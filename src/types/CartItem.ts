import { Item } from "./Item"
export type CartItem = Item & {
  size: { size: string; price: number }
  quantity: number
}
