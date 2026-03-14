## ADDED Requirements

### Requirement: 字型載入
系統 SHALL 在使用者觸發 PDF 產生時，自動從 public/ 目錄載入全字庫正楷體（TW-Kai）TTF 字型檔。

#### Scenario: 首次載入字型
- **WHEN** 使用者首次點擊「產生存證信函 PDF」且瀏覽器尚無快取
- **THEN** 系統 fetch 字型檔並顯示載入中提示（如「正在載入字型...」），載入完成後繼續 PDF 產生流程

#### Scenario: 字型載入失敗
- **WHEN** 字型檔 fetch 失敗
- **THEN** 顯示錯誤提示「字型載入失敗，請重新整理頁面後再試」

### Requirement: 字型快取
系統 SHALL 使用瀏覽器 Cache API 快取字型檔，避免重複下載。

#### Scenario: 快取命中
- **WHEN** 使用者第二次以後點擊「產生存證信函 PDF」
- **THEN** 系統從 Cache API 讀取字型，無需重新下載，無明顯等待時間

#### Scenario: 快取失效
- **WHEN** 瀏覽器清除了快取
- **THEN** 系統重新 fetch 字型檔並存入 Cache API
