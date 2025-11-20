"use client"
import React, { useCallback, useMemo } from "react"
import { useFormik } from "formik"
import * as Yup from "yup"
import { motion } from "framer-motion"
import { useTranslation } from "react-i18next"
import { MapPin, Phone, EnvelopeSimple, PaperPlaneTilt } from "@phosphor-icons/react"
import { ButtonStyled, InputStyled, TextareaStyled } from "@/components"
import {
    GREENWHEEL_ADDRESS,
    GREENWHEEL_ADDRESS_URL,
    GREENWHEEL_EMAIL,
    GREENWHEEL_PHONE
} from "@/constants/constants"
import { EMAIL_REGEX, PHONE_REGEX } from "@/constants/regex"
import { useCreateContact, useUserHelper } from "@/hooks"
import { Spinner } from "@heroui/react"

type FormikValues = {
    lastName: string
    firstName: string
    email: string
    phone: string
    description?: string
}

export default function ContactPage() {
    const { t } = useTranslation()
    const { toFullName } = useUserHelper()

    const createMutation = useCreateContact({ onSuccess: undefined })
    const handleCreate = useCallback(
        async (values: FormikValues) => {
            const description = [
                `Name: ${toFullName({
                    firstName: values.firstName,
                    lastName: values.lastName
                })}`,
                `Email: ${values.email}`,
                `Phone: ${values.phone}`,
                values.description && `Description: ${values.description}`
            ]
                .filter(Boolean)
                .join("\n")

            await createMutation.mutateAsync({
                title: "Contact",
                description
            })
        },
        [createMutation, toFullName]
    )

    const validationSchema = useMemo(() => {
        return Yup.object({
            lastName: Yup.string().required(t("user.last_name_require")),
            firstName: Yup.string().required(t("user.first_name_require")),
            email: Yup.string()
                .required(t("user.email_require"))
                .matches(EMAIL_REGEX, t("user.invalid_email")),
            phone: Yup.string()
                .required(t("user.phone_require"))
                .matches(PHONE_REGEX, t("user.invalid_phone")),
            description: Yup.string()
        })
    }, [t])

    const formik = useFormik<FormikValues>({
        initialValues: {
            lastName: "",
            firstName: "",
            email: "",
            phone: "",
            description: undefined
        },
        validationSchema,
        onSubmit: handleCreate
    })

    return (
        <div className="min-h-screen flex items-center justify-center py-24 px-4 mt-[-6rem]">
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-5xl bg-white/80 backdrop-blur-md shadow-xl rounded-2xl p-10 border border-gray-100"
            >
                {/* Header */}
                <div className="text-center space-y-3">
                    <h2 className="text-4xl font-bold text-primary">{t("contact.title")}</h2>
                    <p className="text-gray-600 text-lg">{t("contact.des")}</p>
                </div>

                {/* Content */}
                <div className="flex flex-col lg:flex-row gap-10 mt-10">
                    {/* LEFT: Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, x: -40 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="flex-1 space-y-4"
                    >
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <InputStyled
                                variant="bordered"
                                label={t("user.last_name")}
                                value={formik.values.lastName}
                                onValueChange={(value) => formik.setFieldValue("lastName", value)}
                                onBlur={() => formik.setFieldTouched("lastName")}
                                isInvalid={!!(formik.touched.lastName && formik.errors.lastName)}
                                errorMessage={formik.errors.lastName}
                            />
                            <InputStyled
                                variant="bordered"
                                label={t("user.first_name")}
                                value={formik.values.firstName}
                                onValueChange={(value) => formik.setFieldValue("firstName", value)}
                                onBlur={() => formik.setFieldTouched("firstName")}
                                isInvalid={!!(formik.touched.firstName && formik.errors.firstName)}
                                errorMessage={formik.errors.firstName}
                            />
                        </div>
                        <InputStyled
                            variant="bordered"
                            label={t("auth.email")}
                            value={formik.values.email}
                            onValueChange={(value) => formik.setFieldValue("email", value)}
                            onBlur={() => formik.setFieldTouched("email")}
                            isInvalid={!!(formik.touched.email && formik.errors.email)}
                            errorMessage={formik.errors.email}
                        />
                        <InputStyled
                            variant="bordered"
                            label={t("user.phone")}
                            value={formik.values.phone}
                            maxLength={10}
                            onValueChange={(value) => formik.setFieldValue("phone", value)}
                            onBlur={() => formik.setFieldTouched("phone")}
                            isInvalid={!!(formik.touched.phone && formik.errors.phone)}
                            errorMessage={formik.errors.phone}
                        />
                        <TextareaStyled
                            label={t("contact.further_description")}
                            placeholder={t("contact.further_description_placeholder")}
                            value={formik.values.description}
                            variant="bordered"
                            onValueChange={(value) => formik.setFieldValue("description", value)}
                            className="min-h-28"
                        />

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
                                    {t("contact.send_message")}
                                </>
                            )}
                        </ButtonStyled>
                    </motion.div>

                    {/* RIGHT: Contact Info */}
                    <motion.div
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="flex-1 border-t lg:border-t-0 lg:border-l border-gray-200 pl-0 lg:pl-10 flex flex-col justify-between"
                    >
                        <div className="space-y-4">
                            <p className="flex items-center gap-3">
                                <MapPin size={22} weight="fill" className="text-primary" />
                                <span>
                                    <span className="font-bold text-primary">{`${t(
                                        "contact.address"
                                    )}: `}</span>
                                    {GREENWHEEL_ADDRESS}
                                </span>
                            </p>
                            <p className="flex items-center gap-3">
                                <Phone size={22} weight="fill" className="text-primary" />
                                <span>
                                    <span className="font-bold text-primary">{`${t(
                                        "contact.phone"
                                    )}: `}</span>
                                    {GREENWHEEL_PHONE}
                                </span>
                            </p>
                            <p className="flex items-center gap-3">
                                <EnvelopeSimple size={22} weight="fill" className="text-primary" />
                                <span>
                                    <span className="font-bold text-primary">{`${t(
                                        "contact.email"
                                    )}: `}</span>
                                    {GREENWHEEL_EMAIL}
                                </span>
                            </p>
                            <p className="text-gray-400 text-sm mt-2">{t("contact.sub")}</p>
                        </div>

                        {/* MAP */}
                        <iframe
                            src={GREENWHEEL_ADDRESS_URL}
                            width="100%"
                            height="200"
                            className="rounded-lg shadow-sm mt-6"
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        ></iframe>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    )
}
