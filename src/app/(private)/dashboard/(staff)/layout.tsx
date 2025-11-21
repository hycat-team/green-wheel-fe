"use client"

import { RoleName } from "@/constants/enum"
import { useGetMe, useTokenStore } from "@/hooks"
import { useRouter } from "next/navigation"
import React, { useEffect } from "react"

export default function StaffLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    const isLogined = useTokenStore((s) => !!s.accessToken)
    const { data: user, isLoading, isError } = useGetMe({ enabled: isLogined })

    const isStaff = user?.role?.name === RoleName.Staff

    useEffect(() => {
        if (isLoading) return
        if (!isLogined || isError || !isStaff) {
            // addToast({
            //     title: t("toast.error"),
            //     description: t("user.unauthorized"),
            //     color: "danger"
            // })
            router.replace("/")
        }
    }, [isError, isLoading, isLogined, isStaff, router])

    if (isLoading) return null

    return <>{children}</>
}
