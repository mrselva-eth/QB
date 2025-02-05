"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"

interface CandidateData {
  address: string
  basicInfo: {
    candidateId: string
    name: string
    partyName: string
    isIndependent: boolean
    manifesto: string
    ambitionsAndGoals: string
  }
  additionalInfo: {
    experience: string
    pastAchievements: string
    contactInfo: string
    socialMediaLinks: string
    candidateImageUrl: string
    partySymbolUrl: string
  }
}

export default function CandidateList() {
  const [candidates, setCandidates] = useState<CandidateData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchCandidates() {
      try {
        setIsLoading(true)
        setError(null)

        // Fetch CIDs from our API
        const response = await axios.get("/api/candidate-cids")
        const { candidates: candidateCIDs } = response.data

        // Fetch candidate data from Pinata for each CID
        const fetchedCandidates = await Promise.all(
          candidateCIDs.map(async (candidate: { cid: string }) => {
            const pinataResponse = await axios.get(`https://gateway.pinata.cloud/ipfs/${candidate.cid}`)
            return pinataResponse.data
          }),
        )

        setCandidates(fetchedCandidates)
      } catch (err) {
        console.error("Error fetching candidates:", err)
        setError("Failed to fetch candidates. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchCandidates()
  }, [])

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center gap-4">
              <Skeleton className="h-16 w-16 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[200px]" />
                <Skeleton className="h-4 w-[150px]" />
              </div>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-[100px]" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center p-4 bg-red-50 text-red-600 rounded-lg">
        <p className="font-semibold">Error</p>
        <p>{error}</p>
      </div>
    )
  }

  if (!candidates || candidates.length === 0) {
    return (
      <div className="text-center p-4 bg-gray-50 rounded-lg">
        <p className="text-lg font-semibold">No candidates registered yet</p>
        <p className="text-gray-600">Be the first to register as a candidate!</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {candidates.map((candidate, index) => (
        <Card key={`${candidate.address}-${index}`} className="hover:shadow-lg transition-shadow">
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
            <div className="space-y-2">
              <p className="text-sm font-medium">Candidate ID: {candidate.basicInfo.candidateId}</p>
              <p className="text-sm text-muted-foreground line-clamp-2">{candidate.basicInfo.manifesto}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

