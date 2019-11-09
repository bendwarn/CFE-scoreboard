import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
// export const theme = {
// star: {
// namespaced: true,
//   state() {
//     return { type: '', summoned: [] }
//   }
// }
// environment: {
// namespaced: true,
//   state() {
//     return { type: '' }
//   }
// }
// spirit: {
// namespaced: true,
//   state() {
//     return { type: [], point: [] }
//   }
// }
// }
const base = {
  namespaced: true,
  state() {
    return {
      foe: {
        health: 250,
        shield: [0, 0]
      },
      friend: {
        health: 250,
        shield: [0, 0]
      }
    }
  },
  mutations: {
    damage(state, { pos, payload }) {
      state[pos].health = payload
    },
    shields(state, payload) {
      0 < payload ? state.foe.shield.push(0) : state.foe.shield.pop()
      0 < payload ? state.friend.shield.push(0) : state.friend.shield.pop()
    },
    shielding(state, { pos, index, payload }) {
      state[pos].shield.splice(index, 1, payload)
    }
  },
  actions: {
    initialize({ state, rootState }) {
      const hp = 150 + rootState.count * 50
      for (const team in state) {
        state[team].health = hp
        state[team].shield = Array(rootState.count).fill(0)
      }
    }
  }
}
const store = new Vuex.Store({
  state() {
    return {
      count: 2,
      rules: ['base'] // ['star','environment', 'spirit']
    }
  },
  modules: {
    base
  },
  mutations: {
    retrieveFromLocal(state) {
      if (localStorage.getItem('store')) {
        this.replaceState(JSON.parse(localStorage.getItem('store') || '{}'))
      }
    },
    everyRule(state, { action, mutation }) {
      for (const rule of state.rules) {
        mutation && this.commit(`${rule}/${mutation}`)
        action && this.dispatch(`${rule}/${action}`)
      }
    },
    stepCount(state: any, payload) {
      state.count += payload
      this.commit({ type: 'everyRule', action: 'initialize' })
    }
    // addRule
    // removeRule
  }
})
const listener = (mutation, state) => {
  switch (mutation.type) {
    case 'retrieveFromLocal':
      break
    default:
      localStorage.setItem('store', JSON.stringify(state))
      break
  }
}
store.subscribe(listener)
store.subscribeAction({ after: listener })

export default store
