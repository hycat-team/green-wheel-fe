"use client"

import { DashboardSidebar } from "@/components"

import React, { useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { useGetMe, useTokenStore } from "@/hooks"
import { RoleName } from "@/constants/enum"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    const isLogined = useTokenStore((s) => !!s.accessToken)
    const { data: user, isLoading, isError } = useGetMe()
    const pathname = usePathname()

    const roleName = user?.role?.name
    const isSuperAdmin = roleName === RoleName.SuperAdmin
    const isAdmin = roleName === RoleName.Admin
    const isStaff = roleName === RoleName.Staff

    useEffect(() => {
        if (isLoading) return
        if (!isLogined || isError || (!isSuperAdmin && !isAdmin && !isStaff)) {
            router.replace("/")
        }

        if (pathname !== "/dashboard") return

        if (isAdmin) router.replace("/dashboard/station-statistic")
        else if (isSuperAdmin) router.replace("/dashboard/statistic")
        else if (isStaff) router.replace("/dashboard/rental-bookings")
    }, [isAdmin, isError, isLoading, isLogined, isStaff, isSuperAdmin, pathname, router])

    return (
        <div className="flex w-full max-w-screen lg:max-w-7xl flex-col gap-1 lg:gap-6 lg:flex-row">
            <aside className="self-start lg:sticky lg:top-10">
                <DashboardSidebar className="min-w-fit w-40 text-sm" />
            </aside>
            <div className="w-full px-3 py-2 md:py-8 md:px-12 bg-white rounded-2xl">{children}</div>
        </div>
    )
}
