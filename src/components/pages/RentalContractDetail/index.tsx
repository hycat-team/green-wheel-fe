"use client"

import React, { useCallback, useEffect, useMemo, useRef } from "react"
import { motion } from "framer-motion"
import {
    InvoiceAccordion,
    InputStyled,
    renderInvoiceForm,
    SectionStyled,
    SpinnerStyled,
    TextareaStyled,
    DateTimeStyled,
    SignatureSection,
    ViewUserModal
} from "@/components"
import {
    useDay,
    useGetAllVehicleChecklists,
    useGetRentalContractById,
    useHandoverContract,
    useUserHelper,
    useNumber,
    useTokenStore,
    useUpdateContractStatus,
    useGetBusinessVariables
} from "@/hooks"
import {
    Car,
    IdentificationBadge,
    ClipboardText,
    ArrowsLeftRight,
    Invoice
} from "@phosphor-icons/react"
import { InvoiceTypeLabels, RentalContractStatusLabels } from "@/constants/labels"

import { DATE_TIME_VIEW_FORMAT } from "@/constants/constants"
import { useTranslation } from "react-i18next"
import Link from "next/link"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useFormik } from "formik"
import * as Yup from "yup"
import { decodeJwt } from "@/utils/helpers/jwt"
import {
    BusinessVariableKey,
    InvoiceStatus,
    InvoiceType,
    RentalContractStatus,
    RoleName,
    VehicleChecklistType
} from "@/constants/enum"
import { ChecklistSection } from "./ChecklistSection"
import { CreateInvoiceSection } from "./CreateInvoiceSection"
import { HandoverContractReq } from "@/models/rental-contract/schema/request"
import { BottomActionButtons } from "./BottomActionButtons"
import { addToast } from "@heroui/toast"
import { Chip, useDisclosure } from "@heroui/react"
import { cn } from "node_modules/@heroui/theme/dist/utils/cn"
import { UserProfileViewRes } from "@/models/user/schema/response"
import { RentalContractStatusColorMap } from "@/constants/colorMap"
import { EyeIcon } from "lucide-react"
import dayjs from "dayjs"

function getChecklistDisplay(status?: RentalContractStatus) {
    const handoverStatuses = [
        RentalContractStatus.Active,
        RentalContractStatus.Returned,
        RentalContractStatus.RefundPending,
        RentalContractStatus.Completed
    ]

    const returnStatuses = [
        RentalContractStatus.Returned,
        RentalContractStatus.RefundPending,
        RentalContractStatus.Completed
    ]

    return {
        isHandoverChecklistDisplay: !!status && handoverStatuses.includes(status),
        isReturnChecklistDisplay: !!status && returnStatuses.includes(status)
    }
}

