import {
  Badge,
  Caption,
  Divider,
  Skeleton,
  Title,
} from "@telegram-apps/telegram-ui"
import { useNavigate, useParams } from "react-router-dom"
import {
  hapticFeedbackImpactOccurred,
  mainButton,
} from "@telegram-apps/sdk-react"
import { useEffect, useState } from "react"
import { CartItem } from "../types/CartItem"
import { useCart } from "../providers/CartProvider"
import { Item } from "../types/Item"
import { FaMinus, FaPlus } from "react-icons/fa"
import { getItem } from "@/lib/api"
import Carousel from "@/components/Carousel"
import useBackButton from "@/hooks/useBackButton"
import { cn, formatPrice } from "@/lib/utils"

export default function Product() {
  const { id } = useParams()
  const { cart, updateCart } = useCart()
  const [item, setItem] = useState<Item | null>(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const [selectedSize, setSelectedSize] = useState(
    item?.sizes ? item.sizes[0] : null
  )
  useEffect(() => {
    setSelectedSize(item?.sizes ? item.sizes[0] : null)
  }, [item])

  useBackButton("/")

  const quantity =
    cart.filter((cartItem: CartItem) => cartItem.id === Number(id))[0]
      ?.quantity ?? 0

  useEffect(() => {
    getItem(Number(id)).then((item) => {
      setItem(item)
      setLoading(false)
    })
  }, [id])

  const isInCart = cart.some(
    (cartItem: CartItem) => cartItem.id === Number(id) && cartItem.quantity > 0
  )

  useEffect(() => {
    mainButton.setParams({
      text: isInCart ? "Перейти в корзину" : "Добавить в корзину",
      isVisible: true,
      // backgroundColor: themeParams.buttonColor,
    })

    const handleButtonClick = () => {
      if (!item) return
      if (!selectedSize) return
      if (!isInCart)
        updateCart([
          ...cart,
          { ...item, id: item.id, quantity: 1, size: selectedSize },
        ])
      else navigate("/cart")
    }

    return mainButton.onClick(handleButtonClick)
  }, [item, isInCart, updateCart, selectedSize])

  function decrement() {
    updateCart(
      (function () {
        const item = cart.find(
          (cartItem: CartItem) => cartItem.id === Number(id)
        )
        if (!item) return cart

        if (item.quantity <= 1) {
          return cart.filter((cartItem: CartItem) => cartItem.id !== Number(id))
        }

        return cart.map((cartItem: CartItem) =>
          cartItem.id === Number(id)
            ? { ...cartItem, quantity: cartItem.quantity - 1 }
            : cartItem
        )
      })()
    )
  }

  function increment() {
    updateCart(
      (function () {
        const item = cart.find(
          (cartItem: CartItem) => cartItem.id === Number(id)
        )
        if (!item) return cart
        return cart.map((cartItem: CartItem) =>
          cartItem.id === Number(id)
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        )
      })()
    )
  }
  const updateSize = (newSize: { size: string; price: number }) => {
    setSelectedSize(newSize)
    updateCart(
      cart.map((cartItem) => ({
        ...cartItem,
        size: cartItem.id == item?.id ? newSize : cartItem.size,
      }))
    )
  }

  return (
    <div className="p-4">
      {item ? (
        <Carousel slides={item.images} />
      ) : (
        <>
          <Skeleton visible={loading}>
            <div className="h-[368px]"></div>
          </Skeleton>
          <div className="flex gap-2 mt-4">
            <Skeleton visible={loading}>
              <div className="h-16 w-16"></div>
            </Skeleton>
            <Skeleton visible={loading}>
              <div className="h-16 w-16"></div>
            </Skeleton>
            <Skeleton visible={loading}>
              <div className="h-16 w-16"></div>
            </Skeleton>
          </div>
        </>
      )}
      <div className="flex flex-col gap-3">
        <div className="mt-4">
          <Title weight="2">
            <Skeleton visible={loading}>
              {item?.name ?? "loading title"}
            </Skeleton>
          </Title>
          {(item?.flavour || item?.category) && (
            <div className="flex gap-2 mt-2 text-white">
              {item?.flavour && (
                <div className="text-xs bg-orange-600  rounded-full px-3 font-semibold py-1 text-center">
                  Вкус: {item?.flavour}
                </div>
              )}
              {item?.category && (
                <div className="text-xs bg-sky-600 rounded-full px-3 font-semibold py-1 text-center">
                  Категория: {item?.category}
                </div>
              )}
            </div>
          )}
          <Skeleton visible={loading}>
            <div className="opacity-70 text-md">
              <div className="flex items-center gap-2 h-6 my-2">
                {selectedSize
                  ? `${formatPrice(selectedSize.price)} ₽`
                  : "loading"}
                {isInCart && (
                  <Badge type="number" mode="secondary">
                    В корзине
                  </Badge>
                )}
              </div>
            </div>
          </Skeleton>
          {isInCart && (
            <div className="mt-2 flex items-center justify-between w-32 bg-[var(--tg-theme-secondary-bg-color)] rounded-xl h-8 relative">
              <button
                className="pressable font-bold px-3 bg-[var(--tg-theme-button-color)] h-full rounded-2xl text-[var(--tg-theme-button-text-color)]"
                onClick={decrement}
              >
                <FaMinus size={12} />
              </button>
              <Caption weight="1">{quantity} шт</Caption>
              <button
                className="pressable font-bold px-3 bg-[var(--tg-theme-button-color)] h-full rounded-2xl text-[var(--tg-theme-button-text-color)]"
                onClick={increment}
              >
                <FaPlus size={12} />
              </button>
            </div>
          )}
        </div>
        <div className="">
          <Divider />
        </div>
        <div>
          <div className="mb-1 text-md font-semibold">Доступные размеры</div>
          <div className="overflow-x-auto hide-scrollbar -mx-4">
            <div className="flex gap-2 px-4 w-fit">
              {item &&
                item.sizes?.map((size) => (
                  <Skeleton visible={!item} key={size.size}>
                    <div className="pressable">
                      <div
                        onClick={() => {
                          updateSize(size)
                          hapticFeedbackImpactOccurred.ifAvailable("light")
                        }}
                        className={cn(
                          "bg-tg-section-bg shadow mb-1 min-w-[72px] h-14 rounded-xl p-2 flex flex-col items-center justify-center border-2 border-transparent transition-all duration-200 ease-in-out",
                          selectedSize &&
                            selectedSize.size === size.size &&
                            "border-tg-button"
                        )}
                      >
                        <div className="font-semibold text-nowrap text-sm">
                          {size.size}
                        </div>
                        <div className="text-xs opacity-60 text-nowrap">
                          {formatPrice(size.price) + " ₽"}
                        </div>
                      </div>
                    </div>
                  </Skeleton>
                ))}
            </div>
          </div>
        </div>

        <div className="">
          <Divider />
        </div>
        <div style={{ whiteSpace: "pre-line" }} className="text-md">
          {!loading && <div>{item?.description}</div>}
        </div>
      </div>
    </div>
  )
}
