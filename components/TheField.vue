<template>
  <div
    class="absolute right-0 lg:right-auto lg:bottom-1/2 w-16 h-16 z-0 bg-gray-300 text-5xl border-2 border-black rounded-xl shadow-xl transition duration-500 field"
    :class="[bg, fborder]"
    ref="fieldref"
  >
    <div class="w-full h-full" :class="text" @click="clickIcon">
      <font-awesome-icon v-if="font" :icon="font" />
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
          class="absolute w-16 h-16 left-0 rounded-xl z-10"
          :class="[elementbgColor[i], elementTextColor[i], transform[i], delay[i]]"
          @click="assignField(i)"
        >
          <font-awesome-icon :icon="fontmap[i]" /></div
      ></transition-group>
    </OnClickOutside>
  </div>
</template>

<script setup lang="ts">
import { OnClickOutside } from '@vueuse/components'
import { isNil } from 'lodash-es'
import interact from 'interactjs'

import { elementbgColor, elementTextColor } from '~~/composables/color'
import { element } from '~~/composables/rules'

const fontmap = ['cat', ['fab', 'phoenix-framework'], 'water', 'mountain', 'dragon', '']
const fieldref = ref()
const fborder = ref('')
const field = useField()
const [show, toggle] = useToggle()
const throttleToggle = useThrottleFn(toggle, 50, false)
const font = computed(() => fontmap[field.field ?? 5])
const bg = computed(() => elementbgColor[field.field ?? 5])
const text = computed(() => elementTextColor[field.field ?? 5])
const delay = ['', 'delay-100', 'delay-200', 'delay-300', 'delay-[400ms]']
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
        relatedTarget.firstElementChild.classList.add('fa-spin')
      },
      ondragleave({ relatedTarget }) {
        relatedTarget.firstElementChild.classList.remove('fa-spin')
      },
      ondrop({ relatedTarget }) {
        relatedTarget.firstElementChild.classList.remove('fa-spin')
        allreset()
      },
    })
})
onBeforeUnmount(() => {
  interact(unrefElement(fieldref)).unset()
})
</script>
