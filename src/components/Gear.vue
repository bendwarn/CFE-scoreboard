<template>
    <div class="setting btn spot" @click="initializeAll"></div>
</template>
<style lang="sass" scoped>
.setting
  position: absolute
  background-color: #f6b26b
  border: 3px solid black
  z-index: 2
@media (min-aspect-ratio: 1/1)
  .setting
    width: 8vw
    height: 8vw
    left: 46vw
    bottom: 0
@media (max-aspect-ratio: 1/1)
  .setting
    width: 8vh
    height: 8vh
</style>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Mutation } from 'vuex-class'
@Component
export default class Gear extends Vue {
  @Mutation everyRule
  initializeAll() {
    this.everyRule({ action: 'initialize' })
  }
}
</script>
