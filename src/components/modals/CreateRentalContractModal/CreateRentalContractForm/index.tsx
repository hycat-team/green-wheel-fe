"use client"

import React, { useState, useEffect, useCallback, useMemo } from "react"
import { useFormik } from "formik"
import * as Yup from "yup"
import { useTranslation } from "react-i18next"
// import Link from "next/link"

import {
    useBookingFilterStore,
    useGetAllStations,
    useGetMe,
    useCreateRentalContract,
    useDay,
    useCreateContractManual,
    useUserHelper
} from "@/hooks"
import {
    ButtonStyled,
    InputStyled,
    ImageStyled,
    TextareaStyled,
    TempInvoice,
    TitleSkeleton
} from "@/components"
import { Spinner, useDisclosure } from "@heroui/react"
import { translateWithFallback } from "@/utils/helpers/translateWithFallback"
import { BackendError } from "@/models/common/response"
import { VehicleModelViewRes } from "@/models/vehicle/schema/response"
import { CheckboxStyled, SelectUserModal } from "@/components"
import { UserProfileViewRes } from "@/models/user/schema/response"
import { addToast } from "@heroui/toast"
import { DATE_TIME_VIEW_FORMAT } from "@/constants/constants"
import Link from "next/link"

type FormValues = {
    fullName: string
    phone: string
    email: string
    stationId: string
    notes: string
    // paymentMethod: PaymentMethod
    agreePolicy: boolean
    // agreeTerms: boolean
    // agreeDataPolicy: boolean
}

