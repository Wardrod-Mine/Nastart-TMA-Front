import { Divider, Select } from "@telegram-apps/telegram-ui"
import { useEffect, useRef, useState } from "react"
import { getSuggestedAddresses } from "@/lib/api"
import { IoSearch } from "react-icons/io5"
import {
  hapticFeedback,
  hapticFeedbackImpactOccurred,
} from "@telegram-apps/sdk-react"
import { cn } from "@/lib/utils"

export enum ExternalDeliveryMethods {
  CDEK = "СДЭК",
  DELOVIE = "Деловые линии",
}

export default function OrderForm({
  address,
  setAddress,
  addressDetails,
  setAddressDetails,
  email,
  setEmail,
  fio,
  setFio,
  phone,
  setPhone,
  deliveryPrice,
  externalDelivery,
  setExternalDelivery,
}: {
  address: string
  setAddress: (s: string) => void
  addressDetails: string
  setAddressDetails: (s: string) => void
  email: string
  setEmail: (s: string) => void
  fio: string
  setFio: (s: string) => void
  phone: string
  setPhone: (s: string) => void
  deliveryPrice: number | null
  externalDelivery: ExternalDeliveryMethods | null
  setExternalDelivery: (s: ExternalDeliveryMethods | null) => void
}) {
  const [addressInput, setAddressInput] = useState<string>("")
  const [suggestedAddresses, setSuggestedAddresses] = useState<string[]>([])
  const [suggestionsVisible, setSuggestionsVisible] = useState<boolean>(false)
  const dropdownRef = useRef<HTMLDivElement | null>(null) // Ref for the dropdown
  const inputRef = useRef<HTMLInputElement | null>(null) // Ref for the input field

  useEffect(() => {
    if (addressInput.length < 3) return
    getSuggestedAddresses(addressInput).then((res) => {
      setSuggestedAddresses(
        res.map((addressObj: any) => addressObj.address.formatted_address)
      )
    })
  }, [addressInput])

  const handleAddressSelect = (address: string) => {
    hapticFeedbackImpactOccurred("medium")
    setAddress(address)
    setSuggestionsVisible(false)
  }

  const handleClickOutside = (e: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(e.target as Node) &&
      !inputRef.current?.contains(e.target as Node)
    ) {
      setSuggestionsVisible(false)
    }
  }

  useEffect(() => {
    document.addEventListener("click", handleClickOutside)
    return () => {
      document.removeEventListener("click", handleClickOutside)
    }
  }, [])

  return (
    <div className="grow flex flex-col my-4 rounded-xl shadow-md bg-tg-section-bg">
      <div ref={inputRef} onFocus={() => setSuggestionsVisible(true)}>
        <div className="flex items-center gap-2 pl-4">
          <input
            className="bg-transparent border-none p-3 pl-0 outline-none w-full"
            value={addressInput}
            onChange={(e) => setAddressInput(e.target.value)}
            placeholder="Начните вводить адрес доставки"
          />
        </div>
        <div className="px-2 relative" ref={dropdownRef}>
          <div className="relative">
            {suggestedAddresses.length > 0 && suggestionsVisible && (
              <div className="bg-tg-secondary-bg rounded-xl p-3 flex flex-col absolute z-10 w-full">
                {suggestedAddresses.map((address: string, index: number) => (
                  <>
                    {index !== 0 && (
                      <div className="py-1">
                        <Divider />
                      </div>
                    )}
                    <div onClick={() => handleAddressSelect(address)}>
                      {address}
                    </div>
                  </>
                ))}
              </div>
            )}
          </div>
        </div>
        <div>
          {address && (
            <div className="font-semibold mx-4 mb-4 opacity-60">
              Выбранный адрес: {address}
            </div>
          )}
          {externalDelivery != null && (
            <div className="px-4 text-sm mb-2">
              Выберите транспортную компанию для доствки
              <div className="mt-2 flex gap-2">
                {[
                  ExternalDeliveryMethods.CDEK,
                  ExternalDeliveryMethods.DELOVIE,
                ].map((option) => (
                  <div className="pressable flex-1" key={option}>
                    <button
                      onClick={() => {
                        setExternalDelivery(option)
                        hapticFeedbackImpactOccurred.ifAvailable("medium")
                      }}
                      className={cn(
                        "bg-tg-secondary-bg w-full border-2 border-transparent transition-all duration-200 ease-in-out rounded-xl p-2 text-sm",
                        externalDelivery == option && "border-tg-button"
                      )}
                    >
                      {option}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {deliveryPrice != null && (
            <div className="font-semibold mx-4 mb-4">
              {deliveryPrice > 0 ? (
                <span>Cтоимость доставки: {deliveryPrice} ₽</span>
              ) : (
                <span>Бесплатная доставка</span>
              )}
            </div>
          )}
        </div>
      </div>
      <Divider />
      <input
        className="bg-transparent border-none p-3 px-4 outline-none"
        value={addressDetails}
        onChange={(e) => setAddressDetails(e.target.value)}
        placeholder="Комментарий для доставки"
      />
      <Divider />
      <input
        className="bg-transparent border-none p-3 px-4 outline-none"
        placeholder="Ваш номер телефона"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
      <Divider />
      <input
        className="bg-transparent border-none p-3 px-4 outline-none"
        placeholder="Ваше ФИО"
        value={fio}
        onChange={(e) => setFio(e.target.value)}
      />
      <Divider />
      <input
        className="bg-transparent border-none p-3 px-4 outline-none"
        placeholder="Email для получения чека"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      {/* <div className="p-4">
        <div>
          <AddressSelector />
        </div>
      </div> */}
    </div>
  )
}
