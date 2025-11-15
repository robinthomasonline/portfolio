"use client";
import React from "react";
import {
  FaShieldAlt,
  FaNetworkWired,
  FaCloud,
  FaTasks,
  FaCode,
  FaMobileAlt,
} from "react-icons/fa";
import { motion } from "motion/react";

export function ServicesSection() {
  return (
        <section id="services" className="h-screen w-full bg-black overflow-hidden" style={{backgroundColor: 'rgba(74, 144, 226, 0.03)'}}>
      <div className="container mx-auto px-8 py-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="mb-6 text-6xl font-bold gradient-text">
            What I Bring to the Table
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Comprehensive expertise across multiple technology domains
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {servicesItems.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="glass-card p-8 text-center"
            >
              <div className="mb-6 flex items-center gap-4">
                <div className="text-3xl gradient-text">
                  {item.icon}
                </div>
                <h3 className="text-xl font-semibold text-white">{item.title}</h3>
              </div>
              <ul className="space-y-2 text-left">
                {item.skills.map((skill, index) => (
                  <li key={index} className="text-gray-300 text-sm flex items-center">
                    <span className="text-blue-400 mr-2">→</span>
                    {skill}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}


const servicesItems = [
  {
    title: "Infrastructure & Network",
    skills: [
      "System & Server Administration",
      "Network Security & VPN",
      "Firewall & Load Balancing",
      "Network & Infrastructure Security"
    ],
    icon: <FaNetworkWired className="h-6 w-6 text-blue-400" />,
  },
  {
    title: "GRC & Cyber Security",
    skills: [
      "PCI DSS & ISO 27001 Implementation",
      "VAPT & Security Audits",
      "Risk Assessment & Management",
      "Security Monitoring & Operations"
    ],
    icon: <FaShieldAlt className="h-6 w-6 text-red-400" />,
  },
  {
    title: "Cloud & DevOps",
    skills: [
      "AWS, Azure, GCP",
      "Docker, Kubernetes",
      "Ansible, Terraform",
      "CI/CD Implementation"
    ],
    icon: <FaCloud className="h-6 w-6 text-green-400" />,
  },
  {
    title: "Project Management",
    skills: [
      "Agile Methodologies",
      "Risk Assessment",
      "Team Leadership",
      "Strategic Planning"
    ],
    icon: <FaTasks className="h-6 w-6 text-purple-400" />,
  },
  {
    title: "Website Development",
    skills: [
      "Static Website Development",
      "Dynamic Web Applications",
      "CMS Development",
      "E-commerce Solutions"
    ],
    icon: <FaCode className="h-6 w-6 text-orange-400" />,
  },
  {
    title: "Mobile Development",
    skills: [
      "iOS App Development",
      "Android App Development",
      "Cross-Platform Solutions",
      "Progressive Web Apps"
    ],
    icon: <FaMobileAlt className="h-6 w-6 text-cyan-400" />,
  },
];
