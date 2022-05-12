<template>
  <Title>CFE scoreboard</Title>
  <div
    class="w-screen h-screen m-0 overflow-hidden bg-green-100 text-gray-700 font-sans text-center flex-col lg:flex-row"
  >
    <div id="undo" class="w-1/12 h-screen absolute pointer-events-none left-0"></div>
    <div id="redo" class="w-1/12 h-screen absolute pointer-events-none right-0"></div>
    <div
      class="absolute z-10 w-full h-full bg-transparent/20 transition duration-200"
      v-if="container"
    >
      <Calculator
        :initial="calnum"
        :container="container"
        @give-result="updateHandler"
        @close="container = ''"
      />
    </div>
    <Dashboard
      :pos="'enemy' as opponent"
      class="flex-col w-full h-1/2 lg:h-full lg:flex-1 rotate-180 lg:rotate-0 border-black border-t-2 lg:border-t-0 lg:border-r-2"
      @req-cal="showCal"
    />
    <Dashboard
      :pos="'friend' as opponent"
      class="flex-col w-full h-1/2 lg:h-full lg:flex-1 border-black border-t-2 lg:border-t-0 lg:border-l-2"
      @req-cal="showCal"
    />
    <TheField />
    <Gear />
  </div>
</template>

<script lang="ts" setup>
import interact from 'interactjs'
import { noop, capitalize, find } from 'lodash-es'

import './assets/css/tailwind.css'
import { opponent } from '~~/composables/rules'
import { countChange } from '~~/composables/utils'

enum cando {
  undo = 'redo',
  redo = 'undo',
}

const calnum = ref('')
const container = ref('')
const updateHandler = ref(noop as (value: string) => any)
const showCal = (initial: number, category: string, handler: (value: string) => any) => {
  calnum.value = `${initial}`
  container.value = category
  updateHandler.value = handler
}

const rules = {
  hp: useHealth(),
  shield: useShield(),
  star: useStar(),
  field: useField(),
  spirit: useSpirit(),
}
let done = countChange.initial
onMounted(() => {
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
  @apply flex justify-center items-center select-none touch-none;
}
</style>
