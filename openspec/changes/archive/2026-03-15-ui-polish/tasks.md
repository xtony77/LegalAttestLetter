## 1. Favicon

- [x] 1.1 設計金色天秤 SVG favicon，使用 accent 色 #C4A265，替換 `public/favicon.svg`

## 2. HTML meta & SEO

- [x] 2.1 `index.html` 的 `<html lang="en">` 改為 `<html lang="zh-TW">`
- [x] 2.2 `<title>` 改為「台灣存證信函產生器」
- [x] 2.3 加入 `<meta name="description">` 與 `<meta name="keywords">`
- [x] 2.4 加入 Open Graph tags（og:title, og:description, og:type, og:locale）

## 3. Footer 改版

- [x] 3.1 在 `src/App.tsx` 新增 RocketIcon inline SVG component
- [x] 3.2 在 `src/App.tsx` 新增 GitHubIcon inline SVG component（官方 mark path，固定色 #24292f）
- [x] 3.3 改寫 Footer component：火箭 icon + 隱私文字 + `·` 分隔符 + GitHub icon + 「問題回報」連結
- [x] 3.4 「問題回報」連結指向 `https://github.com/xtony77/LegalAttestLetter/issues`，`target="_blank" rel="noopener noreferrer"`，hover 文字變 primary 色
