import type { NextApiRequest, NextApiResponse } from "next"
import formidable from "formidable"
import fs from "fs"
import axios from "axios"
import FormData from "form-data"

export const config = {
  api: {
    bodyParser: false,
  },
}

const pinataApiKey = process.env.NEXT_PUBLIC_PINATA_API_KEY
const pinataSecretApiKey = process.env.NEXT_PUBLIC_PINATA_SECRET_API_KEY

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const form = formidable()

    form.parse(req, async (err, fields, files: formidable.Files) => {
      if (err) {
        return res.status(500).json({ error: "Error parsing form data" })
      }

      const file = Array.isArray(files.file) ? files.file[0] : files.file
      if (!file || !("filepath" in file)) {
        return res.status(400).json({ error: "Invalid file upload" })
      }

      try {
        const fileData = fs.createReadStream(file.filepath)
        const formData = new FormData()
        formData.append("file", fileData, {
          filename: file.originalFilename || "unnamed_file",
          contentType: file.mimetype || undefined,
        })

        const pinataResponse = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
          maxBodyLength: Number.POSITIVE_INFINITY,
          headers: {
            "Content-Type": `multipart/form-data; boundary=${formData.getBoundary()}`,
            pinata_api_key: pinataApiKey,
            pinata_secret_api_key: pinataSecretApiKey,
          },
        })

        return res.status(200).json({ ipfsHash: pinataResponse.data.IpfsHash })
      } catch (error) {
        console.error("Error uploading to Pinata:", error)
        return res.status(500).json({ error: "Error uploading to Pinata" })
      }
    })
  } else {
    res.setHeader("Allow", ["POST"])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

