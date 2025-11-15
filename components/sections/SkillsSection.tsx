"use client"
import { motion } from "motion/react"

export function SkillsSection() {
  const skillCategories = [
    {
      title: "Cloud & DevOps",
      skills: [
        "AWS", "AWS EC2", "Azure", "GCP", "Google Compute Engine", "OpenStack", 
        "DigitalOcean", "Linode", "Docker", "Kubernetes", "Jenkins", "GitLab CI", 
        "GitHub Actions", "Terraform", "Ansible", "Infrastructure as Code", 
        "Bash", "Python", "Shell Scripting", "Cron Jobs", "Make.com"
      ],
      direction: "left"
    },
    {
      title: "Security & Network",
      skills: [
        "PCI DSS", "ISO 27001", "VAPT", "SIEM", "WAF", "IDS/IPS", "Nessus", 
        "Burp Suite", "Metasploit", "OWASP ZAP", "Nmap", "Wireshark", "pfSense", 
        "OPNsense", "FortiGate", "Cisco ASA", "iptables", "CSF", "UFW", 
        "ModSecurity", "Fail2ban", "Snort", "OSINT Tools", "VLANs", 
        "SSH Key Management", "Google SSO", "MFA/OTP", "AAA", "IAM"
      ],
      direction: "right"
    },
    {
      title: "Infrastructure & Servers",
      skills: [
        "Linux", "Ubuntu", "CentOS", "RHEL", "Debian", "Windows", "Windows Server", 
        "VMware ESXi", "Proxmox", "KVM", "Xen", "Apache", "Nginx", "OpenLiteSpeed", 
        "IIS", "HAProxy", "Varnish", "LXC/LXD", "Load Balancers", "High Availability", 
        "Failover Systems", "Postfix", "Dovecot", "BIND", "DHCP", "Asterisk", 
        "3CX", "Proxy Servers"
      ],
      direction: "left"
    },
    {
      title: "Databases & Monitoring",
      skills: [
        "MySQL", "PostgreSQL", "MongoDB", "Redis", "MariaDB", "MSSQL", "Supabase", 
        "Firebase", "Nagios", "Zabbix", "Grafana", "Prometheus", "ELK Stack", 
        "Rsnapshot", "Automysqlbackup", "Barracuda Backup", "HP Data Protector"
      ],
      direction: "right"
    },
    {
      title: "Tools & Services",
      skills: [
        "Git", "GitHub", "GitLab", "SVN", "Trello", "Zoho", "G Suite", 
        "Microsoft 365", "OpenLDAP", "S3", "NFS", "SAN", "NAS", "GlusterFS"
      ],
      direction: "left"
    },
    {
      title: "Web & Mobile Development",
      skills: [
        "HTML", "CSS", "JavaScript", "React", "Next.js", "TypeScript", "PHP", 
        "Node.js", "WordPress", "WooCommerce", "Shopify", "Headless CMS", 
        "RESTful APIs", "Tailwind CSS", "React Native", "Expo", "AI Integrations"
      ],
      direction: "right"
    }
  ]

  return (
    <section id="skills" className="h-screen w-full bg-black overflow-y-auto">
      <div className="container mx-auto px-8 py-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="mb-6 text-6xl font-bold gradient-text">
            Tech I Work With
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            A comprehensive range of technologies and tools I've mastered over the years
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {skillCategories.map((category, categoryIndex) => (
            <motion.div
              key={categoryIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: categoryIndex * 0.1 }}
              className="glass-card p-6"
            >
              <h3 className="text-xl font-semibold text-white mb-6 text-center gradient-text">
                {category.title}
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                {category.skills.join(", ")}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-16"
        >
          <div className="glass-card p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4">
              Always Learning
            </h3>
            <p className="text-gray-300">
              Technology evolves rapidly, and so do I. I'm constantly exploring new tools, frameworks, and methodologies to stay at the forefront of innovation.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
