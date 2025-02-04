"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback } from "react"
import Web3 from "web3"
import type { AbiItem } from "web3-utils"
import {
  CONTRACT_ADDRESS,
  CONTRACT_ABI,
  CANDIDATE_REGISTRY_ADDRESS,
  CANDIDATE_REGISTRY_ABI,
} from "../utils/contractConfig"
import type { MetaMaskInpageProvider } from "@metamask/providers"

const INFURA_PROJECT_ID = process.env.NEXT_PUBLIC_INFURA_PROJECT_ID || ""

if (!INFURA_PROJECT_ID) {
  console.warn("Missing NEXT_PUBLIC_INFURA_PROJECT_ID environment variable")
}

interface Web3ContextType {
  web3: Web3 | null
  contract: any
  candidateContract: any
  account: string | null
  connectWallet: () => Promise<void>
  switchToSepolia: () => Promise<void>
  isSepoliaNetwork: boolean
  getAllCandidates: () => Promise<any[]>
  isConnected: boolean
}

const Web3Context = createContext<Web3ContextType>({
  web3: null,
  contract: null,
  candidateContract: null,
  account: null,
  connectWallet: async () => {},
  switchToSepolia: async () => {},
  isSepoliaNetwork: false,
  getAllCandidates: async () => [],
  isConnected: false,
})

export const useWeb3 = () => useContext(Web3Context)

const SEPOLIA_CHAIN_ID = "0xaa36a7"
const SEPOLIA_RPC_URL = `https://sepolia.infura.io/v3/${INFURA_PROJECT_ID}`

export const Web3Provider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [web3, setWeb3] = useState<Web3 | null>(null)
  const [contract, setContract] = useState<any>(null)
  const [candidateContract, setCandidateContract] = useState<any>(null)
  const [account, setAccount] = useState<string | null>(null)
  const [isSepoliaNetwork, setIsSepoliaNetwork] = useState(false)
  const [isConnected, setIsConnected] = useState(false)

  const initializeWeb3 = useCallback(async () => {
    console.log("Initializing Web3...")
    if (typeof window !== "undefined" && typeof window.ethereum !== "undefined" && !web3) {
      const web3Instance = new Web3(window.ethereum as unknown as MetaMaskInpageProvider)
      setWeb3(web3Instance)

      try {
        await (window.ethereum as MetaMaskInpageProvider).request({ method: "eth_requestAccounts" })
        const accounts = await web3Instance.eth.getAccounts()
        if (accounts[0]) {
          setAccount(accounts[0])
          console.log("Connected account:", accounts[0])
          setIsConnected(true)
        }

        const networkId = await web3Instance.eth.net.getId()
        setIsSepoliaNetwork(networkId === BigInt(11155111)) // Sepolia network ID
        console.log("Network ID:", networkId)

        const contractInstance = new web3Instance.eth.Contract(CONTRACT_ABI as AbiItem[], CONTRACT_ADDRESS)
        setContract(contractInstance)
        console.log("Contract instance created:", contractInstance)
        console.log("Available methods in contract:", Object.keys(contractInstance.methods))

        const candidateContractInstance = new web3Instance.eth.Contract(
          CANDIDATE_REGISTRY_ABI as AbiItem[],
          CANDIDATE_REGISTRY_ADDRESS,
        )
        setCandidateContract(candidateContractInstance)
        console.log("Candidate contract instance created:", candidateContractInstance)
        console.log("Available methods in candidateContract:", Object.keys(candidateContractInstance.methods))
      } catch (error) {
        console.error("Failed to initialize Web3:", error)
        setIsConnected(false)
      }
    }
  }, [web3])

  const connectWallet = async () => {
    if (typeof window !== "undefined" && typeof window.ethereum !== "undefined" && web3) {
      try {
        await (window.ethereum as MetaMaskInpageProvider).request({ method: "eth_requestAccounts" })
        const accounts = await web3.eth.getAccounts()
        setAccount(accounts[0])
        setIsConnected(true)
      } catch (error) {
        console.error("Failed to connect wallet:", error)
        setIsConnected(false)
      }
    } else {
      console.log("Please install MetaMask!")
      setIsConnected(false)
    }
  }

  const switchToSepolia = async () => {
    if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
      try {
        await (window.ethereum as MetaMaskInpageProvider).request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: SEPOLIA_CHAIN_ID }],
        })
        setIsSepoliaNetwork(true)
      } catch (switchError: any) {
        // This error code indicates that the chain has not been added to MetaMask.
        if (switchError.code === 4902) {
          try {
            await (window.ethereum as MetaMaskInpageProvider).request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId: SEPOLIA_CHAIN_ID,
                  chainName: "Sepolia Test Network",
                  nativeCurrency: {
                    name: "Sepolia Ether",
                    symbol: "SEP",
                    decimals: 18,
                  },
                  rpcUrls: [SEPOLIA_RPC_URL],
                  blockExplorerUrls: ["https://sepolia.etherscan.io"],
                },
              ],
            })
            setIsSepoliaNetwork(true)
          } catch (addError) {
            console.error("Failed to add Sepolia network:", addError)
          }
        } else {
          console.error("Failed to switch to Sepolia network:", switchError)
        }
      }
    }
  }

  const getAllCandidates = useCallback(async () => {
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
  }, [])

  useEffect(() => {
    initializeWeb3()
  }, [initializeWeb3])

  return (
    <Web3Context.Provider
      value={{
        web3,
        contract,
        candidateContract,
        account,
        connectWallet,
        switchToSepolia,
        isSepoliaNetwork,
        getAllCandidates,
        isConnected,
      }}
    >
      {children}
    </Web3Context.Provider>
  )
}

export default Web3Provider

