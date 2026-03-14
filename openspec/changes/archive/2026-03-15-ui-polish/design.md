## Context

目前 `index.html` 使用 Vite scaffold 預設值：`lang="en"`、title 為 "legalattestletter"、favicon 為紫色閃電。Footer 僅顯示隱私提示文字，無問題回報管道。需要補上正式的品牌識別、中文 SEO meta、以及使用者回饋入口。

## Goals / Non-Goals

**Goals:**
- 替換 favicon 為金色天秤 SVG，與 header 天秤圖示風格一致
- 設定正確的 `lang="zh-TW"` 與中文 SEO meta tags
- Footer 加入火箭 icon + GitHub Issues 問題回報連結（GitHub mark 使用官方黑色）

**Non-Goals:**
- 不調整現有色彩系統或 Tailwind 設定
- 不加入 sitemap 或 robots.txt
- 不加入 Google Analytics 或其他追蹤碼

## Decisions

### D1: Favicon 格式選擇 — SVG inline

使用 SVG 格式直接替換 `public/favicon.svg`。SVG 在現代瀏覽器支援良好、可縮放、檔案小。不需要額外產生 PNG fallback（目前 `index.html` 已經引用 SVG）。天秤圖示使用 accent 金色 `#C4A265` 作為主色。

### D2: Icon 實作方式 — Inline SVG components

Footer 的火箭 icon 與 GitHub mark icon 使用 inline SVG React components，不引入 icon library（如 react-icons、heroicons）。原因：
- 專案只需要 3 個 icon（header 天秤已有、火箭、GitHub mark）
- 避免增加 bundle size
- GitHub mark 有官方 SVG path，直接使用

### D3: GitHub mark 配色 — 固定官方黑色 #24292f

GitHub icon 不跟隨 `currentColor`，固定使用 GitHub 官方品牌色 `#24292f`。hover 時連結文字變色但 icon 維持黑色，保持品牌辨識度。

### D4: Footer 排版 — 單行 inline

```
[🚀] 您的資料不會離開瀏覽器 · [■] 問題回報
```

使用 `·` 分隔符，flex inline 排列。火箭 icon 繼承 text-muted 色，GitHub icon 固定黑色，「問題回報」文字 hover 時變 primary 色。

### D5: SEO meta tags 範圍

加入以下 meta tags：
- `<title>台灣存證信函產生器</title>`
- `<meta name="description" content="...">`（描述工具功能與隱私特性）
- `<meta name="keywords" content="存證信函,台灣,PDF,產生器,免費">`
- Open Graph: `og:title`, `og:description`, `og:type`, `og:locale`

不加入 Twitter Card tags（非目標受眾主要社群平台）。

## Risks / Trade-offs

- **SVG favicon 相容性**：極少數舊版瀏覽器不支援 SVG favicon → 可接受，目標用戶使用現代瀏覽器（已經需要 Cache API、pdf-lib 等）
- **GitHub icon 固定色在深色模式下可能不可見** → 目前無深色模式支援，非本次範圍
