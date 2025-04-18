"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"
import { useModal } from "./ModalContext"
import type { ModalConfig } from "./types"

interface RouteModalConfig {
  path: string
  modalId: string
  config: ModalConfig
  exact?: boolean
}

export const useRouteModal = (routeConfigs: RouteModalConfig[]) => {
  const pathname = usePathname()
  const { openModal, closeModal } = useModal()

  useEffect(() => {
    // Close all route modals first
    routeConfigs.forEach((config) => {
      closeModal(config.modalId)
    })

    // Find matching route configs
    const matchingConfigs = routeConfigs.filter((config) => {
      if (config.exact) {
        return pathname === config.path
      }
      return pathname.startsWith(config.path)
    })

    // Open modals for matching routes
    matchingConfigs.forEach((config) => {
      openModal(config.modalId, config.config)
    })
  }, [pathname, routeConfigs, openModal, closeModal])
}

