import {
  backButton,
  hapticFeedbackImpactOccurred,
  init,
} from "@telegram-apps/sdk-react"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

export default function useBackButton(backUrl?: string) {
  const navigate = useNavigate()

  useEffect(() => {
    backButton.show()
    if (!backUrl) {
      backButton.hide()
      return
    }
    const handleBackClick = () => {
      hapticFeedbackImpactOccurred.ifAvailable("light")
      navigate(backUrl)
    }
    return backButton.onClick(handleBackClick)
  }, [])
}
