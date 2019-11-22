import theme from './theme'

export default store => {
  let preserveState = false
  if (localStorage.getItem('store')) {
    store.replaceState(JSON.parse(localStorage.getItem('store')!))
    preserveState = true
  }
  for (const rule of store.state.rules.slice(1)) {
    store.registerModule(rule, theme[rule], { preserveState })
  }
  onpopstate = ({ state }) => {
    store.replaceState(state)
    localStorage.setItem('store', JSON.stringify(state))
  }
  const listener = (mutation, state) => {
    if (mutation.type.includes('/') && !mutation.type.includes('/initialize') && !state.ingame) {
      store.commit('toggleIngame')
    }
    if (mutation.type == 'base/setHealth' && mutation.payload < 1) {
      store.commit('toggleIngame')
    }
    if (mutation.type == 'star/toggle') {
      const { pos, index } = mutation.payload
      const allTrue = Object.values(state.star[pos].summoned[index]).every(Boolean)
      allTrue && store.commit('toggleIngame')
    }
    console.dir(mutation)
    localStorage.setItem('store', JSON.stringify(state))
    history.pushState(state, '')
  }

  store.subscribe(listener)
  // store.subscribeAction({ after: listener })
}
