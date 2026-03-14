## MODIFIED Requirements

### Requirement: 產生 PDF 按鈕
表單 SHALL 提供「產生存證信函 PDF」按鈕。驗證通過後 SHALL 觸發 PDF 產生流程並自動下載。按鈕在 PDF 產生過程中 SHALL 顯示載入中狀態並禁止重複點擊。

#### Scenario: 表單驗證通過並產生 PDF
- **WHEN** 所有必填欄位皆已填寫且使用者點擊按鈕
- **THEN** 按鈕進入載入中狀態（顯示「產生中...」並 disabled），完成後自動下載 PDF，按鈕恢復正常

#### Scenario: 表單驗證失敗
- **WHEN** 有任一必填欄位未填寫且使用者點擊按鈕
- **THEN** 捲動至第一個錯誤欄位，顯示所有錯誤提示

#### Scenario: PDF 產生失敗
- **WHEN** PDF 產生過程中發生錯誤（模板載入失敗、字型載入失敗等）
- **THEN** 按鈕恢復正常狀態，顯示錯誤提示訊息
