"use client"
import { motion } from "motion/react"
import { FaPhoneAlt, FaWhatsapp, FaLinkedin, FaInstagram, FaFacebook, FaGlobe } from "react-icons/fa"

export function BusinessSection() {
  const businesses = [
    {
      name: "UTF Innovations Private Limited (Opsbin)",
      company: "IT Support & Solutions",
      description: "IT Support Services and Solutions Platform. Providing efficient technical support and customer service to small and medium-sized businesses. Specializing in cloud infrastructure, security solutions, and managed IT services.",
      website: "https://opsbin.com",
      phone: "+917510995385",
      logo: "/opsbin.png",
      tech: ["Cloud Infrastructure", "DevOps", "Security", "IT Support", "Managed Services"],
      social: {
        website: "https://opsbin.com",
        phone: "+917510995385",
        phone2: "+13154101309",
        whatsapp: "+917510995385",
        linkedin: "https://www.linkedin.com/company/utf_opsbin",
        instagram: "https://www.instagram.com/opsbin",
        facebook: "https://www.facebook.com/profile.php?id=100076796238177"
      }
    },
    {
      name: "Bitstrail Private Limited",
      company: "Software Development",
      description: "Software Development Company specializing in web and mobile application development, cloud solutions, and product innovation. Delivering cutting-edge technology solutions for businesses worldwide.",
      website: "https://bitstrail.com",
      phone: "+919961605385",
      logo: "/bitstrail.png",
      tech: ["Web Development", "Mobile Apps", "Cloud Solutions", "Product Development", "Digital Innovation"],
      social: {
        website: "https://bitstrail.com",
        phone: "+919961605385",
        whatsapp: "+919961605385",
        linkedin: "https://www.linkedin.com/company/bitstrail",
        instagram: "https://www.instagram.com/bitstrail_com",
        facebook: "https://www.facebook.com/bitstrail1"
      }
    }
  ]

  return (
    <section id="business" className="h-screen w-full bg-black overflow-hidden">
      <div className="container mx-auto px-8 py-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="mb-6 text-6xl font-bold gradient-text">
            What I've Built in Business
        </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Two successful business ventures driving innovation and growth in the field of IT and Software Development.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {businesses.map((business, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              className="glass-card p-8"
            >
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 glass rounded-lg flex items-center justify-center p-2">
                  <img 
                    src={business.logo} 
                    alt={`${business.name} Logo`}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">{business.name}</h3>
                  <p className="text-gray-400 text-sm">{business.company}</p>
                </div>
              </div>

              <p className="text-gray-300 mb-6 leading-relaxed">
                {business.description}
              </p>

              <div className="flex flex-wrap gap-2 mb-6">
                {business.tech.map((tech, techIndex) => (
                  <span 
                    key={techIndex}
                    className="tag"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <div className="flex gap-3">
                <a 
                  href={business.social.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="social-link"
                  title="Website"
                >
                  <FaGlobe className="h-5 w-5" />
                </a>
                <a 
                  href={`tel:${business.social.phone}`}
                  className="social-link"
                  title="Call"
                >
                      <FaPhoneAlt className="h-5 w-5" />
                </a>
                {business.social.phone2 && business.social.phone2.trim() !== "" && (
                  <a 
                    href={`tel:${business.social.phone2}`}
                    className="social-link"
                    title="Call"
                  >
                        <FaPhoneAlt className="h-5 w-5" />
                  </a>
                )}
                <a 
                  href={`https://wa.me/${business.social.whatsapp}`}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="social-link"
                  title="WhatsApp"
                >
                  <FaWhatsapp className="h-5 w-5" />
                </a>
                <a 
                  href={business.social.linkedin} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="social-link"
                  title="LinkedIn"
                >
                  <FaLinkedin className="h-5 w-5" />
                </a>
                <a 
                  href={business.social.instagram} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="social-link"
                  title="Instagram"
                >
                  <FaInstagram className="h-5 w-5" />
                </a>
                <a 
                  href={business.social.facebook} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="social-link"
                  title="Facebook"
                >
                  <FaFacebook className="h-5 w-5" />
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
