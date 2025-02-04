import Link from "next/link"
import Image from "next/image"
import Header from "@/components/Header"
import VoterRegistration from "@/components/VoterRegistration"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronRight, ShieldCheck, Users, ClipboardCheck } from "lucide-react"

export default function VoterRegistrationPage() {
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
                    Register to <span className="text-secondary">Vote</span>
                  </h1>
                  <p className="text-xl md:text-2xl text-gray-200">Join our secure and transparent voting system</p>
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
            <h2 className="text-3xl font-bold text-center mb-12 text-primary">Why Register with QB Vote?</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="border-2 border-gray-100 hover:border-secondary transition-colors">
                <CardHeader>
                  <ShieldCheck className="h-12 w-12 text-secondary mb-4" />
                  <CardTitle>Secure Registration</CardTitle>
                  <CardContent>Your personal information is protected with state-of-the-art encryption</CardContent>
                </CardHeader>
              </Card>
              <Card className="border-2 border-gray-100 hover:border-secondary transition-colors">
                <CardHeader>
                  <Users className="h-12 w-12 text-secondary mb-4" />
                  <CardTitle>Easy Process</CardTitle>
                  <CardContent>Simple and quick registration process that takes only a few minutes</CardContent>
                </CardHeader>
              </Card>
              <Card className="border-2 border-gray-100 hover:border-secondary transition-colors">
                <CardHeader>
                  <ClipboardCheck className="h-12 w-12 text-secondary mb-4" />
                  <CardTitle>Verified Identity</CardTitle>
                  <CardContent>Ensure the integrity of the voting process with verified voter identities</CardContent>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        {/* Registration Form Section */}
        <section id="registration-form" className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-primary mb-4">Register to Vote</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Complete the form below to register as a voter. Your information will be securely stored and verified.
              </p>
            </div>
            <VoterRegistration />
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-primary py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-white mb-6">Ready to Participate in Democracy?</h2>
            <p className="text-gray-200 mb-8 max-w-2xl mx-auto">
              By registering to vote, you're taking an important step in shaping the future of your community and
              country.
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

