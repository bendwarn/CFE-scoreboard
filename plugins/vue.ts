import { defineNuxtPlugin } from '#app'
import { MotionPlugin } from '@vueuse/motion'
import { GesturePlugin } from '@vueuse/gesture'
import VueDigitAnimation from 'vue-digit-animation'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(MotionPlugin)
  nuxtApp.vueApp.use(GesturePlugin)
  nuxtApp.vueApp.use(VueDigitAnimation)
  nuxtApp.vueApp.config.errorHandler = (error, context) => {
    console.log(error)
    console.log(context)
  }
})
