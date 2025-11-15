"use client"
import { motion } from "motion/react"
import { FaEnvelope, FaPhoneAlt, FaWhatsapp, FaLinkedin, FaFacebook, FaInstagram } from "react-icons/fa"

export function ContactSection() {
  const contactItems = [
    {
      type: "Personal",
      value: "robinthomasonline@gmail.com",
      href: "mailto:robinthomasonline@gmail.com",
      icon: FaEnvelope,
      color: "text-blue-400"
    },
    {
      type: "Opsbin",
      value: "robin@opsbin.com",
      href: "mailto:robin@opsbin.com",
      icon: FaEnvelope,
      color: "text-green-400"
    },
    {
      type: "Bitstrail",
      value: "robin@bitstrail.com",
      href: "mailto:robin@bitstrail.com",
      icon: FaEnvelope,
      color: "text-purple-400"
    },
    {
      type: "Phone India",
      value: "+919746995385",
      href: "tel:+919746995385",
      icon: FaPhoneAlt,
      color: "text-orange-400"
    },
    {
      type: "Phone Australia",
      value: "+61423453240",
      href: "tel:+61423453240",
      icon: FaPhoneAlt,
      color: "text-cyan-400"
    },
    {
      type: "WhatsApp",
      value: "Start Conversation",
      href: "https://wa.me/qr/PEQ7J2OHI2JPC1",
      icon: FaWhatsapp,
      color: "text-green-400"
    },
    {
      type: "LinkedIn",
      value: "robinthomasonline",
      href: "https://linkedin.com/in/robinthomasonline",
      icon: FaLinkedin,
      color: "text-blue-400"
    },
    {
      type: "Facebook",
      value: "robinthomasonline",
      href: "https://facebook.com/robinthomasonline",
      icon: FaFacebook,
      color: "text-blue-500"
    },
    {
      type: "Instagram",
      value: "robinthomasonline",
      href: "https://instagram.com/robinthomasonline",
      icon: FaInstagram,
      color: "text-pink-400"
    }
  ]

  return (
    <section id="contact" className="h-screen w-full bg-black overflow-y-auto">
      <div className="container mx-auto px-8 py-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="mb-6 text-6xl font-bold gradient-text">
            Let's Chat
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Ready to work together? Get in touch through any of these channels
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {contactItems.map((item, index) => (
            <motion.a
              key={index}
              href={item.href}
              target={item.href.startsWith('http') ? '_blank' : undefined}
              rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group glass-card p-6 hover:scale-105"
            >
              <div className="flex items-center space-x-4">
                <div className="p-3 glass rounded-lg group-hover:bg-white/20 transition-colors">
                  <item.icon className="h-6 w-6 gradient-text" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white group-hover:text-blue-300 transition-colors">
                    {item.type}
                  </h3>
                  <p className="text-gray-300 text-sm">{item.value}</p>
                </div>
              </div>
            </motion.a>
          ))}
        </div>

      </div>
    </section>
  )
}
