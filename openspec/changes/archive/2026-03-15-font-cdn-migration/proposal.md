## Why

TW-Kai.ttf 字型檔 35MB 已 commit 到 git repo，導致 clone 和 CI 緩慢且 repo 膨脹。改為從外部 GitHub raw URL 載入，並從 git history 中徹底移除該檔案。

## What Changes

- **fontLoader 改用外部 URL**：`TW_KAI_FONT_PATH` 從本地 `/fonts/TW-Kai.ttf` 改為 `https://raw.githubusercontent.com/xtony77/fontCollection/master/TW-Kai.ttf`
- **移除本地字型檔**：刪除 `public/fonts/TW-Kai.ttf`
- **Git history 清理**：使用 `git filter-repo` 從所有歷史 commit 中移除該檔案
- **.gitignore 更新**：加入 `public/fonts/*.ttf` 防止未來誤 commit 大型字型檔

## Capabilities

### New Capabilities

_無新增_

### Modified Capabilities

- `font-loader`：字型載入來源從本地 public/ 目錄改為外部 raw.githubusercontent.com URL，需處理跨域 fetch

## Impact

- `src/lib/fontLoader.ts`：修改 fetch URL
- `public/fonts/TW-Kai.ttf`：刪除
- `.gitignore`：新增排除規則
- Git history：rewrite（所有 commit hash 會變）
