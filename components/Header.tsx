"use client"

import type React from "react"
import Link from "next/link"
import Image from "next/image"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { useWeb3 } from "@/contexts/Web3Context"
import { Button } from "@/components/ui/button"
import { Home, UserPlus, ClipboardList, Vote, BarChart2, User } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

const Header: React.FC = () => {
  const { isSepoliaNetwork, switchToSepolia } = useWeb3()

  return (
    <header className="bg-primary text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3">
            <Image src="/QB.png" alt="QB Vote Logo" width={40} height={40} className="rounded-full" />
            <span className="text-2xl font-bold">QB Vote</span>
          </Link>

          <nav className="flex-1 px-8">
            <ul className="flex justify-center space-x-8">
              <NavItem href="/" icon={<Home className="w-5 h-5" />} text="Home" />
              <NavItem href="/voter-registration" icon={<UserPlus className="w-5 h-5" />} text="Register" />
              <NavItem href="/register-candidate" icon={<ClipboardList className="w-5 h-5" />} text="Candidates" />
              <NavItem href="/vote" icon={<Vote className="w-5 h-5" />} text="Vote" />
              <NavItem href="/results" icon={<BarChart2 className="w-5 h-5" />} text="Results" />
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
            <Link href="/profile" className="hover:text-secondary transition-colors rounded-full p-2 hover:opacity-80">
              <Avatar className="h-10 w-10 border-2 border-white/50">
                <AvatarFallback className="bg-gradient-to-r from-[#38BDF8] via-[#86EFAC] to-[#4ADE80] text-white">
                  <User className="w-6 h-6" />
                </AvatarFallback>
              </Avatar>
              <span className="sr-only">Profile</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}

const NavItem: React.FC<{ href: string; icon: React.ReactNode; text: string }> = ({ href, icon, text }) => (
  <li>
    <Link href={href} className="flex items-center space-x-2 hover:text-secondary transition-colors">
      {icon}
      <span>{text}</span>
    </Link>
  </li>
)

export default Header

