import type { NextApiRequest, NextApiResponse } from "next"
import axios from "axios"
import pinJSONToIPFS from "@/lib/ipfs"

const VOTE_COUNT_CID_FILE = "data/vote-count-cid.json"
const fs = require("fs").promises

interface VoteCount {
  [candidateAddress: string]: number
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      const { candidateAddress, voterAddress } = req.body

      // Read the current CID for vote counts
      let currentCID
      try {
        const cidFile = await fs.readFile(VOTE_COUNT_CID_FILE, "utf-8")
        currentCID = JSON.parse(cidFile).cid
      } catch (error) {
        console.error("Error reading vote count CID file:", error)
        currentCID = null
      }

      // Fetch current vote counts or initialize new object
      let voteCount: VoteCount = {}
      if (currentCID) {
        try {
          const response = await axios.get(`https://gateway.pinata.cloud/ipfs/${currentCID}`)
          voteCount = response.data
        } catch (error) {
          console.error("Error fetching vote counts from IPFS:", error)
        }
      }

      // Update vote count for the candidate
      voteCount[candidateAddress] = (voteCount[candidateAddress] || 0) + 1

      // Pin updated vote counts to IPFS
      const newCID = await pinJSONToIPFS(voteCount)

      // Update the CID file
      await fs.writeFile(VOTE_COUNT_CID_FILE, JSON.stringify({ cid: newCID }))

      res.status(200).json({ message: "Vote count updated successfully" })
    } catch (error) {
      console.error("Error updating vote count:", error)
      res.status(500).json({ error: "Failed to update vote count" })
    }
  } else {
    res.setHeader("Allow", ["POST"])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

