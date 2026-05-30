'use client'

import { signOut } from 'next-auth/react'

export default function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: '/login' })}
      className="text-sm text-slate-500 hover:text-slate-900 transition-colors"
    >
      Выйти
    </button>
  )
}
