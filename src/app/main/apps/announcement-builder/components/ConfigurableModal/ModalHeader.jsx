import { cn } from "../../lib/utils"

export const ModalHeader = ({ title, icon, iconSize = 24, iconBackground = "white", titleClassName }) => {
  return (
    <div className="flex flex-col items-center justify-center p-6 text-center">
      {icon && (
        <div
          className="flex items-center justify-center rounded-full mb-4"
          style={{
            backgroundColor: iconBackground,
            width: `${iconSize * 3}px`,
            height: `${iconSize * 3}px`,
          }}
        >
          <div style={{ width: iconSize, height: iconSize }}>{icon}</div>
        </div>
      )}
      {title && <h2 className={cn("text-2xl font-bold", titleClassName)}>{title}</h2>}
    </div>
  )
}

