import { defineNuxtPlugin } from '#app'
import { MotionPlugin } from '@vueuse/motion'
import VueDigitAnimation from 'vue-digit-animation'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(MotionPlugin)
  nuxtApp.vueApp.use(VueDigitAnimation)
  nuxtApp.vueApp.config.errorHandler = (error, context) => {
    console.log(error)
  }
})
