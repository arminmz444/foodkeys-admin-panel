"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ConfigurableModal } from "./index"
import type { ModalConfig } from "./types"
import { stepTransitionVariants } from "./animations"

interface MultiStepModalProps {
  steps: React.ReactNode[]
  config: ModalConfig
  isOpen?: boolean
  onClose?: () => void
  onComplete?: (data?: any) => void
  initialStep?: number
}

export const MultiStepModal: React.FC<MultiStepModalProps> = ({
  steps,
  config,
  isOpen,
  onClose,
  onComplete,
  initialStep = 0,
}) => {
  const [currentStep, setCurrentStep] = useState(initialStep)
  const [direction, setDirection] = useState(0)
  const [stepData, setStepData] = useState<Record<number, any>>({})

  const goToNextStep = () => {
    if (currentStep < steps.length - 1) {
      setDirection(1)
      setCurrentStep((prev) => prev + 1)
    } else {
      onComplete?.(stepData)
    }
  }

  const goToPrevStep = () => {
    if (currentStep > 0) {
      setDirection(-1)
      setCurrentStep((prev) => prev - 1)
    }
  }

  const handleStepData = (data: any) => {
    setStepData((prev) => ({
      ...prev,
      [currentStep]: data,
    }))
  }

  const handleAction = (action: string) => {
    if (action === "primary") {
      goToNextStep()
    } else if (action === "secondary") {
      onClose?.()
    }
  }

  return (
    <ConfigurableModal
      config={{
        ...config,
        primaryButtonText: currentStep === steps.length - 1 ? "Complete" : "Next",
      }}
      isOpen={isOpen}
      onClose={onClose}
      onAction={handleAction}
      currentStep={currentStep + 1}
      totalSteps={steps.length}
    >
      <div className="relative overflow-hidden">
        <AnimatePresence custom={direction} initial={false}>
          <motion.div
            key={currentStep}
            custom={direction}
            variants={stepTransitionVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            {React.cloneElement(steps[currentStep] as React.ReactElement, {
              onNext: goToNextStep,
              onPrev: goToPrevStep,
              onData: handleStepData,
              data: stepData[currentStep],
            })}
          </motion.div>
        </AnimatePresence>
      </div>
    </ConfigurableModal>
  )
}

