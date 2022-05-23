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