export const CreateRentalContractForm = ({
    isCustomer = false,
    isStaff = false,
    onSuccess,
    totalDays,
    totalPrice,
    modelViewRes
}: {
    isCustomer: boolean
    isStaff: boolean
    onSuccess?: () => void
    totalDays: number
    totalPrice: number
    modelViewRes: VehicleModelViewRes
}) => {
    const { t } = useTranslation()
    const { formatDateTime } = useDay({ defaultFormat: DATE_TIME_VIEW_FORMAT })
    const { toFullName, isUserValidForBooking } = useUserHelper()

    // const handleOpenPolicy = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    //     e.preventDefault()
    //     e.stopPropagation()
    //     window.open("/policy", "_blank", "noopener,noreferrer")
    // }, [])

    const [mounted, setMounted] = useState(false)
    const createContract = useCreateRentalContract({ onSuccess })
    const createContractManual = useCreateContractManual({ onSuccess })

    const { data: userMe, isLoading: isUserLoading, error: userError } = useGetMe()

    const {
        data: stations,
        isLoading: isStationsLoading,
        error: stationsError
    } = useGetAllStations()

    const stationId = useBookingFilterStore((s) => s.stationId)
    const startDate = useBookingFilterStore((s) => s.startDate)
    const endDate = useBookingFilterStore((s) => s.endDate)

    const station = useMemo(() => {
        return stations?.filter((s) => s.id === stationId)[0]
    }, [stationId, stations])

    // =========================
    // Handle create
    // =========================
    const {
        isOpen: isSelectUserOpen,
        onOpen: onOpenSelectUser,
        onOpenChange: onOpenChangeSelectUser,
        onClose: onCloseSelectUser
    } = useDisclosure()
    const [user, setUser] = useState<UserProfileViewRes | undefined>(
        isCustomer ? userMe : undefined
    )

    const handleCreateContract = useCallback(
        async ({ notes }: { notes: string }) => {
            await createContract.mutateAsync({
                modelId: modelViewRes.id,
                stationId: stationId!,
                startDate: startDate!,
                endDate: endDate!,
                notes
            })
        },
        [createContract, endDate, modelViewRes.id, startDate, stationId]
    )

    const handleCreateManual = useCallback(
        async ({ notes }: { notes: string }) => {
            if (!user) return
            await createContractManual.mutateAsync({
                customerId: user.id,
                modelId: modelViewRes.id,
                stationId: stationId!,
                startDate: startDate!,
                endDate: endDate!,
                notes
            })
        },
        [createContractManual, endDate, modelViewRes.id, startDate, stationId, user]
    )

    const handleSubmit = useCallback(
        ({ notes }: { notes: string }) => {
            if (!isUserValidForBooking(user)) {
                addToast({
                    title: t("toast.error"),
                    description: t("user.enter_required_info"),
                    color: "danger"
                })
                return
            }
            if (isStaff) handleCreateManual({ notes })
            if (isCustomer) handleCreateContract({ notes })
        },
        [
            handleCreateContract,
            handleCreateManual,
            isCustomer,
            isStaff,
            isUserValidForBooking,
            t,
            user
        ]
    )

    // =========================
    // Handle moute
    // =========================
    useEffect(() => {
        setMounted(!isUserLoading && !isStationsLoading)
    }, [isStationsLoading, isUserLoading])

    useEffect(() => {
        if (userError || stationsError) {
            const error = (userError as BackendError) || (stationsError as BackendError)
            addToast({
                title: error.title || t("toast.error"),
                description: translateWithFallback(t, error.detail),
                color: "danger"
            })
            onSuccess?.()
        }
    }, [onSuccess, stationsError, t, userError])

    const initialValues: FormValues = {
        fullName: toFullName({
            firstName: user?.firstName,
            lastName: user?.lastName
        }),
        phone: user?.phone ?? "",
        email: user?.email ?? "",
        stationId: stationId || "",
        notes: "",
        agreePolicy: false
        // agreeTerms: false,
        // agreeDataPolicy: false
    }

    const formik = useFormik<FormValues>({
        initialValues,
        enableReinitialize: true,
        validateOnMount: true,
        validationSchema: Yup.object().shape({
            fullName: Yup.string().trim().required(t("contral_form.full_name_require")),
            phone: Yup.string().trim().required(t("contral_form.phone_require")),
            email: Yup.string().trim().email(t("contral_form.email_invalid")),
            stationId: Yup.string().trim().required(t("contral_form.station_require")),
            notes: Yup.string().trim(),
            agreePolicy: Yup.boolean().oneOf([true], t("contral_form.agree_terms_require"))
            // agreeTerms: Yup.boolean().oneOf([true], t("contral_form.agree_terms_require")),
            // agreeDataPolicy: Yup.boolean().oneOf(
            //     [true],
            //     t("contral_form.agree_data_policy_require")
            // )
        }),
        onSubmit: () => {
            handleSubmit({
                notes: formik.values.notes
            })
            formik.setSubmitting(false)
        }
    })

    return (
        <div className="px-1 sm:px-6 lg:px-8">
            {mounted ? (
                <div className="mx-auto max-w-5xl bg-white rounded-lg ">
                    <form onSubmit={formik.handleSubmit} className="px-0 sm:px-6" noValidate>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Cột trái */}
                            <div>
                                {isStaff && (
                                    <>
                                        <SelectUserModal
                                            isOpen={isSelectUserOpen}
                                            onOpenChange={onOpenChangeSelectUser}
                                            onClose={onCloseSelectUser}
                                            setUser={setUser}
                                        />
                                        <ButtonStyled
                                            onPress={onOpenSelectUser}
                                            className="mb-3 text-black"
                                        >
                                            {t("car_rental.select_customer")}
                                        </ButtonStyled>
                                    </>
                                )}

                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-2">
                                        {/* Họ tên */}
                                        <InputStyled
                                            variant="bordered"
                                            label={t("car_rental.renter_name")}
                                            placeholder={t("car_rental.renter_name_placeholder")}
                                            value={formik.values.fullName}
                                            isInvalid={!!formik.errors.fullName}
                                            errorMessage={formik.errors.fullName}
                                            readOnly={true}
                                        />

                                        {/* Phone */}
                                        <InputStyled
                                            variant="bordered"
                                            label={t("car_rental.phone")}
                                            placeholder={t("car_rental.phone_placeholder")}
                                            type="tel"
                                            inputMode="numeric"
                                            value={formik.values.phone}
                                            isInvalid={!!formik.errors.phone}
                                            errorMessage={formik.errors.phone}
                                            readOnly={true}
                                        />

                                        {/* Pickup location */}
                                        <InputStyled
                                            variant="bordered"
                                            label={t("car_rental.pickup_location")}
                                            value={`${station?.name || ""} - ${
                                                station?.address || ""
                                            }`}
                                            readOnly={true}
                                        />

                                        {/* Email */}
                                        <InputStyled
                                            variant="bordered"
                                            label={t("car_rental.email")}
                                            placeholder={t("car_rental.email_placeholder")}
                                            type="email"
                                            value={formik.values.email}
                                            isInvalid={!!formik.errors.email}
                                            errorMessage={formik.errors.email}
                                            readOnly={true}
                                        />
                                    </div>

                                    {/* notes */}
                                    <TextareaStyled
                                        label={t("car_rental.note")}
                                        placeholder=""
                                        value={formik.values.notes}
                                        onValueChange={(v) => formik.setFieldValue("notes", v)}
                                        onBlur={() => formik.setFieldTouched("notes", true)}
                                        isInvalid={!!(formik.touched.notes && formik.errors.notes)}
                                        errorMessage={
                                            formik.touched.notes ? formik.errors.notes : undefined
                                        }
                                        minRows={4}
                                    />
                                </div>

                                {/* Policy */}
                                {/* <div className="mt-6 space-y-4">
                                    <CheckboxStyled
                                        id="agreeTerms"
                                        name="agreeTerms"
                                        checked={formik.values.agreeTerms}
                                        isInvalid={
                                            !!(
                                                formik.touched.agreeTerms &&
                                                formik.errors.agreeTerms
                                            )
                                        }
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        className="mt-1"
                                    >
                                        {t("car_rental.agree_terms")}{" "}
                                        <Link href="#" className="text-blue-600 hover:underline">
                                            {t("car_rental.payment_terms")}
                                        </Link>{" "}
                                        {t("car_rental.of_green_wheel")}
                                    </CheckboxStyled> */}

                                <div className="mt-6 space-y-4">
                                    <CheckboxStyled
                                        id="agreePolicy"
                                        name="agreePolicy"
                                        checked={formik.values.agreePolicy}
                                        isInvalid={
                                            !!(
                                                formik.touched.agreePolicy &&
                                                formik.errors.agreePolicy
                                            )
                                        }
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        className="mt-1"
                                    >
                                        {t("car_rental.agree_terms")}{" "}
                                        <Link
                                            href="/policy"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sky-500 hover:text-sky-700 hover:underline pointer-events-auto relative z-10 font-bold"
                                        >
                                            {t("car_rental.policy_terms")}{" "}
                                        </Link>
                                        {/* </Link>{" "}
                                        {t("car_rental.of_green_wheel")}
                                    </CheckboxStyled>

                                    <CheckboxStyled
                                        id="agreeDataPolicy"
                                        name="agreeDataPolicy"
                                        checked={formik.values.agreeDataPolicy}
                                        isInvalid={
                                            !!(
                                                formik.touched.agreeDataPolicy &&
                                                formik.errors.agreeDataPolicy
                                            )
                                        }
                                        // aria-errormessage={formik.errors.agreeDataPolicy}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    >
                                        {t("car_rental.agree_data_policy")}{" "}
                                        <Link href="#" className="text-blue-600 hover:underline">
                                            {t("car_rental.data_sharing_terms")}
                                        </Link>{" "} */}
                                        {t("car_rental.of_green_wheel")}
                                    </CheckboxStyled>
                                </div>
                            </div>

                            {/* Cột phải: Thông tin xe */}
                            <div>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <div className="flex items-center space-x-4">
                                        <div
                                            className="
                                                relative overflow-hidden rounded-md
                                                w-40 h-28
                                                sm:w-48 sm:h-32
                                                md:w-56 md:h-36
                                            "
                                        >
                                            {/* <ImageStyled
                                                src={modelViewRes.imageUrl}
                                                alt={t("car_rental.vehicle")}
                                                className="absolute inset-0 object-contain"
                                                width={200}
                                                height={150}
                                            /> */}
                                            {modelViewRes.imageUrl ? (
                                                <ImageStyled
                                                    src={modelViewRes.imageUrl}
                                                    alt={t("car_rental.vehicle")}
                                                    className="absolute inset-0 object-contain"
                                                    width={800}
                                                    height={520}
                                                />
                                            ) : (
                                                <TitleSkeleton />
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-medium">
                                                {modelViewRes.name}
                                            </h3>
                                        </div>
                                    </div>

                                    <div className="mt-4 bg-blue-50 p-4 rounded-lg">
                                        <div className="flex justify-between items-center">
                                            <h4 className="font-medium">{station?.name}</h4>
                                            <div>{station?.address}</div>
                                        </div>
                                        <div className="mt-2 flex items-center">
                                            <span>
                                                {`${totalDays} ${t(
                                                    "car_rental.days"
                                                )} • ${formatDateTime({
                                                    date: startDate!
                                                })} → ${formatDateTime({ date: endDate! })}`}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="mt-4">
                                        <h4 className="font-medium text-center">
                                            {t("invoice.temp")}
                                        </h4>
                                        <TempInvoice
                                            model={modelViewRes}
                                            totalDays={totalDays}
                                            totalPrice={totalPrice}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Submit */}
                        <div className="mt-8 text-center">
                            <ButtonStyled
                                type="submit"
                                isDisabled={!formik.isValid || formik.isSubmitting}
                                isLoading={formik.isSubmitting}
                                color={
                                    !formik.isValid || formik.isSubmitting ? "default" : "success"
                                }
                                variant={!formik.isValid || formik.isSubmitting ? "flat" : "solid"}
                                className="px-8 py-2 rounded-md"
                            >
                                {t("rental_contract.send_rental_request")}
                            </ButtonStyled>
                        </div>
                    </form>
                </div>
            ) : (
                <Spinner />
            )}
        </div>
    )
}
