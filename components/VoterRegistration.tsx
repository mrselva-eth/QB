"use client"

import { useState, useEffect } from "react"
import { useWeb3 } from "@/contexts/Web3Context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import toast from "@/utils/toast"
import pinJSONToIPFS from "@/lib/ipfs"

const TEST_ADDRESS = "0x603fbF99674B8ed3305Eb6EA5f3491F634A402A6"

const VoterRegistration: React.FC = () => {
  const { contract, account } = useWeb3()
  const [userId, setUserId] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [dateOfBirth, setDateOfBirth] = useState("")
  const [houseNumber, setHouseNumber] = useState("")
  const [area, setArea] = useState("")
  const [town, setTown] = useState("")
  const [taluk, setTaluk] = useState("")
  const [pinCode, setPinCode] = useState("")
  const [aadhaarNumber, setAadhaarNumber] = useState("")
  const [email, setEmail] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("+91")
  const [profilePicture, setProfilePicture] = useState<File | null>(null)
  const [isRegistered, setIsRegistered] = useState(false)
  const [registrationCount, setRegistrationCount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    console.log("Web3 context:", { contract, account })
    checkRegistrationStatus()
    generateUserId()
  }, [contract, account])

  const checkRegistrationStatus = async () => {
    if (contract && account) {
      try {
        const isRegistered = await contract.read.isVoterRegistered([account])
        setIsRegistered(isRegistered)
        if (isRegistered) {
          const count = await contract.read.getVoterTokenCount([account])
          setRegistrationCount(Number(count))
        }
      } catch (error) {
        console.error("Error checking registration status:", error)
      }
    }
  }

  const generateUserId = () => {
    const randomId = Math.floor(100000 + Math.random() * 900000)
    setUserId(randomId.toString())
  }

  const validateForm = () => {
    if (!firstName || !lastName) {
      toast.error("Please enter your full name")
      return false
    }
    if (!isValidDate(dateOfBirth)) {
      toast.error("Please enter a valid date of birth")
      return false
    }
    if (!isEligibleToVote(dateOfBirth)) {
      toast.error("You must be at least 18 years old to register")
      return false
    }
    if (!houseNumber || !area || !town || !taluk || !pinCode) {
      toast.error("Please fill in all address fields")
      return false
    }
    if (!isValidAadhaar(aadhaarNumber)) {
      toast.error("Please enter a valid Aadhaar number")
      return false
    }
    if (!isValidEmail(email)) {
      toast.error("Please enter a valid email address")
      return false
    }
    if (!isValidPhoneNumber(phoneNumber)) {
      toast.error("Please enter a valid phone number")
      return false
    }
    if (!profilePicture) {
      toast.error("Please upload a profile picture")
      return false
    }
    return true
  }

  const isValidDate = (dateString: string) => {
    const regex = /^\d{4}-\d{2}-\d{2}$/
    return regex.test(dateString)
  }

  const isEligibleToVote = (dateString: string) => {
    const birthDate = new Date(dateString)
    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return age >= 18
  }

  const isValidAadhaar = (aadhaar: string) => {
    // Basic validation: 12 digits
    return /^\d{12}$/.test(aadhaar)
  }

  const isValidEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return regex.test(email)
  }

  const isValidPhoneNumber = (phone: string) => {
    // Validate Indian phone numbers
    return /^\+91[6-9]\d{9}$/.test(phone)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!contract || !account) {
      toast.error("Please connect your wallet first")
      return
    }

    setIsLoading(true)
    try {
      const voterData = {
        userId,
        name: `${firstName} ${lastName}`,
        dateOfBirth,
        addressDetails: JSON.stringify({
          houseNumber,
          area,
          town,
          taluk,
          pinCode,
        }),
        aadhaarNumber,
        email,
        phoneNumber,
        profilePictureUrl: "",
        ipfsHash: "",
      }

      // Upload profile picture to IPFS
      if (profilePicture) {
        const formData = new FormData()
        formData.append("file", profilePicture)
        const response = await fetch("/api/upload-to-ipfs", {
          method: "POST",
          body: formData,
        })
        const { ipfsHash } = await response.json()
        voterData.profilePictureUrl = `https://ipfs.io/ipfs/${ipfsHash}`
      }

      // Upload voter data to IPFS
      voterData.ipfsHash = await pinJSONToIPFS(voterData)

      console.log("Registering voter with data:", voterData)

      const transaction = await contract.write.registerVoter([
        voterData.userId,
        voterData.name,
        voterData.dateOfBirth,
        voterData.addressDetails,
        voterData.aadhaarNumber,
        voterData.email,
        voterData.phoneNumber,
        voterData.profilePictureUrl,
        voterData.ipfsHash,
      ])

      console.log("Transaction result:", transaction)

      toast.success("Voter registered successfully!")
      setIsRegistered(true)
      setRegistrationCount((prevCount) => prevCount + 1)
      if (account.toLowerCase() !== TEST_ADDRESS.toLowerCase()) {
        resetForm()
      } else {
        generateUserId()
      }
    } catch (error) {
      console.error("Error registering voter:", error)
      toast.error("Failed to register voter. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setFirstName("")
    setLastName("")
    setDateOfBirth("")
    setHouseNumber("")
    setArea("")
    setTown("")
    setTaluk("")
    setPinCode("")
    setAadhaarNumber("")
    setEmail("")
    setPhoneNumber("+91")
    setProfilePicture(null)
  }

  if (isRegistered && account && account.toLowerCase() !== TEST_ADDRESS.toLowerCase()) {
    return (
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
        <div className="md:flex">
          <div className="p-8">
            <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">Registration Status</div>
            <p className="mt-4">You are already registered as a voter.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-8">
        <h2 className="text-2xl font-bold mb-6">Voter Registration</h2>
        {account && account.toLowerCase() === TEST_ADDRESS.toLowerCase() && (
          <p className="mb-4 text-blue-600">Test address detected. You can register multiple times.</p>
        )}
        {registrationCount > 0 && (
          <p className="mb-4 text-green-600">You have registered {registrationCount} time(s).</p>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="userId">User ID</Label>
              <Input id="userId" value={userId} disabled />
            </div>
            <div>
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={firstName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFirstName(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={lastName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLastName(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="dateOfBirth">Date of Birth</Label>
              <Input
                id="dateOfBirth"
                type="date"
                value={dateOfBirth}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDateOfBirth(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <Label>Address</Label>
            <div className="grid grid-cols-2 gap-4 mt-2">
              <Input
                placeholder="House Number"
                value={houseNumber}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setHouseNumber(e.target.value)}
                required
              />
              <Input
                placeholder="Area"
                value={area}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setArea(e.target.value)}
                required
              />
              <Input
                placeholder="Town"
                value={town}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTown(e.target.value)}
                required
              />
              <Input
                placeholder="Taluk"
                value={taluk}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTaluk(e.target.value)}
                required
              />
              <Input
                placeholder="PIN Code"
                value={pinCode}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPinCode(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="aadhaarNumber">Aadhaar Number</Label>
            <Input
              id="aadhaarNumber"
              value={aadhaarNumber}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAadhaarNumber(e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="walletAddress">Wallet Address</Label>
            <Input id="walletAddress" value={account || ""} disabled />
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <Input
              id="phoneNumber"
              value={phoneNumber}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPhoneNumber(e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="profilePicture">Profile Picture</Label>
            <Input
              id="profilePicture"
              type="file"
              accept="image/*"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setProfilePicture(e.target.files?.[0] || null)}
              required
            />
          </div>

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? "Registering..." : "Register"}
          </Button>
        </form>
      </div>
    </div>
  )
}

export default VoterRegistration

