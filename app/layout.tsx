import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Robin Thomas | Entrepreneur | IT & Cybersecurity Consultant | DevOps & Cloud Specialist",
  description: "GRC & Cybersecurity Consultant, DevOps & Cloud Specialist, System Architect, and Business Consultant. Co-founder of Opsbin and Bitstrail.",
  icons: {
    icon: "/robin.ico",
    shortcut: "/robin.ico",
    apple: "/robin.ico",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full`}>
        {children}
      </body>
    </html>
  )
}
