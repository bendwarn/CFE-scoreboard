<template>
  <div class="home">
    <DashBoard pos="foe"/>
    <DashBoard pos="friend"/>
    <gear/>
    <component v-for="rule of $store.state.rules.slice(1)" :is="rule" :key="rule"></component>
  </div>
</template>
<style scoped lang="sass">
.foe, .friend
  flex-direction: column
@media (min-aspect-ratio: 1/1)
  .foe, .friend
    height: 100%
    flex: 1
@media (max-aspect-ratio: 1/1)
  .home
    flex-direction: column
  .foe, .friend
    width: 100%
    height: 50%
    border-top: 1px solid black
  .foe
    transform: rotate(180deg)
</style>
<script>
import DashBoard from '../components/Dashboard'
import gear from '../components/gear'
import environment from '../components/environment'
import star from '../components/star'
import spirit from '../components/spirit'
document.addEventListener('touchstart', event => {
  if (event.touches.length > 1) {
    event.preventDefault()
  }
}, { passive: false })

let lastTouchEnd = 0
document.addEventListener('touchend', event => {
  const now = (new Date()).getTime()
  if (now - lastTouchEnd <= 300) {
    event.preventDefault()
  }
  lastTouchEnd = now
}, false)
export default {
  name: 'home',
  components: {
    DashBoard,
    gear,
    environment,
    star,
    spirit
  }
}
</script>
