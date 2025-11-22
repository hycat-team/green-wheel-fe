"use client"
import {
    AlertModal,
    ButtonStyled,
    SectionStyled,
    SpinnerStyled,
    TableSelectionStaff,
    TableSelectionVehicle
} from "@/components"
import { DispatchRequestStatus } from "@/constants/enum"
import { useGetMe } from "@/hooks"
import { useGetDispatchById, useUpdateDispatch } from "@/hooks/queries/useDispatch"
import { Spinner, useDisclosure } from "@heroui/react"
import { addToast } from "@heroui/toast"
import { Car, UserSwitchIcon } from "@phosphor-icons/react"
import { useParams, useRouter } from "next/navigation"
import React, { useCallback, useEffect, useState } from "react"
import { useTranslation } from "react-i18next"

export default function DispatchAssignPage() {
    const { t } = useTranslation()
    const router = useRouter()
    const { id } = useParams()
    const dispatchId = id?.toString()
    const { data: dispatch } = useGetDispatchById({ id: dispatchId!, enabled: true })
    const { data: user, isLoading: isGetMeLoading } = useGetMe()
    const stationIdNow = user?.station?.id

    const { isOpen, onOpenChange, onOpen, onClose } = useDisclosure()

    const updateMutation = useUpdateDispatch({
        onSuccess: () => router.push(`/dashboard/dispatchs/${dispatchId}`)
    })
    const [selectStaffs, setSelectStaffs] = useState<string[]>([])
    const [selectVehicles, setSelectVehicles] = useState<string[]>([])

    const handleUpdate = useCallback(
        async (status: DispatchRequestStatus) => {
            if (!dispatch) return

            await updateMutation.mutateAsync({
                id: dispatch.id,
                req: {
                    status,
                    staffIds: selectStaffs,
                    vehicleIds: selectVehicles
                }
            })
        },
        [dispatch, updateMutation, selectStaffs, selectVehicles]
    )

    useEffect(() => {
        if (!stationIdNow || !dispatch) return
        if (stationIdNow !== dispatch.fromStationId) {
            router.replace("/")
            addToast({
                title: t("toast.error"),
                description: t("user.do_not_have_permission"),
                color: "danger"
            })
        }

        if (dispatch.status !== DispatchRequestStatus.Approved) {
            router.replace(`/dashboard/dispatchs/${dispatch.id}`)
        }
    }, [dispatch, router, stationIdNow, t])

    if (isGetMeLoading || !stationIdNow || !dispatch) return <SpinnerStyled />

    return (
        <>
            {/* Tables */}
            <SectionStyled
                title={t("dispatch.list_staff")}
                icon={UserSwitchIcon}
                sectionClassName="mb-4"
            >
                <TableSelectionStaff stationId={stationIdNow} onChangeSelected={setSelectStaffs} />
            </SectionStyled>

            <SectionStyled title={t("dispatch.list_vehicle")} icon={Car} sectionClassName="mb-4">
                <TableSelectionVehicle
                    stationId={stationIdNow}
                    onChangeSelected={setSelectVehicles}
                />
            </SectionStyled>

            <div className="flex justify-center items-center gap-2">
                <ButtonStyled
                    isDisabled={updateMutation.isPending}
                    className="btn-gradient px-6 py-2"
                    onPress={onOpen}
                >
                    {updateMutation.isPending ? <Spinner color="white" /> : t("enum.assign")}
                </ButtonStyled>
                <AlertModal
                    header={t("common.confirm_to_submit")}
                    body={t("common.confirm_to_submit_body")}
                    isOpen={isOpen}
                    onOpenChange={onOpenChange}
                    onClose={onClose}
                    onConfirm={() => {
                        handleUpdate(DispatchRequestStatus.Assigned)
                    }}
                />
                {/* <ButtonStyled
                    variant="ghost"
                    color="danger"
                    className="font-semibold px-6 py-2 rounded-xl transition-all duration-300"
                    onPress={() => handleUpdate(DispatchRequestStatus.Cancelled)}
                >
                    {t("enum.rejected")}
                </ButtonStyled> */}
            </div>
        </>
    )
}