export function RentalContractDetail({
    contractId,
    isCustomer = false,
    staff = undefined,
    className = ""
}: {
    contractId: string
    isCustomer?: boolean
    staff?: UserProfileViewRes
    className?: string
}) {
    const searchParams = useSearchParams()
    const pathName = usePathname()
    const returnPath = pathName.startsWith("/dashboard")
        ? "/dashboard/rental-bookings"
        : "/rental-bookings"
    const router = useRouter()

    const { t } = useTranslation()
    const { toZonedDateTime, getDiffDaysCeil } = useDay()
    const { parseNumber } = useNumber()
    const { toFullName } = useUserHelper()
    const { formatDateTime } = useDay({ defaultFormat: DATE_TIME_VIEW_FORMAT })
    const { isOpen, onOpen, onOpenChange } = useDisclosure()

    const { data: businessVariables } = useGetBusinessVariables()

    const payload = decodeJwt(useTokenStore((s) => s.accessToken!))
    const { data: contract, isLoading } = useGetRentalContractById({
        id: contractId,
        enabled: true
    })
    const updateContractStatus = useUpdateContractStatus()

    // check owner if customer
    useEffect(() => {
        if (!contract || !payload.sid) return
        if (isCustomer && payload.sid != contract?.customer.id) {
            router.push("/")
            addToast({
                title: t("toast.error"),
                description: t("user.do_not_have_permission"),
                color: "danger"
            })
        }
    }, [contract, isCustomer, payload.sid, router, t])

    // check staff station
    const isStaffInStation =
        staff !== undefined &&
        staff.role?.name === RoleName.Staff &&
        contract?.station.id === staff?.station?.id

    //======================================= //
    // Checklist
    //======================================= //
    const { isHandoverChecklistDisplay, isReturnChecklistDisplay } = getChecklistDisplay(
        contract?.status
    )
    const isHandoverChecklistDisabled = dayjs().isBefore(contract?.startDate)
    const { data: checklists } = useGetAllVehicleChecklists({
        query: {
            contractId
        },
        pagination: {}
    })
    const handoverChecklist = useMemo(() => {
        return checklists?.items.find((item) => item.type === VehicleChecklistType.Handover)
    }, [checklists])
    const returnChecklist = useMemo(() => {
        return checklists?.items.find((item) => item.type === VehicleChecklistType.Return)
    }, [checklists])

    //======================================= //
    // Invoice accordion
    //======================================= //
    const invoiceAccordion = (contract?.invoices || []).map((invoice) => ({
        key: invoice.id,
        ariaLabel: invoice.id,
        title: `${InvoiceTypeLabels[invoice.type]}`,
        status: invoice.status,
        content: renderInvoiceForm(invoice),
        invoice: invoice
    }))

    const refundCreationDelayDays = (businessVariables || []).find(
        (v) => v.key === BusinessVariableKey.RefundCreationDelayDays
    ) || {
        id: "",
        key: BusinessVariableKey.RefundCreationDelayDays,
        value: 10
    }

    const refundInvoiceCreateable =
        isStaffInStation &&
        contract &&
        contract.status == RentalContractStatus.Returned &&
        returnChecklist &&
        !contract.invoices.find((item) => item.type == InvoiceType.Refund) &&
        getDiffDaysCeil({
            startDate: contract.actualEndDate,
            endDate: dayjs()
        }) >= refundCreationDelayDays.value

    //======================================= //
    // Handover
    //======================================= //
    const isHandoverStaffEditable = useMemo(() => {
        return isStaffInStation && !contract?.isSignedByStaff
    }, [contract?.isSignedByStaff, isStaffInStation])

    const isHandoverCustomerEditable = useMemo(() => {
        return ((staff && isStaffInStation) || isCustomer) && !contract?.isSignedByCustomer
    }, [contract?.isSignedByCustomer, isCustomer, isStaffInStation, staff])

    const handoverMutation = useHandoverContract({ id: contractId })
    const handoverInitValue = useMemo(() => {
        return {
            isSignedByStaff: contract?.isSignedByStaff ?? false,
            isSignedByCustomer: contract?.isSignedByCustomer ?? false
        }
    }, [contract?.isSignedByCustomer, contract?.isSignedByStaff])
    const handoverFormik = useFormik<HandoverContractReq>({
        initialValues: handoverInitValue,
        enableReinitialize: true,
        validationSchema: Yup.object().shape({
            isSignedByStaff: Yup.boolean().oneOf([true], t("signature.signed_by_staff_require")),
            isSignedByCustomer: isStaffInStation
                ? Yup.boolean().notRequired()
                : Yup.boolean().oneOf([true], t("signature.signed_by_customer_require"))
        }),
        onSubmit: async (value) => {
            if (!contract?.id) return
            await handoverMutation.mutateAsync({
                req: {
                    isSignedByStaff: value.isSignedByStaff,
                    isSignedByCustomer: value.isSignedByCustomer
                }
            })
        }
    })

    //======================================= //
    const hasRunUpdateRef = useRef(false)
    const handleUpdate = useCallback(async () => {
        await updateContractStatus.mutateAsync({ id: contractId })
    }, [contractId, updateContractStatus])
    useEffect(() => {
        const resultCodeRaw = searchParams.get("resultCode")
        if (resultCodeRaw == null || hasRunUpdateRef.current) return

        hasRunUpdateRef.current = true

        const resultCode = parseNumber(resultCodeRaw)

        if (resultCode === 0) {
            handleUpdate()
        } else {
            addToast({
                title: t("toast.error"),
                description: t("failed.payment"),
                color: "danger"
            })
        }
    }, [handleUpdate, parseNumber, searchParams, t])

    useEffect(() => {
        const resultCodeRaw = searchParams.get("resultCode")
        if (resultCodeRaw != null || hasRunUpdateRef.current || !contract) return

        const reservationInvoice = contract.invoices.find((i) => i.type === InvoiceType.Reservation)
        const handoverInvoice = contract.invoices.find((i) => i.type === InvoiceType.Handover)
        const refundInvoice = contract.invoices.find((i) => i.type === InvoiceType.Refund)

        switch (contract.status) {
            case RentalContractStatus.PaymentPending:
                if (
                    reservationInvoice?.status != InvoiceStatus.Paid &&
                    handoverInvoice?.status != InvoiceStatus.Paid
                ) {
                    return
                }
                break
            case RentalContractStatus.RefundPending:
                if (refundInvoice?.status != InvoiceStatus.Paid) {
                    return
                }
                break

            default:
                return
        }

        hasRunUpdateRef.current = true

        handleUpdate()
    }, [contract, handleUpdate, searchParams])

    //======================================= //
    if (isLoading || !contract)
        return (
            <div className="flex justify-center mt-65">
                <SpinnerStyled />
            </div>
        )

    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={cn("relative min-h-screen w-full max-w-7xl pt-12", className)}
        >
            <Link
                className="absolute top-0 left-0 hover:cursor-pointer text-gray-500 italic hidden sm:block"
                href={returnPath}
            >
                {t("rental_contract.back_to_rental_contract")}
            </Link>
            {/* Header */}
            <div className="text-center space-y-3 mb-12">
                <h1 className="text-4xl font-bold text-primary">
                    {t("rental_contract.rental_contract")}
                </h1>
                <p className="text-gray-600 dark:text-gray-400 text-lg">
                    {t("rental_contract.rental_contract_details_description")}
                </p>
                <Chip className={RentalContractStatusColorMap[contract.status]}>
                    {contract.status === RentalContractStatus.Active && !!contract.actualStartDate
                        ? t("enum.renting")
                        : RentalContractStatusLabels[contract.status]}
                </Chip>
            </div>

            {/* Contract Info */}
            <SectionStyled title={t("rental_contract.rental_contract_information")}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                        {/* <span onClick={onOpen} className="hover:cursor-pointer">
                            {t("table.customer")}
                            {": "}
                            {toFullName({
                                firstName: contract.customer.firstName,
                                lastName: contract.customer.lastName
                            })}
                        </span> */}
                        <span onClick={onOpen} className="hover:cursor-pointer flex items-center">
                            {t("table.customer")}
                            {": "}
                            {toFullName({
                                firstName: contract.customer.firstName,
                                lastName: contract.customer.lastName
                            })}
                            <span className="underline ml-2 text-sm text-gray-400 ">
                                <EyeIcon size={18} />
                            </span>
                        </span>

                        <ViewUserModal
                            isOpen={isOpen}
                            onOpenChange={onOpenChange}
                            user={contract.customer}
                        />
                        <div>
                            {t("rental_contract.create_at")}
                            {": "}
                            {contract.createdAt && formatDateTime({ date: contract.createdAt })}
                        </div>
                    </div>

                    <InputStyled
                        isReadOnly
                        label={t("rental_contract.contract_code")}
                        value={contract.id}
                        startContent={
                            <Invoice size={22} className="text-primary" weight="duotone" />
                        }
                        variant="bordered"
                        // className="sm:col-span-2"
                    />
                    <div className="flex gap-4">
                        <InputStyled
                            isReadOnly
                            label={t("rental_contract.vehicle_name")}
                            value={contract.vehicle?.model.name || "-"}
                            startContent={
                                <Car size={22} className="text-primary" weight="duotone" />
                            }
                            variant="bordered"
                        />
                        <InputStyled
                            isReadOnly
                            label={t("rental_contract.license_plate")}
                            value={contract.vehicle?.licensePlate || "-"}
                            startContent={
                                <IdentificationBadge
                                    size={22}
                                    className="text-primary"
                                    weight="duotone"
                                />
                            }
                            variant="bordered"
                        />
                    </div>

                    <InputStyled
                        isReadOnly
                        label={t("station.station")}
                        value={`${contract.station.name} - ${contract.station.address}`}
                        startContent={
                            <ClipboardText size={22} className="text-primary" weight="duotone" />
                        }
                        variant="bordered"
                    />

                    <InputStyled
                        isReadOnly
                        label={t("rental_contract.customer_notes")}
                        value={contract.notes || ""}
                        variant="bordered"
                    />

                    <TextareaStyled
                        isReadOnly
                        label={t("rental_contract.contract_description")}
                        value={contract.description}
                        placeholder=". . ."
                        variant="bordered"
                        className="sm:col-span-2"
                    />
                </div>
            </SectionStyled>

            {/*Rental Dates */}
            <SectionStyled title={t("rental_contract.rental_duration")}>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    <DateTimeStyled
                        value={toZonedDateTime(contract.startDate)}
                        label={t("rental_contract.start_date")}
                        isReadOnly
                        endContent
                    />
                    <DateTimeStyled
                        value={toZonedDateTime(contract.actualStartDate)}
                        label={t("rental_contract.actual_start_date")}
                        isReadOnly
                        endContent
                    />
                    <DateTimeStyled
                        value={toZonedDateTime(contract.endDate)}
                        label={t("rental_contract.end_date")}
                        isReadOnly
                        endContent
                    />
                    <DateTimeStyled
                        value={toZonedDateTime(contract.actualEndDate)}
                        label={t("rental_contract.actual_end_date")}
                        isReadOnly
                        endContent
                    />
                </div>
            </SectionStyled>

            {/*Staff Info */}
            <SectionStyled title={t("rental_contract.staff")}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <InputStyled
                        isReadOnly
                        label={t("rental_contract.vehicle_handover_staff")}
                        value={toFullName({
                            firstName: contract.handoverStaff?.firstName,
                            lastName: contract.handoverStaff?.lastName
                        })}
                        startContent={
                            <ArrowsLeftRight size={22} className="text-primary" weight="duotone" />
                        }
                        variant="bordered"
                    />
                    <InputStyled
                        isReadOnly
                        label={t("rental_contract.vehicle_return_staff")}
                        value={toFullName({
                            firstName: contract.returnStaff?.firstName,
                            lastName: contract.returnStaff?.lastName
                        })}
                        startContent={
                            <ArrowsLeftRight size={22} className="text-primary" weight="duotone" />
                        }
                        variant="bordered"
                    />
                </div>
            </SectionStyled>

            {/* Invoice Accordion  isLoading={isFetching}*/}
            <SectionStyled title={t("rental_contract.payment_invoice_list")}>
                <InvoiceAccordion
                    items={invoiceAccordion}
                    contractId={contract.id}
                    contractStatus={contract.status}
                    returnChecklist={returnChecklist}
                    className="mb-3"
                />
                {refundInvoiceCreateable && (
                    <CreateInvoiceSection contractId={contract.id} type={InvoiceType.Refund} />
                )}
            </SectionStyled>

            {/* Vehicle checklists */}
            <SectionStyled
                title={t("vehicle_checklist.vehicle_checklist")}
                childrenClassName="flex flex-wrap gap-2"
            >
                {isHandoverChecklistDisplay && (
                    <ChecklistSection
                        isStaff={isStaffInStation}
                        isCustomer={isCustomer}
                        isDisabled={isHandoverChecklistDisabled}
                        contract={contract}
                        checklist={handoverChecklist}
                        type={VehicleChecklistType.Handover}
                    />
                )}
                {isReturnChecklistDisplay && (
                    <ChecklistSection
                        isStaff={isStaffInStation}
                        isCustomer={isCustomer}
                        contract={contract}
                        checklist={returnChecklist}
                        type={VehicleChecklistType.Return}
                    />
                )}
            </SectionStyled>

            {/* Signature */}
            <SignatureSection
                // className="pt-10"
                sectionClassName="mt-8 mb-8"
                staffSign={{
                    id: "isSignedByStaff",
                    name: "isSignedByStaff",
                    checked: handoverFormik.values.isSignedByStaff,
                    isInvalid: !!(
                        isHandoverStaffEditable &&
                        handoverFormik.touched.isSignedByStaff &&
                        handoverFormik.errors.isSignedByStaff
                    ),
                    isSelected: handoverFormik.values.isSignedByStaff,
                    isReadOnly: !isHandoverStaffEditable,
                    // onValueChange: (value) => handoverFormik.setFieldValue("isSignedByStaff", value)
                    onChange: handoverFormik.handleChange,
                    onBlur: handoverFormik.handleBlur
                }}
                customerSign={{
                    id: "isSignedByCustomer",
                    name: "isSignedByCustomer",
                    checked: handoverFormik.values.isSignedByCustomer,
                    isInvalid: !!(
                        isHandoverCustomerEditable &&
                        handoverFormik.touched.isSignedByCustomer &&
                        handoverFormik.errors.isSignedByCustomer
                    ),
                    isSelected: handoverFormik.values.isSignedByCustomer,
                    isReadOnly: !isHandoverCustomerEditable,
                    // onValueChange: (value) => handoverFormik.setFieldValue("isSignedByCustomer", value)
                    onChange: handoverFormik.handleChange,
                    onBlur: handoverFormik.handleBlur
                }}
            />

            {/* Contract action button */}
            <div className="text-center mb-10">
                <BottomActionButtons
                    contract={contract}
                    isStaff={isStaffInStation}
                    isCustomer={isCustomer}
                    handoverFormik={handoverFormik}
                    handoverChecklist={handoverChecklist}
                />
            </div>
        </motion.div>
    )
}
