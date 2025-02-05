import type { NextApiRequest, NextApiResponse } from "next"
import axios from "axios"

const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" })
  }

  try {
    const { token } = req.body

    const response = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify?secret=${RECAPTCHA_SECRET_KEY}&response=${token}`,
    )

    const { success } = response.data

    if (success) {
      return res.status(200).json({ success: true })
    } else {
      return res.status(400).json({ success: false, message: "Invalid captcha" })
    }
  } catch (error) {
    console.error("Error verifying captcha:", error)
    return res.status(500).json({ success: false, message: "Error verifying captcha" })
  }
}

