import { retrieveLaunchParams } from "@telegram-apps/sdk-react"

const BASE_URL = import.meta.env.VITE_API_BASE_URL

async function fetchAPI(
  url: string,
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
  body?: any
) {
  const { initDataRaw } = retrieveLaunchParams()

  const options: RequestInit = {
    method: method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `tma ${initDataRaw}`,
    },
  }
  if (body) {
    options.body = JSON.stringify(body)
  }
  const response = await fetch(BASE_URL + url, options)
  if (!response.ok) {
    if (response.status === 422) {
      throw { type: "validation" }
    }
  }
  return response.json()
}

export async function visit() {
  await fetchAPI("/metrics/visit", "POST")
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
