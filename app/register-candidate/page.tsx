"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useWeb3 } from "@/contexts/Web3Context"
import Header from "@/components/Header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import toast from "@/utils/toast"
import pinJSONToIPFS from "@/lib/ipfs"
import axios from "axios"
import { ChevronRight, ShieldCheck, Users, FileText } from "lucide-react"

interface VoterDetails {
  userId: string
  name: string
  dateOfBirth: string
  addressDetails: string
  aadhaarNumber: string
  email: string
  phoneNumber: string
  profilePictureUrl: string
}

interface CandidateBasicInfo {
  candidateId: string
  name: string
  partyName: string
  isIndependent: boolean
  manifesto: string
  ambitionsAndGoals: string
}

interface CandidateAdditionalInfo {
  experience: string
  pastAchievements: string
  contactInfo: string
  socialMediaLinks: string
  candidateImageUrl: string
  partySymbolUrl: string
}

interface CandidateDetails {
  basicInfo: CandidateBasicInfo
  additionalInfo: CandidateAdditionalInfo
  walletAddress: string
  registrationTimestamp: number
  isRegistered: boolean
  ipfsHash: string
}

export default function RegisterCandidate() {
  const { account, contract, candidateContract } = useWeb3()
  const [isLoading, setIsLoading] = useState(false)
  const [voterDetails, setVoterDetails] = useState<VoterDetails | null>(null)
  const [candidateDetails, setCandidateDetails] = useState<CandidateDetails | null>(null)
  const [isRegistered, setIsRegistered] = useState(false)
  const [formData, setFormData] = useState<CandidateDetails>({
    basicInfo: {
      candidateId: "",
      name: "",
      partyName: "",
      isIndependent: false,
      manifesto: "",
      ambitionsAndGoals: "",
    },
    additionalInfo: {
      experience: "",
      pastAchievements: "",
      contactInfo: "",
      socialMediaLinks: "",
      candidateImageUrl: "",
      partySymbolUrl: "",
    },
    walletAddress: "",
    registrationTimestamp: 0,
    isRegistered: false,
    ipfsHash: "",
  })

  useEffect(() => {
    if (account) {
      fetchVoterDetails()
      checkCandidateRegistration()
    }
  }, [account])

  const fetchVoterDetails = async () => {
    if (!contract || !account) return

    try {
      const tokenId = await contract.methods.voterTokens(account, 0).call()
      const details = await contract.methods.getVoterDetails(tokenId).call()

      setVoterDetails({
        userId: details[0],
        name: details[1],
        dateOfBirth: details[2],
        addressDetails: details[3],
        aadhaarNumber: details[4],
        email: details[5],
        phoneNumber: details[6],
        profilePictureUrl: details[7],
      })

      setFormData((prevState) => ({
        ...prevState,
        basicInfo: {
          ...prevState.basicInfo,
          name: details[1],
        },
        additionalInfo: {
          ...prevState.additionalInfo,
          contactInfo: `Email: ${details[5]}, Phone: ${details[6]}`,
        },
      }))
    } catch (error) {
      console.error("Error fetching voter details:", error)
      toast.error("Failed to fetch voter details")
    }
  }

  const checkCandidateRegistration = async () => {
    if (!candidateContract || !account) return

    try {
      const isRegistered = await candidateContract.methods.isRegisteredCandidate(account).call()
      setIsRegistered(isRegistered)

      if (isRegistered) {
        const basicInfo = await candidateContract.methods.getCandidateBasicInfo(account).call()
        const additionalInfo = await candidateContract.methods.getCandidateAdditionalInfo(account).call()
        const metadata = await candidateContract.methods.getCandidateMetadata(account).call()

        setCandidateDetails({
          basicInfo,
          additionalInfo,
          walletAddress: metadata.walletAddress,
          registrationTimestamp: Number(metadata.registrationTimestamp),
          isRegistered: metadata.isRegistered,
          ipfsHash: metadata.ipfsHash,
        })
      }
    } catch (error) {
      console.error("Error checking candidate registration:", error)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prevState) => ({
      ...prevState,
      basicInfo: {
        ...prevState.basicInfo,
        [name]: value,
      },
      additionalInfo: {
        ...prevState.additionalInfo,
        [name]: value,
      },
    }))
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target
    if (files && files[0]) {
      const file = files[0]
      const formData = new FormData()
      formData.append("file", file)

      try {
        const response = await fetch("/api/upload-to-ipfs", {
          method: "POST",
          body: formData,
        })
        const { ipfsHash } = await response.json()
        const ipfsUrl = `https://ipfs.io/ipfs/${ipfsHash}`

        setFormData((prevState) => ({
          ...prevState,
          additionalInfo: {
            ...prevState.additionalInfo,
            [name]: ipfsUrl,
          },
        }))
      } catch (error) {
        console.error("Error uploading file to IPFS:", error)
        toast.error("Failed to upload file")
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!candidateContract || !account) return

    setIsLoading(true)
    try {
      const ipfsHash = await pinJSONToIPFS(formData)

      // Store CID in the JSON file
      await axios.post("/api/candidate-cids", { cid: ipfsHash, address: account })

      await candidateContract.methods
        .registerCandidate(formData.basicInfo, formData.additionalInfo, ipfsHash)
        .send({ from: account })

      toast.success("Successfully registered as a candidate!")
      checkCandidateRegistration()
    } catch (error) {
      console.error("Error registering candidate:", error)
      toast.error("Failed to register as candidate")
    } finally {
      setIsLoading(false)
    }
  }

  if (!account) {
    return (
      <>
        <Header />
        <main className="container mx-auto px-4 py-8">
          <p className="text-center text-red-500">Please connect your wallet to register as a candidate.</p>
        </main>
      </>
    )
  }

  if (!voterDetails) {
    return (
      <>
        <Header />
        <main className="container mx-auto px-4 py-8">
          <p className="text-center text-red-500">
            You must be registered as a voter before registering as a candidate.
          </p>
        </main>
      </>
    )
  }

  return (
    <>
      <Header />
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="relative bg-primary py-20 text-white overflow-hidden">
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
          <div className="container mx-auto px-4 relative">
            <div className="flex flex-col md:flex-row items-center justify-between gap-12">
              <div className="flex-1 space-y-6">
                <div className="space-y-4">
                  <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                    Become a <span className="text-secondary">Candidate</span>
                  </h1>
                  <p className="text-xl md:text-2xl text-gray-200">Register as a candidate and make a difference</p>
                </div>
                <div className="flex gap-4">
                  <Link href="#registration-form">
                    <Button size="lg" className="bg-secondary hover:bg-secondary-hover">
                      Register Now <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/vote">
                    <Button size="lg" variant="outline" className="text-secondary border-white hover:bg-white/10">
                      Go to Voting
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex-1 flex justify-center">
                <div className="relative w-72 h-72">
                  <Image src="/QB.png" alt="QB Vote Logo" fill className="object-contain" priority />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-primary">Why Become a Candidate?</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="border-2 border-gray-100 hover:border-secondary transition-colors">
                <CardHeader>
                  <ShieldCheck className="h-12 w-12 text-secondary mb-4" />
                  <CardTitle>Secure Platform</CardTitle>
                  <CardContent>Your candidacy is protected by blockchain technology</CardContent>
                </CardHeader>
              </Card>
              <Card className="border-2 border-gray-100 hover:border-secondary transition-colors">
                <CardHeader>
                  <Users className="h-12 w-12 text-secondary mb-4" />
                  <CardTitle>Reach Voters</CardTitle>
                  <CardContent>Connect with your constituency through our platform</CardContent>
                </CardHeader>
              </Card>
              <Card className="border-2 border-gray-100 hover:border-secondary transition-colors">
                <CardHeader>
                  <FileText className="h-12 w-12 text-secondary mb-4" />
                  <CardTitle>Transparent Process</CardTitle>
                  <CardContent>Ensure a fair and open electoral process for all</CardContent>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        {/* Registration Form Section */}
        <section id="registration-form" className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-primary mb-4">Candidate Registration</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Fill out the form below to register as a candidate. Your information will be securely stored and
                verified.
              </p>
            </div>
            <Card className="max-w-4xl mx-auto">
              <CardContent>
                {isRegistered && candidateDetails ? (
                  <Tabs defaultValue="profile" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="profile">Profile</TabsTrigger>
                      <TabsTrigger value="details">Details</TabsTrigger>
                    </TabsList>
                    <TabsContent value="profile" className="space-y-6">
                      <div className="flex flex-col items-center space-y-4">
                        <Avatar className="w-32 h-32">
                          <AvatarImage src={candidateDetails.additionalInfo.candidateImageUrl} />
                          <AvatarFallback>{candidateDetails.basicInfo.name[0]}</AvatarFallback>
                        </Avatar>
                        <h2 className="text-2xl font-bold">{candidateDetails.basicInfo.name}</h2>
                        <p className="text-lg">Candidate ID: {candidateDetails.basicInfo.candidateId}</p>
                        <div className="flex items-center space-x-4">
                          <Avatar className="w-16 h-16">
                            <AvatarImage src={candidateDetails.additionalInfo.partySymbolUrl} />
                            <AvatarFallback>PS</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold">{candidateDetails.basicInfo.partyName}</p>
                            <p className="text-sm text-gray-500">
                              {candidateDetails.basicInfo.isIndependent ? "Independent" : "Party Candidate"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                    <TabsContent value="details" className="space-y-6">
                      <div className="grid gap-6">
                        <div>
                          <h3 className="font-semibold mb-2">Manifesto & Future Plans</h3>
                          <p className="text-gray-700">{candidateDetails.basicInfo.manifesto}</p>
                        </div>
                        <div>
                          <h3 className="font-semibold mb-2">Ambitions & Goals</h3>
                          <p className="text-gray-700">{candidateDetails.basicInfo.ambitionsAndGoals}</p>
                        </div>
                        <div>
                          <h3 className="font-semibold mb-2">Experience & Qualifications</h3>
                          <p className="text-gray-700">{candidateDetails.additionalInfo.experience}</p>
                        </div>
                        <div>
                          <h3 className="font-semibold mb-2">Past Achievements</h3>
                          <p className="text-gray-700">{candidateDetails.additionalInfo.pastAchievements}</p>
                        </div>
                        <div>
                          <h3 className="font-semibold mb-2">Contact Information</h3>
                          <p className="text-gray-700">{candidateDetails.additionalInfo.contactInfo}</p>
                        </div>
                        <div>
                          <h3 className="font-semibold mb-2">Social Media Links</h3>
                          <p className="text-gray-700">{candidateDetails.additionalInfo.socialMediaLinks}</p>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                      {/* Voter Details Section */}
                      <div className="col-span-2">
                        <h3 className="text-lg font-semibold mb-4">Voter Details</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Name</Label>
                            <Input value={voterDetails?.name} disabled />
                          </div>
                          <div>
                            <Label>Email</Label>
                            <Input value={voterDetails?.email} disabled />
                          </div>
                          <div>
                            <Label>Phone</Label>
                            <Input value={voterDetails?.phoneNumber} disabled />
                          </div>
                          <div>
                            <Label>Voter ID</Label>
                            <Input value={voterDetails?.userId} disabled />
                          </div>
                        </div>
                      </div>

                      {/* Party Information */}
                      <div className="col-span-2">
                        <h3 className="text-lg font-semibold mb-4">Party Information</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex items-center space-x-2">
                            <Switch
                              id="independent"
                              checked={formData.basicInfo.isIndependent}
                              onCheckedChange={(checked: boolean) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  basicInfo: { ...prev.basicInfo, isIndependent: checked },
                                }))
                              }
                            />
                            <Label htmlFor="independent">Independent Candidate</Label>
                          </div>
                          {!formData.basicInfo.isIndependent && (
                            <div>
                              <Label>Party Name</Label>
                              <Input
                                name="partyName"
                                value={formData.basicInfo.partyName}
                                onChange={handleInputChange}
                                required={!formData.basicInfo.isIndependent}
                              />
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Manifesto & Goals */}
                      <div className="col-span-2">
                        <Label>Manifesto / Future Plans</Label>
                        <Textarea
                          name="manifesto"
                          value={formData.basicInfo.manifesto}
                          onChange={handleInputChange}
                          required
                          className="h-32"
                        />
                      </div>

                      <div className="col-span-2">
                        <Label>Ambitions & Goals</Label>
                        <Textarea
                          name="ambitionsAndGoals"
                          value={formData.basicInfo.ambitionsAndGoals}
                          onChange={handleInputChange}
                          required
                          className="h-32"
                        />
                      </div>

                      {/* Experience & Achievements */}
                      <div>
                        <Label>Experience & Qualifications</Label>
                        <Textarea
                          name="experience"
                          value={formData.additionalInfo.experience}
                          onChange={handleInputChange}
                          required
                          className="h-32"
                        />
                      </div>

                      <div>
                        <Label>Past Achievements</Label>
                        <Textarea
                          name="pastAchievements"
                          value={formData.additionalInfo.pastAchievements}
                          onChange={handleInputChange}
                          required
                          className="h-32"
                        />
                      </div>

                      {/* Contact & Social Media */}
                      <div>
                        <Label>Contact Information</Label>
                        <Textarea
                          name="contactInfo"
                          value={formData.additionalInfo.contactInfo}
                          onChange={handleInputChange}
                          required
                        />
                      </div>

                      <div>
                        <Label>Social Media Links</Label>
                        <Textarea
                          name="socialMediaLinks"
                          value={formData.additionalInfo.socialMediaLinks}
                          onChange={handleInputChange}
                          required
                        />
                      </div>

                      {/* Images */}
                      <div>
                        <Label>Candidate Picture</Label>
                        <Input
                          type="file"
                          name="candidateImageUrl"
                          onChange={handleFileChange}
                          accept="image/*"
                          required
                        />
                      </div>

                      <div>
                        <Label>Party Symbol</Label>
                        <Input
                          type="file"
                          name="partySymbolUrl"
                          onChange={handleFileChange}
                          accept="image/*"
                          required={!formData.basicInfo.isIndependent}
                        />
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button type="submit" disabled={isLoading}>
                        {isLoading ? "Registering..." : "Register as Candidate"}
                      </Button>
                    </div>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-primary py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-white mb-6">Ready to Lead?</h2>
            <p className="text-gray-200 mb-8 max-w-2xl mx-auto">
              By registering as a candidate, you're taking the first step towards making a real impact in your
              community.
            </p>
            <div className="flex justify-center gap-4">
              <Link href="#registration-form">
                <Button size="lg" className="bg-secondary hover:bg-secondary-hover">
                  Register Now
                </Button>
              </Link>
              <Link href="/">
                <Button size="lg" variant="outline" className="text-secondary border-white hover:bg-white/10">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}

