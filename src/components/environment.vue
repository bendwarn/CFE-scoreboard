<template>
  <div class="env btn spot" :class="font" ref="env">
    <font-awesome-icon :icon="font" v-if="font" />
  </div>
</template>

<style lang="sass" scoped>
=harmony($c)
  background-color: $c
  color: darken($c, 20%)
.env
  position: absolute
  width: 8vmax
  height: 8vmax
  font-size: 8vmin
  z-index: 1
  background-color: gainsboro
  border: 3px solid black
  border-radius: 8px
  transition: all .8s
  touch-action: none
  &.dragon
    +harmony(green)
  &.cat
    +harmony(silver)
  &.phoenix-framework
    +harmony(red)
  &.water
    +harmony(blue)
  &.mountain
    +harmony(yellow)
@media (min-aspect-ratio: 1/1)
  .env
    bottom: 10vmax
@media (max-aspect-ratio: 1/1)
  .env
    right: 0
</style>

<script lang="ts">
import { Component, Vue, Ref } from 'vue-property-decorator'
import { namespace } from 'vuex-class'
import interact from 'interactjs'
const env = namespace('environment')
enum fontmap {
  metal = 'cat',
  fire = 'phoenix-framework',
  water = 'water',
  earth = 'mountain',
  wood = 'dragon',
  '' = '',
}

@Component
export default class environment extends Vue {
  @env.State(function (state) {
    let attr = this.moving ? this.moveType : fontmap[state.type]
    if (attr == 'phoenix-framework') {
      attr = ['fab', 'phoenix-framework']
    }
    return attr
  })
  font
  @env.State type
  @env.Mutation change
  @Ref() readonly env!: HTMLElement
  moving = false
  moveType = ''
  dy = 0

  mounted() {
    interact(this.env)
      .draggable({
        lockAxis: 'y',
        onstart: () => {
          this.moving = true
          this.moveType = this.font
        },
        onmove: ({ dy }) => {
          this.dy -= dy * devicePixelRatio
          if (this.dy < 0) {
            this.moveType = ''
          } else if (this.dy < 100) {
            this.moveType = 'mountain'
          } else if (100 < this.dy && this.dy < 200) {
            this.moveType = 'phoenix-framework'
          } else if (200 < this.dy && this.dy < 300) {
            this.moveType = 'water'
          } else if (300 < this.dy && this.dy < 400) {
            this.moveType = 'dragon'
          } else {
            this.moveType = 'cat'
          }
        },
        onend: () => {
          this.moving = false
          this.dy = 0
          if (this.moveType != fontmap[this.type]) {
            for (const k of Object.keys(fontmap)) {
              if (fontmap[k] == this.moveType) {
                return this.change(k)
              }
            }
          }
        },
      })
      .on('tap', () => {
        this.type && this.change('')
      })
  }
  beforeDestroy() {
    interact(this.env).unset()
  }
}
</script>
