"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  FaHome,
  FaUser,
  FaBriefcase,
  FaBuilding,
  FaClock,
  FaMicrochip,
  FaEnvelope,
  FaChevronLeft,
  FaChevronRight
} from "react-icons/fa"

const navigation = [
  {
    name: "Home",
    sectionId: "home",
    icon: FaHome,
  },
  {
    name: "About",
    sectionId: "about",
    icon: FaUser,
  },
  {
    name: "Services",
    sectionId: "services",
    icon: FaBriefcase,
  },
  {
    name: "Experience",
    sectionId: "experience",
    icon: FaClock,
  },
  {
    name: "Skills",
    sectionId: "skills",
    icon: FaMicrochip,
  },
  {
    name: "Business",
    sectionId: "business",
    icon: FaBuilding,
  },
  {
    name: "Contact",
    sectionId: "contact",
    icon: FaEnvelope,
  },
]

interface SidebarProps {
  activeSection: string
  onSectionChange: (sectionId: string) => void
}

export function Sidebar({ activeSection, onSectionChange }: SidebarProps) {
  const [isMinimized, setIsMinimized] = useState(false)

  return (
    <div className={cn(
      "flex h-screen flex-col glass text-white transition-all duration-300 z-50",
      isMinimized ? "w-20" : "w-64"
    )}>
      {/* Logo/Brand */}
      <div className={cn(
        "flex flex-col items-center justify-center border-b border-white/10 px-4 relative",
        isMinimized ? "h-24" : "h-40"
      )}>
        <img 
          src="/robin.jpeg" 
          alt="Robin Thomas"
          className={cn(
            "rounded-full object-cover mt-2",
            isMinimized ? "w-12 h-12 mb-2" : "w-24 h-24 mb-3"
          )}
        />
        {!isMinimized && (
          <div className="text-2xl font-bold gradient-text-animated">
            Robin Thomas
          </div>
        )}
        
        {/* Toggle Button */}
        <button
          onClick={() => setIsMinimized(!isMinimized)}
          className="absolute -right-4 top-7 -translate-y-1/2 p-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full hover:bg-white/20 hover:border-white/30 transition-all duration-300 z-50 shadow-lg"
        >
          {isMinimized ? (
            <FaChevronRight className="h-4 w-4 text-white" />
          ) : (
            <FaChevronLeft className="h-4 w-4 text-white" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        {navigation.map((item) => {
          const isActive = activeSection === item.sectionId
          return (
            <button
              key={item.name}
              className={cn(
                "w-full flex items-center text-left rounded-lg transition-all duration-300",
                isMinimized ? "justify-center p-3" : "justify-start p-3",
                isActive
                  ? "bg-white/15 text-white"
                  : "text-gray-300 hover:bg-white/10 hover:text-white"
              )}
              onClick={() => onSectionChange(item.sectionId)}
              title={isMinimized ? item.name : undefined}
            >
              <item.icon className={cn("h-5 w-5", !isMinimized && "mr-3")} />
              {!isMinimized && item.name}
            </button>
          )
        })}
      </nav>

      {/* Footer */}
      {!isMinimized && (
        <div className="border-t border-white/10 p-4">
          <p className="text-xs text-gray-400">
            © 2025 Robin Thomas
          </p>
        </div>
      )}
    </div>
  )
}
