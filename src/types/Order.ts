export type Order = {
  id: number
  // order_details: string
  address: string
  address_details: string
  delivery_price: number
  fio: string
  phone: string
  user_id: number
  total_price: number
  payment_status: string
  created_at_str: string
  items: Array<{
    id: number
    quantity: number
    item_id: number
    item_price: number
    item_size: string
    item: {
      id: number
      name: string
      item_price: number
      item_size: string
      images: { url: string }[]
    }
  }>
}
