<template>
  <div
    class="field z-0 h-16 w-16 touch-none rounded-xl border-2 border-black text-5xl shadow-xl transition duration-500"
    :class="[bg, fborder]"
    ref="fieldref"
  >
    <div class="h-full w-full" :class="text" @click="clickIcon">
      <span v-if="font" :class="font" />
    </div>
    <OnClickOutside @trigger="modal">
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
          class="absolute left-0 z-10 h-16 w-16 rounded-xl"
          :class="[elementBG[i], elementStroke[i], transform[i], delay[i]]"
          @click="assignField(i)"
        >
          <span :class="fontmap[i]" /></div
      ></transition-group>
    </OnClickOutside>
  </div>
</template>

<script setup lang="ts">
import { isNil } from 'lodash-es'
import interact from 'interactjs'

const fontmap = [
  'i-emojione-monotone:tiger-face',
  'i-fa-brands:phoenix-framework',
  'i-fa-solid:water',
  'i-emojione-monotone:mountain',
  'i-simple-icons:dungeonsanddragons',
  '',
]
const fieldref = ref()
const fborder = ref('')
const field = useField()
const [show, toggle] = useToggle()
const throttleToggle = useThrottleFn(toggle, 50, false)
const font = computed(() => fontmap[field.field ?? 5])
const bg = computed(() => elementBG[field.field ?? 5])
const text = computed(() => elementStroke[field.field ?? 5])
const delay = ['', 'delay-100', 'delay-200', 'delay-300', 'delay-400']
const transform = [
  '-translate-y-16',
  '-translate-x-16 -translate-y-16',
  '-translate-x-16',
  '-translate-x-16 translate-y-16',
  'translate-y-16',
]

const clickIcon = () => {
  if (!isNil(field.field)) {
    field.field = null
  } else {
    throttleToggle()
  }
}
const modal = () => {
  if (show.value) {
    throttleToggle()
  }
}
const assignField = (i: element) => {
  field.field = i
  throttleToggle()
}
onMounted(() => {
  interact(unrefElement(fieldref))
    .draggable(true)
    .dropzone({
      accept: '.gear',
      ondropactivate() {
        fborder.value = 'border-dashed'
      },
      ondropdeactivate() {
        fborder.value = ''
      },
      ondragenter({ relatedTarget }) {
        relatedTarget.firstElementChild.classList.add('i-eos-icons:rotating-gear')
        relatedTarget.firstElementChild.classList.remove('i-fa6-solid:gear')
      },
      ondragleave({ relatedTarget }) {
        relatedTarget.firstElementChild.classList.remove('i-eos-icons:rotating-gear')
        relatedTarget.firstElementChild.classList.add('i-fa6-solid:gear')
      },
      ondrop({ relatedTarget }) {
        relatedTarget.firstElementChild.classList.remove('i-eos-icons:rotating-gear')
        relatedTarget.firstElementChild.classList.add('i-fa6-solid:gear')
        allreset()
      },
    })
})
onBeforeUnmount(() => {
  interact(unrefElement(fieldref)).unset()
})
</script>
