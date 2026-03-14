## Why

本專案需要建立台灣存證信函產生器的 UI 介面 Mockup。這是一個純前端的 React SPA，讓使用者填寫寄件人、收件人、副本收件人與內文後，即可產生符合中華郵政官方格式的存證信函 PDF。先以 Mockup UI 確認畫面設計與互動流程，再進入實作階段。

## What Changes

- 建立 Vite + React 19 + TypeScript + Tailwind CSS v4 專案骨架
- 實作響應式表單 UI（桌面版 + 手機版）：
  - 寄件人區塊（可新增多個，姓名 + 地址必填）
  - 收件人區塊（可新增多個，姓名 + 地址必填）
  - 副本收件人區塊（可新增多個，姓名 + 地址選填）
  - 內文純文字輸入框
  - 「產生存證信函 PDF」按鈕
- UI 風格：明亮、可靠、正義女神意象（深靛藍主色 + 金色點綴 + 淺灰白背景）
- 隱私提示文字：「您的資料不會離開瀏覽器」

## Capabilities

### New Capabilities
- `form-ui`: 響應式表單介面，含寄件人/收件人/副本收件人動態新增刪除、內文輸入、表單驗證
- `ui-theme`: 正義女神意象的視覺設計系統（色彩、字型、元件風格）

### Modified Capabilities

（無既有 capability）

## Impact

- 新建 Vite + React + TypeScript 專案（全新 repo，無既有程式碼受影響）
- 依賴：react, react-dom, tailwindcss v4, typescript, vite
- 本階段僅含 UI Mockup，不含 PDF 產生功能（後續 change 處理）
