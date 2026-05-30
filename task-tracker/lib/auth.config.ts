import type { NextAuthConfig } from 'next-auth'

// Lightweight config without providers — safe for Edge Runtime (used in middleware)
export const authConfig: NextAuthConfig = {
  session: { strategy: 'jwt' },
  pages: { signIn: '/login' },
  providers: [],
  callbacks: {
    authorized({ auth, request }) {
      const isLoggedIn = !!auth?.user
      const isDashboard = request.nextUrl.pathname.startsWith('/dashboard')
      const isLogin = request.nextUrl.pathname === '/login'

      if (isDashboard && !isLoggedIn) return false
      if (isLogin && isLoggedIn) {
        return Response.redirect(new URL('/dashboard', request.nextUrl))
      }
      return true
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = (user as { role?: string }).role
      }
      return token
    },
    session({ session, token }) {
      session.user.id = token.id as string
      session.user.role = token.role as string
      return session
    },
  },
}
