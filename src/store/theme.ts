function newSummon() {
  return { metal: false, wood: false, water: false, fire: false, earth: false }
}
function starInit(n = 2) {
  return {
    foe: { type: '', summoned: Array(n).fill(1).map(newSummon) },
    friend: { type: '', summoned: Array(n).fill(1).map(newSummon) }
  }
}
export enum opponent {
  foe = 'friend',
  friend = 'foe'
}
enum bane {
  metal = 'fire',
  fire = 'water',
  water = 'earth',
  earth = 'wood',
  wood = 'metal'
}
export default {
  star: {
    namespaced: true,
    state: starInit,
    mutations: {
      toggle(state, { pos, index, type }) {
        if (state[pos].summoned[index][type] && state[pos].type) {
          state[pos].summoned[index][type] = false
        } else if (state[opponent[pos]].type != type && state[pos].type != type) {
          state[pos].summoned[index][type] = true
          state[pos].type = type
          if (type == bane[state[opponent[pos]].type]) {
            state[opponent[pos]].type = ''
          }
        }
      },
      eliminate(state, pos) {
        state[pos].type = ''
      }
    },
    actions: {
      initialize({ state, rootState }) {
        const n = rootState.count
        Object.assign(state, starInit(n))
      }
    }
  },
  environment: {
    namespaced: true,
    state() {
      return { type: '' }
    },
    mutations: {
      change(state, payload) {
        state.type = payload
      }
    },
    actions: {
      initialize({ state }) {
        state.type = ''
      }
    }
  },
  spirit: {
    namespaced: true,
    state() {
      return {
        foe: [{ type: '', point: 0 }, { type: '', point: 0 }],
        friend: [{ type: '', point: 0 }, { type: '', point: 0 }]
      }
    },
    mutations: {
      setPoint(state, { pos, index, payload }) {
        state[pos][index].point = payload
        if (state[pos][index].point < 1) {
          state[pos][index].type = ''
          state[pos][index].point = 0
        }
      },
      spawn(state, { pos, index, type }) {
        state[pos][index].type = type
        state[pos][index].point = 2
      },
      void(state) {
        for (const pos of ['foe', 'friend']) {
          for (const spi of state[pos]) {
            if (spi.type) {
              if (2 < spi.point) {
                spi.point -= 2
              } else {
                spi.type = ''
                spi.point = 0
              }
            }
          }
        }
      }
    },
    actions: {
      initialize({ state, rootState }) {
        const n = rootState.count
        state.foe = Array(n).fill(1).map(_ => ({ type: '', point: 0 }))
        state.friend = Array(n).fill(1).map(_ => ({ type: '', point: 0 }))
      }
    }
  }
}
