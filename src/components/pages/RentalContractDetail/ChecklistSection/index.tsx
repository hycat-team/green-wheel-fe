import { ButtonStyled, ChecklistModal } from "@/components"
import { VehicleChecklistType } from "@/constants/enum"
import { useCreateVehicleChecklist } from "@/hooks"
import { VehicleChecklistViewRes } from "@/models/checklist/schema/response"
import { RentalContractViewRes } from "@/models/rental-contract/schema/response"
import { Spinner, useDisclosure } from "@heroui/react"
import { useRouter } from "next/navigation"
import React, { useCallback, useMemo } from "react"
import { useTranslation } from "react-i18next"

interface ChecklistSectionProps {
    isStaff: boolean
    isCustomer?: boolean
    contract: RentalContractViewRes
    checklist?: VehicleChecklistViewRes
    type: VehicleChecklistType
}

export function ChecklistSection({
    isStaff,
    isCustomer = false,
    contract,
    checklist,
    type
}: ChecklistSectionProps) {
    const { t } = useTranslation()
    const router = useRouter()
    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure()

    const { createLabel, viewLabel } = useMemo(() => {
        switch (type) {
            case VehicleChecklistType.Handover:
                return {
                    createLabel: t("vehicle_checklist.create_handover"),
                    viewLabel: t("vehicle_checklist.view_handover")
                }
            case VehicleChecklistType.Return:
                return {
                    createLabel: t("vehicle_checklist.create_return"),
                    viewLabel: t("vehicle_checklist.view_return")
                }
            case VehicleChecklistType.OutOfContract:
                return {
                    createLabel: t("vehicle_checklist.create_out_of_contract"),
                    viewLabel: t("vehicle_checklist.view_out_of_contract")
                }
            default:
                return {
                    createLabel: "",
                    viewLabel: ""
                }
        }
    }, [t, type])

    const createVehicleChecklist = useCreateVehicleChecklist({})
    const handleCreateVehicleChecklist = useCallback(async () => {
        await createVehicleChecklist.mutateAsync({
            vehicleId: contract?.vehicle?.id,
            contractId: contract?.id,
            type: type
        })
    }, [contract?.id, contract?.vehicle?.id, createVehicleChecklist, type])

    const handleOpenChecklist = useCallback(() => {
        if (!checklist) return
        if (isStaff) {
            router.push(`/dashboard/vehicle-checklists/${checklist.id}`)
        } else {
            onOpen()
        }
    }, [checklist, isStaff, onOpen, router])

    return (
        <div className="flex gap-4">
            {!checklist ? (
                isStaff && (
                    <ButtonStyled onPress={handleCreateVehicleChecklist}>
                        {createVehicleChecklist.isPending ? <Spinner /> : <div>{createLabel}</div>}
                    </ButtonStyled>
                )
            ) : (
                <div>
                    <ButtonStyled onPress={handleOpenChecklist}>
                        {createVehicleChecklist.isPending ? <Spinner /> : <div>{viewLabel}</div>}
                    </ButtonStyled>
                    <ChecklistModal
                        id={checklist.id}
                        isCustomer={isCustomer}
                        isOpen={isOpen}
                        onOpenChange={onOpenChange}
                        onClose={onClose}
                    />
                </div>
            )}
        </div>
    )
}
