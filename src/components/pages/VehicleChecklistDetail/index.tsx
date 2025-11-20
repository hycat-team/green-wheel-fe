"use client"
import {
    ButtonStyled,
    DatePickerStyled,
    InputStyled,
    SignatureSection,
    SpinnerStyled
} from "@/components"
import { VehicleChecklistTypeLabels } from "@/constants/labels"
import {
    useChangeVehicleByContractId,
    useDay,
    useGetVehicleChecklistById,
    useUserHelper,
    useUpdateVehicleChecklist,
    useSignByCustomer
} from "@/hooks"
import { UpdateVehicleChecklistReq } from "@/models/checklist/schema/request"
import { useFormik } from "formik"
import * as Yup from "yup"
import React, { useCallback, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { TableCheckListItems } from "./TableCheckListItems"
import { Spinner } from "@heroui/react"
import { DamageStatus, VehicleChecklistType } from "@/constants/enum"
import Link from "next/link"
import { fromDate } from "@internationalized/date"
import { DEFAULT_DATE_FORMAT, DEFAULT_TIMEZONE } from "@/constants/constants"
import { addToast } from "@heroui/toast"
import { useRouter } from "next/navigation"

export function VehicleChecklistDetail({
    id,
    isStaff = false,
    isCustomer = false
}: {
    id: string
    isStaff?: boolean
    isCustomer?: boolean
}) {
    const { t } = useTranslation()
    const router = useRouter()
    const { toFullName } = useUserHelper()
    const { formatDateTime: formatDate, toDate } = useDay({
        defaultFormat: DEFAULT_DATE_FORMAT
    })

    const { formatDateTime, toZonedDateTime } = useDay()

    const { data: checklist, isLoading } = useGetVehicleChecklistById({
        id,
        enabled: true
    })

    const isStaffEditable = useMemo(() => {
        return isStaff && !checklist?.isSignedByStaff
    }, [checklist?.isSignedByStaff, isStaff])

    const isCustomerEditable = useMemo(() => {
        return (isStaff || isCustomer) && !checklist?.isSignedByCustomer
    }, [checklist?.isSignedByCustomer, isCustomer, isStaff])

    const contractUrl = useMemo(() => {
        return isStaff
            ? `/dashboard/rental-bookings/${checklist?.contractId}`
            : `/rental-bookings/${checklist?.contractId}`
    }, [checklist?.contractId, isStaff])

    const [hasItemsDamaged, setHasItemsDamaged] = useState<boolean>(
        (checklist?.type !== VehicleChecklistType.Handover &&
            checklist?.vehicleChecklistItems?.some((item) => item.status > DamageStatus.Good)) ??
            false
    )

    const updateChecklist = useUpdateVehicleChecklist({ id })
    const signByCustomer = useSignByCustomer({ id })
    const changeVehicle = useChangeVehicleByContractId({ id: checklist?.contractId || "" })
    const handleUpdate = useCallback(
        async (value: UpdateVehicleChecklistReq) => {
            if (!isStaff) {
                await signByCustomer.mutateAsync()
            } else {
                const maintainDateTimeZoned = toZonedDateTime(value.maintainUntil)
                const formatMaintainDate =
                    maintainDateTimeZoned && hasItemsDamaged
                        ? formatDateTime({
                              date: maintainDateTimeZoned.set({ hour: 23, minute: 59, second: 59 })
                          })
                        : undefined

                await updateChecklist.mutateAsync({
                    checklistItems: value.checklistItems,
                    isSignedByCustomer: value.isSignedByCustomer,
                    isSignedByStaff: value.isSignedByStaff,
                    maintainUntil: formatMaintainDate
                })

                if (
                    checklist?.type == VehicleChecklistType.Return &&
                    formatMaintainDate != undefined
                ) {
                    await changeVehicle.mutateAsync()
                }
            }

            router.refresh()
            addToast({
                title: t("toast.success"),
                description: t("success.update"),
                color: "success"
            })
        },
        [
            changeVehicle,
            checklist?.type,
            formatDateTime,
            hasItemsDamaged,
            isStaff,
            router,
            signByCustomer,
            t,
            toZonedDateTime,
            updateChecklist
        ]
    )

    const formik = useFormik({
        initialValues: {
            isSignedByStaff: checklist?.isSignedByStaff ?? false,
            isSignedByCustomer: checklist?.isSignedByCustomer ?? false,
            checklistItems: checklist?.vehicleChecklistItems || [],
            maintainUntil: checklist?.maintainedUntil || undefined
        },
        enableReinitialize: true,
        validationSchema: Yup.object().shape({
            isSignedByStaff: Yup.boolean().oneOf([true], t("signature.signed_by_staff_require")),
            isSignedByCustomer: isStaff
                ? Yup.boolean().notRequired()
                : Yup.boolean().oneOf([true], t("signature.signed_by_customer_require")),
            maintainUntil: hasItemsDamaged
                ? Yup.string()
                      .required(t("vehicle_checklist.maintain_until_require"))
                      .test(
                          "is-valid-maintain-date",
                          t("vehicle_checklist.invalid_maintain_until"),
                          (value) => {
                              const valueDatetime = toDate(value)
                              return (
                                  !!valueDatetime &&
                                  valueDatetime.compare(
                                      fromDate(new Date(), DEFAULT_TIMEZONE).add({ minutes: 30 })
                                  ) >= 0
                              )
                          }
                      )
                : Yup.string().notRequired()
        }),
        onSubmit: handleUpdate
    })

    if (isLoading || !checklist) {
        return <SpinnerStyled />
    }

    return (
        <form onSubmit={formik.handleSubmit} className="max-w-full md:max-w-6xl mx-auto">
            {/* Header */}
            {/* <div className="flex flex-col md:flex-row items-center justify-between mb-8"> */}
            <div className="flex flex-col gap-2 mb-8">
                <h2 className="text-3xl font-bold text-gray-800">
                    {t("vehicle_checklist.checklist")} –{" "}
                    <span className="text-primary">
                        {VehicleChecklistTypeLabels[checklist!.type]}
                    </span>
                </h2>
                {checklist.contractId && isStaff && (
                    <Link href={contractUrl}>
                        {`${t("rental_contract.id")}: ${checklist.contractId}`}
                        <span className="underline pl-2 text-sm text-gray-400 ">
                            {t("table.view_details")}
                        </span>
                    </Link>
                )}
            </div>

            {/* Information */}
            {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-5 mb-10"> */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5 mb-8">
                {/* <div className="flex flex-col gap-4"></div> */}
                <InputStyled
                    label={t("vehicle_checklist.checklist_type")}
                    value={VehicleChecklistTypeLabels[checklist!.type]}
                    readOnly
                />
                <InputStyled
                    label={t("vehicle_checklist.vehicle_license_plate")}
                    value={checklist.vehicle.licensePlate}
                    readOnly
                />
                <InputStyled
                    label={t("vehicle_checklist.staff_name")}
                    value={toFullName({
                        firstName: checklist.staff.firstName,
                        lastName: checklist.staff.lastName
                    })}
                    readOnly
                />
                <InputStyled
                    label={t("vehicle_checklist.customer_name")}
                    value={toFullName({
                        firstName: checklist.customer?.firstName,
                        lastName: checklist.customer?.lastName
                    })}
                    readOnly
                />

                {/* <div className="flex flex-col gap-4"></div> */}
            </div>

            <hr className="border-gray-200 mb-8" />

            {/* Table */}
            {formik.values.checklistItems.length > 0 && (
                <TableCheckListItems
                    isEditable={isStaffEditable}
                    checklistType={checklist.type}
                    vehicleCheckListItems={formik.values.checklistItems}
                    setFieldValue={formik.setFieldValue}
                    setHasItemsDamaged={setHasItemsDamaged}
                />
            )}

            {hasItemsDamaged && (
                <DatePickerStyled
                    label={t("vehicle_checklist.maintain_until")}
                    value={toDate(formik.values.maintainUntil)}
                    onChange={(value) => {
                        if (!value) {
                            formik.setFieldValue("maintainUntil", null)
                            return
                        }

                        const date = formatDate({ date: value })
                        formik.setFieldValue("maintainUntil", date)
                    }}
                    className="mt-3"
                    isInvalid={hasItemsDamaged && !!formik.errors.maintainUntil}
                    isReadOnly={!hasItemsDamaged}
                    isRequired={hasItemsDamaged}
                    errorMessage={hasItemsDamaged ? formik.errors.maintainUntil : undefined}
                    onBlur={() => {
                        formik.setFieldTouched("maintainUntil")
                    }}
                />
            )}

            {/* Signature */}
            <SignatureSection
                // className="pt-10"
                sectionClassName="mt-8"
                // isReadOnly={!isEditable}
                staffSign={{
                    id: "isSignedByStaff",
                    name: "isSignedByStaff",
                    checked: formik.values.isSignedByStaff,
                    isInvalid: !!(
                        isStaffEditable &&
                        formik.touched.isSignedByStaff &&
                        formik.errors.isSignedByStaff
                    ),
                    isSelected: formik.values.isSignedByStaff,
                    isReadOnly: !isStaffEditable,
                    // onValueChange: (value) => formik.setFieldValue("isSignedByStaff", value)
                    onChange: formik.handleChange,
                    onBlur: formik.handleBlur
                }}
                customerSign={{
                    id: "isSignedByCustomer",
                    name: "isSignedByCustomer",
                    checked: formik.values.isSignedByCustomer,
                    isInvalid: !!(
                        isCustomerEditable &&
                        formik.touched.isSignedByCustomer &&
                        formik.errors.isSignedByCustomer
                    ),
                    isSelected: formik.values.isSignedByCustomer,
                    isReadOnly: !isCustomerEditable,
                    // onValueChange: (value) => formik.setFieldValue("isSignedByCustomer", value)
                    onChange: formik.handleChange,
                    onBlur: formik.handleBlur
                }}
            />

            {(isStaffEditable || isCustomerEditable) && (
                <div className="flex justify-center">
                    <ButtonStyled
                        type="submit"
                        color="primary"
                        className="mt-8 p-6"
                        isDisabled={formik.isSubmitting || !formik.isValid}
                        onPress={() => formik.handleSubmit()}
                    >
                        {formik.isSubmitting ? <Spinner color="secondary" /> : t("common.update")}
                    </ButtonStyled>
                </div>
            )}
        </form>
    )
}
