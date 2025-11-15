"use client"
import { motion } from "motion/react"

export function AboutSection() {

  return (
    <section id="about" className="h-screen w-full bg-black overflow-hidden">
      <div className="container mx-auto px-8 py-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="mb-6 text-6xl font-bold gradient-text">
            My Story
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            From curiosity to expertise - my journey in technology and business
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <p className="text-lg text-gray-300 leading-relaxed">
              My journey in technology began with a simple curiosity about how systems work and evolved into a passion for making them more secure and efficient. Over the years, I've transformed this passion into a successful career, helping organizations navigate the complex landscape of IT security and infrastructure management.
            </p>
            
            <p className="text-lg text-gray-300 leading-relaxed">
              What sets me apart is my ability to bridge the gap between technical complexity and business objectives. I don't just implement security measures – I create comprehensive solutions that protect while enabling growth. My expertise in GRC and IT security has helped numerous organizations achieve and maintain compliance with international standards, turning potential vulnerabilities into competitive advantages.
            </p>
            
            <p className="text-lg text-gray-300 leading-relaxed">
              Today, through my businesses Opsbin and Bitstrail, I'm channeling my experience into building innovative solutions that empower businesses. Whether it's providing cutting-edge IT support services or developing transformative software solutions, my goal remains the same: to help organizations thrive in the digital age while maintaining the highest standards of security and efficiency.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
