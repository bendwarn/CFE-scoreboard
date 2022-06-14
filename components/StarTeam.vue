<template>
  <transition>
    <div
      class="star h-14 w-14 rounded-xl bg-black text-3xl shadow-lg transition duration-500"
      :class="type"
      ref="starref"
      @click="star[props.pos].type = undefined"
    >
      <span class="i-bi:star-fill" />
    </div>
  </transition>
</template>

<script lang="ts" setup>
import interact from 'interactjs'

import { opponent } from '~~/composables/rules'
import { elementFill } from '~~/composables/color'

const props = defineProps<{ pos: opponent }>()
const starref = ref()
const star = useStar()
const type = computed(() => elementFill[star[props.pos].type ?? 5])
onMounted(() => {
  interact(unrefElement(starref)).draggable(true)
})
onBeforeUnmount(() => {
  interact(unrefElement(starref)).unset()
})
</script>
