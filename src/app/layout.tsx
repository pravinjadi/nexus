import type { Metadata } from "next"
import { DM_Sans, Fraunces } from "next/font/google"
import "./globals.css"
import { Toaster } from "sonner"

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600"],
})

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["300", "400"],
  style: ["normal", "italic"],
})

export const metadata: Metadata = {
  title: "Nexus — your social presence, one card at a time",
  description: "Share all your social profiles through beautiful, swipeable QR cards.",
  openGraph: {
    title: "Nexus",
    description: "Share all your social profiles through beautiful, swipeable QR cards.",
    type: "website",
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${dmSans.variable} ${fraunces.variable}`}>
      <body>
        {children}
        <Toaster
          position="bottom-center"
          toastOptions={{
            style: {
              fontFamily: "var(--font-sans)",
              fontSize: "13px",
              borderRadius: "100px",
            },
          }}
        />
      </body>
    </html>
  )
}
