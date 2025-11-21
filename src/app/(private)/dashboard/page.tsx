"use client"

import React, { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useGetMe, useTokenStore } from "@/hooks"
import { SpinnerStyled } from "@/components"
import { RoleName } from "@/constants/enum"

export default function DashboardPage() {
    const router = useRouter()
    const isLogined = useTokenStore((s) => !!s.accessToken)
    const { data: user, isLoading, isError } = useGetMe({ enabled: isLogined })

    const roleName = user?.role?.name
    const isSuperAdmin = roleName === RoleName.SuperAdmin
    const isAdmin = roleName === RoleName.Admin
    const isStaff = roleName === RoleName.Staff

    useEffect(() => {
        if (isLoading) return
        if (!isLogined || isError || (!isSuperAdmin && !isAdmin && !isStaff)) {
            router.replace("/")
        }
        if (isAdmin) router.replace("/dashboard/station-statistic")
        else if (isSuperAdmin) router.replace("/dashboard/statistic")
        else if (isStaff) router.replace("/dashboard/rental-bookings")
    }, [isAdmin, isError, isLoading, isLogined, isStaff, isSuperAdmin, router])

    return <SpinnerStyled />
}
