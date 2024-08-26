'use client'
import { SessionProvider } from "next-auth/react"

export default function NextAuthWrapper({ children }: { chilren: React.ReactNode }) {
    return (
        <SessionProvider>
            {children}
        </SessionProvider>
    )
} 