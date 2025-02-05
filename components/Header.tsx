"use client"

import type React from "react"
import Link from "next/link"
import Image from "next/image"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { useWeb3 } from "@/contexts/Web3Context"
import { Button } from "@/components/ui/button"

const Header: React.FC = () => {
  const { isSepoliaNetwork, switchToSepolia } = useWeb3()

  return (
    <header className="bg-primary text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-3">
            <Image src="/QB.png" alt="QB Vote Logo" width={40} height={40} className="rounded-full" />
            <span className="text-2xl font-bold">QB Vote</span>
          </Link>
          <nav className="hidden md:block">
            <ul className="flex space-x-8">
              <li>
                <Link href="/voter-registration" className="hover:text-secondary transition-colors">
                  Voter Registration
                </Link>
              </li>
              <li>
                <Link href="/register-candidate" className="hover:text-secondary transition-colors">
                  Candidate Registration
                </Link>
              </li>
              <li>
                <Link href="/vote" className="hover:text-secondary transition-colors">
                  Vote
                </Link>
              </li>
              <li>
                <Link href="/results" className="hover:text-secondary transition-colors">
                  Results
                </Link>
              </li>
            </ul>
          </nav>
          <div className="flex items-center space-x-4">
            {!isSepoliaNetwork && (
              <Button
                onClick={switchToSepolia}
                variant="secondary"
                className="bg-secondary hover:bg-secondary-hover text-white"
              >
                Switch to Sepolia
              </Button>
            )}
            <ConnectButton />
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header

