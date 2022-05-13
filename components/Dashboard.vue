<template>
  <div>
    <div
      class="w-11/12 h-1/5 bg-red-300 text-red-600 text-5xl border-x-2 border-b-2 border-black items-end lg:items-center rounded-b-xl shadow-xl hp"
      :class="hpBorder"
      ref="hpref"
    >
      {{ hptrans.toFixed() }}
    </div>
    <div class="w-4/5 h-4/5 items-stretch" ref="team">
      <div
        v-for="(n, i) in people.count"
        :key="i"
        :ref="shieldrefs.set"
        class="flex-1 border-x-2 border-b-2 border-black bg-amber-200 flex-col items-stretch justify-between rounded-b-xl shadow-lg"
      >
        <div
          class="h-1/6 text-4xl text-blue-800 bg-sky-200 rounded-b-2xl shadow-lg shield"
        >
          <div v-show="shtrans[i]">{{ shtrans[i].toFixed() }}</div>
        </div>
        <Spirits :pos="pos" :index="i" />
        <StarPersonal :pos="pos" :index="i" />
      </div>
      <StarTeam :pos="pos" class="absolute bottom-16" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import interact from 'interactjs'
import { map } from 'lodash-es'

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
const hpBorder = ref('border-solid')
const hpref = ref()
const team = ref()
const shieldrefs = useTemplateRefsList()

const hpoint = computed(() => hp[props.pos])
const hptrans = useTransition(hpoint)
const shpoints = computed(() => map(shield[props.pos]))
const shtrans = useTransition(shpoints)

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
        hpBorder.value = 'border-solid'
      },
      ondrop: hp.swap,
    })
    .on(['tap', 'click'], () => {
      emit('reqCal', hp[props.pos], 'hp', (payload: string) => {
        hp[props.pos] = +payload
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
      .on(['tap', 'click'], () => {
        emit('reqCal', shield[props.pos][i], 'sp', (sh: string) => {
          shield[props.pos][i] = +sh
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
