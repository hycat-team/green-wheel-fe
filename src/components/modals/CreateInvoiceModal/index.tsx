"use client"
import { ModalStyled } from "@/components/"
import { InvoiceType } from "@/constants/enum"
import { ModalBody, ModalContent, ModalHeader } from "@heroui/react"
import React from "react"
import { useTranslation } from "react-i18next"
import { CreateInvoiceForm } from "./CreateInvoiceForm"

interface CreateInvoiceModalProps {
    isOpen: boolean
    onClose: () => void
    contractId: string
    type: InvoiceType
}

export function CreateInvoiceModal({ isOpen, onClose, contractId, type }: CreateInvoiceModalProps) {
    const { t } = useTranslation()
    return (
        <ModalStyled isOpen={isOpen} onClose={onClose} isKeyboardDismissDisabled>
            <ModalContent className="max-w-6xl px-3 py-2">
                <ModalHeader className="self-center font-bold text-3xl">
                    {t("invoice.create_title")}
                </ModalHeader>
                <ModalBody>
                    <CreateInvoiceForm contractId={contractId} type={type} onClose={onClose} />
                </ModalBody>
            </ModalContent>
        </ModalStyled>
    )
}
