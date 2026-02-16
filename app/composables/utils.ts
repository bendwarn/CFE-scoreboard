import { parse, stringify } from 'flatted'

export enum countChange {
  decrease = -1,
  initial,
  increase,
}

export const allreset = () => {
  useHealth().reset()
  useShield().reset()
  useStar().reset()
  useField().reset()
  useSpirit().reset()
}

export const useLocalHistory = (name: string) => {
  const ls = useLocalStorage(
    name,
    {},
    {
      serializer: {
        read: parse,
        write: stringify,
      },
    },
  )
  return useRefHistory(ls, { deep: true })
}
