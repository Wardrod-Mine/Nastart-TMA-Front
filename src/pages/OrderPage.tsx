import useBackButton from "@/hooks/useBackButton"
import { getOrder } from "@/lib/api"
import { useCart } from "@/providers/CartProvider"
import { mainButton } from "@telegram-apps/sdk-react"
import {
  Badge,
  Divider,
  Skeleton,
  Text,
  Timeline,
  Title,
} from "@telegram-apps/telegram-ui"
import { TimelineItem } from "@telegram-apps/telegram-ui/dist/components/Blocks/Timeline/components/TimelineItem/TimelineItem"
import { useEffect, useState } from "react"
import { Link, useLocation, useNavigate, useParams } from "react-router-dom"
import { Order } from "../types/Order"
import { formatPrice } from "@/lib/utils"
import { IoIosArrowForward } from "react-icons/io"

export default function OrderPage() {
  const { id } = useParams()
  const { setCart } = useCart()
  const [order, setOrder] = useState<Order | null>(null)
  const navigate = useNavigate()
  const location = useLocation()
  useBackButton("/orders")

  const queryParams = new URLSearchParams(location.search)
  const isRedirected = queryParams.get("redirected") == "true"

  useEffect(() => {
    mainButton.setParams({
      text: "Вернуться в каталог",
      isVisible: true,
    })
    getOrder(Number(id)).then((order: Order) => {
      if (order.payment_status == "succeeded") {
        setOrder(order)
        if (isRedirected) setCart([])
        return
      }
      navigate("/cart")
    })
    return mainButton.onClick(() => {
      navigate("/")
    })
  }, [id])

  return (
    <div className="p-4">
      <Skeleton visible={!order}>
        <Title weight="2">Заказ от {order?.created_at_str}</Title>
        <div className="mt-4">
          <div className="flex items-center gap-2">
            <Text>Сумма:</Text>
            <Text>{formatPrice(order?.total_price ?? 0)} ₽</Text>
          </div>
          <div className="mt-1 flex items-center">
            <Text className="text-xl">Статус оплаты:</Text>
            <Badge mode="secondary" type="number">
              {order?.payment_status == "succeeded" ? "Оплачен" : "Не оплачен"}
            </Badge>
          </div>
          <div className="mt-4">
            <Divider />
          </div>
          {/* <Skeleton visible={!order}>
            <Timeline active={2}>
            <TimelineItem header="Оплачено"></TimelineItem>
            <TimelineItem header="Обработано"></TimelineItem>
            <TimelineItem header="В доставке">
            Примерно время - 3 дня
            </TimelineItem>
            <TimelineItem header="Доставлено"></TimelineItem>
            </Timeline>
            </Skeleton> */}
          <div className="flex flex-col gap-3 mt-6">
            <Title className="!mb-1">Доставка</Title>
            <div>Адрес: {order?.address}</div>
            <div>{order?.address_details}</div>
            {order?.delivery_price && (
              <div>Стоимость доставки: {order?.delivery_price} ₽</div>
            )}
          </div>

          <div className="mt-4">
            <Divider />
          </div>

          <div className="flex flex-col gap-3 mt-6">
            <Title className="!mb-1">Товары в заказе</Title>
            {order?.items.map((orderItem) => (
              <Link to={`/products/${orderItem.item.id}`} key={orderItem.id}>
                {/* <Cell
                  before={
                    <Image src={orderItem.item.images[0]?.url} size={96} />
                  }
                  after={
                    <Badge type="number">
                      <span className="text-nowrap">
                        {orderItem.quantity} шт
                      </span>
                    </Badge>
                  }
                  subtitle={
                    <div className="opacity-70">
                      {formatPrice(orderItem.item.price) + " ₽"}
                    </div>
                  }
                >
                  {orderItem.item.name}
                </Cell> */}
                <div className="pr-2 pressable shadow flex items-center justify-between bg-[var(--tg-theme-section-bg-color)] rounded-xl w-full">
                  <div className="flex items-center gap-3 flex-1">
                    <img
                      src={orderItem.item.images[0]?.url}
                      className="rounded-xl object-cover h-20 w-20 shrink-0"
                    />
                    <div className="flex flex-col max-w-52 min-w-0">
                      <div className="truncate overflow-hidden min-w-0">
                        {orderItem.item.name}
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="opacity-50 text-sm">
                          {formatPrice(orderItem.item_price) + " ₽"}
                        </div>
                        <Badge type="number" mode="gray">
                          <span className="text-nowrap">
                            {orderItem.item_size}
                          </span>
                        </Badge>
                        <Badge type="number" mode="secondary">
                          <span className="text-nowrap">
                            {orderItem.quantity} шт
                          </span>
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div>
                    <IoIosArrowForward
                      className="relative opacity-70"
                      size={20}
                    />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </Skeleton>
    </div>
  )
}
