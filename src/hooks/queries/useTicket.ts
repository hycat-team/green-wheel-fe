import { TicketStatus } from "@/constants/enum"
import { QUERY_KEYS } from "@/constants/queryKey"
import { PaginationParams } from "@/models/common/request"
import { BackendError, PageResult } from "@/models/common/response"
import { TicketViewRes } from "@/models/ticket/schema/response"
import { TicketFilterParams } from "@/models/ticket/schema/request"
import { ticketApi } from "@/services/ticketApi"
import { translateWithFallback } from "@/utils/helpers/translateWithFallback"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"
import { addToast } from "@heroui/toast"

export const useCreateContact = ({ onSuccess }: { onSuccess?: () => void }) => {
    const { t } = useTranslation()

    return useMutation({
        mutationFn: ticketApi.createContact,
        onSuccess: () => {
            onSuccess?.()
            addToast({
                title: t("toast.success"),
                description: t("contact.wait_for_reply"),
                color: "success"
            })
        },
        onError: (error: BackendError) => {
            addToast({
                title: error.title || t("toast.error"),
                description: translateWithFallback(t, error.detail),
                color: "danger"
            })
        }
    })
}

export const useCreateTicket = ({
    status,
    pagination = {},
    onSuccess
}: {
    status?: TicketStatus
    pagination?: PaginationParams
    onSuccess?: () => void
}) => {
    const { t } = useTranslation()
    const queryClient = useQueryClient()
    const key = [...QUERY_KEYS.TICKETS, ...QUERY_KEYS.ME, status, pagination]

    return useMutation({
        mutationFn: ticketApi.create,
        onSuccess: async () => {
            onSuccess?.()
            await queryClient.invalidateQueries({ queryKey: key })
            addToast({
                title: t("toast.success"),
                description: t("success.create"),
                color: "success"
            })
        },
        onError: (error: BackendError) => {
            addToast({
                title: error.title || t("toast.error"),
                description: translateWithFallback(t, error.detail),
                color: "danger"
            })
        }
    })
}

export const useGetAllTickets = ({
    query = {},
    pagination = {},
    enabled = true
}: {
    query: TicketFilterParams
    pagination: PaginationParams
    enabled?: boolean
}) => {
    const queryClient = useQueryClient()
    const key = [...QUERY_KEYS.TICKETS, query, pagination]

    return useQuery({
        queryKey: key,
        queryFn: async () => await ticketApi.getAll({ query, pagination }),
        initialData: () => {
            return queryClient.getQueryData<PageResult<TicketViewRes>>(key)
        },
        enabled
    })
}

export const useGetMyTickets = ({
    status,
    pagination = {},
    enabled = true
}: {
    status?: TicketStatus
    pagination: PaginationParams
    enabled?: boolean
}) => {
    const queryClient = useQueryClient()
    const key = [...QUERY_KEYS.TICKETS, ...QUERY_KEYS.ME, status, pagination]

    return useQuery({
        queryKey: key,
        queryFn: async () => await ticketApi.getMyTickets({ status, pagination }),
        initialData: () => {
            return queryClient.getQueryData<PageResult<TicketViewRes>>(key)
        },
        enabled
    })
}

export const useUpdateTicket = ({
    query = {},
    pagination = {},
    onSuccess
}: {
    query: TicketFilterParams
    pagination: PaginationParams
    onSuccess?: () => void
}) => {
    const { t } = useTranslation()
    const queryClient = useQueryClient()
    const key = [...QUERY_KEYS.TICKETS, query, pagination]

    return useMutation({
        mutationFn: ticketApi.update,
        onSuccess: async () => {
            addToast({
                title: t("toast.success"),
                description: t("success.update"),
                color: "success"
            })
            onSuccess?.()
            await queryClient.invalidateQueries({ queryKey: key })
        },
        onError: (error: BackendError) => {
            addToast({
                title: error.title || t("toast.error"),
                description: translateWithFallback(t, error.detail),
                color: "danger"
            })
        }
    })
}

export const useEscalateTicketToAdmin = ({
    query = {},
    pagination = {},
    onSuccess
}: {
    query: TicketFilterParams
    pagination: PaginationParams
    onSuccess?: () => void
}) => {
    const { t } = useTranslation()
    const queryClient = useQueryClient()
    const key = [...QUERY_KEYS.TICKETS, query, pagination]

    return useMutation({
        mutationFn: ticketApi.escalateToAdmin,
        onSuccess: async () => {
            addToast({
                title: t("toast.success"),
                description: t("success.update"),
                color: "success"
            })
            onSuccess?.()
            await queryClient.invalidateQueries({ queryKey: key })
        },
        onError: (error: BackendError) => {
            addToast({
                title: error.title || t("toast.error"),
                description: translateWithFallback(t, error.detail),
                color: "danger"
            })
        }
    })
}
