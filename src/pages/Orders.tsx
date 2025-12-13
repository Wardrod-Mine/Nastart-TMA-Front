import useBackButton from "@/hooks/useBackButton"
import { formatPrice } from "@/lib/utils"
import { useOrders } from "@/providers/OrdersProvider"
import { mainButton } from "@telegram-apps/sdk-react"
import {
  Badge,
  Cell,
  Divider,
  Skeleton,
  Title,
} from "@telegram-apps/telegram-ui"
import { useEffect } from "react"
import { IoIosArrowForward } from "react-icons/io"
import { Link, useNavigate } from "react-router-dom"

export default function Orders() {
  const { orders } = useOrders()
  const navigate = useNavigate()
  useBackButton("/")

  useEffect(() => {
    mainButton.setParams({
      isVisible: true,
      text: "Вернуться в каталог",
    })
    return mainButton.onClick(() => navigate("/"))
  }, [])

  return (
    <div className="p-4">
      <Title weight="2">Мои заказы</Title>
      <div className="py-2">
        <Divider />
      </div>
      <div className="flex flex-col gap-2 pt-4">
        {orders == null ? (
          <>
            {Array(3)
              .fill(null)
              .map(() => (
                <Skeleton visible>
                  <Cell>ы</Cell>
                </Skeleton>
              ))}
          </>
        ) : (
          orders.map((order) => (
            <Link to={`/order/${order.id}`} key={order.id}>
              <div className="flex items-center justify-between pressable pl-4 pr-2 py-2 bg-[var(--tg-theme-section-bg-color)] rounded-xl">
                <div>
                  <div>{order.created_at_str}</div>
                  <div className="opacity-70">
                    {" "}
                    {formatPrice(order.total_price) + " ₽"}{" "}
                  </div>
                </div>
                <div className="flex items-center gap-0">
                  <Badge type="number">Оплачено</Badge>
                  <IoIosArrowForward
                    className="relative opacity-70"
                    size={20}
                  />
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  )
}
