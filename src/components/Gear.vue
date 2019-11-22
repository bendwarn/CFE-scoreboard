<template>
<transition>
  <div class="setting btn spot" :class="{ingame:!ingame}" key="setting" @click="folded=!folded" v-if="folded">
    <font-awesome-icon icon="cogs"/>
  </div>
  <div class="overlay" key="overlay" @click.self="folded=!folded" v-else>
    <div class="menu" key="menu">
      <div class="btn btn-danger" @click="everyRule({ action: 'initialize' })">初始化</div>
      <p-check class="p-switch p-fill" color="success" v-model="star"> 星辰</p-check>
      <p-check class="p-switch p-fill" color="success" v-model="environment"> 環境</p-check>
      <p-check class="p-switch p-fill" color="success" v-model="spirit"> 精靈</p-check>
    </div>
  </div>
</transition>
</template>
<style lang="sass">
@import '~pretty-checkbox/src/pretty-checkbox.scss'
</style>
<style lang="sass" scoped>
.overlay::v-deep .state
  display: block
  &:before
    top: -5px
    // top: calc((0% - (100% - 1em)) - 8%)
.v-enter-active, .v-enter-active > div
  transition: all .3s
.v-leave
  z-index: 1
=common
  position: absolute
  background-color: #f6b26b
  border: 3px solid black
  z-index: 2
  font-size: 8vmin
  border-radius: 8px
  overflow: hidden
=gear
  width: 8vmax
  height: 8vmax
=menu
  width: 85vmin
  height: 85vmin
.setting
  +common
  +gear
  &.ingame
    background-color: lawngreen
  &.v-enter, &.v-leave-to
    +menu
.menu
  +common
  +menu
  flex-direction: column
  justify-content: space-around
  .v-enter &, .v-leave-to &
    +gear
.btn-danger
  padding: 10px
  box-shadow: 0.1rem 0.1rem 0.3rem rgb(85, 65, 65)
  background-color: #d9534f
  border-color: #d43f3a
  &:active, &:hover
    color: #f1f5f7
    transform: translate(0.05rem, 0.05rem)
    box-shadow: 0.3rem 0.3rem 0.5rem black
    background-color: #d2322d
    border-color: #ac2925
.overlay
  position: absolute
  width: 100vw
  height: 100vh
  background-color: rgba(0, 0, 0, .35)
  z-index: 1
  &.v-enter, &.v-leave-to
    background-color: transparent
@media (min-aspect-ratio: 1/1)
  .setting
    bottom: 0
    &.v-enter, &.v-leave-to
      bottom: 7.5vh
  .menu
    bottom: 7.5vh
    .v-enter &, .v-leave-to &
      bottom: 0
@media (max-aspect-ratio: 1/1)
  .setting
    left: 0
    &.v-enter, &.v-leave-to
      left: 7.5vw
  .menu
    left: 7.5vw
    .v-enter &, .v-leave-to &
      left: 0
</style>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { State, Mutation } from 'vuex-class'
import PrettyCheck from 'pretty-checkbox-vue/check'
@Component({
  components: { pCheck: PrettyCheck }
})
export default class gear extends Vue {
  folded = true
  @State rules
  @State ingame
  @Mutation everyRule
  @Mutation addRule
  @Mutation removeRule
  get star() {
    return this.rules.includes('star')
  }
  set star(fresh) {
    this.toggleRule('star', fresh)
  }
  get environment() {
    return this.rules.includes('environment')
  }
  set environment(fresh) {
    this.toggleRule('environment', fresh)
  }
  get spirit() {
    return this.rules.includes('spirit')
  }
  set spirit(fresh) {
    this.toggleRule('spirit', fresh)
  }
  toggleRule(rule, flag) {
    if (flag) {
      this.addRule(rule)
    } else {
      this.removeRule(rule)
    }
  }
}
</script>
