import type { NextApiRequest, NextApiResponse } from "next"
import fs from "fs"
import path from "path"

const voteCountFilePath = path.join(process.cwd(), "data", "vote-count-cid.json")

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      if (!fs.existsSync(voteCountFilePath)) {
        return res.status(200).json({ voteCounts: {}, totalVotes: 0 })
      }

      const fileContents = fs.readFileSync(voteCountFilePath, "utf8")
      const data = JSON.parse(fileContents)

      if (!data.cid) {
        return res.status(200).json({ voteCounts: {}, totalVotes: 0 })
      }

      const response = await fetch(`https://gateway.pinata.cloud/ipfs/${data.cid}`)
      const voteCounts: { [key: string]: number } = await response.json()

      const totalVotes = Object.values(voteCounts).reduce((sum: number, count: number) => sum + count, 0)

      res.status(200).json({ voteCounts, totalVotes })
    } catch (error) {
      console.error("Error reading vote counts:", error)
      res.status(500).json({ error: "Failed to read vote counts" })
    }
  } else {
    res.setHeader("Allow", ["GET"])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

