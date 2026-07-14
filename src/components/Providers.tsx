"use client"

import { FloatingDecorations } from "./FloatingDecorations"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <FloatingDecorations />
      {/* Global background patterns */}
      <div className="pointer-events-none fixed inset-0 z-0 pattern-dots opacity-30" aria-hidden="true" />
      <div className="pointer-events-none fixed inset-0 z-0 pattern-stripes opacity-20" aria-hidden="true" />
      {/* Animated gradient orbs */}
      <div
        className="pointer-events-none fixed top-0 left-0 h-[500px] w-[500px] z-0 opacity-30"
        aria-hidden="true"
        style={{
          background: "radial-gradient(circle, rgba(255,58,242,0.08) 0%, transparent 60%)",
          animation: "float 12s ease-in-out infinite",
        }}
      />
      <div
        className="pointer-events-none fixed bottom-0 right-0 h-[400px] w-[400px] z-0 opacity-25"
        aria-hidden="true"
        style={{
          background: "radial-gradient(circle, rgba(0,245,212,0.06) 0%, transparent 60%)",
          animation: "float-reverse 15s ease-in-out infinite 2s",
        }}
      />
      {children}
    </>
  )
}
