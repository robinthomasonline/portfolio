"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { HomeSection } from "@/components/sections/HomeSection"
import { AboutSection } from "@/components/sections/AboutSection"
import { ServicesSection } from "@/components/sections/ServicesSection"
import { BusinessSection } from "@/components/sections/BusinessSection"
import { ExperienceSection } from "@/components/sections/ExperienceSection"
import { SkillsSection } from "@/components/sections/SkillsSection"
import { ContactSection } from "@/components/sections/ContactSection"

export default function Home() {
  const [activeSection, setActiveSection] = useState("home")

  const renderSection = () => {
    switch (activeSection) {
      case "home":
        return <HomeSection />
      case "about":
        return <AboutSection />
      case "services":
        return <ServicesSection />
      case "business":
        return <BusinessSection />
      case "experience":
        return <ExperienceSection />
      case "skills":
        return <SkillsSection />
      case "contact":
        return <ContactSection />
      default:
        return <HomeSection />
    }
  }

  return (
    <div className="flex h-screen w-full">
      <Sidebar 
        activeSection={activeSection} 
        onSectionChange={setActiveSection} 
      />
      <main className="flex-1 overflow-hidden">
        {renderSection()}
      </main>
    </div>
  )
}
