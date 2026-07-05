"use client"

import { createAuthClient } from "better-auth/react"
import { usernameClient } from "better-auth/client/plugins"
import { useState, useEffect } from "react"

export const authClient = createAuthClient({
  plugins: [usernameClient()],
})

type SessionUser = {
  id: string
  email: string
  name: string | null
  username: string | null
  image: string | null
  role: string
  label: string
}

export function useAuth() {
  const [user, setUser] = useState<SessionUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function fetchSession() {
      try {
        const { data } = await authClient.getSession()
        if (!cancelled) {
          if (data?.user) {
            setUser({
              id: data.user.id,
              email: data.user.email,
              name: data.user.name ?? null,
              username: data.user.username ?? null,
              image: data.user.image ?? null,
              role: (data.user as any).role || "user",
              label: (data.user as any).label || data.user.name || data.user.username || data.user.email,
            })
          } else {
            setUser(null)
          }
        }
      } catch {
        if (!cancelled) setUser(null)
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    fetchSession()
    return () => { cancelled = true }
  }, [])

  return {
    user,
    isAuthenticated: !!user && !isLoading,
    isLoading,
    login: async (username: string, password: string) => {
      const { error } = await authClient.signIn.username({ username, password })
      return !error
    },
    logout: () => authClient.signOut(),
  }
}

export type AuthUser = SessionUser
