import { createContext, useContext, useEffect, useState } from "react"
import { Order } from "../types/Order"
import { getOrders } from "@/lib/api"

const OrdersContext = createContext<{
  orders: Order[]
  setOrders: (orders: Order[]) => void
}>({ orders: [], setOrders: () => {} })

export const OrdersProvider = ({ children }: { children: React.ReactNode }) => {
  const [orders, setOrders] = useState<Order[]>([])
  useEffect(() => {
    getOrders().then((orders) => {
      setOrders(orders)
    })
  }, [])

  return (
    <OrdersContext.Provider value={{ orders, setOrders }}>
      {children}
    </OrdersContext.Provider>
  )
}

export const useOrders = () => useContext(OrdersContext)
