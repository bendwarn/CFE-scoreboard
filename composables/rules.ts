import { times, constant, toPlainObject, each } from 'lodash-es'
import { defineStore } from 'pinia'
import { Ref } from 'vue'

export enum element {
  metal,
  fire,
  water,
  earth,
  wood,
}
export enum opponent {
  enemy = 'friend',
  friend = 'enemy',
}
export enum bane {
  fire,
  water,
  earth,
  wood,
  metal,
}
interface starRecord {
  type?: element
  summoned: boolean[][]
}
interface spiritRecord {
  type?: element
  point: Ref<number>
}

export const usePeople = defineStore('people', {
  state: () => {
    return { count: useClamp(useLocalStorage('people', 2), 1, 10) }
  },
})

export const useHealth = defineStore('health', {
  state: () => {
    const people = usePeople()
    const hplimit = 150 + people.count * 50
    return {
      enemy: useClamp(hplimit, 0, hplimit),
      friend: useClamp(hplimit, 0, hplimit),
    }
  },
  actions: {
    swap() {
      ;[this.enemy, this.friend] = [this.friend, this.enemy]
    },
    parse(lsValue: any) {
      this.enemy = lsValue.enemy
      this.friend = lsValue.friend
    },
  },
})

export const useShield = defineStore('shield', {
  state: () => {
    const people = usePeople()
    const hplimit = 150 + people.count * 50
    return {
      enemy: toPlainObject(
        Array.from({ length: people.count }, () => useClamp(0, 0, hplimit))
      ),
      friend: toPlainObject(
        Array.from({ length: people.count }, () => useClamp(0, 0, hplimit))
      ),
    }
  },
  actions: {
    parse(lsValue: any) {
      each(this.enemy, (v, i) => {
        v = lsValue.enemy[i]
      })
      each(this.friend, (v, i) => {
        v = lsValue.friend[i]
      })
    },
  },
})

export const useStar = defineStore('star', {
  state: () => {
    const people = usePeople()
    const enemy: starRecord = {
      summoned: Array.from({ length: people.count }, () =>
        times(5, constant(false))
      ),
    }
    const friend: starRecord = {
      summoned: Array.from({ length: people.count }, () =>
        times(5, constant(false))
      ),
    }
    return { enemy, friend }
  },
  actions: {
    toggle(pos: keyof typeof opponent, index: number, type: element) {
      if (this[opponent[pos]].type != type && this[pos].type != type) {
        this[pos].summoned[index][type] = true
        this[pos].type = type
        if (element[type] == bane[this[opponent[pos]].type ?? type]) {
          delete this[opponent[pos]].type
        }
      }
    },
    parse(lsValue: any) {
      this.enemy.type = lsValue.enemy.type
      this.enemy.summoned = lsValue.enemy.summoned
      this.friend.type = lsValue.friend.type
      this.friend.summoned = lsValue.friend.summoned
    },
  },
})

export const useField = defineStore('field', {
  state: () => ({
    field: null as element | null,
  }),
  actions: {
    parse(lsValue: typeof this) {
      this.field = lsValue.field
    },
  },
})

export const useSpirit = defineStore('spirit', {
  state: () => {
    const people = usePeople()
    const enemy: spiritRecord[] = Array.from({ length: people.count }, () => ({
      point: useClamp(0, 0, 6),
    }))
    const friend: spiritRecord[] = Array.from({ length: people.count }, () => ({
      point: useClamp(0, 0, 6),
    }))
    return { enemy, friend }
  },
  actions: {
    parse(lsValue: any) {
      this.enemy.forEach(
        (v, i) => (
          (v.type = lsValue.enemy[i].type), (v.point = lsValue.enemy[i].point)
        )
      )
      this.friend.forEach(
        (v, i) => (
          (v.type = lsValue.friend[i].type), (v.point = lsValue.friend[i].point)
        )
      )
    },
  },
})
