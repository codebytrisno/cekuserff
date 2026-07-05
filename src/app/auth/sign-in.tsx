"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { LogIn, Eye, EyeOff, ShieldCheck } from "lucide-react"
import { authClient } from "@/lib/auth-client"

export function SignInView() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!username.trim() || !password.trim()) {
      setError("Isi username dan password")
      return
    }

    setLoading(true)

    const { error: signInError } = await authClient.signIn.username({
      username,
      password,
    })

    setLoading(false)

    if (signInError) {
      setError("Username atau password salah")
      return
    }

    const { data: session } = await authClient.getSession()
    const isAdmin = (session?.user as any)?.role === "admin"
    router.replace(isAdmin ? "/admin" : "/")
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-container/20">
            <ShieldCheck className="h-8 w-8 text-primary-container" />
          </div>
          <h1 className="text-2xl font-bold text-on-surface">Sign In</h1>
          <p className="mt-1 text-sm text-on-surface-variant">Masuk dengan akun yang sudah terdaftar</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-on-surface-variant">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Masukkan username"
              className="h-12 w-full rounded-xl border border-outline-variant bg-surface-container-lowest px-4 text-on-surface outline-none transition-all focus:border-primary-container focus:ring-1 focus:ring-primary-container"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-on-surface-variant">Password</label>
            <div className="relative">
              <input
                type={showPw ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password"
                className="h-12 w-full rounded-xl border border-outline-variant bg-surface-container-lowest pl-4 pr-12 text-on-surface outline-none transition-all focus:border-primary-container focus:ring-1 focus:ring-primary-container"
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface"
              >
                {showPw ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-sm text-error">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary-container text-base font-semibold text-on-primary-container shadow-lg shadow-primary-container/20 transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50"
          >
            <LogIn className="h-4 w-4" />
            {loading ? "Memproses..." : "Masuk"}
          </button>
        </form>

        <button
          onClick={() => router.back()}
          className="mx-auto mt-4 block text-sm text-on-surface-variant hover:text-on-surface"
        >
          Kembali
        </button>
      </div>
    </div>
  )
}
