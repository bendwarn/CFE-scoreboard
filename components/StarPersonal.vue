<template>
  <div class="w-full text-3xl justify-around flex-wrap">
    <font-awesome-icon
      icon="star"
      v-for="(n, i) in 5"
      :key="i"
      class="border-2 rounded-lg transition-all duration-300"
      :class="[
        elementColor[i],
        { 'border-black shadow-lg': summoned[i], 'border-transparent': !summoned[i] },
      ]"
      @click="star.toggle(pos, index, i)"
      @dblclick="star[pos].summoned[index][i] = !star[pos].summoned[index][i]"
    />
  </div>
</template>

<script setup lang="ts">
import { opponent } from '~~/composables/rules'
import { elementColor } from '~~/composables/color'

const props = defineProps<{ pos: opponent; index: number }>()
const star = useStar()
const summoned = computed(() => star[props.pos].summoned[props.index])
</script>
