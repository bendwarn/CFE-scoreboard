<template>
  <div>
    <template v-for="(s, pos) in star">
      <portal
        slim
        v-for="(summoned, index) of s.summoned"
        :to="pos + index"
        :key="pos + index"
        :order="2"
      >
        <div class="starbox">
          <font-awesome-icon
            icon="star"
            v-for="(val, key) in summoned"
            :key="key"
            :class="['meteor', key, { summoned: val, spot: val }]"
            :data-pos="pos"
            :data-index="index"
            :data-type="key"
          />
        </div>
      </portal>
      <portal slim :to="pos" :key="pos">
        <transition>
          <font-awesome-icon
            icon="star"
            class="star btn spot"
            :class="s.type"
            :data-pos="pos"
            v-if="s.type"
          />
        </transition>
      </portal>
    </template>
  </div>
</template>
<style lang="sass" scoped>
.star, .meteor
  transition: all .5s
.star
  width: 7vmax
  height: 7vmax
  background-color: black
  border: 3px solid black
    radius: 8px
  margin-top: 10px
  &.v-enter, &.v-leave-to
    opacity: 0
  &.v-leave, &.v-enter-to
    opacity: 1
.starbox
  width: 100%
  font-size: 5vmin
  justify-content: space-around
  flex-wrap: wrap
.meteor
  border: 3px solid transparent
  margin-right: 10px
.wood
  color: green
.metal
  color: white
.fire
  color: red
.water
  color: blue
.earth
  color: yellow

$primarycolor: #ffe599

.summoned
  border-color: black
</style>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { namespace, State } from 'vuex-class'
import { IntegerPlusminus } from 'vue-integer-plusminus'
import interact from 'interactjs'
const store = namespace('star')

@Component
export default class star extends Vue {
  @State star
  @store.Mutation toggle
  @store.Mutation eliminate

  mounted() {
    interact('.star').on('tap', ({ currentTarget }) => {
      this.eliminate(currentTarget.dataset.pos)
    })
    interact('.meteor').on('tap', ({ currentTarget }) => {
      const { pos, index, type } = currentTarget.dataset
      this.toggle({ pos, index, type })
    })
  }
  beforeDestroy() {
    interact('.star').unset()
    interact('.meteor').unset()
  }
}
</script>
