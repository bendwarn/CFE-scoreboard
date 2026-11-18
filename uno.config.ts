import {
  defineConfig,
  presetTypography,
  presetWind4,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'

export default defineConfig({
  shortcuts: [
    // ...
  ],
  theme: {
    colors: {
      // ...
    },
  },
  presets: [
    presetWind4(),
    presetTypography(),
  ],
  transformers: [transformerDirectives(), transformerVariantGroup()],
})
