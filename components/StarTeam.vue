<template>
  <transition>
    <div
      class="w-14 h-14 text-3xl bg-black rounded-xl shadow-lg transition duration-500 star"
      :class="type"
      ref="starref"
      @click="delete star[props.pos].type"
    >
      <font-awesome-icon icon="star" />
    </div>
  </transition>
</template>

<script lang="ts" setup>
import interact from 'interactjs'

import { opponent } from '~~/composables/rules'
import { elementColor } from '~~/composables/color'

const props = defineProps<{ pos: opponent }>()
const starref = ref()
const star = useStar()
const type = computed(() => elementColor[star[props.pos].type ?? 5])
onMounted(() => {
  interact(unrefElement(starref)).draggable(true)
})
onBeforeUnmount(() => {
  interact(unrefElement(starref)).unset()
})
</script>
