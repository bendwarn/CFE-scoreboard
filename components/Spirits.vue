<template>
  <div class="relative w-full my-3 justify-between text-4xl spirit" ref="spref">
    <font-awesome-icon
      icon="minus-circle"
      :class="{
        'text-red-700 border-dashed rounded-sm active:border-8 active:border-green-800 transition-all duration-200': !isNil(
          type
        ),
      }"
      @click="isNil(type) || spirit[pos][index].point--"
    />
    <font-awesome-icon icon="ghost" :class="elementColor[type ?? 5]" @click="clickIcon" />
    <digit-wheel v-show="point" size="5xl" :digit="point" :duration="500"></digit-wheel>
    <font-awesome-icon
      icon="plus-circle"
      :class="{
        'text-green-400 border-dashed rounded-sm active:border-8 active:border-green-800 transition-all duration-200': !isNil(
          type
        ),
      }"
      @click="isNil(type) || spirit[pos][index].point++"
    />
    <OnClickOutside @trigger="modal" class="absolute left-1/2">
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
          class="absolute w-20 h-20"
          :class="[elementColor[i], transform[i], delay[i]]"
          @click="assignSpirit(i)"
        >
          <font-awesome-icon icon="ghost" />
        </div>
      </transition-group>
    </OnClickOutside>
  </div>
</template>

<script lang="ts" setup>
import { OnClickOutside } from '@vueuse/components'
import { isNil } from 'lodash-es'
import interact from 'interactjs'

import { element, opponent } from '~~/composables/rules'
import { elementColor } from '~~/composables/color'

const props = defineProps<{ pos: opponent; index: element }>()
const spref = ref()
const spirit = useSpirit()
const type = computed(() => spirit[props.pos][props.index].type)
const point = computed(() => spirit[props.pos][props.index].point)

const [show, toggle] = useToggle()
const throttleToggle = useThrottleFn(toggle, 50, false)
const delay = ['', 'delay-100', 'delay-200', 'delay-300', 'delay-[400ms]']
const transform = [
  '-translate-y-12',
  '-translate-x-12 -translate-y-12',
  '-translate-x-12',
  '-translate-x-12 translate-y-12',
  'translate-y-12',
]
const clickIcon = () => {
  if (isNil(type.value)) {
    throttleToggle()
  }
}
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
