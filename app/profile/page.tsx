"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useWeb3 } from "@/contexts/Web3Context"
import Header from "@/components/Header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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

const ProfilePage: React.FC = () => {
  const { contract, account } = useWeb3()
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editedDetails, setEditedDetails] = useState<UserDetails | null>(null)

  useEffect(() => {
    fetchUserDetails()
  }, [])

  const fetchUserDetails = async () => {
    if (!contract || !account) return

    try {
      const tokenId = await contract.methods.voterTokens(account, 0).call()
      const details = await contract.methods.getVoterDetails(tokenId).call()

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
    }
  }

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleSave = async () => {
    if (!contract || !account || !editedDetails) return

    try {
      await contract.methods
        .updateVoterDetails(
          editedDetails.name,
          editedDetails.dateOfBirth,
          editedDetails.addressDetails,
          editedDetails.email,
          editedDetails.phoneNumber,
          editedDetails.profilePictureUrl,
        )
        .send({ from: account })

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

  if (!userDetails) {
    return (
      <>
        <Header />
        <main className="container mx-auto px-4 py-8">
          <p>Loading user details...</p>
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
      <main className="container mx-auto px-4 py-8">
        <Card className="max-w-4xl mx-auto">
          <CardHeader className="text-center pb-16">
            <CardTitle className="text-3xl font-bold mb-8">User Profile</CardTitle>
          </CardHeader>
          <div className="flex justify-center -mt-20 mb-8">
            <Avatar className="w-32 h-32 border-4 border-white shadow-lg">
              <AvatarImage src={userDetails.profilePictureUrl} alt={userDetails.name} />
              <AvatarFallback className="text-4xl">
                {userDetails.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
          </div>
          <CardContent>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <Label className="text-sm text-blue-600/75">UserId</Label>
                <p className="text-lg text-gray-900">{userDetails.userId}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Name</Label>
                {isEditing ? (
                  <Input name="name" value={editedDetails?.name} onChange={handleInputChange} />
                ) : (
                  <p className="text-lg font-semibold">{userDetails.name}</p>
                )}
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Date of Birth</Label>
                {isEditing ? (
                  <Input
                    name="dateOfBirth"
                    value={editedDetails?.dateOfBirth}
                    onChange={handleInputChange}
                    type="date"
                  />
                ) : (
                  <p className="text-lg font-semibold">{userDetails.dateOfBirth}</p>
                )}
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Address Details</Label>
                <p className="text-lg font-semibold">
                  {`${addressDetails.houseNumber}, ${addressDetails.area}, ${addressDetails.town}, ${addressDetails.taluk} - ${addressDetails.pinCode}`}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Aadhaar Number</Label>
                <p className="text-lg font-semibold">{userDetails.aadhaarNumber}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Email</Label>
                {isEditing ? (
                  <Input name="email" value={editedDetails?.email} onChange={handleInputChange} type="email" />
                ) : (
                  <p className="text-lg font-semibold">{userDetails.email}</p>
                )}
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Phone Number</Label>
                {isEditing ? (
                  <Input name="phoneNumber" value={editedDetails?.phoneNumber} onChange={handleInputChange} />
                ) : (
                  <p className="text-lg font-semibold">{userDetails.phoneNumber}</p>
                )}
              </div>
            </div>
            <div className="mt-6 flex justify-end px-6 pb-6">
              <Button
                onClick={isEditing ? handleSave : handleEdit}
                className="bg-[#0f172a] text-white hover:bg-[#1e293b]"
              >
                {isEditing ? "Save Changes" : "Edit Profile"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </>
  )
}

export default ProfilePage

