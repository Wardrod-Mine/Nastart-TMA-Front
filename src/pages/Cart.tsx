import { Divider, Snackbar, TabsList, Title } from "@telegram-apps/telegram-ui"
import { useCart } from "../providers/CartProvider"
import { useEffect, useState } from "react"
import {
  backButton,
  closingBehavior,
  hapticFeedbackImpactOccurred,
  mainButton,
  openPopup,
  setMiniAppBackgroundColor,
} from "@telegram-apps/sdk-react"
import { getDeliveryPrice, getInvoiceLink } from "@/lib/api"
import useBackButton from "@/hooks/useBackButton"
import { TabsItem } from "@telegram-apps/telegram-ui/dist/components/Navigation/TabsList/components/TabsItem/TabsItem"
import CartItems from "@/components/CartItems"
import OrderForm, { ExternalDeliveryMethods } from "@/components/OrderForm"
import { ImSpinner8 } from "react-icons/im"
import { cn, formatPrice } from "@/lib/utils"

function showError(message: string) {
  openPopup({
    title: "Ошибка",
    message: message,
    buttons: [{ id: "idk", type: "ok" }],
  })
}

export default function Cart() {
  const { cart } = useCart()
  useBackButton("/")
  const [activeTab, setActiveTab] = useState(0)
  const [loadingSnackbar, setLoadingSnackbar] = useState(false)

  const [loading, setLoading] = useState(false)
  const [address, setAddress] = useState("")
  const [addressDetails, setAddressDetails] = useState<string>("")
  const [email, setEmail] = useState("")
  const [fio, setFio] = useState("")
  const [phone, setPhone] = useState("")
  const [deliveryPrice, setDeliveryPrice] = useState<number | null>(null)
  const [externalDelivery, setExternalDelivery] =
    useState<ExternalDeliveryMethods | null>(null)

  useEffect(() => hapticFeedbackImpactOccurred("medium"), [activeTab])

  useEffect(() => {
    if (!address) return
    getDeliveryPrice(address).then((res) => {
      if (res.price != null) {
        setDeliveryPrice(res.price)
        setExternalDelivery(null)
      } else {
        setDeliveryPrice(null)
        if (externalDelivery == null)
          setExternalDelivery(ExternalDeliveryMethods.CDEK)
      }
    })
  }, [address])

  const goToPayment = async () => {
    if (loading) return

    hapticFeedbackImpactOccurred("medium")
    if (!address) {
      showError("Пожалуйста, укажите адрес доставки")
      setLoadingSnackbar(false)
      return
    }
    if (!email) {
      showError("Пожалуйста, укажите email")
      setLoadingSnackbar(false)
      return
    }
    if (!fio) {
      showError("Пожалуйста, укажите ФИО")
      setLoadingSnackbar(false)
      return
    }
    if (!phone) {
      showError("Пожалуйста, укажите номер телефона")
      setLoadingSnackbar(false)
      return
    }
    setLoadingSnackbar(true)
    setTimeout(() => {
      setLoadingSnackbar(false)
    }, 29000)
    setLoading(true)
    mainButton.setParams({ isEnabled: false, hasShineEffect: true })
    try {
      const payment_response = await getInvoiceLink(
        cart.map((item) => ({
          id: item.id,
          quantity: item.quantity,
          size: item.size.size,
        })),
        address,
        addressDetails,
        externalDelivery,
        email,
        fio,
        phone
      )
      backButton.hide()
      closingBehavior.enableConfirmation()
      setMiniAppBackgroundColor.ifAvailable("#ffffff")

      mainButton.setParams({ isVisible: false })
      window.location.href = payment_response.payment_url
    } catch (e: any) {
      if (e.type === "validation") {
        openPopup({
          title: "Ошибка",
          message: "Введите валидный email",
          buttons: [{ id: "idk", type: "ok" }],
        })
        // setError("Пожалуйста, проверьте введенные данные")
      }
      setLoading(false)
      setLoadingSnackbar(false)
      mainButton.setParams({ isEnabled: true, hasShineEffect: false })
    }
  }

  useEffect(() => {
    // mainButton.setParams({ isVisible: false })
    mainButton.setParams({
      isVisible: true,
      isEnabled: true,
      text: activeTab == 0 ? "Перейти к оформлению заказа" : "Перейти к оплате",
    })
    return mainButton.onClick(() => {
      if (activeTab == 0) {
        setActiveTab(1)
      } else {
        goToPayment()
      }
    })
  }, [activeTab, email, address, fio, phone, loading])

  return (
    <div className="p-4 h-screen flex flex-col">
      {loadingSnackbar && (
        <Snackbar
          before={<ImSpinner8 size={28} className="animate-spin" />}
          onClose={() => {
            setLoadingSnackbar(false)
          }}
          duration={30000}
        >
          Загрузка формы оплаты...
        </Snackbar>
      )}
      <div className="pb-2 flex items-center justify-between">
        <Title weight="2">Корзина</Title>
      </div>
      <div>
        <Divider />
      </div>

      <div className="mt-2 relative">
        <TabsList>
          <TabsItem onClick={() => setActiveTab(0)} selected={activeTab == 0}>
            Список товаров
          </TabsItem>
          <TabsItem onClick={() => setActiveTab(1)} selected={activeTab == 1}>
            Детали заказа
          </TabsItem>
        </TabsList>
        <div className="absolute h-4 l-0 r-0 w-full z-10 bg-gradient-to-t from-transparent to-[var(--tg-theme-secondary-bg-color)]"></div>
      </div>

      <div className="relative">
        <div
          className={cn(
            "absolute inset-0 transition-opacity duration-200 opacity-0 pointer-events-none",
            activeTab == 0 && "opacity-100 pointer-events-auto"
          )}
        >
          <CartItems cart={cart} />
          <div className="h-16"></div>
        </div>
        <div
          className={cn(
            "absolute inset-0 transition-opacity duration-200 opacity-0 pointer-events-none",
            activeTab == 1 && "opacity-100 pointer-events-auto"
          )}
        >
          <OrderForm
            address={address}
            setAddress={setAddress}
            addressDetails={addressDetails}
            setAddressDetails={setAddressDetails}
            email={email}
            setEmail={setEmail}
            fio={fio}
            setFio={setFio}
            phone={phone}
            setPhone={setPhone}
            deliveryPrice={deliveryPrice}
            externalDelivery={externalDelivery}
            setExternalDelivery={setExternalDelivery}
          />
        </div>
      </div>

      {/* {activeTab == 0 ? (
        <CartItems cart={cart} />
      ) : (
        <OrderForm
          address={address}
          setAddress={setAddress}
          email={email}
          setEmail={setEmail}
        />
      )} */}
      <div
        className={cn(
          "transition-opacity duration-300 ease-in-out",
          activeTab != 0 && "opacity-0"
        )}
      >
        {activeTab == 0 && (
          <div className="fixed p-4 pt-0 bottom-0 left-0 w-full bg-[var(--tg-theme-secondary-bg-color)]">
            <div className="pb-4">
              <Divider />
            </div>
            <Title weight="2">
              Сумма:{" "}
              {formatPrice(
                cart.reduce(
                  (acc, item) => acc + item.size.price * item.quantity,
                  0
                ) + (deliveryPrice ?? 0)
              )}{" "}
              ₽
            </Title>
            <div className="opacity-60">
              {deliveryPrice
                ? ` включая доставку (${deliveryPrice} ₽)`
                : " + доставка (введите адрес)"}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
