## Context

Mockup UI 已完成（Vite + React 19 + TypeScript + Tailwind CSS v4）。目前 App.tsx 的「產生存證信函 PDF」按鈕通過表單驗證後僅顯示 alert。需要接入 PDF 產生引擎，以官方存證信函 PDF 為模板，疊加使用者輸入的文字後自動下載。

官方格式規格（來自 example10206.pdf）：
- 每頁：20 格 × 10 行 = 200 字
- 表頭區：寄件人（姓名+地址）、收件人（姓名+地址）、副本收件人（姓名+地址）
- 字型：全字庫正楷體（TW-Kai，台灣政府免費開放授權）
- 紙張：A4

## Goals / Non-Goals

**Goals:**
- 使用者填完表單後一鍵產生符合中華郵政格式的存證信函 PDF
- 純前端完成，資料不離開瀏覽器
- 字型自動載入，使用者零額外操作
- 正確處理方格填字、自動分頁、人員資訊填入邏輯

**Non-Goals:**
- 不做 PDF 預覽（直接下載）
- 不做列印功能（使用者自行用系統列印）
- 不處理避頭尾標點符號排版規則（逐字填格即可）
- 不做多語言支援

## Decisions

### 1. PDF 產生方案：pdf-lib 模板疊加

選 pdf-lib 而非 @react-pdf/renderer 或 html2canvas。

| 方案 | 優點 | 缺點 |
|------|------|------|
| **pdf-lib 模板疊加** | 格式保證正確（用官方 PDF）、向量文字、檔案小 | 需量測座標 |
| @react-pdf/renderer | React 式宣告 | 需從零重建複雜官方格式 |
| html2canvas + jsPDF | 可用系統標楷體 | 圖片 PDF、列印品質差 |

pdf-lib 的核心邏輯：
1. fetch 載入 example10206.pdf
2. 取出第 1 頁作為模板
3. 每頁內文複製模板頁，用 drawText 在方格座標逐字繪製
4. 組合所有頁面後觸發下載

### 2. 字型方案：全字庫正楷體 CDN lazy load

字型檔約 8MB，不打包進 bundle，改為：
- 點擊「產生 PDF」時才 fetch 字型檔
- 首次載入後存入瀏覽器 Cache API（非 IndexedDB，更簡單）
- 後續使用直接從 cache 讀取，毫秒級

字型來源：將 TW-Kai TTF 放在 public/ 目錄，隨 Cloudflare Pages 一起部署。Cloudflare 自帶 CDN 快取，台灣使用者載入快。

不使用外部 CDN 的理由：避免第三方依賴失效、確保 CORS 不出問題。

### 3. 方格座標量測策略

需要從 example10206.pdf 精確量測以下座標（單位：PDF point，1pt = 1/72 inch）：
- 方格區域的起始 x, y
- 每格的寬度與高度
- 行間距
- 表頭區寄件人/收件人/副本收件人姓名與地址欄位的 x, y

量測方式：用 pdf-lib 讀取模板頁尺寸，搭配 PDF 座標系統（原點在左下角）手動調校。第一輪用估算值，產出 PDF 後肉眼比對微調。

### 4. 分頁邏輯

```
輸入文字 → 逐字元處理
  ├─ 普通字元 → 填入當前格 (col, row)
  │   col < 20 → col++
  │   col = 20 → col=1, row++
  │   row > 10 → 新頁, col=1, row=1
  ├─ 換行符 \n → col=1, row++
  │   row > 10 → 新頁, col=1, row=1
  └─ 結束 → 完成
```

### 5. 人員資訊填入邏輯

- **標準情境**（寄件人=1、收件人=1、副本收件人≤1）：在第一頁模板的表頭欄位座標 drawText 填入姓名與地址
- **多人情境**（任一角色 > 1 人）：所有正式頁的表頭留空。最後新增一頁空白 A4，繪製所有人員資訊區塊（含剪貼虛線與指示文字），供使用者列印後裁剪覆蓋至第一頁

### 6. 模組結構

```
src/
├── lib/
│   ├── pdfGenerator.ts      # 主流程：組合模板+文字+人員→產出PDF
│   ├── gridEngine.ts        # 方格填字引擎：文字→分頁字元座標
│   ├── fontLoader.ts        # 字型載入+快取
│   └── pdfCoordinates.ts    # 座標常數（方格、表頭欄位位置）
```

### 7. 下載觸發方式

使用 Blob + URL.createObjectURL + 動態建立 <a> 標籤 + click()，純前端觸發瀏覽器下載。檔名格式：`存證信函_YYYYMMDD.pdf`

## Risks / Trade-offs

- **[Risk] 方格座標量測可能需要多次微調** → 將座標集中在 pdfCoordinates.ts 常數檔，方便快速調整。先產出測試 PDF 肉眼比對。
- **[Risk] 全字庫正楷體 8MB 首次載入較慢** → 顯示載入進度提示（「正在載入字型...」），Cloudflare CDN 在台灣延遲低，實測約 1-2 秒。Cache API 快取後後續毫秒級。
- **[Risk] pdf-lib 的 fontkit 對某些罕用字可能缺字** → 全字庫正楷體涵蓋 CNS11643 全字集，常用字不會有問題。極端情況下缺字會顯示空格，使用者可察覺。
- **[Risk] 不同版本官方 PDF 模板的座標可能不同** → 鎖定使用 example10206.pdf（102年6月版），座標寫死在常數檔。
