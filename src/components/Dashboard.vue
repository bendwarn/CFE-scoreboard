<template>
  <div :class="pos">
    <div class="hp bot left right btn spot" @click="popup(health ,'for-hp', damage)">{{ health }}</div>
    <div class="personal" ref='personal'>
      <div class="person bot left right spot" v-for="n in count" :key='n'>
        <div class="shield bot left right btn spot" @click="popup(shield[n-1], 'for-sp', shielding(n-1))">{{ shield[n-1] }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { State, Mutation } from 'vuex-class'
import VModal from 'vue-js-modal'
import interact from 'interactjs'

import calculator from './calculator.vue'
Vue.use(VModal, { dynamic: true, injectModalsContainer: true })
@Component
export default class DashBoard extends Vue {
  @Prop() private pos!: string
  @State(function(state) { return state.base[this.pos].health }) health
  @State(function(state) { return state.base[this.pos].shield.map(x => 0 < x ? x : '') }) shield
  @State count
  @State rules
  @Mutation stepCount
  canAddPeople = true
  pinchActivated = false
  test = 1
  damage(hp) {
    this.$store.commit('base/damage', { pos: this.pos, payload: hp })
  }
  shielding(index) {
    return sp => this.$store.commit('base/shielding', { pos: this.pos, index, payload: sp })
  }
  popup(value, caller, handler) {
    this.$modal.show(calculator, { initial: value, container: caller, handler }, { width: '85vmin', height: '85vmin', pivotX: 0, pivotY: 0 })
  }
  mounted() {
    interact(this.$refs.personal as HTMLElement).gesturable({
      onmove: ({ scale }) => {
        if (this.canAddPeople) {
          if (1.5 < scale) {
            this.canAddPeople = false
            this.pinchActivated = true
            navigator.vibrate(1)
            this.stepCount(1)
          } else if (scale < 0.5) {
            this.canAddPeople = false
            this.pinchActivated = true
            navigator.vibrate(1)
            this.stepCount(-1)
          }
        }
      },
      onend: _ => {
        if (this.pinchActivated) {
          this.canAddPeople = true
          this.pinchActivated = false
        }
      }
    })
  }
  beforeDestroy() {
    interact(this.$refs.personal as HTMLElement).unset()
  }
}
</script>

<style scoped lang="sass">
$radius: 10px
$border: 3px solid black
.hp
  width: 90%
  flex: 3
  background-color: #ea9999
  color: #cc0000
  font-size: 50px
  padding: 0 5px
  border-left: $border
  border-right: $border
  border-bottom: $border
  z-index: 1
.personal
  touch-action: none
  width: 80%
  flex: 17
  align-items: stretch
  .person
    flex: 1
    background-color: #ffe599
    border-left: $border
    border-right: $border
    border-bottom: $border
    align-items: flex-start
    .shield
      width: 100%
      height: 8vh
      font-size: 36px
      background-color: #cfe2f3
      color: #073763
</style>
<style lang="sass">
.v--modal
  background: transparent
.v--modal-overlay .v--modal-box
  overflow: initial
</style>
