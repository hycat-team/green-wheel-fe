"use client"

import { RoleName } from "@/constants/enum"
import { useGetMe } from "@/hooks"

import { Spinner } from "@heroui/react"
// import { addToast } from "@heroui/toast"
import { useRouter } from "next/navigation"
import React, { useEffect } from "react"
import { useTranslation } from "react-i18next"

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    const { t } = useTranslation()
    const { data: user, isLoading, isError } = useGetMe()

    const isCustomer = user?.role?.name === RoleName.Customer

    useEffect(() => {
        if (isLoading) return
        if (isError || !isCustomer) {
            router.replace("/")
        }
    }, [isCustomer, isError, isLoading, router, t])

    if (!isCustomer) return <Spinner />

    return <>{children}</>
}
