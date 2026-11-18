<template>
  <Title>CFE scoreboard</Title>
  <VitePwaManifest />
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
import interact from 'interactjs'
import { noop, find } from 'lodash-es'
import type { InteractEvent } from '@interactjs/core/InteractEvent'

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
  doBorder.value = 'border-dashed border-1'
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

onMounted(() => {
  const { $pwa } = useNuxtApp()
  if ($pwa?.needRefresh) {
    $pwa.updateServiceWorker()
  }
  interact.on('dragstart', onDragStart)
  interact.on('dragmove', onDragMove)
  interact.on('dragend', onDragEnd)
})
onBeforeUnmount(() => {
  interact.off('dragstart', onDragStart)
  interact.off('dragmove', onDragMove)
  interact.off('dragend', onDragEnd)
  drags.clear()
})
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:wght@400;700&display=swap');

body {
  font-family: 'Atkinson Hyperlegible', sans-serif;
}

div {
  @apply flex items-center justify-center text-center select-none;
}
</style>
