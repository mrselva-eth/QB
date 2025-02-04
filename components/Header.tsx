"use client"

import type React from "react"
import Link from "next/link"
import Image from "next/image"
import { useWeb3 } from "@/contexts/Web3Context"
import { Button } from "@/components/ui/button"
import { UserCircle } from "lucide-react"

const Header: React.FC = () => {
  const { account, connectWallet, switchToSepolia, isSepoliaNetwork } = useWeb3()

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
            {account ? (
              <div className="flex items-center space-x-2">
                <Link href="/profile">
                  <Button variant="ghost" className="p-2 hover:text-secondary">
                    <UserCircle className="h-6 w-6" />
                  </Button>
                </Link>
                <span className="bg-white/10 px-4 py-2 rounded text-sm">
                  {account.slice(0, 6)}...{account.slice(-4)}
                </span>
              </div>
            ) : (
              <Button onClick={connectWallet} className="bg-secondary hover:bg-secondary-hover">
                Connect Wallet
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header

