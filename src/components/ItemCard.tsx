import { Button } from "@telegram-apps/telegram-ui"
import { IoIosAdd } from "react-icons/io"
import { Link } from "react-router-dom"

import { Item } from "../types/Item"
import { useCart } from "../providers/CartProvider"
import { CartItem } from "../types/CartItem"
import { formatPrice, getPriceString } from "@/lib/utils"
import { hapticFeedbackImpactOccurred } from "@telegram-apps/sdk-react"
import { PiBasketBold } from "react-icons/pi"
import { resolveImageUrl } from "@/lib/api"

export default function ItemCard({ item }: { item: Item }) {
  const { cart } = useCart()
  const isInCart = cart.some(
    (cartItem: CartItem) => cartItem.id === Number(item.id)
  )

  return (
    <div
      className="overflow-hidden rounded-[20px] shadow-md relative pressable"
      onClick={() => hapticFeedbackImpactOccurred.ifAvailable("light")}
    >
      <Link
        to={`/products/${item.id}`}
        className="bg-[var(--tg-theme-section-bg-color)] flex flex-col h-full"
      >
        <img
          alt={item.name}
          src={resolveImageUrl(item.images[0]?.url)}
          className="aspect-square w-full object-cover object-center"
        />
        <div className="pb-2 pt-2 text-center flex-grow px-2">
          <div className="font-semibold leading-5">{item.name}</div>
          {/* <Subheadline weight="2">{item.name}</Subheadline> */}
          {(item.price || !!item.sizes) && (
            <div className="opacity-60 text-xs mt-1">
              {getPriceString(item)}
            </div>
          )}
        </div>
        <div className="relative m-1">
          {isInCart ? (
            <Button size="s" className="!rounded-2xl" mode="gray" stretched>
              <div className="text-xs flex gap-1 items-center font-bold opacity-80">
                <PiBasketBold size={16} />В корзине
              </div>
            </Button>
          ) : (
            <Button size="s" className="!rounded-2xl" stretched>
              <div className="text-xs flex items-center font-bold">
                <IoIosAdd size={24} />
                Купить
              </div>
            </Button>
          )}
        </div>
      </Link>
    </div>
  )
}
