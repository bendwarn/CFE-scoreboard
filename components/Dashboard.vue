<template>
  <div class="flex-col">
    <div
      class="hp h-1/5 w-11/12 touch-none items-end rounded-b-xl border-x-2 border-b-2 border-black bg-red-300 text-5xl text-red-600 shadow-xl lg:items-center"
      :class="hpBorder"
      ref="hpref"
    >
      {{ hptrans }}
    </div>
    <div class="relative h-4/5 w-4/5 touch-none items-stretch" ref="team">
      <div
        v-for="(n, i) in people.count"
        :key="i"
        :ref="shieldrefs.set"
        class="flex-1 flex-col items-stretch justify-between rounded-b-xl border-x-2 border-b-2 border-black bg-amber-200 shadow-lg"
      >
        <div
          class="shield h-1/6 rounded-b-2xl bg-sky-200 text-4xl text-blue-800 shadow-lg"
        >
          <div v-show="shtrans[i]">{{ shtrans[i].toFixed() }}</div>
        </div>
        <Spirits :pos="pos" :index="i" class="-mt-14" />
        <StarPersonal :pos="pos" :index="i" />
      </div>
      <StarTeam :pos="pos" class="absolute bottom-20" />
    </div>
    <div class="absolute z-20 flex-col" v-show="show" v-motion-roll-visible-bottom>
      <p>計算結果為 NaN</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useToFixed } from '@vueuse/math'
import interact from 'interactjs'
import { map, isNaN } from 'lodash-es'

import { opponent } from '~~/composables/rules'
import { countChange } from '~~/composables/utils'

const props = defineProps<{ pos: opponent }>()
const emit = defineEmits<{
  (
    event: 'reqCal',
    initial: number,
    category: string,
    handler: (value: string) => any
  ): void
}>()
const people = usePeople()
const hp = useHealth()
const shield = useShield()
const hpBorder = ref('')
const hpref = ref()
const team = ref()
const shieldrefs = useTemplateRefsList()

const hpoint = toRefs(hp)[props.pos]
const hptrans = useToFixed(useTransition(hpoint),0)
const shpoints = computed(() => map(shield[props.pos]))
const shtrans = useTransition(shpoints)

const show = autoResetRef(false, 2000)

let pinchActivated = countChange.initial
onMounted(() => {
  interact(unrefElement(hpref))
    .draggable(true)
    .dropzone({
      accept: '.hp',
      ondropactivate() {
        hpBorder.value = 'border-dashed'
      },
      ondropdeactivate() {
        hpBorder.value = ''
      },
      ondrop: hp.swap,
    })
    .on('click', () => {
      emit('reqCal', hp[props.pos], 'hp', (payload: string) => {
        if (isNaN(+payload)) {
          show.value = true
        } else {
          hp[props.pos] = +payload
        }
      })
    })
  interact(unrefElement(team)).gesturable({
    onmove({ scale }) {
      if (1.5 < scale && pinchActivated < countChange.increase) {
        pinchActivated++
        navigator.vibrate?.(200)
        people.count++
        allreset()
      } else if (scale < 0.5 && countChange.decrease < pinchActivated) {
        pinchActivated--
        navigator.vibrate?.(200)
        people.count--
        allreset()
      } else if (0.5 < scale && scale < 1.5 && countChange.initial != pinchActivated) {
        people.count -= pinchActivated
        allreset()
        navigator.vibrate?.(200)
        pinchActivated = countChange.initial
      }
    },
    onend() {
      pinchActivated = countChange.initial
    },
  })
  shieldrefs.value.forEach((ele, i) => {
    interact(ele.firstElementChild as HTMLDivElement)
      .draggable(true)
      .on('click', () => {
        emit('reqCal', shield[props.pos][i], 'sp', (sh: string) => {
          if (isNaN(+sh)) {
            show.value = true
          } else {
            shield[props.pos][i] = +sh
          }
        })
      })
  })
})
onBeforeUnmount(() => {
  interact(unrefElement(hpref)).unset()
  interact(unrefElement(team)).unset()
  shieldrefs.value.forEach((ele, i) => {
    interact(ele.firstElementChild as HTMLDivElement).unset()
  })
})
</script>
