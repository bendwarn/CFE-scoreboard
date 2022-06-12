<template>
  <Title>CFE scoreboard</Title>
  <div
    class="m-0 h-[90vh] w-screen flex-col bg-green-100 font-sans text-gray-700 lg:h-screen lg:flex-row"
  >
    <div id="undo" class="pointer-events-none absolute left-0 h-full w-1/12"></div>
    <div id="redo" class="pointer-events-none absolute right-0 h-full w-1/12"></div>
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
    <Gear class="absolute left-0 lg:left-auto lg:bottom-0" />
  </div>
</template>

<script lang="ts" setup>
import interact from 'interactjs'
import { noop, capitalize, find } from 'lodash-es'

import './assets/css/tailwind.css'
import type { opponent } from '~~/composables/rules'
import { countChange } from '~~/composables/utils'

enum cando {
  undo = 'redo',
  redo = 'undo',
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
onMounted(async () => {
  interact('#undo, #redo').dropzone({
    accept: '.hp, .shield, .star, .field, .spirit',
    ondropactivate() {
      done = countChange.initial
    },
    ondragenter(event) {
      const act = event.target.id as 'redo' | 'undo'
      const ele = event.relatedTarget.classList
      const rule = find(rules, (v, k) => ele.contains(k))!
      if (rule[`can${capitalize(act)}` as 'canRedo' | 'canUndo']) {
        done++
        rule[act]()
      }
    },
    ondragleave(event) {
      const act = cando[event.target.id as 'redo' | 'undo']
      const ele = event.relatedTarget.classList
      const rule = find(rules, (v, k) => ele.contains(k))!
      if (
        rule[`can${capitalize(act)}` as 'canRedo' | 'canUndo'] &&
        done != countChange.initial
      ) {
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
  @apply flex select-none items-center justify-center text-center;
}
</style>
