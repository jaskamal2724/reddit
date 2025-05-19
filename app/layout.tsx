import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ClerkProvider } from "@clerk/nextjs"
import { ThemeProvider } from "@/components/theme-provider"
import Header from "@/components/header"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Reddit Clone",
  description: "A Reddit clone built with Next.js and TypeScript",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html>
        <body>
         
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
              <Header />
              <main className="container mx-auto max-w-7xl pt-16 px-4 sm:px-6">{children}</main>
            </div>
          
        </body>
      </html>
    </ClerkProvider>
  )
}
