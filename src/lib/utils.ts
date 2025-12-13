import { Item } from "@/types/Item"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
    .format(price)
    .replace(/,/g, " ")
}

export const getPriceString = (item: Item) => {
  if (item.sizes?.length) {
    return formatPrice(item.sizes[0].price) + " ₽ За " + item.sizes[0].size
  } else if (item.price) {
    return formatPrice(item.price) + " ₽"
  } else {
    return ""
  }
}
