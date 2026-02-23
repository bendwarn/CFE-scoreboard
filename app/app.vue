<template>
  <Title>CFE scoreboard</Title>
  <VitePwaManifest />
  <div
    class="h-90vh m-0 w-screen flex-col bg-green-100 font-sans text-gray-700 lg:h-screen lg:flex-row"
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
      class="pointer-events-none absolute top-2/3 left-1 z-30 -translate-y-1/2 rounded-full bg-black/10 px-2 py-3 text-xs text-gray-700 backdrop-blur-sm"
    >
      <span class="text-lg leading-none">←</span>
      <span class="[writing-mode:vertical-rl]">拖到此處復原</span>
    </div>
    <div
      class="pointer-events-none absolute top-2/3 right-1 z-30 -translate-y-1/2 rounded-full bg-black/10 px-2 py-3 text-xs text-gray-700 backdrop-blur-sm"
    >
      <span class="[writing-mode:vertical-rl]">拖到此處重做</span>
      <span class="text-lg leading-none">→</span>
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
import { noop, capitalize, find } from 'lodash-es'

enum cando {
  undo = 'redo',
  redo = 'undo',
}
enum can {
  undo = 'canUndo',
  redo = 'canRedo',
}

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
let done = countChange.initial
const doBorder = ref('')
onMounted(async () => {
  const { $pwa } = useNuxtApp()
  if ($pwa?.needRefresh) {
    $pwa.updateServiceWorker()
  }

  interact('#undo, #redo').dropzone({
    accept: '.hp, .shield, .star, .field, .spirit',
    ondropactivate() {
      done = countChange.initial
      doBorder.value = 'border-dashed border-1'
    },
    ondropdeactivate() {
      doBorder.value = ''
    },
    ondragenter(event) {
      const act = event.target.id as cando
      const ele = event.relatedTarget.classList
      const rule = find(rules, (v, k) => ele.contains(k))!
      if (rule[can[act]]) {
        done++
        rule[act]()
      }
    },
    ondragleave(event) {
      const act = cando[event.target.id as cando]
      const ele = event.relatedTarget.classList
      const rule = find(rules, (v, k) => ele.contains(k))!
      if (rule[can[act]] && done != countChange.initial) {
        done--
        rule[act]()
      }
    },
  })
})
onBeforeUnmount(() => {
  interact('#undo, #redo').unset()
})
</script>

<style>
div {
  @apply flex items-center justify-center text-center select-none;
}
</style>
