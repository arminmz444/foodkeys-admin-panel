"use client"

import type React from "react"
import { ConfigurableModal, type ModalConfig } from "../index"

interface NextJSAdapterProps {
  config: ModalConfig
  children: React.ReactNode
  isOpen?: boolean
  onClose?: () => void
  onAction?: (action: string, data?: any) => void
}

export const NextJSAdapter: React.FC<NextJSAdapterProps> = ({ config, children, isOpen, onClose, onAction }) => {
  return (
    <ConfigurableModal config={config} isOpen={isOpen} onClose={onClose} onAction={onAction}>
      {children}
    </ConfigurableModal>
  )
}

