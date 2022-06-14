<template>
  <div class="spirit relative w-full justify-between text-4xl" ref="spref">
    <span
      class="i-akar-icons:circle-minus-fill"
      :class="{
        'rounded-sm border-dashed text-red-700 transition-all duration-200': point,
      }"
      @click="point && spirit[pos][index].point--"
    />
    <span
      class="i-icon-park-solid:ghost"
      :class="elementFill[point ? type : 5]"
      @click="throttleToggle()"
    />
    <digit-wheel v-show="point" size="5xl" :digit="point" :duration="500"></digit-wheel>
    <span
      class="i-akar-icons:circle-plus-fill"
      :class="{
        'rounded-sm border-dashed text-green-400 transition-all duration-200': point,
      }"
      @click="point && spirit[pos][index].point++"
    />
    <OnClickOutside @trigger="modal" class="absolute left-1/2 z-10">
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
          class="absolute h-12 w-12"
          :class="[elementFill[i], transform[i], delay[i]]"
          @click="assignSpirit(i)"
        >
          <span class="i-icon-park-solid:ghost" />
        </div>
      </transition-group>
    </OnClickOutside>
  </div>
</template>

<script lang="ts" setup>
import { OnClickOutside } from '@vueuse/components'
import interact from 'interactjs'

import { element, opponent } from '~~/composables/rules'
import { elementFill } from '~~/composables/color'

const props = defineProps<{ pos: opponent; index: element }>()
const spref = ref()
const spirit = useSpirit()
const type = computed(() => spirit[props.pos][props.index].type)
const point = computed(() => spirit[props.pos][props.index].point)

const [show, toggle] = useToggle()
const throttleToggle = useThrottleFn(toggle, 50, false)
const delay = ['', 'delay-100', 'delay-200', 'delay-300', 'delay-400']
const transform = [
  '-translate-y-10',
  '-translate-x-10 -translate-y-10',
  '-translate-x-10',
  '-translate-x-10 translate-y-10',
  'translate-y-10',
]

const modal = () => {
  if (show.value) {
    throttleToggle()
  }
}
const assignSpirit = (i: element) => {
  spirit[props.pos][props.index].type = i
  spirit[props.pos][props.index].point = 2
  throttleToggle()
}
onMounted(() => {
  interact(unrefElement(spref)).draggable(true)
})
onBeforeUnmount(() => {
  interact(unrefElement(spref)).unset()
})
</script>
