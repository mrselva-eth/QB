"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useWeb3 } from "../contexts/Web3Context"
import { toast } from "react-toastify"

interface Candidate {
  id: number
  name: string
  voteCount: number
}

const Voting: React.FC = () => {
  const { contract, account } = useWeb3()
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [selectedCandidate, setSelectedCandidate] = useState<number | null>(null)
  const [isRegistered, setIsRegistered] = useState(false)

  useEffect(() => {
    fetchCandidates()
    checkRegistrationStatus()
  }, [contract]) // Removed unnecessary dependency: account

  const checkRegistrationStatus = async () => {
    if (contract && account) {
      try {
        const registered = await contract.methods.isVoterRegistered(account).call()
        setIsRegistered(registered)
      } catch (error) {
        console.error("Error checking registration status:", error)
      }
    }
  }

  const fetchCandidates = async () => {
    if (!contract) return

    try {
      const candidateCount = await contract.methods.getCandidateCount().call()
      const fetchedCandidates = []

      for (let i = 0; i < candidateCount; i++) {
        const candidate = await contract.methods.candidates(i).call()
        fetchedCandidates.push({
          id: i,
          name: candidate.name,
          voteCount: Number.parseInt(candidate.voteCount),
        })
      }

      setCandidates(fetchedCandidates)
    } catch (error) {
      console.error("Error fetching candidates:", error)
      toast.error("Failed to fetch candidates. Please try again.")
    }
  }

  const handleVote = async () => {
    if (!contract || !account || selectedCandidate === null) return

    try {
      await contract.methods.vote(selectedCandidate).send({ from: account })
      toast.success("Vote cast successfully!")
      fetchCandidates()
    } catch (error) {
      console.error("Error casting vote:", error)
      toast.error("Failed to cast vote. Please try again.")
    }
  }

  if (!isRegistered) {
    return (
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
        <div className="md:flex">
          <div className="p-8">
            <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">Voting</div>
            <p className="mt-4">You must be registered as a voter to cast a vote.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
      <div className="md:flex">
        <div className="p-8">
          <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">Cast Your Vote</div>
          <div className="mt-6">
            {candidates.map((candidate) => (
              <div key={candidate.id} className="mb-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio"
                    name="candidate"
                    value={candidate.id}
                    checked={selectedCandidate === candidate.id}
                    onChange={() => setSelectedCandidate(candidate.id)}
                  />
                  <span className="ml-2">{candidate.name}</span>
                </label>
              </div>
            ))}
          </div>
          <button
            onClick={handleVote}
            disabled={selectedCandidate === null}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
          >
            Vote
          </button>
        </div>
      </div>
    </div>
  )
}

export default Voting

