"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useAccount, useConnect, useDisconnect, useChainId, useSwitchChain, usePublicClient } from "wagmi"
import { sepolia } from "viem/chains"
import { getContract } from "viem"
import { injected } from "wagmi/connectors"
import {
  CONTRACT_ADDRESS,
  CONTRACT_ABI,
  CANDIDATE_REGISTRY_ADDRESS,
  CANDIDATE_REGISTRY_ABI,
} from "../utils/contractConfig"

interface Web3ContextType {
  account: `0x${string}` | undefined
  isConnected: boolean
  connect: () => Promise<void>
  disconnect: () => void
  switchToSepolia: () => void
  isSepoliaNetwork: boolean
  contract: any
  candidateContract: any
  getAllCandidates: () => Promise<any[]>
}

const Web3Context = createContext<Web3ContextType>({
  account: undefined,
  isConnected: false,
  connect: async () => {},
  disconnect: () => {},
  switchToSepolia: () => {},
  isSepoliaNetwork: false,
  contract: null,
  candidateContract: null,
  getAllCandidates: async () => [],
})

export const useWeb3 = () => useContext(Web3Context)

export const Web3Provider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { address, isConnected } = useAccount()
  const { connectAsync } = useConnect()
  const { disconnectAsync } = useDisconnect()
  const chainId = useChainId()
  const { switchChainAsync } = useSwitchChain()
  const publicClient = usePublicClient()

  const [contract, setContract] = useState<any>(null)
  const [candidateContract, setCandidateContract] = useState<any>(null)

  useEffect(() => {
    if (isConnected && chainId === sepolia.id && publicClient) {
      const voterContract = getContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: CONTRACT_ABI,
        client: publicClient,
      })
      setContract(voterContract)

      const candidateRegistryContract = getContract({
        address: CANDIDATE_REGISTRY_ADDRESS as `0x${string}`,
        abi: CANDIDATE_REGISTRY_ABI,
        client: publicClient,
      })
      setCandidateContract(candidateRegistryContract)
    } else {
      setContract(null)
      setCandidateContract(null)
    }
  }, [isConnected, chainId, publicClient])

  const switchToSepolia = async () => {
    if (switchChainAsync) {
      try {
        await switchChainAsync({ chainId: sepolia.id })
      } catch (error) {
        console.error("Failed to switch to Sepolia:", error)
      }
    }
  }

  const getAllCandidates = async () => {
    try {
      const response = await fetch("/api/candidates")
      if (!response.ok) {
        throw new Error("Failed to fetch candidates")
      }
      const candidates = await response.json()
      console.log("Fetched candidates:", candidates)
      return candidates
    } catch (error) {
      console.error("Error in getAllCandidates:", error)
      throw error
    }
  }

  return (
    <Web3Context.Provider
      value={{
        account: address,
        isConnected,
        connect: async () => {
          try {
            await connectAsync({ connector: injected() })
          } catch (error) {
            console.error("Failed to connect:", error)
          }
        },
        disconnect: async () => {
          try {
            await disconnectAsync()
          } catch (error) {
            console.error("Failed to disconnect:", error)
          }
        },
        switchToSepolia,
        isSepoliaNetwork: chainId === sepolia.id,
        contract,
        candidateContract,
        getAllCandidates,
      }}
    >
      {children}
    </Web3Context.Provider>
  )
}

export default Web3Provider

