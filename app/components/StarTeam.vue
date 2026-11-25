<template>
  <transition>
    <div
      class="star h-14 w-14 rounded-xl bg-black text-3xl shadow-lg transition duration-500"
      :class="type"
      ref="starref"
      @click="star[props.pos].type = undefined"
    >
      <span class="icon icon-star" />
    </div>
  </transition>
</template>

<script lang="ts" setup>
import interact from 'interactjs'
import { historyDragKey } from '../utils/history-drag'

const props = defineProps<{ pos: opponent }>()
const starref = ref()
const registerHistoryDrag = inject(historyDragKey, () => {})
const star = useStar()
const type = computed(() => elementFill[star[props.pos].type ?? 5])
onMounted(() => {
  registerHistoryDrag(interact(unrefElement(starref)).draggable(true))
})
onBeforeUnmount(() => {
  interact(unrefElement(starref)).unset()
})
</script>
