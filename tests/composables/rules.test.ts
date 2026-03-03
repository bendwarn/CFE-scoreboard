// @vitest-environment nuxt
import { beforeEach, describe, expect, it } from 'vitest'
import { element, opponent, usePeople, useSpirit, useStar } from '../../app/composables/rules'

describe('rules stores', () => {
  beforeEach(() => {
    localStorage.clear()
    const people = usePeople()
    people.reset()
    people.count = 2
    useStar().reset()
    useSpirit().reset()
  })

  it('useStar.toggle should set summon and block duplicate pick', () => {
    const star = useStar()

    star.toggle('enemy' as opponent, 0, element.fire)
    expect(star.enemy.type).toBe(element.fire)
    expect(star.enemy.summoned[0]![element.fire]).toBe(true)

    star.toggle('friend' as opponent, 0, element.fire)
    expect(star.friend.type).toBeUndefined()
    expect(star.friend.summoned[0]![element.fire]).toBe(false)
  })

  it('useStar.toggle should clear opponent type when element is countered', () => {
    const star = useStar()

    star.toggle('enemy' as opponent, 0, element.fire)
    star.toggle('friend' as opponent, 0, element.water)

    expect(star.friend.type).toBe(element.water)
    expect(star.enemy.type).toBeUndefined()
  })

  it('useSpirit.parse should keep point clamped and reactive after parse', () => {
    const spirit = useSpirit()
    spirit.parse({
      enemy: [
        { type: element.wood, point: 99 },
        { type: element.fire, point: -3 },
      ],
      friend: [
        { type: element.earth, point: 5 },
        { type: element.water, point: 1 },
      ],
    })

    expect(spirit.enemy[0]!.type).toBe(element.wood)
    expect(spirit.enemy[0]!.point).toBe(6)
    expect(spirit.enemy[1]!.point).toBe(0)

    spirit.enemy[0]!.point++
    spirit.enemy[1]!.point--
    expect(spirit.enemy[0]!.point).toBe(6)
    expect(spirit.enemy[1]!.point).toBe(0)
  })
})
