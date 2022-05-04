<template>
  <transition>
    <div
      class="w-16 h-16 text-3xl bg-black rounded-xl shadow-lg transition duration-300"
      :class="type"
      v-drag:[dragOption]="dragHandler"
    >
      <font-awesome-icon icon="star" />
    </div>
  </transition>
</template>

<script lang="ts" setup>
import { Handler } from '@vueuse/gesture'

import { opponent } from '~~/composables/rules'
import { elementColor } from '~~/composables/color'

const props = defineProps<{ pos: opponent }>()
const star = useStar()
const type = computed(() => elementColor[star[props.pos].type ?? 5])

const dragOption = { preventWindowScrollY: true }
const dragHandler: Handler<'drag'> = ({ swipe, tap, distance, memo = 0 }) => {
  if (50 < distance) {
    return swipeHistory(star, swipe, memo)
  } else if (tap) {
    delete star[props.pos].type
  }
  return memo
}
</script>
