<template>
  <div class="w-full flex-wrap justify-around text-3xl">
    <div
      v-for="(n, i) in 5"
      :key="i"
      class="rounded-lg border-2 transition-all duration-300"
      :class="[
        elementFill[i],
        { 'border-black shadow-lg': summoned[i], 'border-transparent': !summoned[i] },
      ]"
    >
      <span class="i-bi:star-fill" @click="star.toggle(pos, index, i)" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { opponent } from '~~/composables/rules'
import { elementFill } from '~~/composables/color'

const props = defineProps<{ pos: opponent; index: number }>()
const star = useStar()
const summoned = computed(() => star[props.pos].summoned[props.index])
</script>
