"use client"

import { RoleName } from "@/constants/enum"
import { useGetMe, useTokenStore } from "@/hooks"
import { useRouter } from "next/navigation"
import React, { useEffect } from "react"

export default function SuperAdminLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    const isLogined = useTokenStore((s) => !!s.accessToken)
    const { data: user, isLoading, isError } = useGetMe()

    const isSuperAdmin = user?.role?.name === RoleName.SuperAdmin

    useEffect(() => {
        if (isLoading) return

        if (!isLogined || isError || !isSuperAdmin) {
            router.replace("/")
        }
    }, [isError, isLoading, isLogined, isSuperAdmin, router])

    if (!isSuperAdmin) return null

    return <>{children}</>
}
