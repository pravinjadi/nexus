import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: { onboarded: true, username: true, industry: true },
        })
        session.user.onboarded = dbUser?.onboarded ?? false
        session.user.username  = dbUser?.username  ?? null
        session.user.industry  = dbUser?.industry  ?? null
      }
      return session
    },
  },
  pages: { signIn: "/", newUser: "/onboarding" },
})
