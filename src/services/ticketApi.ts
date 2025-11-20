import { TicketStatus } from "@/constants/enum"
import { PaginationParams } from "@/models/common/request"
import { PageResult } from "@/models/common/response"
import { TicketViewRes } from "@/models/ticket/schema/response"
import {
    CreateContactReq,
    CreateTicketReq,
    TicketFilterParams,
    UpdateTicketReq
} from "@/models/ticket/schema/request"
import axiosInstance from "@/utils/axios"
import { buildQueryParams, requestWrapper } from "@/utils/helpers/axiosHelper"

export const ticketApi = {
    createContact: (req: CreateContactReq) =>
        requestWrapper<{ id: string }>(async () => {
            const res = await axiosInstance.post("/tickets/contact", req)
            return res.data
        }),

    create: (req: CreateTicketReq) =>
        requestWrapper<{ id: string }>(async () => {
            const res = await axiosInstance.post("/tickets", req)
            return res.data
        }),

    getAll: ({ query, pagination }: { query: TicketFilterParams; pagination: PaginationParams }) =>
        requestWrapper<PageResult<TicketViewRes>>(async () => {
            const params = {
                ...buildQueryParams(query),
                ...buildQueryParams(pagination)
            }
            const res = await axiosInstance.get("/tickets", { params })
            return res.data
        }),

    getMyTickets: ({
        status,
        pagination
    }: {
        status?: TicketStatus
        pagination: PaginationParams
    }) =>
        requestWrapper<PageResult<TicketViewRes>>(async () => {
            const params = {
                status,
                ...buildQueryParams(pagination)
            }
            const res = await axiosInstance.get("/tickets/me", { params })
            return res.data
        }),

    update: ({ id, req }: { id: string; req: UpdateTicketReq }) =>
        requestWrapper<void>(async () => {
            await axiosInstance.patch(`/tickets/${id}`, req)
        }),

    escalateToAdmin: (id: string) =>
        requestWrapper<void>(async () => {
            await axiosInstance.patch(`/tickets/${id}/escalated-to-admin`)
        })
}
