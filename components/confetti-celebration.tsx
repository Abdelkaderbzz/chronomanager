"use client"

import { useState, useEffect } from "react"
import Confetti from "react-confetti"
import { useWindowSize } from "@/hooks/use-window-size"

interface ConfettiCelebrationProps {
  show: boolean
  duration?: number
  onComplete?: () => void
}

export default function ConfettiCelebration({ show, duration = 3000, onComplete }: ConfettiCelebrationProps) {
  const { width, height } = useWindowSize()
  const [isActive, setIsActive] = useState(false)

  useEffect(() => {
    if (show) {
      setIsActive(true)
      const timer = setTimeout(() => {
        setIsActive(false)
        if (onComplete) onComplete()
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [show, duration, onComplete])

  if (!isActive) return null

  return (
    <Confetti
      width={width}
      height={height}
      recycle={false}
      numberOfPieces={200}
      gravity={0.2}
      colors={["#10b981", "#3b82f6", "#f59e0b", "#8b5cf6", "#ec4899"]}
    />
  )
}
