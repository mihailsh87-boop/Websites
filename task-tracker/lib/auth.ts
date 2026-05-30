import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { getSanityWriteClient } from './sanity/client'
import { authConfig } from './auth.config'

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Пароль', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const user = await getSanityWriteClient().fetch(
          `*[_type == "user" && email == $email][0]{ _id, email, passwordHash, role, fullName }`,
          { email: credentials.email }
        )

        if (!user?.passwordHash) return null

        const valid = await bcrypt.compare(credentials.password as string, user.passwordHash)
        if (!valid) return null

        return {
          id: user._id,
          email: user.email,
          name: user.fullName || user.email,
          role: user.role,
        }
      },
    }),
  ],
})

declare module 'next-auth' {
  interface User { role?: string }
  interface Session {
    user: { id: string; email: string; name?: string | null; role: string }
  }
}
