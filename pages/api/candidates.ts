import type { NextApiRequest, NextApiResponse } from "next"
import Web3 from "web3"
import { CANDIDATE_REGISTRY_ADDRESS, CANDIDATE_REGISTRY_ABI } from "@/utils/contractConfig"

const web3 = new Web3(
  process.env.NEXT_PUBLIC_INFURA_PROJECT_ID
    ? `https://sepolia.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_PROJECT_ID}`
    : "http://localhost:8545",
)

const candidateContract = new web3.eth.Contract(CANDIDATE_REGISTRY_ABI as any, CANDIDATE_REGISTRY_ADDRESS)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      const candidates = []
      let i = 0
      let continueLoop = true

      while (continueLoop) {
        try {
          const address = await candidateContract.methods.candidateAddresses(i).call()
          const isRegistered = await candidateContract.methods.isRegisteredCandidate(address).call()

          if (isRegistered) {
            const basicInfo = await candidateContract.methods.getCandidateBasicInfo(address).call()
            const additionalInfo = await candidateContract.methods.getCandidateAdditionalInfo(address).call()

            candidates.push({
              address,
              basicInfo,
              additionalInfo,
            })
          }
          i++
        } catch (error) {
          // If we've reached the end of the candidates array, break the loop
          continueLoop = false
        }
      }

      res.status(200).json(candidates)
    } catch (error) {
      console.error("Error fetching candidates:", error)
      res.status(500).json({ error: "Failed to fetch candidates" })
    }
  } else {
    res.setHeader("Allow", ["GET"])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

