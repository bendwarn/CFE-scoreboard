<template>
<div>
  <template v-for="(spirits, pos) in spirit">
    <portal slim v-for="(s, index) of spirits" :to='pos+index' :key='pos+index' :order='1'>
      <integer-plusminus
        :max='s.type?6:0'
        :value="s.point"
        @input="setPoint({pos, index, payload: $event})"
      >
        <font-awesome-icon icon="ghost" :class="['slider', selected(pos, index)? moveType : s.type]" :data-pos="pos" :data-index="index"/>
        <div v-if="s.type">{{ s.point }}</div>
      </integer-plusminus>
    </portal>
  </template>
</div>
</template>
<style lang="sass" scoped>
.int-pm
  width: 100%
  margin:
    top: 10px
    bottom: 10px
  justify-content: space-between
  font-size: 8vmin
  line-height: 1
  &::v-deep .int-pm-value
    width: 100%
    border-style: none
    justify-content: space-evenly
    &:focus
      outline-width: 1
::v-deep .int-pm-btn.int-pm-increment
  background-color: #5cb85c
::v-deep .int-pm-btn.int-pm-decrement
  background-color: #d9534f
.wood
  color: green
.metal
  color: silver
.fire
  color: red
.water
  color: blue
.earth
  color: yellow
</style>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { namespace, State } from 'vuex-class'
import { IntegerPlusminus } from 'vue-integer-plusminus'
import interact from 'interactjs'
const spi = namespace('spirit')

@Component({
  components: { IntegerPlusminus }
})
export default class spirit extends Vue {
  @State spirit
  @spi.Mutation setPoint
  @spi.Mutation spawn
  @spi.Mutation void
  movePos = ''
  moveIndex = -2
  moveType = ''
  dx = 0
  dy = 0

  selected(pos, index) {
    return this.movePos == pos && this.moveIndex == index
  }

  mounted() {
    interact('.slider').draggable({
      onstart: ({ currentTarget }) => {
        this.movePos = currentTarget.dataset.pos
        this.moveIndex = currentTarget.dataset.index
      },
      onmove: ({ dx, dy }) => {
        this.dx += dx
        if (this.movePos == 'foe' && matchMedia('(max-aspect-ratio: 1/1)').matches) {
          this.dy += dy
        } else {
          this.dy -= dy
        }
        if (this.dx < this.dy) {
          if (this.dy < 0) {
            this.moveType = ''
          } else if (this.dy < 100) {
            this.moveType = 'earth'
          } else if (100 < this.dy && this.dy < 200) {
            this.moveType = 'fire'
          } else if (200 < this.dy && this.dy < 300) {
            this.moveType = 'water'
          } else if (300 < this.dy && this.dy < 400) {
            this.moveType = 'wood'
          } else {
            this.moveType = 'metal'
          }
        } else {
          this.moveType = ''
        }
      },
      onend: () => {
        if (0 < this.dy && this.dx < this.dy) {
          this.spawn({ pos: this.movePos, index: this.moveIndex, type: this.moveType })
        } else if (0 < this.dx) {
          this.void()
        }
        this.movePos = ''
        this.moveIndex = -1
        this.moveType = ''
        this.dy = this.dx = 0
      }
    }).on('tap', ({ currentTarget }) => {
      this.setPoint({ pos: currentTarget.dataset.pos, index: currentTarget.dataset.index, payload: 0 })
    })
  }
  beforeDestroy() {
    interact('.slider').unset()
  }
}
</script>
