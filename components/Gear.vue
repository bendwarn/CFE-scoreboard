<template>
  <div
    class="absolute w-24 h-24 shadow-lg bg-orange-300 border-2 border-black text-5xl rounded-xl left-0 lg:left-auto lg:bottom-0"
    ref="setting"
  >
    <font-awesome-icon
      icon="gear"
      :style="{ transform: `rotate(${rotateTh})` }"
      :class="[{ 'text-red-500': turnRed }]"
    />
  </div>
  <div class="absolute flex-col z-20" v-show="show" v-motion-roll-visible-bottom>
    <p>旋轉齒輪直到變紅來初始化</p>
    <p>左右拖移各個規則可回到上/下一步</p>
  </div>
</template>

<script lang="ts" setup>
import { useGesture } from '@vueuse/gesture'
const setting = ref()
const show = autoResetRef(false, 2000)
const turnRed = ref(false)
const rotateRef = ref('0deg')
const rotateTh = refThrottled(rotateRef, 50, false)

useGesture(
  {
    onDrag({ tap }) {
      if (tap) {
        show.value = true
      }
    },
    onWheel({ movement: [x, y] }) {
      rotateTh.value = `${-y}deg`
      if (100 < y || y < -100) {
        turnRed.value = true
      } else {
        turnRed.value = false
      }
    },
    onWheelEnd({ touches }) {
      if (turnRed.value && !touches) {
        useHealth().$reset()
        useShield().$reset()
        useStar().$reset()
        useField().$reset()
        useSpirit().$reset()
      }
      rotateTh.value = `0deg`
      turnRed.value = false
    },
    onPinch({ da: [d, a] }) {
      rotateTh.value = `${-a}deg`
      if (70 < a) {
        turnRed.value = true
      } else {
        turnRed.value = false
      }
    },
    onPinchEnd({ touches }) {
      if (turnRed.value && !touches) {
        useHealth().$reset()
        useShield().$reset()
        useStar().$reset()
        useField().$reset()
        useSpirit().$reset()
      }
      rotateTh.value = `0deg`
      turnRed.value = false
    },
  },
  { domTarget: setting, eventOptions: { passive: false } }
)
</script>
