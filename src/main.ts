import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faCogs, faDragon, faCat, faWater, faMountain, faStar, faGhost } from '@fortawesome/free-solid-svg-icons'
import { faPhoenixFramework } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import PortalVue from 'portal-vue'
import VModal from 'vue-js-modal'

library.add(faCogs, faPhoenixFramework, faDragon, faCat, faWater, faMountain, faStar, faGhost)
Vue.use(PortalVue)
Vue.use(VModal, { dynamic: true, injectModalsContainer: true })
Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
