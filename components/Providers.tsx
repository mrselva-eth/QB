"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { WagmiProvider } from "wagmi"
import { RainbowKitProvider, getDefaultConfig } from "@rainbow-me/rainbowkit"
import { QueryClientProvider, QueryClient } from "@tanstack/react-query"
import { mainnet, sepolia } from "wagmi/chains"
import { http } from "wagmi"

const queryClient = new QueryClient()

// Ensure this matches the environment variable name in your .env.local file
const WALLET_CONNECT_PROJECT_ID = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || ""

if (!WALLET_CONNECT_PROJECT_ID) {
  console.error("Missing NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID")
  // You might want to handle this error case differently
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<any>(null)

  useEffect(() => {
    const config = getDefaultConfig({
      appName: "QB Vote",
      projectId: WALLET_CONNECT_PROJECT_ID,
      chains: [mainnet, sepolia],
      transports: {
        [mainnet.id]: http(),
        [sepolia.id]: http(),
      },
    })
    setConfig(config)
  }, [])

  if (!config) {
    return null // or a loading spinner
  }

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>{children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}

