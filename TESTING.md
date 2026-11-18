# 測試

第一次執行瀏覽器測試前，安裝 Playwright 的 Chromium：

```sh
pnpm exec playwright install chromium
```

使用 `pnpm storybook` 開啟 Storybook，或使用 `pnpm test:storybook` 在 Chromium 中執行 stories 的互動測試。`pnpm build-storybook` 可產生靜態 Storybook。Nuxt 開發伺服器也會自動啟動 Storybook，預設位於 `http://localhost:6006`。

Storybook 包含各個元件及完整記分板，可透過工具列的 Viewport 選擇手機、平板或桌面尺寸。Stories 會重設 Storybook 網址下的記分板資料，確保展示狀態一致。

規則、狀態管理與端對端測試保留在 Vitest。執行完整測試前，先在另一個終端機啟動 `bun run dev`，再執行 `bun run vt`；完整測試包含 Storybook stories，端對端測試需要 `http://localhost:3000/CFE-scoreboard/`。

Nuxt 開發伺服器與建置會執行型別檢查；Vitest 不會額外啟動另一個型別檢查程序。
