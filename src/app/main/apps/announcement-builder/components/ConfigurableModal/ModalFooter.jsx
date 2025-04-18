"use client"
import { cn } from "../../lib/utils"
import { Button } from "@mui/material"

export const ModalFooter = ({
  primaryButtonText = "Next",
  secondaryButtonText = "Skip",
  primaryButtonAction,
  secondaryButtonAction,
  showStepIndicator = false,
  currentStep = 1,
  totalSteps = 1,
  primaryButtonClassName,
  secondaryButtonClassName,
}) => {
  return (
    <div className="p-6 flex flex-col items-center space-y-4">
      {primaryButtonText && (
        <Button
          variant="contained"
          onClick={primaryButtonAction}
          className={cn("w-full py-2 rounded-md", primaryButtonClassName)}
        >
          {primaryButtonText}
        </Button>
      )}

      {secondaryButtonText && (
        <Button
          variant="text"
          onClick={secondaryButtonAction}
          className={cn("text-sm text-gray-300 hover:text-white", secondaryButtonClassName)}
        >
          {secondaryButtonText}
        </Button>
      )}

      {showStepIndicator && totalSteps > 1 && (
        <div className="text-sm text-gray-300 mt-2">
          {currentStep}/{totalSteps}
        </div>
      )}
    </div>
  )
}

