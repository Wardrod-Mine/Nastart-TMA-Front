import { createContext, useContext, useEffect, useState } from "react"
import { Item } from "../types/Item"
import { getItems } from "@/lib/api"

const ProductsContext = createContext<{
  items: Item[]
  setItems: (products: Item[]) => void
  loading: boolean
}>({ items: [], setItems: () => {}, loading: true })

export const ProductsProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    getItems().then((items) => {
      setItems(items)
      setLoading(false)
    })
  }, [])

  return (
    <ProductsContext.Provider value={{ items, setItems, loading }}>
      {children}
    </ProductsContext.Provider>
  )
}

export const useProducts = () => useContext(ProductsContext)
