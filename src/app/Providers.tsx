"use client"
import { ThemeProvider } from "@/components/ThemeProvider"
import { SessionProvider } from "next-auth/react"

interface Props {
    children: React.ReactNode
}

export default function Providers({ children }: Props) {
    return (
        <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
            >
                <SessionProvider>
                    {children}
                </SessionProvider>
        </ThemeProvider>
    )
}