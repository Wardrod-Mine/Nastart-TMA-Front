import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "./index.css"
import "./App.css"
import "@telegram-apps/telegram-ui/dist/styles.css"
import App from "./App.tsx"
import { AppRoot } from "@telegram-apps/telegram-ui"
import {
  init,
  backButton,
  mainButton,
  closingBehavior,
  swipeBehavior,
  postEvent,
  themeParams,
  expandViewport,
  miniApp,
  setMiniAppBackgroundColor,
  openLink,
  initData,
  popup,
} from "@telegram-apps/sdk-react"
import NotSupported from "./NotSupported.tsx"

init()
let isAvailable = true

if (!miniApp.isSupported()) isAvailable = false
if (!backButton.isSupported()) isAvailable = false
if (!swipeBehavior.isSupported()) isAvailable = false
if (!openLink.isAvailable()) isAvailable = false
if (!popup.isSupported()) isAvailable = false

if (isAvailable) {
  miniApp.mount()
  backButton.mount()
  mainButton.mount()
  closingBehavior.mount()
  swipeBehavior.mount()
  swipeBehavior.disableVertical()
  expandViewport.ifAvailable()

  if (!themeParams.isMounted()) themeParams.mount()
  postEvent("web_app_set_header_color", { color_key: "secondary_bg_color" })
  setMiniAppBackgroundColor.ifAvailable(
    (window as any).Telegram.WebApp.themeParams.secondary_bg_color
  )
  initData.restore()
}
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppRoot>{isAvailable ? <App /> : <NotSupported />}</AppRoot>
  </StrictMode>
)
