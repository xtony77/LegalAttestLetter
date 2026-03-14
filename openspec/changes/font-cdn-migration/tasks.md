## 1. 程式碼改動

- [x] 1.1 `src/lib/fontLoader.ts` 的 `TW_KAI_FONT_PATH` 改為 `https://raw.githubusercontent.com/xtony77/fontCollection/master/TW-Kai.ttf`
- [x] 1.2 驗證 TypeScript 編譯通過

## 2. 檔案清理

- [x] 2.1 刪除 `public/fonts/TW-Kai.ttf`
- [x] 2.2 `.gitignore` 加入 `public/fonts/*.ttf` 排除規則

## 3. Git history 清理

- [ ] 3.1 使用 `git filter-repo --path public/fonts/TW-Kai.ttf --invert-paths` 從歷史移除大檔案
- [ ] 3.2 驗證 `.git/` 體積已縮小
- [ ] 3.3 `git push --force` 同步 remote
