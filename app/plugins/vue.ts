import VueDigitAnimation from 'vue-digit-animation'
import { consola } from 'consola'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(VueDigitAnimation)
  nuxtApp.vueApp.config.errorHandler = (error, context) => {
    console.log(error)
    consola.log(error)
  }
})
