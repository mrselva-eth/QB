import type { NextApiRequest, NextApiResponse } from "next"
import fs from "fs"
import path from "path"

const dataFilePath = path.join(process.cwd(), "data", "candidateCIDs.json")

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      const fileContents = fs.readFileSync(dataFilePath, "utf8")
      const data = JSON.parse(fileContents)
      res.status(200).json(data)
    } catch (error) {
      console.error("Error reading CIDs:", error)
      res.status(500).json({ error: "Failed to read candidate CIDs" })
    }
  } else if (req.method === "POST") {
    try {
      const { cid, address } = req.body
      if (!cid || !address) {
        return res.status(400).json({ error: "CID and address are required" })
      }

      const fileContents = fs.readFileSync(dataFilePath, "utf8")
      const data = JSON.parse(fileContents)
      data.candidates.push({ cid, address })
      fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2))

      res.status(200).json({ message: "CID added successfully" })
    } catch (error) {
      console.error("Error adding CID:", error)
      res.status(500).json({ error: "Failed to add candidate CID" })
    }
  } else {
    res.setHeader("Allow", ["GET", "POST"])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

