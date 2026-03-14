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
頁面 SHALL 顯示標題「台灣存證信函產生器」與天秤圖示，傳達法律公平正義的意象。

#### Scenario: 標題顯示
- **WHEN** 頁面載入
- **THEN** 頁面頂部顯示天秤圖示與「台灣存證信函產生器」標題，使用 primary 色

### Requirement: 隱私聲明
頁面 SHALL 在表單下方顯示隱私提示文字。

#### Scenario: 隱私提示顯示
- **WHEN** 頁面載入
- **THEN** 表單下方顯示「您的資料不會離開瀏覽器」提示文字，使用 text-muted 色
