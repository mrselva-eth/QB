"use client"

import type React from "react"
import { useState } from "react"
import { useWeb3 } from "@/contexts/Web3Context"
import { useRouter } from "next/navigation"
import pinJSONToIPFS from "@/lib/ipfs"
import toast from "@/utils/toast" // Import toast from utils

const CandidateRegistration: React.FC = () => {
  const router = useRouter()
  const { contract, account } = useWeb3()
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!contract || !account) return

    setIsLoading(true)
    try {
      const candidateData = { name, description }
      const ipfsHash = await pinJSONToIPFS(candidateData)

      await contract.methods.registerCandidate(name, ipfsHash).send({ from: account })

      toast.success("Candidate registered successfully!")
      setIsSuccess(true)
      setName("")
      setDescription("")

      setTimeout(() => {
        router.push("/vote")
      }, 2000)
    } catch (error) {
      console.error("Error registering candidate:", error)
      toast.error("Failed to register candidate. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
        <div className="p-8 text-center">
          <div className="text-2xl font-bold text-green-600 mb-4">Registration Successful!</div>
          <p className="text-gray-600 mb-4">Your candidate has been registered successfully.</p>
          <p className="text-gray-500">Redirecting to voting page...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
      <div className="md:flex">
        <div className="p-8">
          <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">Candidate Registration</div>
          <form onSubmit={handleSubmit} className="mt-6">
            <div className="mb-4">
              <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
                Name:
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
                disabled={isLoading}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">
                Description:
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
                disabled={isLoading}
              />
            </div>
            <div className="flex items-center justify-between">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
                disabled={isLoading}
              >
                {isLoading ? "Registering..." : "Register Candidate"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CandidateRegistration

