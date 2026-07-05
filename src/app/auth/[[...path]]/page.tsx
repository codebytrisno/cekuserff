"use client"

import { useRouter } from "next/navigation"
import { use, useEffect } from "react"
import { SignInView } from "../sign-in"
import { notFound } from "next/navigation"

const VIEWS = ["sign-in"] as const

export default function AuthPage({ params }: { params: Promise<{ path?: string[] }> }) {
  const router = useRouter()
  const { path } = use(params)

  useEffect(() => {
    if (!path || path.length === 0) {
      router.replace("/auth/sign-in")
    }
  }, [path, router])

  if (!path || path.length === 0) return null

  const view = path[0]

  if (!VIEWS.includes(view as any)) {
    notFound()
  }

  return <SignInView />
}
