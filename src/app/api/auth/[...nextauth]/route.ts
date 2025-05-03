import { prisma } from '@/lib/prisma'
import { getUserSession } from '@/lib/session'
import { NextAuthOptions } from 'next-auth'
import NextAuth from 'next-auth/next'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!

const authOption: NextAuthOptions = {
  session: {
    strategy: 'jwt',
  },
  providers: [
    GoogleProvider({
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const res = await fetch(`${process.env.NEXTAUTH_URL}/api/auth/login`, {
          method: 'POST',
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(credentials),
        })

        const user = await res.json()

        if (res.ok && user) {
          return user
        }
        return null
      },
    }),
  ],
  pages: {
    signIn: "/sign-in",
  },
  callbacks: {
    async signIn({ account, profile }) {
      if (account?.provider === 'google') {
        if (!profile?.email) throw new Error('No profile')

        await prisma.user.upsert({
          where: { email: profile.email },
          create: { email: profile.email, name: profile.name },
          update: { name: profile.name },
        })
      }

      return true
    },
    async session({ session }) {
      const userSession = await getUserSession()
      session.user = userSession || {}
      return session
    },
    async jwt({ token, user, profile }) {
      if (profile?.email) {
        const existingUser = await prisma.user.findUnique({
          where: { email: profile.email },
        })
        if (!existingUser) throw new Error('No user found')
        token.id = existingUser.id
      }

      if (user) {
        token.id = (user as { id: string }).id
      }

      return token
    },
  },
}

const handler = NextAuth(authOption)
export { handler as GET, handler as POST }
