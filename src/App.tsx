import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom"
import Catalog from "./pages/Catalog"
import Product from "./pages/Product"
import { CartProvider } from "./providers/CartProvider"
import Cart from "./pages/Cart"
import Orders from "./pages/Orders"
import OrderPage from "./pages/OrderPage"
import { OrdersProvider } from "./providers/OrdersProvider"
import { ProductsProvider } from "./providers/ProductsProvider"
import {
  mainButton,
  themeParams,
  themeParamsSecondaryBackgroundColor,
  themeParamsButtonColor,
  themeParamsButtonTextColor,
  useLaunchParams,
} from "@telegram-apps/sdk-react"
import { useEffect } from "react"
import { visit } from "./lib/api"

function App() {
  const lp = useLaunchParams()

  useEffect(() => {
    try {
      visit()
    } finally {
    }
    mainButton.setParams({
      backgroundColor: themeParams.buttonColor(),
      textColor: themeParams.buttonTextColor(),
    })
  }, [])
  if (lp.startParam === "product_123") {
    return <Navigate to="/products/1" replace />
  }
  return (
    <div className="mx-auto max-w-screen-sm">
      <Router>
        <CartProvider>
          <OrdersProvider>
            <ProductsProvider>
              <Routes>
                <Route path="/" element={<Catalog />} />
                <Route path="/products/:id" element={<Product />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/order/:id" element={<OrderPage />} />
              </Routes>
            </ProductsProvider>
          </OrdersProvider>
        </CartProvider>
      </Router>
    </div>
  )
}

export default App
