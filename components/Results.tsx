"use client"

import { useState, useEffect } from "react"
import { useWeb3 } from "../contexts/Web3Context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import toast from "@/utils/toast"
import axios from "axios"

interface Candidate {
  id: string
  name: string
  voteCount: number
  partyName: string
  candidateImageUrl: string
}

interface VotingStats {
  totalVoters: number
  totalCandidates: number
  totalVotesCast: number
}

const Results: React.FC = () => {
  const { contract, candidateContract } = useWeb3()
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [votingStats, setVotingStats] = useState<VotingStats>({
    totalVoters: 0,
    totalCandidates: 0,
    totalVotesCast: 0,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchResults()
    fetchVotingStats()
  }, [])

  const fetchResults = async () => {
    setIsLoading(true)
    try {
      const candidateResponse = await axios.get("/api/candidate-cids")
      const voteCountResponse = await axios.get("/api/vote-count")
      const candidateCIDs = candidateResponse.data.candidates
      const voteCounts = voteCountResponse.data.voteCounts || {}

      const validVoteCounts = Object.entries(voteCounts).reduce(
        (acc, [key, value]) => {
          acc[key] = typeof value === "number" ? value : 0
          return acc
        },
        {} as Record<string, number>,
      )

      const fetchedCandidates = await Promise.all(
        candidateCIDs.map(async (candidate: { cid: string; address: string }) => {
          const pinataResponse = await axios.get(`https://gateway.pinata.cloud/ipfs/${candidate.cid}`)
          return {
            id: candidate.address,
            name: pinataResponse.data.basicInfo.name,
            voteCount: validVoteCounts[candidate.address] || 0,
            partyName: pinataResponse.data.basicInfo.isIndependent
              ? "Independent"
              : pinataResponse.data.basicInfo.partyName,
            candidateImageUrl: pinataResponse.data.additionalInfo.candidateImageUrl,
          }
        }),
      )

      setCandidates(fetchedCandidates.sort((a, b) => b.voteCount - a.voteCount))
      setIsLoading(false)
    } catch (error) {
      console.error("Error fetching results:", error)
      toast.error("Failed to fetch results. Please try again.")
      setIsLoading(false)
    }
  }

  const fetchVotingStats = async () => {
    setIsLoading(true)
    try {
      // Fetch total registered voters from Sepolia scan
      const voterContractAddress = process.env.NEXT_PUBLIC_VOTER_CONTRACT_ADDRESS
      const etherscanApiKey = process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY

      const response = await axios.get(
        `https://api-sepolia.etherscan.io/api?module=stats&action=tokensupply&contractaddress=${voterContractAddress}&apikey=${etherscanApiKey}`,
      )

      // Ensure we have a valid number for total voters
      const totalVoters = Number.parseInt(response.data.result) || 0

      // Fetch candidate count from local data
      const candidateResponse = await axios.get("/api/candidate-cids")
      const totalCandidates = candidateResponse.data.candidates.length

      // Fetch total votes cast from local data
      const voteCountResponse = await axios.get("/api/vote-count")
      const voteCounts = voteCountResponse.data.voteCounts || {}
      const validVoteCounts = Object.entries(voteCounts).reduce(
        (acc, [key, value]) => {
          acc[key] = typeof value === "number" ? value : 0
          return acc
        },
        {} as Record<string, number>,
      )

      const totalVotesCast = Object.values(validVoteCounts).reduce((sum: number, count: number) => sum + count, 0)

      setVotingStats({
        totalVoters,
        totalCandidates,
        totalVotesCast,
      })
      setIsLoading(false)
    } catch (error) {
      console.error("Error fetching voting stats:", error)
      toast.error("Failed to fetch voting statistics")
      // Set default values in case of error
      setVotingStats({
        totalVoters: 0,
        totalCandidates: 0,
        totalVotesCast: 0,
      })
      setIsLoading(false)
    }
  }

  const maxVotes = candidates.length > 0 ? Math.max(...candidates.map((c) => c.voteCount)) : 0

  if (isLoading) {
    return <div>Loading results...</div>
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Registered Voters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{votingStats.totalVoters}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Candidates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{votingStats.totalCandidates}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Votes Cast</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{votingStats.totalVotesCast}</div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        {candidates.map((candidate, index) => (
          <Card key={`${candidate.id}-${index}`}>
            <CardContent className="flex items-center space-x-4 p-6">
              <Avatar className="h-20 w-20">
                <AvatarImage src={candidate.candidateImageUrl} alt={candidate.name} />
                <AvatarFallback>{candidate.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <h3 className="text-2xl font-semibold">{candidate.name}</h3>
                <p className="text-sm text-muted-foreground">{candidate.partyName}</p>
                <div className="flex items-center space-x-2">
                  <Progress value={(candidate.voteCount / maxVotes) * 100} className="h-2" />
                  <span className="text-lg font-semibold">{candidate.voteCount} votes</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default Results

