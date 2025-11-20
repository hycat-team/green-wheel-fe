"use client"

import TicketManagement from "@/components/pages/TicketManagement"
import { TicketType } from "@/constants/enum"
import { useGetAllTickets } from "@/hooks"
import { PaginationParams } from "@/models/common/request"
import { BackendError } from "@/models/common/response"
import { TicketFilterParams } from "@/models/ticket/schema/request"
import { translateWithFallback } from "@/utils/helpers/translateWithFallback"
import { addToast } from "@heroui/toast"
import React, { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"

export default function ContactsPage() {
    const { t } = useTranslation()

    const [filter, setFilter] = useState<TicketFilterParams>({ type: TicketType.Contact })
    const [pagination, setPagination] = useState<PaginationParams>({ pageSize: 9 })
    const queryResult = useGetAllTickets({
        query: filter,
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
        <TicketManagement
            isEditable={true}
            isAdmin={false}
            filterState={[filter, setFilter]}
            paginations={[pagination, setPagination]}
            queryResult={queryResult}
            createType={undefined}
        />
    )
}
