"use client"
import { motion } from "motion/react"
import { FaCalendarAlt, FaBuilding, FaBriefcase } from "react-icons/fa"
import CardSwap, { Card } from "@/components/CardSwap"

export function ExperienceSection() {
  const experiences = [
    {
      title: "Co-Founder & CEO",
      company: "UTF Innovations (Opsbin)",
      duration: "Sep 2022 – Apr 2025",
      color: "from-blue-600 to-blue-800",
      borderColor: "border-blue-500",
      iconColor: "text-blue-400",
      responsibilities: [
        "Provide strategic leadership and direction for the organization",
        "Oversee daily operations and manage technical support teams",
        "Develop strong client relationships and drive business growth",
        "Lead business development and expand service offerings",
        "Ensure compliance with industry standards and regulations"
      ]
    },
    {
      title: "GRC Consultant",
      company: "ValueMentor Infosec Private Limited",
      duration: "Aug 2021 – Jul 2022",
      color: "from-green-600 to-green-800",
      borderColor: "border-green-500",
      iconColor: "text-green-400",
      responsibilities: [
        "Conducted security audits for PCI DSS compliance",
        "Prepared GAP reports, AOC, and ROC for clients",
        "Identified system components and suggested remediation",
        "Provided PCI DSS compliance training to stakeholders",
        "Led security assessments and penetration tests"
      ]
    },
    {
      title: "Head of Internal System/Server Administrator",
      company: "Poornam Info Vision Private Limited",
      duration: "Nov 2019 – Aug 2021",
      color: "from-purple-600 to-purple-800",
      borderColor: "border-purple-500",
      iconColor: "text-purple-400",
      responsibilities: [
        "Led server, workstation, and network security operations",
        "Managed vulnerability assessments and security measures",
        "Supervised security testing and incident response",
        "Directed BCP and DR testing initiatives",
        "Managed infrastructure and server deployments"
      ]
    },
    {
      title: "Internal System/Server Administrator",
      company: "Poornam Info Vision Private Limited",
      duration: "May 2017 – Oct 2019",
      color: "from-orange-600 to-orange-800",
      borderColor: "border-orange-500",
      iconColor: "text-orange-400",
      responsibilities: [
        "Managed Windows and Linux server environments",
        "Implemented backup and disaster recovery solutions",
        "Configured network infrastructure and security protocols",
        "Provided technical support to end users",
        "Maintained system documentation and procedures"
      ]
    },
    {
      title: "Server Administrator",
      company: "Aforeserve.com",
      duration: "Oct 2015 – May 2017",
      color: "from-red-600 to-red-800",
      borderColor: "border-red-500",
      iconColor: "text-red-400",
      responsibilities: [
        "Managed server infrastructure and maintenance",
        "Implemented system monitoring and alerting",
        "Configured network services and protocols",
        "Provided technical support and troubleshooting",
        "Maintained system security and compliance"
      ]
    },
    {
      title: "Technical Support Engineer",
      company: "Team Computers Private Limited",
      duration: "Apr 2015 – Oct 2015",
      color: "from-cyan-600 to-cyan-800",
      borderColor: "border-cyan-500",
      iconColor: "text-cyan-400",
      responsibilities: [
        "Provided first-line technical support to clients",
        "Troubleshot hardware and software issues",
        "Installed and configured computer systems",
        "Maintained IT inventory and asset management",
        "Assisted with network setup and maintenance"
      ]
    }
  ]

  return (
    <section id="experience" className="h-screen w-full bg-black overflow-hidden">
      <div className="h-full w-full relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-16 left-16 z-10"
        >
          <h1 className="mb-4 text-6xl font-bold gradient-text">
            Professional Journey
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl">
            A timeline of my career progression and key achievements
          </p>
        </motion.div>

        <div className="absolute bottom-0 right-0 w-full h-full flex items-center justify-center">
          <div style={{ height: '600px', width: '600px', position: 'relative' }}>
            <CardSwap
              cardDistance={50}
              verticalDistance={60}
              delay={3500}
              pauseOnHover={true}
              width={450}
              height={350}
              skewAmount={4}
            >
              {experiences.map((experience, index) => (
                <Card 
                  key={index} 
                  customClass={`bg-gradient-to-br ${experience.color} ${experience.borderColor} border-2 shadow-2xl`}
                >
                  <div className="p-6 h-full flex flex-col relative overflow-hidden">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-10">
                      <div className="absolute top-4 right-4 w-20 h-20 rounded-full bg-white/20"></div>
                      <div className="absolute bottom-4 left-4 w-16 h-16 rounded-full bg-white/10"></div>
                    </div>
                    
                    <div className="relative z-10">
                      <div className="flex items-start gap-4 mb-4">
                        <div className={`w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center flex-shrink-0 border ${experience.borderColor}`}>
                          <FaBriefcase className={`h-6 w-6 ${experience.iconColor}`} />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-white mb-1 leading-tight">{experience.title}</h3>
                          <div className="flex items-center gap-2 mb-2">
                            <FaCalendarAlt className={`h-3 w-3 ${experience.iconColor}`} />
                            <span className="text-xs font-medium text-white/90">{experience.duration}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <FaBuilding className="h-3 w-3 text-white/70" />
                            <span className="text-sm text-white/80 font-medium">{experience.company}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex-1 overflow-y-auto">
                        <ul className="space-y-1.5">
                          {experience.responsibilities.map((responsibility, respIndex) => (
                            <li key={respIndex} className="text-white/90 text-xs flex items-start leading-relaxed">
                              <span className={`${experience.iconColor} mr-2 mt-1 font-bold`}>•</span>
                              {responsibility}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </CardSwap>
          </div>
        </div>
      </div>
    </section>
  )
}
