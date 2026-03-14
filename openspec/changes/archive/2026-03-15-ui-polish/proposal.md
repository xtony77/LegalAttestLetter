## Why

目前網站使用 Vite 預設的 favicon、英文 lang 屬性、無 SEO meta tags，且 footer 僅有隱私提示文字缺少問題回報管道。作為一個公開的台灣存證信函工具，需要適當的品牌識別、搜尋引擎可見性與使用者回饋入口。

## What Changes

- **Favicon**：將 Vite 預設紫色閃電替換為金色天秤 SVG icon
- **HTML lang**：`<html lang="en">` 改為 `<html lang="zh-TW">`
- **SEO meta tags**：加入 `<title>`（台灣存證信函產生器）、`<meta name="description">`、`<meta name="keywords">`、Open Graph tags
- **Footer 改版**：加入火箭 icon + 隱私提示、GitHub mark icon（官方黑色 #24292f）+ 「問題回報」連結指向 GitHub Issues

## Capabilities

### New Capabilities

_無新增_

### Modified Capabilities

- `ui-theme`：更新「頁面標題與品牌」requirement 加入 favicon 規格；更新「隱私聲明」requirement 擴充為包含問題回報連結的 footer；新增 SEO meta tags 與 lang 屬性 requirement

## Impact

- `index.html`：lang 屬性、title、meta tags、favicon 引用
- `public/favicon.svg`：替換為金色天秤 SVG
- `src/App.tsx`：Footer component 改版（新增 RocketIcon、GitHubIcon inline SVG components）
