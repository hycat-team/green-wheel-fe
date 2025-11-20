import { TicketStatus, TicketType } from "@/constants/enum"

export type CreateContactReq = {
    title: string
    description: string
}

export type CreateTicketReq = {
    title: string
    description: string
    type: TicketType
}

export type UpdateTicketReq = {
    reply?: string
    status?: TicketStatus
}

export type TicketFilterParams = {
    status?: TicketStatus
    type?: TicketType
}
