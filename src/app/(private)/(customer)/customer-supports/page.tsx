"use client"

import TicketManagement from "@/components/pages/TicketManagement"
import { TicketType } from "@/constants/enum"
import { useGetMyTickets } from "@/hooks"
import { PaginationParams } from "@/models/common/request"
import { BackendError } from "@/models/common/response"
import { TicketFilterParams } from "@/models/ticket/schema/request"
import { translateWithFallback } from "@/utils/helpers/translateWithFallback"
import { addToast } from "@heroui/toast"
import React, { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"

export default function CustomerSupportsPage() {
    const { t } = useTranslation()
    const [filter, setFilter] = useState<TicketFilterParams>({ type: TicketType.CustomerSupport })
    const [pagination, setPagination] = useState<PaginationParams>({ pageSize: 9 })
    const queryResult = useGetMyTickets({
        status: filter.status,
        pagination
    })

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
        <div className="md:min-w-3xl lg:min-w-5xl max-w-screen px-3 py-2 md:py-8 md:px-12 rounded-2xl bg-white">
            <TicketManagement
                isEditable={false}
                filterState={[filter, setFilter]}
                paginations={[pagination, setPagination]}
                queryResult={queryResult}
                createType={TicketType.CustomerSupport}
            />
        </div>
    )
}
