import { toast, type ToastOptions } from "react-toastify"

type ToastFunc = (message: string, options?: ToastOptions) => void

const Toast: {
  success: ToastFunc
  error: ToastFunc
  info: ToastFunc
  warn: ToastFunc
} = {
  success: (message, options) => toast.success(message, options),
  error: (message, options) => toast.error(message, options),
  info: (message, options) => toast.info(message, options),
  warn: (message, options) => toast.warn(message, options),
}

export default Toast

