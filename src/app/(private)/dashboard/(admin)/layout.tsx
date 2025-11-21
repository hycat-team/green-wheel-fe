"use client"

import { RoleName } from "@/constants/enum"
import { useGetMe, useTokenStore } from "@/hooks"
import { useRouter } from "next/navigation"
import React, { useEffect } from "react"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    const isLogined = useTokenStore((s) => !!s.accessToken)
    const { data: user, isLoading, isError } = useGetMe()

    const isAdmin = user?.role?.name === RoleName.Admin

    useEffect(() => {
        if (isLoading) return

        if (!isLogined || isError || !isAdmin) {
            router.replace("/")
        }
    }, [isAdmin, isError, isLoading, isLogined, router])

    if (!isAdmin) return null

    return <>{children}</>
}
