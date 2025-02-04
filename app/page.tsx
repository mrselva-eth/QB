import Link from "next/link"
import Image from "next/image"
import Header from "@/components/Header"
import CandidateList from "@/components/CandidateList"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronRight, ShieldCheck, Users, BarChart3 } from "lucide-react"

export default function Home() {
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
                    Welcome to <span className="text-secondary">QB Vote</span>
                  </h1>
                  <p className="text-xl md:text-2xl text-gray-200">
                    A Secure and Transparent Blockchain-Based Voting System
                  </p>
                </div>
                <div className="flex gap-4">
                  <Link href="/voter-registration">
                    <Button size="lg" className="bg-secondary hover:bg-secondary-hover">
                      Register to Vote <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/vote">
                    <Button size="lg" variant="outline" className="text-secondary border-white hover:bg-white/10">
                      Cast Your Vote
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
            <h2 className="text-3xl font-bold text-center mb-12 text-primary">Why Choose QB Vote?</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="border-2 border-gray-100 hover:border-secondary transition-colors">
                <CardHeader>
                  <ShieldCheck className="h-12 w-12 text-secondary mb-4" />
                  <CardTitle>Secure Voting</CardTitle>
                  <CardDescription>
                    Blockchain technology ensures your vote is secure, immutable, and transparent
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="border-2 border-gray-100 hover:border-secondary transition-colors">
                <CardHeader>
                  <Users className="h-12 w-12 text-secondary mb-4" />
                  <CardTitle>Easy Registration</CardTitle>
                  <CardDescription>
                    Simple and quick voter registration process with identity verification
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="border-2 border-gray-100 hover:border-secondary transition-colors">
                <CardHeader>
                  <BarChart3 className="h-12 w-12 text-secondary mb-4" />
                  <CardTitle>Real-time Results</CardTitle>
                  <CardDescription>View election results in real-time with complete transparency</CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        {/* Candidates Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-primary mb-4">Current Candidates</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Meet the candidates participating in the current election. Each candidate has been verified and approved
                to participate in the democratic process.
              </p>
            </div>
            <CandidateList />
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-primary py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-white mb-6">Ready to Make Your Voice Heard?</h2>
            <p className="text-gray-200 mb-8 max-w-2xl mx-auto">
              Join thousands of voters who have already registered to participate in this secure and transparent voting
              process.
            </p>
            <div className="flex justify-center gap-4">
              <Link href="/voter-registration">
                <Button size="lg" className="bg-secondary hover:bg-secondary-hover">
                  Register Now
                </Button>
              </Link>
              <Link href="/results">
                <Button size="lg" variant="outline" className="text-secondary border-white hover:bg-white/10">
                  View Results
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}

