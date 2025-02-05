"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { useWeb3 } from "@/contexts/Web3Context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import toast from "@/utils/toast"

interface CandidateData {
  address: string
  basicInfo: {
    candidateId: string
    name: string
    partyName: string
    isIndependent: boolean
    manifesto: string
  }
  additionalInfo: {
    candidateImageUrl: string
  }
}

export default function VotingComponent() {
  const { account, contract, candidateContract } = useWeb3()
  const [candidates, setCandidates] = useState<CandidateData[]>([])
  const [selectedCandidate, setSelectedCandidate] = useState<CandidateData | null>(null)
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false)
  const [confirmationStep, setConfirmationStep] = useState(0)
  const [hasVoted, setHasVoted] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchCandidates()
    if (candidateContract && account) {
      checkVotingStatus()
    }
  }, [candidateContract, account])

  useEffect(() => {
    if (candidateContract) {
      setIsLoading(false)
    }
  }, [candidateContract])

  async function fetchCandidates() {
    try {
      const response = await axios.get("/api/candidate-cids")
      const { candidates: candidateCIDs } = response.data

      const fetchedCandidates = await Promise.all(
        candidateCIDs.map(async (candidate: { cid: string; address: string }) => {
          const pinataResponse = await axios.get(`https://gateway.pinata.cloud/ipfs/${candidate.cid}`)
          return { ...pinataResponse.data, address: candidate.address }
        }),
      )

      setCandidates(fetchedCandidates)
    } catch (error) {
      console.error("Error fetching candidates:", error)
      toast.error("Failed to fetch candidates. Please try again later.")
    }
  }

  async function checkVotingStatus() {
    if (candidateContract && account) {
      try {
        const hasVoted = await candidateContract.read.hasVoted([account])
        setHasVoted(hasVoted)
      } catch (error) {
        console.error("Error checking voting status:", error)
        // Set hasVoted to false if there's an error
        setHasVoted(false)
      }
    }
  }

  async function handleVote(candidate: CandidateData) {
    setSelectedCandidate(candidate)
    setIsConfirmDialogOpen(true)
    setConfirmationStep(1)
  }

  async function requestSignature(message: string) {
    if (typeof window.ethereum !== "undefined") {
      try {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" })
        if (accounts && Array.isArray(accounts) && accounts.length > 0) {
          const address = accounts[0]

          const signature = await window.ethereum.request({
            method: "personal_sign",
            params: [message, address],
          })

          console.log("Signature:", signature)
          return signature
        } else {
          throw new Error("No accounts found")
        }
      } catch (error) {
        console.error("Error:", error)
        throw error
      }
    } else {
      throw new Error("MetaMask is not installed!")
    }
  }

  async function handleConfirmVote(e: React.MouseEvent) {
    e.preventDefault()
    if (!selectedCandidate || !account) return

    try {
      const message = `Confirm Vote ${confirmationStep} for candidate ${selectedCandidate.basicInfo.name}`
      const signature = await requestSignature(message)

      if (confirmationStep === 1) {
        setConfirmationStep(2)
        toast.success("First confirmation received. Please confirm again.")
      } else if (confirmationStep === 2) {
        if (candidateContract && candidateContract.methods && candidateContract.methods.vote) {
          await candidateContract.methods.vote(selectedCandidate.address).send({ from: account })

          // Update vote count on IPFS
          await axios.post("/api/update-vote-count", {
            candidateAddress: selectedCandidate.address,
            voterAddress: account,
          })

          setHasVoted(true)
          toast.success("Your vote has been cast successfully!")
        } else {
          console.error("Vote method not found in the contract")
          toast.error("Voting is not available at the moment. Please try again later.")
        }

        setIsConfirmDialogOpen(false)
        setConfirmationStep(0)
        setSelectedCandidate(null)
      }
    } catch (error) {
      console.error("Error during voting process:", error)
      toast.error("An error occurred during the voting process. Please try again.")
      setIsConfirmDialogOpen(false)
      setConfirmationStep(0)
      setSelectedCandidate(null)
    }
  }

  if (isLoading) {
    return <div>Loading voting information...</div>
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Cast Your Vote</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {candidates.map((candidate, index) => (
          <Card key={`${candidate.address}-${index}`}>
            <CardHeader className="flex flex-row items-center gap-4">
              <Avatar className="w-16 h-16 border-2 border-primary/10">
                <AvatarImage src={candidate.additionalInfo.candidateImageUrl} alt={candidate.basicInfo.name} />
                <AvatarFallback>{candidate.basicInfo.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-lg">{candidate.basicInfo.name}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {candidate.basicInfo.isIndependent ? "Independent" : candidate.basicInfo.partyName}
                </p>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm mb-4">{candidate.basicInfo.manifesto.substring(0, 100)}...</p>
              <Button onClick={() => handleVote(candidate)} disabled={hasVoted}>
                {hasVoted ? "Already Voted" : "Vote"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <AlertDialog
        open={isConfirmDialogOpen}
        onOpenChange={(open) => {
          if (!open && confirmationStep !== 2) {
            setIsConfirmDialogOpen(open)
            setConfirmationStep(0)
            setSelectedCandidate(null)
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Your Vote</AlertDialogTitle>
            <AlertDialogDescription>
              {confirmationStep === 1
                ? "Are you sure you want to vote for this candidate? This action requires two confirmations."
                : "Please confirm your vote once more to finalize your decision."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                if (confirmationStep !== 2) {
                  setIsConfirmDialogOpen(false)
                  setConfirmationStep(0)
                  setSelectedCandidate(null)
                }
              }}
              disabled={confirmationStep === 2}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction type="button" onClick={handleConfirmVote}>
              {confirmationStep === 1 ? "Confirm Vote 1" : "Confirm Vote 2"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

