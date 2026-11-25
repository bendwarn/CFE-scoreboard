<template>
  <Title>CFE scoreboard</Title>
  <NuxtPwaManifest />
  <div
    class="h-90vh m-0 w-screen flex-col bg-green-100 text-gray-700 lg:h-screen lg:flex-row"
  >
    <div
      id="undo"
      class="pointer-events-none absolute left-0 z-1 h-full w-1/12"
      :class="doBorder"
    ></div>
    <div
      id="redo"
      class="pointer-events-none absolute right-0 z-1 h-full w-1/12"
      :class="doBorder"
    ></div>
    <div
      class="pointer-events-none absolute top-2/3 left-1 z-3 -translate-y-1/2 rounded-full bg-black/10 px-2 py-3 text-xs text-gray-700 backdrop-blur-sm"
    >
      <span class="[writing-mode:vertical-rl]"
        ><span class="text-lg leading-none">↓</span>拖到該側上一步</span
      >
    </div>
    <div
      class="pointer-events-none absolute top-2/3 right-1 z-3 -translate-y-1/2 rounded-full bg-black/10 px-2 py-3 text-xs text-gray-700 backdrop-blur-sm"
    >
      <span class="[writing-mode:vertical-rl]"
        ><span class="text-lg leading-none">↑</span>拖到該側下一步</span
      >
    </div>
    <Calculator
      :initial="calnum"
      :container="container"
      @give-result="updateHandler"
      ref="dialog"
    />
    <Dashboard
      :pos="'enemy' as opponent"
      class="h-1/2 w-full rotate-180 border-t-2 border-black lg:h-full lg:flex-1 lg:rotate-0 lg:border-t-0 lg:border-r-2"
      @req-cal="showCal"
    />
    <Dashboard
      :pos="'friend' as opponent"
      class="h-1/2 w-full border-t-2 border-black lg:h-full lg:flex-1 lg:border-t-0 lg:border-l-2"
      @req-cal="showCal"
    />
    <TheField class="absolute right-0 lg:right-auto" />
    <Gear class="absolute left-0 lg:bottom-0 lg:left-auto" />
  </div>
</template>

<script lang="ts" setup>
import { noop, find } from 'lodash-es'
import type { InteractEvent } from '@interactjs/core/InteractEvent'
import { historyDragKey } from './utils/history-drag'

const calnum = ref('')
const container = ref('')
const dialog = ref()
const updateHandler = ref(noop as (value: string) => any)
const showCal = (initial: number, category: string, handler: (value: string) => any) => {
  calnum.value = `${initial}`
  container.value = category
  updateHandler.value = handler
  unrefElement(dialog).showModal()
}

const rules = {
  hp: useHealth(),
  shield: useShield(),
  star: useStar(),
  field: useField(),
  spirit: useSpirit(),
}
type HistoryDirection = 'undo' | 'redo'
type HistoryRule = (typeof rules)[keyof typeof rules]
const drags = new Map<object, { rule: HistoryRule; preview: HistoryDirection | null }>()
const doBorder = ref('')

const onDragStart = (event: InteractEvent<'drag'>) => {
  const rule = find(rules, (_, key) => event.target.classList.contains(key))
  if (!rule) return
  drags.set(event.interaction, { rule, preview: null })
  doBorder.value = 'border-dashed border-4'
}

const onDragMove = (event: InteractEvent<'drag'>) => {
  const drag = drags.get(event.interaction)
  if (!drag) return
  const direction = event.clientX <= window.innerWidth / 12
    ? 'undo'
    : event.clientX >= window.innerWidth * 11 / 12
      ? 'redo'
      : null
  if (direction === drag.preview) return

  if (drag.preview) {
    drag.rule[drag.preview === 'undo' ? 'redo' : 'undo']()
    drag.preview = null
  }
  if (direction && drag.rule[direction === 'undo' ? 'canUndo' : 'canRedo']) {
    drag.rule[direction]()
    drag.preview = direction
  }
}

const onDragEnd = (event: InteractEvent<'drag'>) => {
  drags.delete(event.interaction)
  if (!drags.size) doBorder.value = ''
}

provide(historyDragKey, (target) => {
  target.on('dragstart', onDragStart)
  target.on('dragmove', onDragMove)
  target.on('dragend', onDragEnd)
})

onMounted(() => {
  const { $pwa } = useNuxtApp()
  if ($pwa?.needRefresh) {
    $pwa.updateServiceWorker()
  }
})
onBeforeUnmount(() => {
  drags.clear()
})
</script>

<style>
body {
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang TC',
    'Microsoft JhengHei', 'Noto Sans CJK TC', sans-serif;
}

div {
  @apply flex items-center justify-center text-center select-none;
}
</style>
