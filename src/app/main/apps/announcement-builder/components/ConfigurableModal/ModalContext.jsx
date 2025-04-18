"use client"

import { createContext, useContext } from "react"

export const ModalContext = createContext({
  openModal: () => {},
  closeModal: () => {},
  isModalOpen: () => false,
  updateModalConfig: () => {},
})

export const useModal = () => useContext(ModalContext)

