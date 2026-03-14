## Context

目前 `fontLoader.ts` 從本地 `/fonts/TW-Kai.ttf`（35MB）載入字型，檔案已 commit 到 git repo。需要將載入來源改為外部 URL 並從 git history 移除大檔案。

字型來源：`https://raw.githubusercontent.com/xtony77/fontCollection/master/TW-Kai.ttf`

`raw.githubusercontent.com` 支援 CORS（`Access-Control-Allow-Origin: *`）、檔案大小上限 100MB、由 Fastly CDN 服務。

## Goals / Non-Goals

**Goals:**
- fontLoader 改從 `raw.githubusercontent.com` 載入 TW-Kai.ttf
- 刪除 `public/fonts/TW-Kai.ttf` 並加入 `.gitignore` 排除
- 從 git history 中移除該檔案以縮小 repo 體積
- 保留現有 Cache API 快取機制不變

**Non-Goals:**
- 不更換字型（仍使用 TW-Kai）
- 不改變 Cache API 快取策略
- 不引入 Service Worker 或其他離線方案

## Decisions

### D1: 外部 URL 選擇 — raw.githubusercontent.com

使用 `https://raw.githubusercontent.com/xtony77/fontCollection/master/TW-Kai.ttf`。

替代方案考量：
- jsDelivr CDN：有 20MB 檔案大小限制，TW-Kai 35MB 超限（之前已實測失敗）
- GitHub Pages serve：需要額外設定 repo，過度工程
- raw.githubusercontent.com：CORS OK、100MB 上限、Fastly CDN、零設定

### D2: Cache API key 策略 — 使用完整外部 URL

Cache API 的 `cache.match()` 和 `cache.put()` 以 request URL 為 key。改用外部 URL 後，cache key 自動變更，舊的本地路徑快取會自然失效。不需要額外處理 cache 版本號或遷移。

### D3: Git history 清理工具 — git filter-repo

使用 `git filter-repo --path public/fonts/TW-Kai.ttf --invert-paths` 從所有歷史 commit 移除檔案。

替代方案：
- `git filter-branch`：官方已標記 deprecated，速度慢
- BFG Repo Cleaner：需要 Java runtime，額外依賴

注意：rewrite 後所有 commit hash 會改變，需要 `git push --force`。

### D4: fontLoader 程式碼改動範圍

只需修改 `TW_KAI_FONT_PATH` 常數值。`fetchFontResponse()`、`readCachedFont()`、`loadTwKaiFontBytes()` 的邏輯完全不需要改動——`fetch()` 原生支援跨域 URL，Cache API 也支援任意 URL 作為 key。

## Risks / Trade-offs

- **GitHub raw 服務中斷** → 字型載入失敗，但網站本身也部署在 GitHub Pages，同時掛機風險一致
- **Rate limit** → raw.githubusercontent.com 有 soft rate limit，但 Cache API 確保每用戶只下載一次，實際影響極低
- **Git history rewrite** → 所有 commit hash 變更，需 force push。目前僅單人開發，影響可控
- **舊 cache 浪費** → 已快取本地路徑的使用者會保留無用的舊 cache entry，不影響功能，瀏覽器最終會自動清理
