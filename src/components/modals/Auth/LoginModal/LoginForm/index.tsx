"use client"
import { Checkbox, Divider, Link } from "@heroui/react"
import React, { useCallback, useState } from "react"
import { useFormik } from "formik"
import * as Yup from "yup"
import { useTranslation } from "react-i18next"
import { ButtonStyled, ButtonToggleVisibility, InputStyled, LogoStyled } from "@/components"
import {
    useForgotPasswordDiscloresureSingleton,
    useLogin,
    useLoginDiscloresureSingleton,
    useRegisterDiscloresureSingleton
} from "@/hooks"
import { GoogleLoginButton } from "./GoogleLoginButton"
import { EMAIL_REGEX } from "@/constants/regex"

export function LoginForm({ onSuccess }: { onSuccess?: () => void }) {
    const { t } = useTranslation()
    // const router = useRouter()
    // const pathname = usePathname()
    // const { data: currentUser } = useGetMe()

    const [isVisible, setIsVisible] = useState(false)
    const [rememberMe, setRememberMe] = useState(true)
    const loginMutation = useLogin({ rememberMe, onSuccess })
    const { onClose: onCloseLogin } = useLoginDiscloresureSingleton()
    const { onOpen: onOpenRegister } = useRegisterDiscloresureSingleton()
    const { onOpen: onOpenForgot } = useForgotPasswordDiscloresureSingleton()

    // useEffect(() => {
    //     if (!currentUser) return
    //     const roleName = currentUser.role?.name
    //     const isStaffOrAdmin =
    //         roleName === RoleName.Admin || roleName === RoleName.Staff || RoleName.SuperAdmin
    //     if (!isStaffOrAdmin) return
    //     if (pathname.startsWith("/dashboard")) return
    //     router.replace("/dashboard")
    // }, [currentUser, pathname, router])

    // function
    const toggleVisibility = () => setIsVisible(!isVisible)

    const handleLogin = useCallback(
        async (values: { email: string; password: string }) => {
            await loginMutation.mutateAsync(values)
        },
        [loginMutation]
    )

    const handleOpenRegister = useCallback(() => {
        onCloseLogin()
        onOpenRegister()
    }, [onCloseLogin, onOpenRegister])

    const handleOpenForgot = useCallback(() => {
        onCloseLogin()
        onOpenForgot()
    }, [onCloseLogin, onOpenForgot])

    const formik = useFormik({
        initialValues: {
            email: "",
            password: ""
            // rememberMe: false
        },
        validationSchema: Yup.object().shape({
            email: Yup.string()
                .required(t("user.email_require"))
                .matches(EMAIL_REGEX, t("user.invalid_email")),
            password: Yup.string()
                .required(t("user.password_can_not_empty"))
                .min(8, t("user.password_too_short"))
        }),
        onSubmit: handleLogin
    })

    return (
        <div className="h-fit w-full max-w-sm mx-auto flex flex-col gap-4">
            <form
                onSubmit={formik.handleSubmit}
                className="flex h-full w-full items-center justify-center"
            >
                <div className="flex w-full flex-col gap-4">
                    <div className="flex flex-col items-center pb-6">
                        {/* <AcmeIcon size={60} /> */}
                        <LogoStyled className="mb-3" />
                        <p className="text-xl font-medium">{t("login.welcome")}</p>
                        <p className="text-small text-default-500">{t("login.login_continue")}</p>
                    </div>

                    <div className="flex flex-col gap-3">
                        <InputStyled
                            // className="my-3"
                            variant="bordered"
                            label={t("auth.email")}
                            value={formik.values.email}
                            onValueChange={(value) => formik.setFieldValue("email", value)}
                            isInvalid={!!(formik.touched.email && formik.errors.email)}
                            errorMessage={formik.errors.email}
                            onBlur={() => {
                                formik.setFieldTouched("email")
                            }}
                        />
                        <InputStyled
                            variant="bordered"
                            label={t("auth.password")}
                            type={isVisible ? "text" : "password"}
                            value={formik.values.password}
                            onValueChange={(value) => formik.setFieldValue("password", value)}
                            isInvalid={!!(formik.touched.password && formik.errors.password)}
                            errorMessage={formik.errors.password}
                            onBlur={() => {
                                formik.setFieldTouched("password")
                            }}
                            endContent={
                                <ButtonToggleVisibility
                                    isVisible={isVisible}
                                    toggleVisibility={toggleVisibility}
                                />
                            }
                        />
                    </div>

                    <div className="flex w-full items-center justify-between px-1 py-2">
                        <div className="flex flex-col gap-2">
                            {/* <Checkbox
                            isSelected={formik.values.rememberMe}
                            onValueChange={(isSelected) =>
                                formik.setFieldValue("rememberMe", isSelected)
                            }
                        > */}
                            <Checkbox
                                isSelected={rememberMe}
                                onValueChange={(isSelected) => setRememberMe(isSelected)}
                            >
                                {t("login.remember")}
                            </Checkbox>
                        </div>
                        <div>
                            <Link
                                className="text-default-500 cursor-pointer"
                                size="sm"
                                onPress={handleOpenForgot}
                            >
                                {t("login.forgot")}
                            </Link>
                        </div>
                    </div>

                    <ButtonStyled
                        className="w-full"
                        type="submit"
                        isLoading={formik.isSubmitting}
                        color="primary"
                        isDisabled={!formik.isValid}
                        onPress={() => formik.submitForm()}
                    >
                        {t("login.login")}
                    </ButtonStyled>
                </div>
            </form>
            <div className="flex items-center gap-4 py-2">
                <Divider className="flex-1" />
                <p className="text-tiny text-default-500 shrink-0">{t("login.or")}</p>
                <Divider className="flex-1" />
            </div>
            <div className="flex flex-col gap-2">
                <GoogleLoginButton rememberMe={rememberMe} onSuccess={onSuccess} />
            </div>
            <p className="text-small text-center">
                {t("login.need_to_create_an_account")}&nbsp;
                <Link isBlock onPress={handleOpenRegister} className="cursor-pointer">
                    {t("login.register")}
                </Link>
            </p>
        </div>
    )
}
