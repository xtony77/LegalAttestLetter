## ADDED Requirements

### Requirement: 色彩系統
應用程式 SHALL 使用以下色彩系統：primary (#1B365D 深靛藍)、accent (#C4A265 金色)、background (#F5F5F0 淺灰白)、surface (#FFFFFF 白色)、text (#2D2D2D 深灰)、text-muted (#6B7280)、success (#2E7D5B)、error (#DC2626)。透過 Tailwind CSS 自訂色彩 token 實作。

#### Scenario: 色彩一致性
- **WHEN** 頁面渲染完成
- **THEN** 頁面背景為 #F5F5F0，主要按鈕為 #1B365D，強調元素為 #C4A265

### Requirement: 響應式佈局
應用程式 SHALL 支援桌面版（≥768px）與手機版（<768px）兩種佈局。

#### Scenario: 桌面版佈局
- **WHEN** 視窗寬度 ≥ 768px
- **THEN** 表單以居中卡片呈現（最大寬度 720px），寄件人與收件人並排兩欄

#### Scenario: 手機版佈局
- **WHEN** 視窗寬度 < 768px
- **THEN** 表單全寬單欄堆疊，所有區塊垂直排列

### Requirement: 頁面標題與品牌
頁面 SHALL 顯示標題「台灣存證信函產生器」與天秤圖示，傳達法律公平正義的意象。Favicon SHALL 使用金色（#C4A265）天秤 SVG 圖示，取代預設 favicon。

#### Scenario: 標題顯示
- **WHEN** 頁面載入
- **THEN** 頁面頂部顯示天秤圖示與「台灣存證信函產生器」標題，使用 primary 色

#### Scenario: Favicon 顯示
- **WHEN** 頁面載入
- **THEN** 瀏覽器分頁顯示金色天秤 favicon

### Requirement: 隱私聲明
頁面 footer SHALL 以單行 inline 排列顯示：火箭 icon + 「您的資料不會離開瀏覽器」隱私提示文字 + `·` 分隔符 + GitHub mark icon + 「問題回報」連結。火箭 icon 與隱私文字 SHALL 使用 text-muted 色。

#### Scenario: Footer 完整顯示
- **WHEN** 頁面載入
- **THEN** footer 顯示火箭 icon、隱私提示文字、分隔符、GitHub icon、問題回報連結，排列為單行

#### Scenario: 隱私文字色彩
- **WHEN** 頁面載入
- **THEN** 火箭 icon 與「您的資料不會離開瀏覽器」文字使用 text-muted 色

### Requirement: SEO meta tags 與語系
頁面 SHALL 設定 `lang="zh-TW"`，並包含中文 title、description、keywords meta tags 以及 Open Graph tags，確保搜尋引擎正確索引與社群分享呈現。

#### Scenario: HTML lang 屬性
- **WHEN** 頁面載入
- **THEN** `<html>` 元素的 `lang` 屬性為 `zh-TW`

#### Scenario: 頁面標題
- **WHEN** 頁面載入
- **THEN** `<title>` 為「台灣存證信函產生器」

#### Scenario: Meta description
- **WHEN** 搜尋引擎爬取頁面
- **THEN** 頁面包含 `<meta name="description">` 描述工具功能與隱私特性

#### Scenario: Open Graph tags
- **WHEN** 使用者在社群平台分享頁面連結
- **THEN** 頁面包含 `og:title`、`og:description`、`og:type`、`og:locale` tags

### Requirement: 問題回報連結
頁面 footer SHALL 包含指向 GitHub Issues 的「問題回報」連結，附帶 GitHub 官方 mark icon（固定色 #24292f），供使用者回報問題。

#### Scenario: 問題回報連結顯示
- **WHEN** 頁面載入
- **THEN** footer 顯示 GitHub mark icon 與「問題回報」文字，icon 為固定色 #24292f

#### Scenario: 點擊問題回報
- **WHEN** 使用者點擊「問題回報」連結
- **THEN** 在新分頁開啟 `https://github.com/xtony77/LegalAttestLetter/issues`

#### Scenario: Hover 效果
- **WHEN** 使用者 hover「問題回報」連結
- **THEN** 連結文字變為 primary 色，GitHub icon 維持 #24292f 不變
