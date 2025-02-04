import type React from "react"
import { Web3Provider } from "@/contexts/Web3Context"
import ClientToastContainer from "@/components/ClientToastContainer"
import { ThemeProvider } from "@/components/theme-provider"
import "react-toastify/dist/ReactToastify.css"
import "./globals.css"

export const metadata = {
  title: "QB Vote",
  description: "A secure and transparent voting system for the future",
  icons: {
    icon: "/favicon.ico",
    apple: "/QB.png",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Web3Provider>
            <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
              {children}
              <ClientToastContainer />
            </div>
          </Web3Provider>
        </ThemeProvider>
      </body>
    </html>
  )
}

