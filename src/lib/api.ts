import { retrieveLaunchParams } from "@telegram-apps/sdk-react"

const BASE_URL = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "")

async function fetchAPI(
  path: string,
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
  body?: unknown
) {
  if (!BASE_URL) {
    console.warn("VITE_API_BASE_URL пустой — запрос отменён:", path)
    return null
  }

  const { initDataRaw } = retrieveLaunchParams()

  const url = `${BASE_URL}${path.startsWith("/") ? "" : "/"}${path}`
  const response = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `tma ${initDataRaw}`,
    },
    body: body ? JSON.stringify(body) : undefined,
  })

  const contentType = response.headers.get("content-type") || ""
  const text = await response.text()

  if (!response.ok) {
    if (response.status === 422) {
      throw { type: "validation" }
    }
    throw new Error(`${response.status} ${response.statusText}: ${text.slice(0, 200)}`)
  }

  if (!contentType.includes("application/json")) {
    return null
  }

  return text ? JSON.parse(text) : null
}

export async function visit() {
  try {
    await fetchAPI("/metrics/visit", "POST")
  } catch (e) {
    // Метрика некритична — не ломаем основной поток
    console.debug("metrics/visit skipped:", e)
  }
}

export const getItems = async () => {
  const response = await fetchAPI("/items", "GET")
  return response
}

export const getItem = async (id: number) => {
  const response = await fetchAPI(`/items/${id}`, "GET")
  return response
}

export const getInvoiceLink = async (
  items: { id: number; quantity: number; size: string }[],
  address: string,
  addressDetails: string,
  externalDelivery: string | null,
  email: string,
  fio: string,
  phone: string
) => {
  const response = await fetchAPI(`/checkout`, "POST", {
    items: items,
    address: address,
    address_details: addressDetails,
    other_delivery_method: externalDelivery,
    email: email,
    fio: fio,
    phone: phone,
  })
  return response
}

export const getOrder = async (order_id: number) => {
  return await fetchAPI(`/orders/${order_id}`, "GET")
}

export const getOrders = async () => {
  return await fetchAPI(`/orders`, "GET")
}

export const getSuggestedAddresses = async (input: string) => {
  return await fetchAPI(`/addresses/suggest?address_input=${input}`, "GET")
}

export const getDeliveryPrice = async (address: string) => {
  return await fetchAPI(`/addresses/delivery-price?address=${address}`, "GET")
}
