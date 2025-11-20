"use client"
import React from "react"
import { ModalBody, ModalContent } from "@heroui/react"
import { ModalStyled, VehicleChecklistDetail } from "@/components/"

interface ChecklistModalProps {
    id: string
    isCustomer?: boolean
    isOpen: boolean
    onOpenChange: () => void
    onClose: () => void
}

export function ChecklistModal({
    id,
    isCustomer = false,
    isOpen,
    onOpenChange,
    onClose
}: ChecklistModalProps) {
    return (
        <ModalStyled
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            onClose={onClose}
            isDismissable={true}
            className="min-w-full max-w-screen sm:w-sm"
        >
            <ModalContent className="px-0 py-3 sm:min-w-fit sm:px-8 sm:py-4">
                <ModalBody className="px-3 py-2 sm:px-6">
                    <VehicleChecklistDetail id={id} isCustomer={isCustomer} />
                </ModalBody>
            </ModalContent>
        </ModalStyled>
    )
}
