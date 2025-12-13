import { useState } from "react"
import { cn } from "../lib/utils"
import { hapticFeedbackImpactOccurred } from "@telegram-apps/sdk-react"

export default function ScrollingBar({ items }: { items: any[] }) {
  const [seen, setSeen] = useState(
    JSON.parse(localStorage.getItem("seen") ?? "[]")
  )

  function addSeen(text: string) {
    if (seen.includes(text)) return
    setSeen([...seen, text])
    localStorage.setItem("seen", JSON.stringify([...seen, text]))
  }

  return (
    <div className="-mx-4 overflow-x-auto hide-scrollbar overflow-y-auto font-bold relative z-[2] py-1">
      <div className="px-4 flex items-center gap-3 w-fit">
        {items.map((item, index) => (
          <div
            key={index}
            className={cn(
              "rounded-2xl pressable relative text-white",
              item.darkText && "text-black"
            )}
          >
            {!seen.includes(item.text) && (
              <div className="absolute -inset-[3px] rounded-[19px] border border-[var(--tg-theme-button-color)]"></div>
            )}
            <div
              key={index}
              className={cn(
                "shrink-0 rounded-2xl p-2 w-[72px] h-[72px] bg-gradient-to-br relative overflow-hidden",
                item.className
              )}
              onClick={() => {
                addSeen(item.text)
                hapticFeedbackImpactOccurred.ifAvailable("medium")
                item.onClick()
              }}
            >
              <div className={cn("relative z-10 text-xs", item.textClasses)}>
                {item.text}
              </div>
              <img
                src={item.pic}
                className={cn("absolute right-0", item.picClasses)}
                alt=""
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
