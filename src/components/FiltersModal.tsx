import { cn } from "@/lib/utils"
import { Item } from "@/types/Item"
import {
  hapticFeedback,
  hapticFeedbackImpactOccurred,
} from "@telegram-apps/sdk-react"
import { Button, Modal, Text } from "@telegram-apps/telegram-ui"
import { ModalHeader } from "@telegram-apps/telegram-ui/dist/components/Overlays/Modal/components/ModalHeader/ModalHeader"
import { useState } from "react"
import { VscSettings } from "react-icons/vsc"

const flavours = ["Баранина", "Индейка", "Оленина", "Утка"] as Item["flavour"][]
const categories = [
  "Щенки",
  "Взрослые кошки (1+ лет)",
  "Взрослые собаки (1-6 лет)",
  "Взрослые собаки (7+ лет)",
  "Запеченный корм для собак всех возрастов",
] as Item["category"][]

const Overlay = ({ open }: { open: boolean }) => {
  return (
    <div
      className="bg-black/30 backdrop-blur-sm z-50 absolute inset-0 pointer-events-auto"
      style={{
        animation: open ? "fadeIn 0.5s forwards" : "fadeOut 0.5s forwards",
      }}
    />
  )
}

export default function FiltersModal({
  categoryFilter,
  setCategoryFilter,
  flavourFilter,
  setFlavourFilter,
}: {
  categoryFilter: Item["category"]
  setCategoryFilter: (category: Item["category"]) => void
  flavourFilter: Item["flavour"]
  setFlavourFilter: (flavour: Item["flavour"]) => void
}) {
  const [open, setOpen] = useState(true)
  return (
    <Modal
      // overlayComponent={<Overlay open={open} />}
      header={<ModalHeader>Фильтры</ModalHeader>}
      onOpenChange={(open) => {
        setOpen(open)
      }}
      trigger={
        <Button mode="gray" className="pressable">
          <div className="flex items-center gap-2">
            {/* Фильтры */}
            <VscSettings size={20} className="text-tg-button" />
          </div>
        </Button>
      }
    >
      {/* <ModalHeader>Фильтры</ModalHeader> */}
      <div className="min-h-64 p-4 pb-8 z-50">
        <div className="mb-1 font-semibold text-md">Вкусы</div>
        <div className="pt-2 flex w-full flex-col gap-2">
          <button
            className={cn(
              "pressable w-full text-sm rounded-xl font-[500] py-1",
              flavourFilter == null
                ? "bg-tg-button text-white"
                : "bg-tgui-button-gray"
            )}
            onClick={() => {
              hapticFeedbackImpactOccurred.ifAvailable("light")
              setFlavourFilter(null)
            }}
          >
            Все вкусы
          </button>
          <div className="flex flex-wrap gap-2">
            {flavours.map((c: Item["flavour"], index: number) => (
              <button
                key={c}
                className={cn(
                  "pressable text-sm rounded-xl font-[500] py-1 min-w-[33%] grow max-w-[50%]",
                  flavourFilter === c
                    ? "bg-tg-button text-white"
                    : "bg-tgui-button-gray"
                )}
                onClick={() => {
                  setFlavourFilter(c)
                  hapticFeedbackImpactOccurred.ifAvailable("light")
                }}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
        <div className="mb-1 mt-6 font-semibold text-md">Категории</div>
        <div className="flex flex-col gap-2">
          <button
            className={cn(
              "pressable rounded-xl font-[500] py-1 text-sm",
              categoryFilter === null
                ? "bg-tg-button text-white"
                : "bg-tgui-button-gray"
            )}
            onClick={() => {
              setCategoryFilter(null)
              hapticFeedbackImpactOccurred.ifAvailable("light")
            }}
          >
            Все категории
          </button>
          {categories.map((c: Item["category"], index: number) => (
            <button
              key={c}
              className={cn(
                "pressable rounded-xl font-[500] py-1 text-sm",
                categoryFilter === c
                  ? "bg-tg-button text-white"
                  : "bg-tgui-button-gray"
              )}
              onClick={() => {
                setCategoryFilter(c)
                hapticFeedbackImpactOccurred.ifAvailable("light")
              }}
            >
              {c}
            </button>
          ))}
        </div>
      </div>
    </Modal>
  )
}
