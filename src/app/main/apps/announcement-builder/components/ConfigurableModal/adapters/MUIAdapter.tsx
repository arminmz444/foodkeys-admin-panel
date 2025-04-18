"use client"

import type React from "react"
import { ConfigurableModal, type ModalConfig } from "../index"

interface MUIAdapterProps {
  config: ModalConfig
  children: React.ReactNode
  isOpen?: boolean
  onClose?: () => void
  onAction?: (action: string, data?: any) => void
}

export const MUIAdapter: React.FC<MUIAdapterProps> = ({ config, children, isOpen, onClose, onAction }) => {
  // Convert any MUI-specific props to our internal format
  const adaptedConfig: ModalConfig = {
    ...config,
    // Add any MUI-specific adaptations here
  }

  return (
    <ConfigurableModal config={adaptedConfig} isOpen={isOpen} onClose={onClose} onAction={onAction}>
      {children}
    </ConfigurableModal>
  )
}

