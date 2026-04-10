// Extend the default NextAuth session types
import "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      onboarded?: boolean
      username?: string | null
      industry?: string | null
    }
  }
}
