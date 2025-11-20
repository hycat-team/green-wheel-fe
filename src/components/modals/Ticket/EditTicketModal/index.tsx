"use client"

import {
    ButtonStyled,
    InputStyled,
    ModalBodyStyled,
    ModalContentStyled,
    ModalHeaderStyled,
    ModalStyled,
    TextareaStyled
} from "@/components"
import { TicketStatus, TicketType } from "@/constants/enum"
import { useDay, useEscalateTicketToAdmin, useUserHelper, useUpdateTicket } from "@/hooks"
import { TicketFilterParams, UpdateTicketReq } from "@/models/ticket/schema/request"
import { useFormik } from "formik"
import * as Yup from "yup"
import React, { useCallback, useMemo } from "react"
import { useTranslation } from "react-i18next"
import { Chip, Spinner, User } from "@heroui/react"
import { PaperPlaneTilt } from "@phosphor-icons/react"
import { TicketViewRes } from "@/models/ticket/schema/response"
import { TicketStatusLabels, TicketTypeLabels } from "@/constants/labels"
import { TicketStatusColorMap } from "@/constants/colorMap"
import { DATE_TIME_VIEW_FORMAT } from "@/constants/constants"
import { PaginationParams } from "@/models/common/request"

interface EditTicketModalProps {
    isOpen: boolean
    onOpenChange: (isOpen: boolean) => void
    onClose: () => void
    isEditable: boolean
    isAdmin?: boolean
    ticket: TicketViewRes
    filter: TicketFilterParams
    pagination: PaginationParams
}

export function EditTicketModal({
    isOpen,
    onOpenChange,
    onClose,
    isEditable = false,
    isAdmin = false,
    ticket,
    filter,
    pagination
}: EditTicketModalProps) {
    const { t } = useTranslation()
    const { toFullName } = useUserHelper()
    const { formatDateTime } = useDay({ defaultFormat: DATE_TIME_VIEW_FORMAT })
    const updateMutation = useUpdateTicket({ query: filter, pagination, onSuccess: onClose })
    const escalateMutation = useEscalateTicketToAdmin({
        query: filter,
        pagination,
        onSuccess: onClose
    })

    const canEdit = useMemo(() => {
        if (!isEditable || ticket.status === TicketStatus.Resolve) return false

        switch (ticket.type) {
            case TicketType.CustomerSupport: {
                return !isAdmin || ticket.status === TicketStatus.EscalatedToAdmin
            }
            case TicketType.Contact: {
                return !isAdmin || ticket.status === TicketStatus.EscalatedToAdmin
            }
            case TicketType.StaffReport: {
                return isAdmin
            }
            default: {
                return false
            }
        }
    }, [isAdmin, isEditable, ticket.status, ticket.type])

    const hanldeUpdate = useCallback(
        async (req: UpdateTicketReq) => {
            await updateMutation.mutateAsync({ id: ticket.id, req })
        },
        [ticket.id, updateMutation]
    )

    const handleEscalate = useCallback(async () => {
        await escalateMutation.mutateAsync(ticket.id)
    }, [ticket.id, escalateMutation])

    const formik = useFormik<UpdateTicketReq>({
        initialValues: {
            reply: ticket.reply || "",
            status: TicketStatus.Resolve
        },
        validationSchema: Yup.object({
            reply: Yup.string().required(t("ticket.reply_require"))
        }),
        onSubmit: hanldeUpdate
    })

    return (
        <ModalStyled isOpen={isOpen} onOpenChange={onOpenChange} isDismissable>
            <ModalContentStyled className="max-w-150 w-full px-6 py-4">
                <ModalHeaderStyled>{TicketTypeLabels[ticket.type]}</ModalHeaderStyled>
                <ModalBodyStyled>
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-4 border-b border-dashed pb-4">
                        <div className="flex items-center gap-2">
                            <Chip
                                color={TicketStatusColorMap[ticket.status]}
                                size="sm"
                                variant="bordered"
                            >
                                {TicketStatusLabels[ticket.status]}
                            </Chip>
                            <p className="text-default-400 text-small">
                                {formatDateTime({ date: ticket.createdAt })}
                            </p>
                        </div>
                        <div className="flex items-center gap-4">
                            {ticket.requester && (
                                <User
                                    name={toFullName(ticket.requester)}
                                    description={t("ticket.requester")}
                                    avatarProps={{
                                        src: ticket.requester.avatarUrl,
                                        size: "sm"
                                    }}
                                />
                            )}
                            {ticket.assignee && (
                                <User
                                    name={toFullName(ticket.assignee)}
                                    description={t("ticket.assignee")}
                                    avatarProps={{
                                        src: ticket.assignee.avatarUrl,
                                        size: "sm"
                                    }}
                                />
                            )}
                        </div>
                    </div>
                    <form onSubmit={formik.handleSubmit} className="flex flex-col gap-3">
                        <InputStyled
                            label={t("ticket.title")}
                            variant="bordered"
                            value={ticket.title}
                            isReadOnly
                        />
                        <TextareaStyled
                            label={t("ticket.description")}
                            placeholder={t("ticket.description_placeholder")}
                            variant="bordered"
                            value={ticket.description}
                            isReadOnly
                        />
                        <TextareaStyled
                            label={t("ticket.reply")}
                            placeholder={
                                canEdit ? t("ticket.reply_placeholder") : t("ticket.wait_for_reply")
                            }
                            variant="bordered"
                            value={formik.values.reply}
                            onValueChange={(value) => formik.setFieldValue("reply", value)}
                            onBlur={() => formik.setFieldTouched("reply")}
                            isInvalid={!!(formik.touched.reply && formik.errors.reply) && canEdit}
                            errorMessage={formik.errors.reply}
                            readOnly={!canEdit}
                            required
                        />
                        {canEdit && (
                            <div className="flex gap-2">
                                <ButtonStyled
                                    className="btn-gradient w-full rounded-lg
                                    flex justify-center items-center gap-2"
                                    type="submit"
                                    isDisabled={!formik.isValid || formik.isSubmitting}
                                    onPress={() => formik.submitForm()}
                                >
                                    {formik.isSubmitting ? (
                                        <Spinner color="white" />
                                    ) : (
                                        <>
                                            <PaperPlaneTilt
                                                size={22}
                                                weight="fill"
                                                className="animate-pulse"
                                            />
                                            {t("ticket.reply")}
                                        </>
                                    )}
                                </ButtonStyled>
                                {ticket.type === TicketType.CustomerSupport && !isAdmin && (
                                    <ButtonStyled
                                        className="w-full rounded-lg"
                                        onPress={handleEscalate}
                                        isDisabled={
                                            escalateMutation.isPending ||
                                            ticket.status === TicketStatus.EscalatedToAdmin ||
                                            ticket.status === TicketStatus.Resolve
                                        }
                                    >
                                        {t("enum.escalated_to_admin")}
                                    </ButtonStyled>
                                )}
                            </div>
                        )}
                    </form>
                </ModalBodyStyled>
            </ModalContentStyled>
        </ModalStyled>
    )
}
