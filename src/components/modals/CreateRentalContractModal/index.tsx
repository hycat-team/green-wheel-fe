"use client"
import { ModalStyled } from "@/components/"
import { ModalBody, ModalContent, ModalHeader } from "@heroui/react"
import React, { useCallback } from "react"
import { CreateRentalContractForm } from "./CreateRentalContractForm"
import { VehicleModelViewRes } from "@/models/vehicle/schema/response"
import { useRouter } from "next/navigation"
import { useTranslation } from "react-i18next"
import { useQueryClient } from "@tanstack/react-query"
import { QUERY_KEYS } from "@/constants/queryKey"

export function CreateRentalContractModal({
    isOpen,
    isCustomer = false,
    isStaff = false,
    onClose,
    totalDays,
    totalPrice,
    modelViewRes
}: {
    isOpen: boolean
    isCustomer: boolean
    isStaff: boolean
    onClose: () => void
    totalDays: number
    totalPrice: number
    modelViewRes: VehicleModelViewRes
}) {
    const { t } = useTranslation()
    const router = useRouter()
    const queryClient = useQueryClient()

    const handleSuccess = useCallback(() => {
        const redirectPath = isCustomer ? "/rental-bookings" : "/dashboard/rental-bookings"
        queryClient.invalidateQueries({
            queryKey: QUERY_KEYS.RENTAL_CONTRACTS,
            exact: false
        })
        router.push(redirectPath)
        onClose()
    }, [isCustomer, onClose, queryClient, router])

    return (
        <ModalStyled isOpen={isOpen} onClose={onClose} isDismissable={true}>
            <ModalContent className="min-w-fit px-3 py-2">
                <ModalHeader className="self-center font-bold text-3xl">
                    {t("car_rental.register_title")}
                </ModalHeader>
                <ModalBody>
                    <CreateRentalContractForm
                        isCustomer={isCustomer}
                        isStaff={isStaff}
                        onSuccess={handleSuccess}
                        totalDays={totalDays}
                        totalPrice={totalPrice}
                        modelViewRes={modelViewRes}
                    />
                </ModalBody>
            </ModalContent>
        </ModalStyled>
    )
}
