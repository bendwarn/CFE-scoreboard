<template>
  <Title>CFE scoreboard</Title>
  <div
    class="w-screen h-screen m-0 bg-green-100 text-gray-700 font-sans text-center flex-col lg:flex-row"
  >
    <div class="absolute z-10 w-full h-full bg-transparent/20" v-if="container">
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
import { noop } from 'lodash-es'

import './assets/css/tailwind.css'
import { opponent } from '~~/composables/rules'

const calnum = ref('')
const container = ref('')
const updateHandler = ref(noop as (value: string) => any)
const showCal = (initial: number, category: string, handler: (value: string) => any) => {
  calnum.value = `${initial}`
  container.value = category
  updateHandler.value = handler
}
onMounted(() => {
  const cancelEvent = (e: Event) => e.preventDefault()
  window.addEventListener('wheel', cancelEvent, { passive: false })
  document.addEventListener('gesturestart', cancelEvent)
  document.addEventListener('gesturechange', cancelEvent)
})
</script>

<style>
div {
  @apply flex justify-center items-center select-none;
}
</style>
