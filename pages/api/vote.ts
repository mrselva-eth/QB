import type { NextApiRequest, NextApiResponse } from "next"
import Web3 from "web3"
import { CANDIDATE_REGISTRY_ADDRESS, CANDIDATE_REGISTRY_ABI } from "@/utils/contractConfig"

const web3 = new Web3(
  process.env.NEXT_PUBLIC_INFURA_PROJECT_ID
    ? `https://sepolia.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_PROJECT_ID}`
    : "http://localhost:8545",
)

const candidateContract = new web3.eth.Contract(CANDIDATE_REGISTRY_ABI as any, CANDIDATE_REGISTRY_ADDRESS)

type VoteSession = {
  candidateAddress: string
  voterAddress: string
  step: number
  signatures: string[]
}

const voteSessions: { [key: string]: VoteSession } = {}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { candidateAddress, voterAddress, signature, step } = req.body

    if (!candidateAddress || !voterAddress || !signature || step === undefined) {
      return res.status(400).json({ error: "Missing required parameters" })
    }

    const sessionKey = `${voterAddress}-${candidateAddress}`

    if (step === 1) {
      // Initialize or reset the voting session
      voteSessions[sessionKey] = {
        candidateAddress,
        voterAddress,
        step: 1,
        signatures: [signature],
      }
      return res.status(200).json({ message: "First confirmation received", step: 1 })
    } else if (step === 2) {
      const session = voteSessions[sessionKey]
      if (!session || session.step !== 1) {
        return res.status(400).json({ error: "Invalid voting session" })
      }

      session.signatures.push(signature)
      session.step = 2

      try {
        // Here you would typically verify the signatures and call the smart contract
        // For demonstration, we'll just log the vote
        console.log(`Vote cast for candidate ${candidateAddress} by voter ${voterAddress}`)

        // In a real implementation, you would call the smart contract here
        // await candidateContract.methods.vote(candidateAddress).send({ from: voterAddress })

        delete voteSessions[sessionKey]
        return res.status(200).json({ message: "Vote successfully cast", step: 2 })
      } catch (error) {
        console.error("Error casting vote:", error)
        return res.status(500).json({ error: "Failed to cast vote" })
      }
    } else {
      return res.status(400).json({ error: "Invalid step" })
    }
  } else {
    res.setHeader("Allow", ["POST"])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

