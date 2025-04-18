import { ModalAnimation } from "./types"

export const getAnimationVariants = (animation) => {
  switch (animation) {
    case ModalAnimation.FADE:
      return {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
        exit: { opacity: 0 },
      }

    case ModalAnimation.SLIDE_UP:
      return {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: 50 },
      }

    case ModalAnimation.SLIDE_DOWN:
      return {
        hidden: { opacity: 0, y: -50 },
        visible: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -50 },
      }

    case ModalAnimation.SLIDE_LEFT:
      return {
        hidden: { opacity: 0, x: 50 },
        visible: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: 50 },
      }

    case ModalAnimation.SLIDE_RIGHT:
      return {
        hidden: { opacity: 0, x: -50 },
        visible: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -50 },
      }

    case ModalAnimation.SCALE:
      return {
        hidden: { opacity: 0, scale: 0.8 },
        visible: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.8 },
      }

    case ModalAnimation.ROTATE:
      return {
        hidden: { opacity: 0, rotate: -10, scale: 0.8 },
        visible: { opacity: 1, rotate: 0, scale: 1 },
        exit: { opacity: 0, rotate: 10, scale: 0.8 },
      }

    case ModalAnimation.FLIP:
      return {
        hidden: { opacity: 0, rotateX: 90 },
        visible: { opacity: 1, rotateX: 0 },
        exit: { opacity: 0, rotateX: 90 },
      }

    case ModalAnimation.BOUNCE:
      return {
        hidden: { opacity: 0, y: 50, transition: { type: "spring", stiffness: 300, damping: 30 } },
        visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 30 } },
        exit: { opacity: 0, y: 50, transition: { type: "spring", stiffness: 300, damping: 30 } },
      }

    default:
      return {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
        exit: { opacity: 0 },
      }
  }
}

export const stepTransitionVariants = {
  enter: (direction) => ({
    x: direction > 0 ? "100%" : "-100%",
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction) => ({
    x: direction < 0 ? "100%" : "-100%",
    opacity: 0,
  }),
}

