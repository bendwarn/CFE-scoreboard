<template>
  <div class="spirit relative w-full justify-between text-4xl" ref="spref">
    <span
      class="icon icon-circle-minus"
      :class="{
        'rounded-sm border-dashed text-red-700 transition-all duration-200': point,
      }"
      @click="point && spirit[pos][index]!.point--"
    />
    <OnClickOutside @trigger="modal" class="relative">
      <span
        class="icon icon-ghost"
        :class="elementFill[point ? type : 5]"
        @click="throttleToggle()"
      />
      <div class="absolute left-1/2 z-10">
        <transition-group
          enter-from-class="opacity-0 !translate-none"
          leave-to-class="opacity-0 !translate-none"
          enter-active-class="transition duration-100"
          leave-active-class="transition duration-100"
        >
          <div
            v-show="show"
            v-for="(n, i) in 5"
            :key="i"
            class="absolute h-12 w-12"
            :class="[elementFill[i], transform[i], delay[i]]"
            @click="assignSpirit(i)"
          >
            <span class="icon icon-ghost" />
          </div>
        </transition-group>
      </div>
    </OnClickOutside>
    <digit-wheel v-show="point" size="5xl" :digit="point" :duration="500"></digit-wheel>
    <span
      class="icon icon-circle-plus"
      :class="{
        'rounded-sm border-dashed text-green-400 transition-all duration-200': point,
      }"
      @click="point && spirit[pos][index]!.point++"
    />
  </div>
</template>

<script lang="ts" setup>
import interact from 'interactjs'
import { historyDragKey } from '../utils/history-drag'
import { OnClickOutside } from '@vueuse/components'

const props = defineProps<{ pos: opponent; index: element }>()
const spref = ref()
const spirit = useSpirit()
const type = computed(() => spirit[props.pos][props.index]!.type)
const point = computed(() => spirit[props.pos][props.index]!.point)
const registerHistoryDrag = inject(historyDragKey, () => {})

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
  spirit[props.pos][props.index]!.type = i
  spirit[props.pos][props.index]!.point = 2
  throttleToggle()
}
onMounted(() => {
  registerHistoryDrag(interact(unrefElement(spref)).draggable(true))
})
onBeforeUnmount(() => {
  interact(unrefElement(spref)).unset()
})
</script>
