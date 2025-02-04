import axios from "axios"

const pinataApiKey = process.env.NEXT_PUBLIC_PINATA_API_KEY
const pinataSecretApiKey = process.env.NEXT_PUBLIC_PINATA_SECRET_API_KEY

interface PinataResponse {
  IpfsHash: string
  PinSize: number
  Timestamp: string
}

const pinJSONToIPFS = async (jsonBody: object): Promise<string> => {
  const url = "https://api.pinata.cloud/pinning/pinJSONToIPFS"

  if (!pinataApiKey || !pinataSecretApiKey) {
    throw new Error("Pinata API keys are not set")
  }

  try {
    const response = await axios.post<PinataResponse>(url, jsonBody, {
      headers: {
        "Content-Type": "application/json",
        pinata_api_key: pinataApiKey,
        pinata_secret_api_key: pinataSecretApiKey,
      },
    })

    return response.data.IpfsHash
  } catch (error) {
    console.error("Error pinning JSON to IPFS:", error)
    throw error
  }
}

export default pinJSONToIPFS

