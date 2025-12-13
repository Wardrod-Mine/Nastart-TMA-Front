import { Card, Divider, Skeleton, Title } from "@telegram-apps/telegram-ui"
import ItemCard from "../components/ItemCard"
import { useCart } from "../providers/CartProvider"
import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import {
  mainButton,
  hapticFeedbackImpactOccurred,
  initData,
} from "@telegram-apps/sdk-react"
import useBackButton from "@/hooks/useBackButton"
import FiltersModal from "@/components/FiltersModal"
import { useOrders } from "@/providers/OrdersProvider"
import { useProducts } from "@/providers/ProductsProvider"
import { Item } from "@/types/Item"
import ScrollingBar from "@/components/ScrollingBar"
import { scrollingBar } from "@/constants/scrolling"
import { IoIosArrowForward } from "react-icons/io"
import { IoSearch } from "react-icons/io5"
import { IoCloseCircle } from "react-icons/io5"
import { cn } from "@/lib/utils"

function Catalog() {
  const { cart } = useCart()
  const { orders } = useOrders()
  const { items, loading } = useProducts()
  const [flavourFilter, setFlavourFilter] = useState<Item["flavour"]>(null)
  const [categoryFilter, setCategoryFilter] = useState<Item["category"]>(null)
  const [searchString, setSearchString] = useState("")
  useBackButton()

  const navigate = useNavigate()

  const updateMainButton = () => {
    if (cart.length === 0) {
      mainButton.setParams({
        isVisible: false,
      })
      return
    }
    mainButton.setParams({
      isVisible: true,
      text: "Перейти в корзину",
      hasShineEffect: false,
      isEnabled: true,
    })
  }

  useEffect(() => {
    updateMainButton()
    return mainButton.onClick(() => {
      navigate("/cart")
      hapticFeedbackImpactOccurred("light")
    })
  }, [cart])
  let processedItems: Item[] = [...items]
  if (searchString) {
    processedItems = processedItems.filter((item: Item) =>
      item.name.toLowerCase().includes(searchString.toLowerCase())
    )
  }
  if (flavourFilter) {
    processedItems = processedItems.filter(
      (item: Item) => item.flavour === flavourFilter
    )
  }
  if (categoryFilter) {
    processedItems = processedItems.filter(
      (item: Item) => item.category === categoryFilter
    )
  }
  return (
    <div className="px-4 py-4">
      <div className="flex justify-between items-center ">
        <Title weight="2">
          {initData?.user()?.firstName
            ? `Привет, ${initData?.user()?.firstName} 👋`
            : "Каталог"}
        </Title>
        <Link
          to="/orders"
          className="opacity-80 flex items-center gap-0.5 pressable"
        >
          Мои заказы
          <IoIosArrowForward className="relative top-" size={14} />
        </Link>
      </div>
      {orders && <div className="flex justify-end mt-0"></div>}
      <div className="pt-4 pb-4">
        <ScrollingBar items={scrollingBar} />
      </div>
      <div className="pb-4">
        <Divider />
      </div>
      <div className="flex items-stretch gap-2">
        <div className="shadow flex-1 relative pl-4 bg-tg-section-bg rounded-xl">
          <input
            onFocus={() => mainButton.setParams({ isVisible: false })}
            onBlur={updateMainButton}
            type="text"
            className="w-full h-full pl-4 pr-4 bg-transparent focus:outline-none"
            placeholder="Поиск по товарам"
            value={searchString}
            onChange={(e) => setSearchString(e.target.value)}
          />
          <div className="absolute left-2 top-0 bottom-0 flex items-center">
            <IoSearch size={18} className="opacity-50" />
          </div>
          <div className="absolute right-2 top-0 bottom-0 flex items-center">
            <IoCloseCircle
              size={20}
              className={cn("opacity-0", searchString && "opacity-50")}
              onClick={() => setSearchString("")}
            />
          </div>
        </div>
        <FiltersModal
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
          flavourFilter={flavourFilter}
          setFlavourFilter={setFlavourFilter}
        />
      </div>
      {(categoryFilter || flavourFilter) && (
        <div className="flex gap-2 mt-4 text-white">
          {flavourFilter && (
            <div className="text-xs bg-orange-600  rounded-full px-3 font-semibold py-1 text-center">
              Вкус: {flavourFilter}
            </div>
          )}
          {categoryFilter && (
            <div className="text-xs bg-sky-600 rounded-full px-3 font-semibold py-1 text-center">
              Категория: {categoryFilter}
            </div>
          )}
        </div>
      )}
      <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-4">
        {loading
          ? Array(4)
              .fill(null)
              .map((_, index) => (
                <Card key={index}>
                  <Skeleton visible>
                    <div className="w-full aspect-square"></div>
                    <div className="h-16"></div>
                  </Skeleton>
                </Card>
              ))
          : processedItems.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
      </div>
      {!loading && processedItems.length == 0 && (
        <div className="mt-6 flex items-center justify-center h-full">
          <div className="text-center text-md opacity-60 flex flex-col items-center">
            По вашему запросу ничего не найдено
          </div>
        </div>
      )}
    </div>
  )
}

export default Catalog
