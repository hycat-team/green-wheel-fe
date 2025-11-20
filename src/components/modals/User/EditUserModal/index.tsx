"use client"

import React, { useCallback, useEffect, useMemo, useState } from "react"
import { useFormik } from "formik"
import * as Yup from "yup"
import { useTranslation } from "react-i18next"
import { useQueryClient } from "@tanstack/react-query"

import {
    ButtonStyled,
    DatePickerStyled,
    DriverLicenseUploader,
    EnumPicker,
    ImageStyled,
    InputStyled,
    ModalContentStyled,
    ModalFooterStyled,
    ModalHeaderStyled,
    ModalStyled,
    CitizenIdentityUploader
} from "@/components"
import { RoleName, Sex } from "@/constants/enum"
import { SexLabels } from "@/constants/labels"
import { NAME_REGEX, PHONE_REGEX } from "@/constants/regex"
import { useDay, useUpdateUser } from "@/hooks"
import { UserProfileViewRes } from "@/models/user/schema/response"
import { UserUpdateReq } from "@/models/user/schema/request"
import { QUERY_KEYS } from "@/constants/queryKey"
import { CitizenIdentityViewRes } from "@/models/citizen-identity/schema/response"
import { DriverLicenseViewRes } from "@/models/driver-license/schema/response"
import { ModalBody } from "@heroui/react"

type EditUserModalProps = {
    user: UserProfileViewRes | null
    isOpen: boolean
    onClose: () => void
}

