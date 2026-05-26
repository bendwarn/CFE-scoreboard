## 開發環境 tips

- 型別檢查由 Nuxt 自動執行，不需額外手動執行 `vue-tsc --noEmit`
- 執行 `bun run vt` 前需先啟動 `bun run dev`，其中 e2e 測試會連到 `http://localhost:3000/CFE-scoreboard/`
- 執行測試時直接在 sandbox 外跑 `bun run dev` 與 `bun run vt`，避免 Chromium e2e 測試被 macOS Mach port 權限擋住
