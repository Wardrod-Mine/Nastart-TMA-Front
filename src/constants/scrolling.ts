import { openLink, openTelegramLink } from "@telegram-apps/sdk-react"
import ozonLogo from "@/assets/ozon.png"
import thinkingFace from "@/assets/thinking_face.png"
import truck from "@/assets/truck.png"
// import tglogo from "../assets/Logo.svg"
import shoppingBag from "../assets/shopping_bags.png"
import dollar from "../assets/dollar.png"
import sneaker from "../assets/sneaker.png"
export const scrollingBar = [
  {
    text: "Отзывы на Ozon",
    className: "bg-gradient-to-b from-blue-500 to-blue-400",
    // darkText: true,
    pic: ozonLogo,
    textClasses: "text-xxs",
    picClasses: "-bottom-1 right-5 h-[40px]",
    onClick: () =>
      openLink(
        "https://www.ozon.ru/product/korm-suhoy-na-start-s-utkoy-i-risom-dlya-vzroslyh-sobak-vseh-porod-gipoallergennyy-7-kg-1616536538/reviews/"
      ),
  },
  // {
  //   text: "Ответы на вопросы",
  //   className: "bg-gradient-to-b from-amber-500 to-amber-400",
  //   // darkText: true,
  //   pic: thinkingFace,
  //   textClasses: "text-xs text-balance",
  //   picClasses: "-bottom-1 right-[18px] h-[52px]",
  //   onClick: () =>
  //     openLink("", {
  //       tryInstantView: true,
  //     }),
  // },
  // {
  //   text: "Акции и скидки",
  //   className: "bg-gradient-to-b from-pink-400 to-pink-300",
  //   // darkText: true,
  //   pic: shoppingBag,
  //   textClasses: "text-xs text-balance",
  //   picClasses: "-bottom-1 right-5 h-[48px]",
  //   onClick: () =>
  //     openLink("", {
  //       tryInstantView: true,
  //     }),
  // },
  {
    text: "Доставка",
    className: "bg-gradient-to-b from-green-500 to-green-400",
    // darkText: true,
    pic: truck,
    textClasses: "text-xxs text-balance",
    picClasses: "-bottom-0 right-[14px] h-[40px]",
    onClick: () =>
      openLink("https://telegra.ph/Informaciya-o-dostavke-03-01", {
        tryInstantView: true,
      }),
  },
]
