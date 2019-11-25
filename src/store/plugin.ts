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
    console.dir(mutation)
    localStorage.setItem('store', JSON.stringify(state))
    history.pushState(state, '')
  }

  store.subscribe(listener)
  // store.subscribeAction({ after: listener })
}
