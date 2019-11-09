<template>
  <div class="home">
    <DashBoard pos="foe"/>
    <DashBoard pos="friend"/>
    <Gear/>
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
import Gear from '../components/Gear'
// document.addEventListener('touchstart', () => { }, false) // enable safari :active
export default {
  name: 'home',
  components: {
    DashBoard,
    Gear
  }
}
</script>
