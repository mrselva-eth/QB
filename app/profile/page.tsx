"use client"

import { useState, useEffect } from "react"
import { useWeb3 } from "@/contexts/Web3Context"
import Header from "@/components/Header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronRight, User, Mail, Phone, Calendar, MapPin, Shield } from "lucide-react"
import toast from "@/utils/toast"

interface UserDetails {
  userId: string
  name: string
  dateOfBirth: string
  addressDetails: string
  aadhaarNumber: string
  email: string
  phoneNumber: string
  profilePictureUrl: string
}

export default function ProfilePage() {
  const { account, contract } = useWeb3()
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editedDetails, setEditedDetails] = useState<UserDetails | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (contract && account) {
      fetchUserDetails()
    } else {
      setIsLoading(false)
    }
  }, [contract, account])

  const fetchUserDetails = async () => {
    if (!contract || !account) return

    try {
      setIsLoading(true)
      const isRegistered = await contract.read.isVoterRegistered([account])
      if (!isRegistered) {
        setUserDetails(null)
        toast.error("You are not registered as a voter.")
        return
      }

      const tokenId = await contract.read.voterTokens([account, 0])
      const details = await contract.read.getVoterDetails([tokenId])

      const userDetails: UserDetails = {
        userId: details[0],
        name: details[1],
        dateOfBirth: details[2],
        addressDetails: details[3],
        aadhaarNumber: details[4],
        email: details[5],
        phoneNumber: details[6],
        profilePictureUrl: details[7],
      }

      setUserDetails(userDetails)
      setEditedDetails(userDetails)
    } catch (error) {
      console.error("Error fetching user details:", error)
      toast.error("Failed to fetch user details")
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleSave = async () => {
    if (!contract || !account || !editedDetails) return

    try {
      await contract.write.updateVoterDetails([
        editedDetails.name,
        editedDetails.dateOfBirth,
        editedDetails.addressDetails,
        editedDetails.email,
        editedDetails.phoneNumber,
        editedDetails.profilePictureUrl,
      ])

      setUserDetails(editedDetails)
      setIsEditing(false)
      toast.success("User details updated successfully")
    } catch (error) {
      console.error("Error updating user details:", error)
      toast.error("Failed to update user details")
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editedDetails) return

    setEditedDetails({
      ...editedDetails,
      [e.target.name]: e.target.value,
    })
  }

  if (isLoading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200">
          <div className="container mx-auto px-4 py-8">
            <p className="text-center text-lg">Loading user details...</p>
          </div>
        </main>
      </>
    )
  }

  if (!account) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200">
          <div className="container mx-auto px-4 py-8">
            <p className="text-center text-lg text-red-500">Please connect your wallet to view your profile.</p>
          </div>
        </main>
      </>
    )
  }

  if (!userDetails) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200">
          <div className="container mx-auto px-4 py-8">
            <p className="text-center text-lg text-red-500">You are not registered as a voter.</p>
          </div>
        </main>
      </>
    )
  }

  const parseAddressDetails = (addressString: string) => {
    try {
      return JSON.parse(addressString)
    } catch {
      return {
        houseNumber: "",
        area: "",
        town: "",
        taluk: "",
        pinCode: "",
      }
    }
  }

  const addressDetails = parseAddressDetails(userDetails.addressDetails)

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200">
        {/* Hero Section */}
        <section className="relative bg-primary py-20 text-white overflow-hidden">
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
          <div className="container mx-auto px-4 relative">
            <div className="flex flex-col md:flex-row items-center justify-between gap-12">
              <div className="flex-1 space-y-6">
                <div className="space-y-4">
                  <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                    Your <span className="text-secondary">Profile</span>
                  </h1>
                  <p className="text-xl md:text-2xl text-gray-200">Manage your voter information</p>
                </div>
                <div className="flex gap-4">
                  <Button size="lg" className="bg-secondary hover:bg-secondary-hover" onClick={handleEdit}>
                    Edit Profile <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="flex-1 flex justify-center">
                <Avatar className="w-48 h-48 border-4 border-white shadow-lg">
                  <AvatarImage src={userDetails.profilePictureUrl} alt={userDetails.name} />
                  <AvatarFallback className="text-6xl bg-gradient-to-r from-[#38BDF8] via-[#86EFAC] to-[#4ADE80]">
                    {userDetails.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>
          </div>
        </section>

        {/* Profile Details Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <Card className="max-w-4xl mx-auto">
              <CardHeader>
                <CardTitle className="text-3xl font-bold text-primary">Voter Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <ProfileField
                    icon={<User className="text-primary" />}
                    label="User ID"
                    value={userDetails.userId}
                    isEditable={false}
                  />
                  <ProfileField
                    icon={<User className="text-primary" />}
                    label="Name"
                    value={userDetails.name}
                    isEditing={isEditing}
                    editedValue={editedDetails?.name}
                    onChange={handleInputChange}
                    name="name"
                  />
                  <ProfileField
                    icon={<Calendar className="text-primary" />}
                    label="Date of Birth"
                    value={userDetails.dateOfBirth}
                    isEditing={isEditing}
                    editedValue={editedDetails?.dateOfBirth}
                    onChange={handleInputChange}
                    name="dateOfBirth"
                    type="date"
                  />
                  <ProfileField
                    icon={<MapPin className="text-primary" />}
                    label="Address"
                    value={`${addressDetails.houseNumber}, ${addressDetails.area}, ${addressDetails.town}, ${addressDetails.taluk} - ${addressDetails.pinCode}`}
                    isEditable={false}
                  />
                  <ProfileField
                    icon={<Shield className="text-primary" />}
                    label="Aadhaar Number"
                    value={userDetails.aadhaarNumber}
                    isEditable={false}
                  />
                  <ProfileField
                    icon={<Mail className="text-primary" />}
                    label="Email"
                    value={userDetails.email}
                    isEditing={isEditing}
                    editedValue={editedDetails?.email}
                    onChange={handleInputChange}
                    name="email"
                    type="email"
                  />
                  <ProfileField
                    icon={<Phone className="text-primary" />}
                    label="Phone Number"
                    value={userDetails.phoneNumber}
                    isEditing={isEditing}
                    editedValue={editedDetails?.phoneNumber}
                    onChange={handleInputChange}
                    name="phoneNumber"
                  />
                </div>
                {isEditing && (
                  <div className="mt-6 flex justify-end">
                    <Button onClick={handleSave} className="bg-primary text-white hover:bg-primary/90">
                      Save Changes
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
    </>
  )
}

interface ProfileFieldProps {
  icon: React.ReactNode
  label: string
  value: string
  isEditable?: boolean
  isEditing?: boolean
  editedValue?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  name?: string
  type?: string
}

const ProfileField: React.FC<ProfileFieldProps> = ({
  icon,
  label,
  value,
  isEditable = true,
  isEditing = false,
  editedValue,
  onChange,
  name,
  type = "text",
}) => (
  <div className="flex items-center space-x-4">
    <div className="flex-shrink-0">{icon}</div>
    <div className="flex-grow">
      <Label className="text-sm font-medium text-gray-500">{label}</Label>
      {isEditing && isEditable ? (
        <Input name={name} value={editedValue} onChange={onChange} type={type} className="mt-1" />
      ) : (
        <p className="text-lg font-semibold text-gray-900">{value}</p>
      )}
    </div>
  </div>
)

