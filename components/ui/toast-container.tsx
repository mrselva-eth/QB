"use client"

import { ToastContainer as Toaster } from "react-toastify"

export function ToastContainer() {
  return (
    <Toaster
      position="top-center"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
    />
  )
}