export function EditUserModal({ user, isOpen, onClose }: EditUserModalProps) {
    const { t } = useTranslation()
    const { formatDateTime, toDate } = useDay({ defaultFormat: "YYYY-MM-DD" })
    const queryClient = useQueryClient()
    const updateUserMutation = useUpdateUser({
        onSuccess: onClose
    })
    const [citizenUrl, setCitizenUrl] = useState<string | null>(user?.citizenUrl ?? null)
    const [licenseUrl, setLicenseUrl] = useState<string | null>(user?.licenseUrl ?? null)

    useEffect(() => {
        setCitizenUrl(user?.citizenUrl ?? null)
        setLicenseUrl(user?.licenseUrl ?? null)
    }, [user])

    const handleCitizenUploadSuccess = useCallback(
        (data: CitizenIdentityViewRes) => {
            setCitizenUrl(data.frontImageUrl ?? null)
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USERS, exact: false })
        },
        [queryClient]
    )

    const handleDriverUploadSuccess = useCallback(
        (data: DriverLicenseViewRes) => {
            setLicenseUrl(data.frontImageUrl ?? null)
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USERS, exact: false })
        },
        [queryClient]
    )

    const initialValues = useMemo(
        () => ({
            firstName: user?.firstName ?? "",
            lastName: user?.lastName ?? "",
            phone: user?.phone ?? "",
            sex: user?.sex ?? Sex.Male,
            dateOfBirth: user?.dateOfBirth ?? ""
        }),
        [user]
    )

    const formik = useFormik({
        enableReinitialize: true,
        initialValues,
        validationSchema: Yup.object({
            firstName: Yup.string()
                .required(t("user.first_name_require"))
                .matches(NAME_REGEX, t("user.invalid_first_name")),
            lastName: Yup.string()
                .required(t("user.last_name_require"))
                .matches(NAME_REGEX, t("user.invalid_last_name")),
            phone: Yup.string()
                .required(t("user.phone_require"))
                .matches(PHONE_REGEX, t("user.invalid_phone")),
            sex: Yup.number().required(t("user.sex_require")),
            dateOfBirth: Yup.string().required(t("user.date_of_birth_require"))
        }),
        onSubmit: async (values) => {
            if (!user?.id) return
            const payload: UserUpdateReq = {
                firstName: values.firstName,
                lastName: values.lastName,
                phone: values.phone,
                sex: values.sex,
                dateOfBirth: values.dateOfBirth
            }

            await updateUserMutation.mutateAsync({ userId: user.id, data: payload })
        }
    })

    return (
        <ModalStyled
            isOpen={isOpen}
            onOpenChange={(open) => {
                if (!open) {
                    onClose()
                }
            }}
            className="max-w-140"
        >
            <ModalContentStyled>
                <ModalHeaderStyled className="flex flex-col items-center font-semibold text-3xl">
                    {t("common.edit_user")}
                </ModalHeaderStyled>
                <ModalBody className="min-h-[70vh]">
                    <form onSubmit={formik.handleSubmit} className="flex flex-col gap-6">
                        {/* // === Name === */}
                        <div className="grid gap-4 md:grid-cols-2">
                            <InputStyled
                                label={t("user.last_name")}
                                variant="bordered"
                                value={formik.values.lastName}
                                onValueChange={(value) => formik.setFieldValue("lastName", value)}
                                isInvalid={!!(formik.touched.lastName && formik.errors.lastName)}
                                errorMessage={formik.errors.lastName}
                                onBlur={() => formik.setFieldTouched("lastName")}
                            />

                            <InputStyled
                                label={t("user.first_name")}
                                variant="bordered"
                                value={formik.values.firstName}
                                onValueChange={(value) => formik.setFieldValue("firstName", value)}
                                isInvalid={!!(formik.touched.firstName && formik.errors.firstName)}
                                errorMessage={formik.errors.firstName}
                                onBlur={() => formik.setFieldTouched("firstName")}
                            />
                        </div>

                        {/* ==== Contact ==== */}
                        <InputStyled
                            label={t("user.phone")}
                            variant="bordered"
                            maxLength={10}
                            value={formik.values.phone ?? ""}
                            onValueChange={(value) => formik.setFieldValue("phone", value)}
                            isInvalid={!!(formik.touched.phone && formik.errors.phone)}
                            errorMessage={formik.errors.phone}
                            onBlur={() => formik.setFieldTouched("phone")}
                            pattern="[0-9]*"
                            inputMode="numeric"
                            onInput={(event) => {
                                event.currentTarget.value = event.currentTarget.value.replace(
                                    /[^0-9]/g,
                                    ""
                                )
                            }}
                        />

                        {/* // === Personal Details === */}
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="flex flex-col gap-1">
                                <EnumPicker
                                    label={t("user.sex")}
                                    labels={SexLabels}
                                    value={formik.values.sex}
                                    className="w-full"
                                    onChange={(val) => {
                                        if (val === null) {
                                            formik.setFieldValue("sex", null)
                                            formik.setFieldTouched("sex", true)
                                            return
                                        }
                                        const nextValue = Number(val)
                                        if (Number.isNaN(nextValue)) {
                                            formik.setFieldValue("sex", null)
                                            formik.setFieldTouched("sex", true)
                                            return
                                        }
                                        formik.setFieldValue("sex", nextValue)
                                        formik.setFieldTouched("sex", true)
                                    }}
                                />
                                {formik.touched.sex && formik.errors.sex ? (
                                    <span className="text-sm text-danger">{formik.errors.sex}</span>
                                ) : null}
                            </div>

                            <DatePickerStyled
                                label={t("user.date_of_birth")}
                                value={
                                    formik.values.dateOfBirth
                                        ? toDate(formik.values.dateOfBirth)
                                        : null
                                }
                                onChange={(value) => {
                                    if (!value) {
                                        formik.setFieldValue("dateOfBirth", "")
                                        return
                                    }
                                    const dob = formatDateTime({ date: value })
                                    formik.setFieldValue("dateOfBirth", dob)
                                }}
                                isInvalid={
                                    !!(formik.touched.dateOfBirth && formik.errors.dateOfBirth)
                                }
                                errorMessage={formik.errors.dateOfBirth}
                            />
                        </div>
                    </form>

                    {user?.id && user.role?.name === RoleName.Customer ? (
                        <div className="mt-6 space-y-4">
                            {/* // === Citizen Identity === */}
                            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                                <div className="flex flex-col gap-3">
                                    <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                                        <div>
                                            <p className="text-lg font-semibold text-gray-900">
                                                {t("user.citizen_identity")}
                                            </p>
                                            {!citizenUrl ? (
                                                <p className="text-sm italic text-gray-500">
                                                    {t("user.please_upload_citizen_identity")}
                                                </p>
                                            ) : null}
                                        </div>
                                        <CitizenIdentityUploader
                                            customerId={user.id}
                                            btnClassName="text-primary font-semibold hover:text-primary/80"
                                            onSuccess={handleCitizenUploadSuccess}
                                        />
                                    </div>
                                    {citizenUrl ? (
                                        <ImageStyled
                                            src={citizenUrl}
                                            alt={t("user.citizen_identity")}
                                            width={500}
                                            height={312.5}
                                            className="w-full rounded-lg border border-dashed border-gray-200 object-cover"
                                        />
                                    ) : null}
                                </div>
                            </div>

                            {/* // === Driver License === */}
                            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                                <div className="flex flex-col gap-3">
                                    <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                                        <div>
                                            <p className="text-lg font-semibold text-gray-900">
                                                {t("user.driver_license")}
                                            </p>
                                            {!licenseUrl ? (
                                                <p className="text-sm italic text-gray-500">
                                                    {t("user.please_upload_driver_license")}
                                                </p>
                                            ) : null}
                                        </div>
                                        <DriverLicenseUploader
                                            customerId={user.id}
                                            btnClassName="text-primary font-semibold hover:text-primary/80"
                                            onSuccess={handleDriverUploadSuccess}
                                        />
                                    </div>
                                    {licenseUrl ? (
                                        <ImageStyled
                                            src={licenseUrl}
                                            alt={t("user.driver_license")}
                                            width={500}
                                            height={312.5}
                                            className="w-full rounded-lg border border-dashed border-gray-200 object-cover"
                                        />
                                    ) : null}
                                </div>
                            </div>
                        </div>
                    ) : null}
                </ModalBody>
                <ModalFooterStyled>
                    <ButtonStyled
                        className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-100"
                        onPress={onClose}
                        isDisabled={updateUserMutation.isPending}
                    >
                        {t("common.cancel")}
                    </ButtonStyled>
                    <ButtonStyled
                        type="submit"
                        className="bg-emerald-500 text-white px-6"
                        onPress={formik.submitForm}
                        isLoading={updateUserMutation.isPending}
                        isDisabled={updateUserMutation.isPending || !formik.isValid}
                    >
                        {t("common.save_changes")}
                    </ButtonStyled>
                </ModalFooterStyled>
            </ModalContentStyled>
        </ModalStyled>
    )
}
