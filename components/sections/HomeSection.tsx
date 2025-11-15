"use client"
import { Button } from "@/components/ui/button"
import { useState, useEffect, useRef } from "react"
import { FaPhoneAlt, FaEnvelope, FaLinkedin, FaWhatsapp, FaAward, FaUsers, FaBriefcase, FaTools } from "react-icons/fa"

export function HomeSection() {
  const [currentText, setCurrentText] = useState(0)
  const [displayText, setDisplayText] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)

  const texts = [
    "GRC & Cybersecurity Consultant",
    "DevOps & Cloud Specialist", 
    "System Architect",
    "IT & Infrastructure Expert",
    "Business Consultant",
    "Software Developer"
  ]

  const highlights = [
    { number: 9, suffix: "+", label: "Years of Experience", icon: FaAward },
    { number: 50, suffix: "+", label: "Projects Completed", icon: FaBriefcase },
    { number: 100, suffix: "+", label: "Tools & Technologies", icon: FaTools },
    { number: 40, suffix: "+", label: "Happy Clients", icon: FaUsers },
  ]

  // Count-up animation hook
  const useCountUp = (end: number, duration: number = 2000, start: number = 0, delay: number = 0) => {
    const [count, setCount] = useState(start)
    const [isVisible, setIsVisible] = useState(false)
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && !isVisible) {
            setIsVisible(true)
          }
        },
        { threshold: 0.1 }
      )

      if (ref.current) {
        observer.observe(ref.current)
      }

      return () => observer.disconnect()
    }, [isVisible])

    useEffect(() => {
      if (!isVisible) return

      const startAnimation = () => {
        let startTime: number
        const animate = (currentTime: number) => {
          if (!startTime) startTime = currentTime
          const progress = Math.min((currentTime - startTime) / duration, 1)
          
          // Easing function for smooth animation
          const easeOutQuart = 1 - Math.pow(1 - progress, 4)
          const currentCount = Math.floor(start + (end - start) * easeOutQuart)
          
          setCount(currentCount)

          if (progress < 1) {
            requestAnimationFrame(animate)
          }
        }

        requestAnimationFrame(animate)
      }

      if (delay > 0) {
        const timeout = setTimeout(startAnimation, delay)
        return () => clearTimeout(timeout)
      } else {
        startAnimation()
      }
    }, [isVisible, end, duration, start, delay])

    return { count, ref }
  }

  useEffect(() => {
    const typeSpeed = isDeleting ? 50 : 100
    const pauseTime = 2000

    const timeout = setTimeout(() => {
      const current = texts[currentText]
      
      if (!isDeleting && displayText === current) {
        setTimeout(() => setIsDeleting(true), pauseTime)
      } else if (isDeleting && displayText === "") {
        setIsDeleting(false)
        setCurrentText((prev) => (prev + 1) % texts.length)
      } else {
        setDisplayText(isDeleting 
          ? current.substring(0, displayText.length - 1)
          : current.substring(0, displayText.length + 1)
        )
      }
    }, typeSpeed)

    return () => clearTimeout(timeout)
  }, [displayText, isDeleting, currentText, texts])

  return (
    <section id="home" className="relative h-screen w-full bg-black overflow-hidden">
      <div className="flex h-full flex-col px-16 pt-20">
        <div className="max-w-4xl">
          <div className="text-2xl text-white mb-6 font-medium">
            Hey! I'm
          </div>
          <h1 className="mb-8 text-8xl font-bold gradient-text leading-tight">
            Robin Thomas
          </h1>
          <div className="mb-10 text-3xl text-white flex items-center gap-2">
            <span className="text-white font-medium">I am a </span>
            <span className="text-blue-400 font-semibold">
              {displayText}
              <span className="animate-pulse">|</span>
            </span>
          </div>
          
          <div className="mb-2 flex flex-wrap gap-4">
            <span className="tag">Infrastructure & Network</span>
            <span className="tag">Cloud & DevOps</span>
            <span className="tag">Security & Compliance</span>
            <span className="tag">IT Management</span>
          </div>

          <div className="mb-10 flex flex-wrap gap-4">
            <span className="tag">Business Consulting</span>
            <span className="tag">Software Development</span>
            <span className="tag">IT Support</span>
            <span className="tag">Cloud Services</span>
          </div>


          <div className="flex gap-4 mb-10">
            <a href="tel:+61423453240" className="social-link">
              <FaPhoneAlt className="h-5 w-5" />
            </a>
            <a href="https://wa.me/qr/PEQ7J2OHI2JPC1" target="_blank" className="social-link">
              <FaWhatsapp className="h-5 w-5" />
            </a>
            <a href="https://linkedin.com/in/robinthomasonline" target="_blank" className="social-link">
              <FaLinkedin className="h-5 w-5" />
            </a>
            <a href="mailto:robinthomasonline@gmail.com" className="social-link">
              <FaEnvelope className="h-5 w-5" />
            </a>
          </div>

        </div>

        {/* Fun Facts - Fully Fluid at Bottom */}
        <div className="flex-1 flex items-end pb-8">
          <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-6">
            {highlights.map((highlight, index) => {
              const { count, ref } = useCountUp(highlight.number, 2000, 0, index * 200)
              return (
                <div key={index} className="glass-card text-center p-4">
                  <div className="flex justify-center mb-2">
                    <highlight.icon className="h-6 w-6 gradient-text" />
                  </div>
                  <div ref={ref} className="text-4xl font-bold text-white mb-2">
                    {count}{highlight.suffix}
                  </div>
                  <div className="text-gray-300 text-sm">
                    {highlight.label}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
