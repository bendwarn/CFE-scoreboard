<template>
  <div>
    <div
      class="w-11/12 h-1/5 relative bg-red-300 text-red-600 text-5xl border-x-2 border-b-2 border-black items-end lg:items-center rounded-b-xl shadow-xl"
      :class="hpBorder"
      @click="
        emit('reqCal', hp[pos], 'hp', (payload: string) => {
          hp[pos] = payload
        })
      "
      draggable="true"
      @dragstart="dragOver = 'canplay'"
      @dragend="dragOver = 'dragover'"
      @dragenter="hpBorder = 'border-dashed'"
      @dragleave="hpBorder = 'border-solid'"
      @[dragOver].prevent
      @drop="hp.swap(), (hpBorder = 'border-solid')"
    >
      <digit-animation-group
        size="inherit"
        :digits="hp[pos]"
        :duration="500"
      ></digit-animation-group>
    </div>
    <div class="w-4/5 h-4/5 items-stretch" v-pinch:[pinchOption]="pinchHandler">
      <div
        v-for="(n, i) in people.count"
        :key="i"
        class="flex-1 border-x-2 border-b-2 border-black bg-amber-200 flex-col items-stretch justify-between rounded-b-xl shadow-lg"
      >
        <div
          class="h-1/6 text-4xl text-blue-800 bg-sky-200 rounded-b-2xl shadow-lg"
          @click="
            emit('reqCal', shield[pos][i], 'sp', (sh: string) => {
              shield[pos][i] = sh
            })
          "
          v-drag:[dragOption]="shieldHandler"
        >
          <digit-animation-group
            v-if="0 < shield[pos][i]"
            size="inherit"
            :digits="shield[pos][i]"
            :duration="500"
          ></digit-animation-group>
        </div>
        <Spirits :pos="pos" :index="i" />
        <StarPersonal :pos="pos" :index="i" />
      </div>
      <StarTeam :pos="pos" class="absolute bottom-16" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Handler } from '@vueuse/gesture'

import { opponent } from '~~/composables/rules'

const props = defineProps<{ pos: opponent }>()
const emit = defineEmits<{
  (
    event: 'reqCal',
    initial: number,
    category: string,
    handler: (value: string) => any
  ): void
}>()
const people = usePeople()
const hp = useHealth()
const shield = useShield()
const hpBorder = ref('border-solid')
const dragOver = ref('dragover')

const dragOption = { preventWindowScrollY: true }
const pinchOption = { eventOptions: { passive: false } }
const shieldHandler: Handler<'drag'> = ({ swipe, distance, memo = 0 }) => {
  if (50 < distance) {
    swipeHistory(hp, swipe, memo)
    return swipeHistory(shield, swipe, memo)
  }
}
const pinchHandler: Handler<'pinch'> = ({ da: [d, a], memo = 0 }) => {
  if (memo) return memo
  if (300 < d) {
    people.count++
    hp.$reset()
    shield.$reset()
    useStar().$reset()
    useField().$reset()
    useSpirit().$reset()
    return 1
  } else if (d < -300) {
    people.count--
    hp.$reset()
    shield.$reset()
    useStar().$reset()
    useField().$reset()
    useSpirit().$reset()
    return -1
  }
}
</script>
