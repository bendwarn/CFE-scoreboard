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
        shield: [0, 0],
      },
      friend: {
        health: 250,
        shield: [0, 0],
      },
    }
  },
  mutations: {
    setHealth(state, { pos, payload }) {
      state[pos].health = payload
    },
    swap(state) {
      ;[state.foe.health, state.friend.health] = [state.friend.health, state.foe.health]
    },
    setShield(state, { pos, index, payload }) {
      state[pos].shield.splice(index, 1, payload)
    },
  },
  actions: {
    initialize({ state, rootState }) {
      const hp = 150 + rootState.count * 50
      for (const team in state) {
        state[team].health = hp
        state[team].shield = Array(rootState.count).fill(0)
      }
    },
  },
}
const store = new Vuex.Store({
  state() {
    return {
      count: 2,
      rules: ['base'], // ['star', 'spirit', 'environment']
    }
  },
  modules: {
    base,
  },
  mutations: {
    everyRule(state, { action, mutation }) {
      for (const rule of state.rules) {
        mutation && this.commit(`${rule}/${mutation}`)
        action && this.dispatch(`${rule}/${action}`)
      }
    },
    stepCount(state: any, payload) {
      state.count += payload
      this.commit({ type: 'everyRule', action: 'initialize' })
    },
    addRule(state, rule) {
      state.rules.push(rule)
      this.registerModule(rule, theme[rule])
      this.dispatch(`${rule}/initialize`)
    },
    removeRule(state, rule) {
      state.rules.splice(state.rules.indexOf(rule), 1)
      this.unregisterModule(rule)
    },
  },
  plugins: [plugin],
})

export default store
