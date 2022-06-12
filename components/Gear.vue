<template>
  <div
    class="gear h-16 w-16 touch-none rounded-xl border-2 border-black bg-orange-300 text-5xl shadow-lg"
    :="$attrs"
    ref="gear"
    @click="show = true"
  >
    <font-awesome-icon icon="gear" />
  </div>
  <div class="absolute z-20 flex-col" v-show="show" v-motion-roll-visible-bottom>
    <p>將齒輪拉到場地來初始化</p>
    <p>左右拖移各個規則可回到上/下一步</p>
  </div>
</template>

<script lang="ts" setup>
import interact from 'interactjs'

const gear = ref()
const show = autoResetRef(false, 2000)

onMounted(() => {
  interact(unrefElement(gear)).draggable(true)
})
onBeforeUnmount(() => {
  interact(unrefElement(gear)).unset()
})
</script>
