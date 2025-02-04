"use client"

import { useState, useEffect } from "react"
import Header from "@/components/Header"
import { useWeb3 } from "@/contexts/Web3Context"
import VotingComponent from "@/components/VotingComponent"

export default function VotePage() {
  const { account, isConnected } = useWeb3()
  const [isEligibleToVote, setIsEligibleToVote] = useState(false)

  useEffect(() => {
    // Check if the user is eligible to vote
    // This could involve checking if they're registered, haven't voted yet, etc.
    // For now, we'll just check if they're connected
    setIsEligibleToVote(isConnected)
  }, [isConnected])

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-8">
        {isEligibleToVote ? (
          <VotingComponent />
        ) : (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Voting Eligibility</h2>
            <p>
              {account
                ? "You are not eligible to vote. Please ensure you are registered and haven't voted yet."
                : "Please connect your wallet to check your voting eligibility."}
            </p>
          </div>
        )}
      </main>
    </>
  )
}

