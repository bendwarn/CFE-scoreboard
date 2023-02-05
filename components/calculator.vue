<template>
  <dialog
    class="aspect-4/5 -z-10 grid grid-cols-4 gap-2 rounded-lg p-3 text-5xl opacity-0 shadow-lg transition duration-200 backdrop:backdrop-blur open:z-10 open:opacity-100"
    :class="bg"
    ref="dialog"
    @click.self="close"
  >
    <div class="col-span-3 rounded-xl border-4 text-4xl" :class="areaColor">
      {{ result }} {{ formula }}
    </div>
    <div
      class="rounded-lg bg-blue-600 text-white shadow hover:bg-blue-700 active:bg-blue-700 active:hover:scale-105 active:hover:shadow-md"
      @click="equal"
    >
      =
    </div>
    <div
      class="rounded-lg bg-blue-600 text-white shadow hover:bg-blue-700 active:bg-blue-700 active:hover:scale-105 active:hover:shadow-md"
      @click="append('7')"
    >
      7
    </div>
    <div
      class="rounded-lg bg-blue-600 text-white shadow hover:bg-blue-700 active:bg-blue-700 active:hover:scale-105 active:hover:shadow-md"
      @click="append('8')"
    >
      8
    </div>
    <div
      class="rounded-lg bg-blue-600 text-white shadow hover:bg-blue-700 active:bg-blue-700 active:hover:scale-105 active:hover:shadow-md"
      @click="append('9')"
    >
      9
    </div>
    <div
      class="rounded-lg bg-blue-300 text-white shadow hover:bg-blue-400 active:bg-blue-400 active:hover:scale-105 active:hover:shadow-md"
      @click="append('+')"
    >
      +
    </div>
    <div
      class="rounded-lg bg-blue-600 text-white shadow hover:bg-blue-700 active:bg-blue-700 active:hover:scale-105 active:hover:shadow-md"
      @click="append('4')"
    >
      4
    </div>
    <div
      class="rounded-lg bg-blue-600 text-white shadow hover:bg-blue-700 active:bg-blue-700 active:hover:scale-105 active:hover:shadow-md"
      @click="append('5')"
    >
      5
    </div>
    <div
      class="rounded-lg bg-blue-600 text-white shadow hover:bg-blue-700 active:bg-blue-700 active:hover:scale-105 active:hover:shadow-md"
      @click="append('6')"
    >
      6
    </div>
    <div
      class="rounded-lg bg-blue-300 text-white shadow hover:bg-blue-400 active:bg-blue-400 active:hover:scale-105 active:hover:shadow-md"
      @click="append('-')"
    >
      -
    </div>
    <div
      class="rounded-lg bg-blue-600 text-white shadow hover:bg-blue-700 active:bg-blue-700 active:hover:scale-105 active:hover:shadow-md"
      @click="append('1')"
    >
      1
    </div>
    <div
      class="rounded-lg bg-blue-600 text-white shadow hover:bg-blue-700 active:bg-blue-700 active:hover:scale-105 active:hover:shadow-md"
      @click="append('2')"
    >
      2
    </div>
    <div
      class="rounded-lg bg-blue-600 text-white shadow hover:bg-blue-700 active:bg-blue-700 active:hover:scale-105 active:hover:shadow-md"
      @click="append('3')"
    >
      3
    </div>
    <div
      class="rounded-lg bg-blue-300 text-white shadow hover:bg-blue-400 active:bg-blue-400 active:hover:scale-105 active:hover:shadow-md"
      @click="append('*')"
    >
      *
    </div>
    <div
      class="rounded-lg bg-blue-600 text-white shadow hover:bg-blue-700 active:bg-blue-700 active:hover:scale-105 active:hover:shadow-md"
      @click="append('0')"
    >
      0
    </div>
    <div
      class="rounded-lg bg-red-600 text-white shadow hover:bg-red-700 active:bg-red-700 active:hover:scale-105 active:hover:shadow-md"
      @click="clean"
    >
      C
    </div>
    <div
      class="rounded-lg bg-white text-gray-900 shadow active:hover:scale-105 active:hover:bg-gray-100 active:hover:shadow-md"
      @click="pop"
    >
      Del
    </div>
    <div
      class="rounded-lg bg-blue-300 text-white shadow hover:bg-blue-400 active:bg-blue-400 active:hover:scale-105 active:hover:shadow-md"
      @click="append('/')"
    >
      /
    </div>
  </dialog>
</template>

<script setup lang="ts">
import init, { calculate } from 'calcu'

const props = defineProps<{ initial: string; container: string }>()
const emit = defineEmits<{
  (e: 'giveResult', value: string): void
}>()
const dialog = ref()
const formula = ref('')
const result = ref('')
watch(
  props,
  (v) => {
    result.value = v.initial
  },
  { immediate: true }
)
const bg = computed(() => ({ hp: 'bg-red-100', sp: 'bg-blue-100' }[props.container]))
const areaColor = computed(
  () =>
    ({
      hp: 'text-red-500 border-red-500',
      sp: 'text-blue-500 border-blue-500',
    }[props.container])
)
const append = (element: string) => {
  formula.value += element
}
const pop = () => {
  if (formula.value.length) {
    formula.value = formula.value.slice(0, -1)
  } else {
    result.value = result.value.slice(0, -1)
  }
}
const equal = async () => {
  if (result.value + formula.value == '') {
    emit('giveResult', '0')
  } else {
    await init()
    result.value = calculate(result.value + formula.value)
    emit('giveResult', result.value == '' ? '0' : result.value)
  }
  close()
}
const clean = () => {
  formula.value = ''
  result.value = props.initial
}
const close = () => {
  clean()
  unrefElement(dialog).close()
}
</script>
