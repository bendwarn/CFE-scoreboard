<template>
  <div
    class="absolute right-0 lg:right-auto lg:bottom-1/2 w-24 h-24 z-0 bg-gray-300 text-5xl border-2 border-black rounded-xl shadow-xl transition duration-500"
    :class="bg"
  >
    <div class="w-full h-full" :class="text" v-drag:[dragOption]="dragHandler">
      <font-awesome-icon v-if="font" :icon="font" />
    </div>
    <OnClickOutside @trigger="modal">
      <transition-group
        enter-from-class="opacity-0 transform-none"
        leave-to-class="opacity-0 transform-none"
        enter-active-class="transition duration-300"
        leave-active-class="transition duration-300"
      >
        <div
          v-show="show"
          v-for="(n, i) in 5"
          :key="i"
          class="absolute w-24 h-24 left-0 rounded-xl z-10"
          :class="[elementbgColor[i], elementTextColor[i], transform[i], delay[i]]"
          @click="assignField(i)"
        >
          <font-awesome-icon :icon="fontmap[i]" /></div
      ></transition-group>
    </OnClickOutside>
  </div>
</template>

<script setup lang="ts">
import { OnClickOutside } from '@vueuse/components'
import { Handler } from '@vueuse/gesture'
import { isNil } from 'lodash-es'

import { elementbgColor, elementTextColor } from '~~/composables/color'
import { element } from '~~/composables/rules'

const fontmap = ['cat', ['fab', 'phoenix-framework'], 'water', 'mountain', 'dragon', '']
const field = useField()
const [show, toggle] = useToggle()
const throttleToggle = useThrottleFn(toggle, 50, false)
const font = computed(() => fontmap[field.field ?? 5])
const bg = computed(() => elementbgColor[field.field ?? 5])
const text = computed(() => elementTextColor[field.field ?? 5])
const delay = ['', 'delay-100', 'delay-200', 'delay-300', 'delay-[400ms]']
const transform = [
  '-translate-y-24',
  '-translate-x-24 -translate-y-24',
  '-translate-x-24',
  '-translate-x-24 translate-y-24',
  'translate-y-24',
]

const dragOption = { preventWindowScrollY: true }
const dragHandler: Handler<'drag'> = ({ swipe, tap, distance, memo = 0 }) => {
  if (distance < 50) {
    if (!tap) return memo
    if (!isNil(field.field)) {
      field.field = null
    } else {
      throttleToggle()
    }
  } else {
    return swipeHistory(field, swipe, memo)
  }
  return memo
}

const modal = () => {
  if (show.value) {
    throttleToggle()
  }
}
const assignField = (i: element) => {
  field.field = i
  throttleToggle()
}
</script>
