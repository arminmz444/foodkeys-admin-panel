"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { createPortal } from "react-dom"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"
import { useMediaQuery } from "@/hooks/use-mobile"
import { type ModalConfig, ModalPosition, ModalAnimation, ModalTrigger } from "./types"
import { getAnimationVariants } from "./animations"
import { ModalFooter } from "./ModalFooter"
import { ModalHeader } from "./ModalHeader"
import { ModalContent } from "./ModalContent"

export interface ConfigurableModalProps {
  children: React.ReactNode
  config: ModalConfig
  isOpen?: boolean
  onClose?: () => void
  onAction?: (action: string, data?: any) => void
  className?: string
  currentStep?: number
  totalSteps?: number
}

const ConfigurableModal = ({
  children,
  config,
  isOpen: externalIsOpen,
  onClose,
  onAction,
  className,
  currentStep = 1,
  totalSteps = 1,
}: ConfigurableModalProps) => {
  const [isOpen, setIsOpen] = useState(externalIsOpen || false)
  const [mounted, setMounted] = useState(false)
  const modalRef = useRef<HTMLDivElement>(null)
  const isMobile = useMediaQuery("(max-width: 768px)")

  // Control modal state based on external prop
  useEffect(() => {
    if (externalIsOpen !== undefined) {
      setIsOpen(externalIsOpen)
    }
  }, [externalIsOpen])

  // Handle auto-close timer
  useEffect(() => {
    if (isOpen && config.autoClose && config.autoCloseDelay) {
      const timer = setTimeout(() => {
        handleClose()
      }, config.autoCloseDelay)

      return () => clearTimeout(timer)
    }
  }, [isOpen, config.autoClose, config.autoCloseDelay])

  // Handle trigger based on config
  useEffect(() => {
    setMounted(true)

    if (config.trigger === ModalTrigger.PAGE_LOAD) {
      setIsOpen(true)
    }

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (config.trigger === ModalTrigger.PAGE_LEAVE) {
        setIsOpen(true)
        e.preventDefault()
        e.returnValue = ""
      }
    }

    const handleError = () => {
      if (config.trigger === ModalTrigger.ERROR) {
        setIsOpen(true)
      }
    }

    window.addEventListener("beforeunload", handleBeforeUnload)
    window.addEventListener("error", handleError)

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload)
      window.removeEventListener("error", handleError)
    }
  }, [config.trigger])

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        modalRef.current &&
        !modalRef.current.contains(event.target as Node) &&
        config.closeOnClickOutside
      ) {
        handleClose()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isOpen, config.closeOnClickOutside])

  // Handle ESC key
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (isOpen && event.key === "Escape" && config.closeOnEsc) {
        handleClose()
      }
    }

    document.addEventListener("keydown", handleEscKey)
    return () => document.removeEventListener("keydown", handleEscKey)
  }, [isOpen, config.closeOnEsc])

  const handleClose = () => {
    if (config.preventClose) return

    setIsOpen(false)
    if (onClose) onClose()
  }

  const handleAction = (action: string, data?: any) => {
    if (onAction) onAction(action, data)

    if (action === "close") {
      handleClose()
    }
  }

  // Get position classes based on config
  const getPositionClasses = () => {
    switch (config.position) {
      case ModalPosition.TOP_LEFT:
        return "top-4 left-4"
      case ModalPosition.TOP_RIGHT:
        return "top-4 right-4"
      case ModalPosition.BOTTOM_LEFT:
        return "bottom-4 left-4"
      case ModalPosition.BOTTOM_RIGHT:
        return "bottom-4 right-4"
      case ModalPosition.TOP:
        return "top-4 left-1/2 -translate-x-1/2"
      case ModalPosition.BOTTOM:
        return "bottom-4 left-1/2 -translate-x-1/2"
      case ModalPosition.CENTER:
      default:
        return "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
    }
  }

  // Get animation variants based on config
  const animationVariants = getAnimationVariants(config.animation || ModalAnimation.FADE)

  // Get overlay styles based on config
  const overlayStyles = {
    backgroundColor: config.overlayColor || "rgba(0, 0, 0, 0.5)",
    backdropFilter: config.blurOverlay ? "blur(4px)" : "none",
  }

  // Get modal styles based on config
  const modalStyles = {
    backgroundColor: config.backgroundColor || "#1a2e69",
    color: config.textColor || "#ffffff",
    borderRadius: config.borderRadius || "0.5rem",
    boxShadow: config.shadow ? "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" : "none",
    width: isMobile ? "90%" : config.width || "500px",
    maxWidth: config.maxWidth || "90vw",
    maxHeight: config.maxHeight || "90vh",
    minHeight: config.minHeight,
  }

  if (!mounted) return null

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          {config.showOverlay && (
            <motion.div
              className="fixed inset-0 z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={overlayStyles}
            />
          )}

          {/* Modal */}
          <motion.div
            className={cn("fixed z-50 overflow-hidden", getPositionClasses(), className)}
            ref={modalRef}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={animationVariants}
            transition={{ duration: config.animationDuration || 0.3 }}
          >
            <div className="flex flex-col overflow-hidden" style={modalStyles}>
              {/* Close button */}
              {config.showCloseButton && (
                <button
                  className="absolute top-4 right-4 text-gray-300 hover:text-white"
                  onClick={handleClose}
                  aria-label="Close modal"
                >
                  <X size={20} />
                </button>
              )}

              {/* Header */}
              {config.showHeader && (
                <ModalHeader
                  title={config.title}
                  icon={config.icon}
                  iconSize={config.iconSize}
                  iconBackground={config.iconBackground}
                  titleClassName={config.titleClassName}
                />
              )}

              {/* Content */}
              <ModalContent>{children}</ModalContent>

              {/* Footer */}
              {config.showFooter && (
                <ModalFooter
                  primaryButtonText={config.primaryButtonText}
                  secondaryButtonText={config.secondaryButtonText}
                  primaryButtonAction={() => handleAction("primary")}
                  secondaryButtonAction={() => handleAction("secondary")}
                  showStepIndicator={config.showStepIndicator}
                  currentStep={currentStep}
                  totalSteps={totalSteps}
                  primaryButtonClassName={config.primaryButtonClassName}
                  secondaryButtonClassName={config.secondaryButtonClassName}
                />
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )

  // Use portal to render modal outside of parent component
  return createPortal(modalContent, document.body)
}

export { ConfigurableModal }
export * from "./types"
export * from "./animations"
export * from "./ModalContext"
export * from "./ModalProvider"

