import Link from "next/link"
import Image from "next/image"
import Header from "@/components/Header"
import Results from "@/components/Results"
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"

export default function ResultsPage() {
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
                    Election <span className="text-secondary">Results</span>
                  </h1>
                  <p className="text-xl md:text-2xl text-gray-200">
                    View the latest voting statistics and candidate standings
                  </p>
                </div>
                <div className="flex gap-4">
                  <Link href="#results">
                    <Button size="lg" className="bg-secondary hover:bg-secondary-hover">
                      View Results <ChevronRight className="ml-2 h-4 w-4" />
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
                  <Image
                    src="/QB.png"
                    alt="QB Vote Logo"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-contain"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Results Section */}
        <section id="results" className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-primary mb-4">Current Election Results</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                View the latest standings and voting statistics for the ongoing election.
              </p>
            </div>
            <Results />
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-primary py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-white mb-6">Your Vote Matters</h2>
            <p className="text-gray-200 mb-8 max-w-2xl mx-auto">
              Every vote counts in shaping our future. If you haven't voted yet, make your voice heard!
            </p>
            <div className="flex justify-center gap-4">
              <Link href="/vote">
                <Button size="lg" className="bg-secondary hover:bg-secondary-hover">
                  Cast Your Vote
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

