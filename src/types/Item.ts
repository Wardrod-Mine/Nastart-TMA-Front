export type Image = {
  id: number
  url: string
}

export type Size = {
  size: string
  price: number
}

export type Item = {
  id: number
  name: string
  flavour?: "Баранина" | "Индейка" | "Оленина" | "Утка" | null
  category?:
    | "Щенки"
    | "Взрослые кошки (1+ лет)"
    | "Взрослые собаки (1-6 лет)"
    | "Взрослые собаки (7+ лет)"
    | "Запеченный корм для собак всех возрастов"
    | null
  description: string
  price?: number
  sizes?: { size: string; price: number }[]
  images: Image[]
}
