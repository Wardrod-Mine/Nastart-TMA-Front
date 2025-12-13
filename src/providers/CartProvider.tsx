import React, { useState, useEffect } from "react"
import { CartItem } from "../types/CartItem"
import { hapticFeedbackImpactOccurred } from "@telegram-apps/sdk-react"

const CartContext = React.createContext<{
  cart: CartItem[]
  setCart: (cart: CartItem[] | ((prevCart: CartItem[]) => CartItem[])) => void
  updateCart: (cart: CartItem[]) => void
}>({
  cart: [],
  setCart: () => {},
  updateCart: () => {},
})

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    const savedCart = localStorage.getItem("cart")
    return savedCart ? JSON.parse(savedCart) : []
  })
  const updateCart = (cart: CartItem[]) => {
    setCart(cart)
    hapticFeedbackImpactOccurred("medium")
  }

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart))
  }, [cart])

  return (
    <CartContext.Provider value={{ cart, setCart, updateCart }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => React.useContext(CartContext)
