<template>
    <router-view id="app"/>
</template>

<style lang="sass">
body
  width: 100vw
  height: 100vh
  margin: 0
  background: #eae6d1
  touch-action: pan-y
  user-select: none
div
  display: flex
  box-sizing: border-box
  justify-content: center
  align-items: center
#app
  width: 100vw
  height: 100vh
  font-family: "Avenir", Helvetica, Arial, sans-serif
  text-align: center
  color: #2c3e50
.top.left
  border-top-left-radius: 20px
.top.right
  border-top-right-radius: 20px
.bot.left
  border-bottom-left-radius: 20px
.bot.right
  border-bottom-right-radius: 20px
.btn:active
  box-shadow: inset 0 5px 8px rgba(0,0,0,.5)
.spot
  box-shadow: 3px 3px 5px rgba(0,0,0,.25)

#nav
  padding: 30px

  a
    font-weight: bold
    color: #2c3e50

    &.router-link-exact-active
      color: #42b983
</style>
