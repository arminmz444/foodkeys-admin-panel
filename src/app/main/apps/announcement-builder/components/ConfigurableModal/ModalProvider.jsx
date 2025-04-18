"use client"

import { useState, useCallback, useMemo } from "react"
import { ModalContext } from "./ModalContext"

export const ModalProvider = ({ children, defaultConfigs = {} }) => {
  const [modals, setModals] = useState({})

  const openModal = useCallback(
    (id, config) => {
      setModals((prev) => ({
        ...prev,
        [id]: {
          isOpen: true,
          config: {
            ...(defaultConfigs[id] || {}),
            ...(prev[id]?.config || {}),
            ...(config || {}),
          },
        },
      }))
    },
    [defaultConfigs],
  )

  const closeModal = useCallback((id) => {
    setModals((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        isOpen: false,
      },
    }))
  }, [])

  const isModalOpen = useCallback(
    (id) => {
      return !!modals[id]?.isOpen
    },
    [modals],
  )

  const updateModalConfig = useCallback((id, config) => {
    setModals((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        config: {
          ...prev[id]?.config,
          ...config,
        },
      },
    }))
  }, [])

  const contextValue = useMemo(
    () => ({
      openModal,
      closeModal,
      isModalOpen,
      updateModalConfig,
    }),
    [openModal, closeModal, isModalOpen, updateModalConfig],
  )

  return <ModalContext.Provider value={contextValue}>{children}</ModalContext.Provider>
}

