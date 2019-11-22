import Vue from 'vue'
import Vuex from 'vuex'
import theme from './theme'
import plugin from './plugin'
Vue.use(Vuex)
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
    setHealth(state, { pos, payload }) {
      state[pos].health = payload
    },
    swap(state) {
      [state.foe.health, state.friend.health] = [state.friend.health, state.foe.health]
    },
    setShield(state, { pos, index, payload }) {
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
      ingame: false,
      rules: ['base'] // ['star', 'spirit', 'environment']
    }
  },
  modules: {
    base
  },
  mutations: {
    everyRule(state, { action, mutation }) {
      if (state.ingame) return
      for (const rule of state.rules) {
        mutation && this.commit(`${rule}/${mutation}`)
        action && this.dispatch(`${rule}/${action}`)
      }
    },
    stepCount(state: any, payload) {
      if (state.ingame) return
      state.count += payload
      this.commit({ type: 'everyRule', action: 'initialize' })
    },
    toggleIngame(state) {
      state.ingame = !state.ingame
    },
    addRule(state, rule) {
      if (state.ingame) return
      state.rules.push(rule)
      this.registerModule(rule, theme[rule])
      this.dispatch(`${rule}/initialize`)
    },
    removeRule(state, rule) {
      if (state.ingame) return
      state.rules.splice(state.rules.indexOf(rule), 1)
      this.unregisterModule(rule)
    }
  },
  plugins: [plugin]
})

export default store
