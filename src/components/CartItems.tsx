import { formatPrice } from "@/lib/utils"
import { CartItem } from "@/types/CartItem"
import { Badge } from "@telegram-apps/telegram-ui"
import { IoIosArrowForward } from "react-icons/io"
import { Link } from "react-router-dom"
import { resolveImageUrl } from "@/lib/api"

export default function CartItems({ cart }: { cart: CartItem[] }) {
  return (
    <div className="flex-grow py-4 overflow-x-visible overflow-y-auto -mx-1 flex flex-col gap-3">
      {cart.map((item) => (
        <Link to={`/products/${item.id}`} key={item.id} className="mx-1">
          <div className="pr-2 pressable shadow flex items-center justify-between bg-[var(--tg-theme-section-bg-color)] rounded-xl w-full">
            <div className="flex items-center gap-3 flex-1">
              <img
                src={resolveImageUrl(item.images[0]?.url)}
                className="rounded-xl object-cover h-20 w-20 shrink-0"
              />
              <div className="flex flex-col max-w-52 min-w-0">
                <div className="truncate overflow-hidden min-w-0">
                  {item.name}
                </div>
                <div className="flex items-center gap-1">
                  <div className="opacity-50 text-sm">
                    {formatPrice(item.size.price) + " ₽"}
                  </div>
                  <Badge type="number" mode="secondary">
                    <span className="text-nowrap">{item.quantity} шт</span>
                  </Badge>
                </div>
                {item.size && (
                  <div>
                    <Badge type="number" mode="gray" className="!ml-0">
                      <span className="text-nowrap">{item.size.size}</span>
                    </Badge>
                  </div>
                )}
              </div>
            </div>
            <div>
              <IoIosArrowForward className="relative opacity-70" size={20} />
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
