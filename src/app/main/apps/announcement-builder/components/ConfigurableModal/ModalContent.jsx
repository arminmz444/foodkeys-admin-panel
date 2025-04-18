import { cn } from "../../lib/utils"

export const ModalContent = ({ children, className }) => {
  return <div className={cn("px-6 py-2 flex-1 overflow-auto", className)}>{children}</div>
}

