"use client"

import TicketManagement from "@/components/pages/TicketManagement"
import { RoleName, TicketType } from "@/constants/enum"
import { useGetAllTickets, useGetMe, useGetMyTickets } from "@/hooks"
import { PaginationParams } from "@/models/common/request"
import { BackendError } from "@/models/common/response"
import { TicketFilterParams } from "@/models/ticket/schema/request"
import { translateWithFallback } from "@/utils/helpers/translateWithFallback"
import { addToast } from "@heroui/toast"
import React, { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"

export default function ReportsPage() {
    const { t } = useTranslation()
    const { data: user } = useGetMe()
    const isStaff = user?.role?.name === RoleName.Staff
    const isAdmin = user?.role?.name === RoleName.Admin

    const [filter, setFilter] = useState<TicketFilterParams>({ type: TicketType.StaffReport })
    const [pagination, setPagination] = useState<PaginationParams>({ pageSize: 9 })
    const meQuery = useGetMyTickets({
        status: filter.status,
        pagination,
        enabled: user !== undefined && !isAdmin
    })

    const allQuery = useGetAllTickets({
        query: filter,
        pagination,
        enabled: user !== undefined && isAdmin
    })

    const queryResult = isAdmin ? allQuery : meQuery

    // check error
    useEffect(() => {
        if (queryResult.error) {
            const backendErr = queryResult.error as BackendError
            addToast({
                title: backendErr.title || t("toast.error"),
                description: translateWithFallback(t, backendErr.detail),
                color: "danger"
            })
        }
    }, [queryResult.error, t])

    return (
        <TicketManagement
            isEditable={isAdmin}
            isAdmin={isAdmin}
            filterState={[filter, setFilter]}
            paginations={[pagination, setPagination]}
            queryResult={queryResult}
            createType={isStaff ? TicketType.StaffReport : undefined}
        />
    )
}
