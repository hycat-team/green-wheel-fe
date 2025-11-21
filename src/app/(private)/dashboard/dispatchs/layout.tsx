"use client"

import { RoleName } from "@/constants/enum"
import { useGetMe } from "@/hooks"
// import { addToast } from "@heroui/toast"
import { useRouter } from "next/navigation"
import React, { useEffect } from "react"
import { useTranslation } from "react-i18next"

export default function DispatchLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    const { t } = useTranslation()
    const { data: user, isLoading, isError } = useGetMe()

    const isSuperAdmin = user?.role?.name === RoleName.SuperAdmin
    const isAdmin = user?.role?.name === RoleName.Admin

    useEffect(() => {
        if (isLoading) return

        if (isError || (!isAdmin && !isSuperAdmin)) {
            router.replace("/")
        }
    }, [isAdmin, isError, isLoading, isSuperAdmin, router, t])

    if (!isAdmin && !isSuperAdmin) return null

    return <>{children}</>
}
