## Why

Mockup UI 已完成，使用者可以填寫寄件人、收件人、副本收件人與內文。但目前「產生存證信函 PDF」按鈕僅做表單驗證，尚無實際 PDF 產生功能。本 change 實作核心業務邏輯：將表單資料轉換為符合中華郵政官方格式的存證信函 PDF 並自動下載。

## What Changes

- 安裝 pdf-lib 與 fontkit 依賴
- 載入官方存證信函 PDF 模板（example10206.pdf）作為每頁底圖
- 載入全字庫正楷體字型（TW-Kai），從 CDN lazy load 並快取
- 實作方格填字引擎：將內文逐字填入 20 格 × 10 行方格，半形字元獨佔一格，換行符跳下一行
- 實作自動分頁：每頁 200 字，超過自動新增頁面（複製模板頁）
- 實作寄/收件人/副本收件人資訊填入邏輯：
  - 各角色 ≤ 1 人：填入第一頁表頭對應欄位
  - 任一角色 > 1 人：所有正式頁表頭留空，最後附加空白 A4 頁印出所有人員的剪貼區塊
- 串接表單送出按鈕，驗證通過後產生 PDF 並自動觸發瀏覽器下載

## Capabilities

### New Capabilities
- `pdf-engine`: PDF 產生引擎，含模板載入、字型嵌入、方格填字、自動分頁、人員資訊填入、附加剪貼頁
- `font-loader`: 全字庫正楷體字型的 CDN lazy loading 與瀏覽器快取機制

### Modified Capabilities
- `form-ui`: 按鈕行為從「僅驗證」改為「驗證 + 產生 PDF + 自動下載」，新增載入中狀態（字型/PDF 產生中）

## Impact

- 新增依賴：pdf-lib, @pdf-lib/fontkit
- 修改 App.tsx：按鈕 onClick 串接 PDF 產生邏輯
- 新增 src/ 下的 PDF 引擎模組
- 官方 PDF 模板檔案（example10206.pdf）移至 public/ 目錄供前端載入
- 全字庫正楷體字型檔需託管於 CDN 或 public/ 目錄
