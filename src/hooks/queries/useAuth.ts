import { useTranslation } from "react-i18next"
import { authApi } from "@/services/authApi"
import { useMutation } from "@tanstack/react-query"
import { BackendError } from "@/models/common/response"
// import { UserProfileViewRes } from "@/models/user/schema/response"
import { useInvalidateMeQuery, useRemoveMeQuery, useTokenStore } from "@/hooks"
import { translateWithFallback } from "@/utils/helpers/translateWithFallback"
import { addToast } from "@heroui/toast"
// ===== Login and logout =====
export const useLogin = ({
    rememberMe,
    onSuccess
}: {
    rememberMe?: boolean
    onSuccess?: () => void
}) => {
    const { t } = useTranslation()
    const setAccessToken = useTokenStore((s) => s.setAccessToken)
    const invalidateMeQuery = useInvalidateMeQuery()

    return useMutation({
        mutationFn: authApi.login,
        onSuccess: (data) => {
            setAccessToken(data.accessToken, rememberMe)
            invalidateMeQuery()
            onSuccess?.()
            addToast({
                title: t("toast.success"),
                description: t("success.login"),
                color: "success"
            })
        },
        onError: (error: BackendError) => {
            addToast({
                title: error.title || t("toast.error"),
                description: translateWithFallback(t, error.detail),
                color: "danger"
            })
        }
    })
}

export const useLogout = ({ onSuccess }: { onSuccess?: () => void }) => {
    const { t } = useTranslation()
    const removeAccessToken = useTokenStore((s) => s.removeAccessToken)
    const removeMeQuery = useRemoveMeQuery()

    return useMutation({
        mutationFn: authApi.logout,
        onSuccess: () => {
            onSuccess?.()
            removeAccessToken()
            removeMeQuery()
            addToast({
                title: t("toast.success"),
                description: t("success.logout"),
                color: "success"
            })
        },
        onError: (error: BackendError) => {
            addToast({
                title: error.title || t("toast.error"),
                description: translateWithFallback(t, error.detail),
                color: "danger"
            })
        }
    })
}

export const useLoginGoogle = ({
    rememberMe,
    onSuccess
}: {
    rememberMe?: boolean
    onSuccess?: () => void
}) => {
    const { t } = useTranslation()
    const setAccessToken = useTokenStore((s) => s.setAccessToken)
    const invalidateMeQuery = useInvalidateMeQuery()

    return useMutation({
        mutationFn: authApi.loginGoogle,
        onSuccess: (data) => {
            setAccessToken(data.accessToken, rememberMe)
            invalidateMeQuery()
            onSuccess?.()
            addToast({
                title: t("toast.success"),
                description: t("success.login"),
                color: "success"
            })
        },
        onError: (error: BackendError) => {
            addToast({
                title: error.title || t("toast.error"),
                description: translateWithFallback(t, error.detail),
                color: "danger"
            })
        }
    })
}

// ===== Register =====
export const useRegister = ({ onSuccess }: { onSuccess?: () => void }) => {
    const { t } = useTranslation()

    return useMutation({
        mutationFn: authApi.register,
        onSuccess: onSuccess,
        onError: (error: BackendError) => {
            addToast({
                title: error.title || t("toast.error"),
                description: translateWithFallback(t, error.detail),
                color: "danger"
            })
        }
    })
}

export const useRegisterVerify = ({ onSuccess }: { onSuccess?: () => void }) => {
    const { t } = useTranslation()

    return useMutation({
        mutationFn: authApi.registerVerify,
        onSuccess: onSuccess,
        onError: (error: BackendError) => {
            addToast({
                title: error.title || t("toast.error"),
                description: translateWithFallback(t, error.detail),
                color: "danger"
            })
        }
    })
}

export const useRegisterComplete = ({ onSuccess }: { onSuccess?: () => void }) => {
    const { t } = useTranslation()
    const setAccessToken = useTokenStore((s) => s.setAccessToken)
    const invalidateMeQuery = useInvalidateMeQuery()

    return useMutation({
        mutationFn: authApi.regsiterComplete,
        onSuccess: (data) => {
            setAccessToken(data.accessToken)
            invalidateMeQuery()
            onSuccess?.()
            addToast({
                title: t("toast.success"),
                description: t("success.register"),
                color: "success"
            })
        },
        onError: (error: BackendError) => {
            addToast({
                title: error.title || t("toast.error"),
                description: translateWithFallback(t, error.detail),
                color: "danger"
            })
        }
    })
}

// ===== Password =====
export const useForgotPassword = ({ onSuccess }: { onSuccess?: () => void }) => {
    const { t } = useTranslation()

    return useMutation({
        mutationFn: authApi.forgotPassword,
        onSuccess: onSuccess,
        onError: (error: BackendError) => {
            addToast({
                title: error.title || t("toast.error"),
                description: translateWithFallback(t, error.detail),
                color: "danger"
            })
        }
    })
}

export const useForgotPasswordVerify = ({ onSuccess }: { onSuccess?: () => void }) => {
    const { t } = useTranslation()

    return useMutation({
        mutationFn: authApi.forgotPasswordVerify,
        onSuccess: onSuccess,
        onError: (error: BackendError) => {
            addToast({
                title: error.title || t("toast.error"),
                description: translateWithFallback(t, error.detail),
                color: "danger"
            })
        }
    })
}

export const useResetPassword = ({ onSuccess }: { onSuccess?: () => void }) => {
    const { t } = useTranslation()

    return useMutation({
        mutationFn: authApi.resetPassword,
        onSuccess: () => {
            onSuccess?.()
            addToast({
                title: t("toast.success"),
                description: t("success.reset_password"),
                color: "success"
            })
        },
        onError: (error: BackendError) => {
            addToast({
                title: error.title || t("toast.error"),
                description: translateWithFallback(t, error.detail),
                color: "danger"
            })
        }
    })
}

export const useChangePassword = ({ onSuccess }: { onSuccess?: () => void }) => {
    const { t } = useTranslation()
    const removeAccessToken = useTokenStore((s) => s.removeAccessToken)
    const removeMeQuery = useRemoveMeQuery()

    return useMutation({
        mutationFn: authApi.changePassword,
        onSuccess: () => {
            removeAccessToken()
            removeMeQuery()
            onSuccess?.()
            addToast({
                title: t("toast.success"),
                description: t("success.change_password"),
                color: "success"
            })
        },
        onError: (error: BackendError) => {
            addToast({
                title: error.title || t("toast.error"),
                description: translateWithFallback(t, error.detail),
                color: "danger"
            })
        }
    })
}
