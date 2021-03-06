<template>
  <div :class="pos">
    <div ref="hp" class="hp bot left right btn spot" @click="popup(health, 'for-hp', setHealth)">
      {{ health }}
    </div>
    <div ref="personal" class="personal">
      <portal-target :name="pos" class="team" multiple />
      <div v-for="n in count" :key="n" class="person bot left right spot">
        <div
          class="shield bot left right btn spot"
          @click="popup(shield[n - 1], 'for-sp', setShield(n - 1))"
        >
          {{ shield[n - 1] }}
        </div>
        <portal-target :name="`${pos}${n - 1}`" multiple />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Ref } from 'vue-property-decorator'
import { State, Mutation } from 'vuex-class'
import interact from 'interactjs'

import { opponent } from '../store/theme'
import calculator from './calculator.vue'

enum countChange {
  decrease = -1,
  initial,
  increase,
}

@Component
export default class DashBoard extends Vue {
  @Prop() private pos!: string
  @State(function (state) {
    return state.base[this.pos].health
  })
  health
  @State(function (state) {
    return state.base[this.pos].shield.map((x) => (0 < x ? x : ''))
  })
  shield
  @State count
  @State rules
  @Mutation stepCount
  @Ref() readonly hp!: HTMLElement
  @Ref() readonly personal!: HTMLElement
  pinchActivated = countChange.initial
  setHealth(hp) {
    this.$store.commit('base/setHealth', { pos: this.pos, payload: hp })
  }
  setShield(index) {
    return (sp) =>
      this.$store.commit('base/setShield', {
        pos: this.pos,
        index,
        payload: sp,
      })
  }
  popup(value, caller, handler) {
    this.$modal.show(
      calculator,
      { initial: value, container: caller, handler },
      { width: '85vmin', height: '85vmin', styles: { 'border-radius': '40px' } }
    )
  }

  mounted() {
    interact(this.personal).gesturable({
      onmove: ({ scale }) => {
        if (1.5 < scale && this.pinchActivated < countChange.increase) {
          this.pinchActivated++
          navigator.vibrate && navigator.vibrate(1)
          this.stepCount(1)
        } else if (scale < 0.5 && countChange.decrease < this.pinchActivated) {
          this.pinchActivated--
          navigator.vibrate && navigator.vibrate(1)
          this.stepCount(-1)
        } else if (0.5 < scale && scale < 1.5 && countChange.initial != this.pinchActivated) {
          this.stepCount(-this.pinchActivated)
          navigator.vibrate && navigator.vibrate(1)
          this.pinchActivated = countChange.initial
        }
      },
      onend: () => {
        this.pinchActivated = countChange.initial
      },
    })
    interact(this.hp)
      .draggable({})
      .dropzone({
        accept: '.hp',
        ondropactivate: ({ target, relatedTarget }) => {
          if (relatedTarget != target) {
            target.classList.add('drop-activated')
          }
        },
        ondropdeactivate: ({ target, relatedTarget }) => {
          target.classList.remove('drop-activated')
        },
        ondrop: () => {
          this.$store.commit('base/swap')
        },
      })
  }
  beforeDestroy() {
    interact(this.personal).unset()
    interact(this.hp).unset()
  }
}
</script>

<style scoped lang="sass">
$radius: 10px
=hang
  border:
    right: 3px solid black
    bottom: 3px solid black
    left: 3px solid black
.hp
  width: 90%
  flex: 4
  background-color: #ea9999
  color: #cc0000
  font-size: 50px
  padding: 0 5px
  +hang
  z-index: 0
  touch-action: none
  @media (max-aspect-ratio: 1/1)
    align-items: flex-end
    line-height: 33px
.personal
  touch-action: none
  width: 80%
  flex: 17
  align-items: stretch
  .person
    flex: 1
    background-color: #ffe599
    +hang
    flex-direction: column
    align-items: stretch
    .shield
      height: 8vh
      font-size: 36px
      background-color: #cfe2f3
      color: #073763
    .vue-portal-target
      flex-grow: 1
      flex-direction: column
      justify-content: flex-start
.drop-activated
  border:
    right-style: dotted
    bottom-style: dotted
    left-style: dotted
.team
  position: absolute
  bottom: 0
  overflow: visible
</style>
<style lang="sass">
.v--modal-overlay .v--modal.v--modal-box
  background-color: transparent
  border-radius: 40px
  overflow: initial
</style>
