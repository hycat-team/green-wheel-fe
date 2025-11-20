import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { QUERY_KEYS } from "@/constants/queryKey"
import { useTranslation } from "react-i18next"
import { BackendError } from "@/models/common/response"
import { translateWithFallback } from "@/utils/helpers/translateWithFallback"
import { UserUpdateReq } from "@/models/user/schema/request"
import { UserProfileViewRes } from "@/models/user/schema/response"
import { profileApi } from "@/services/profileApi"
import { CitizenIdentityViewRes } from "@/models/citizen-identity/schema/response"
import { DriverLicenseViewRes } from "@/models/driver-license/schema/response"
import { addToast } from "@heroui/toast"

export const useInvalidateMeQuery = () => {
    const queryClient = useQueryClient()

    return () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ME })
}

export const useRemoveMeQuery = () => {
    const queryClient = useQueryClient()

    return () => queryClient.removeQueries({ queryKey: QUERY_KEYS.ME })
}

export const useGetMe = ({ enabled = true }: { enabled?: boolean } = {}) => {
    const query = useQuery({
        queryKey: QUERY_KEYS.ME,
        queryFn: profileApi.getMe,
        enabled,
        staleTime: 14 * 60 * 1000,
        refetchOnMount: false,
        refetchOnWindowFocus: false
    })
    return query
}

export const useUpdateMe = ({
    onSuccess,
    showToast = true
}: { onSuccess?: () => void; showToast?: boolean } = {}) => {
    const { t } = useTranslation()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (req: UserUpdateReq) => {
            await profileApi.updateMe(req)
            return req
        },
        onSuccess: (data) => {
            queryClient.setQueryData<UserProfileViewRes>(QUERY_KEYS.ME, (prev) => {
                if (!prev) return prev
                return {
                    ...prev,
                    ...data
                }
            })
            onSuccess?.()
            if (showToast) {
                addToast({
                    title: t("toast.success"),
                    description: t("success.update"),
                    color: "success"
                })
            }
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

// export const useUpdateBankAccount = ({ onSuccess }: { onSuccess?: () => void }) => {
//     const { t } = useTranslation()
//     const queryClient = useQueryClient()

//     return useMutation({
//         mutationFn: async (req: UpdateBankAccountReq) => {
//             await profileApi.updateBankAccount(req)
//             return req
//         },
//         onSuccess: (data) => {
//             queryClient.setQueryData<UserProfileViewRes>(QUERY_KEYS.ME, (prev) => {
//                 if (!prev) return prev
//                 return {
//                     ...prev,
//                     ...data
//                 }
//             })

//             onSuccess?.()
//             toast.success(t("success.update"))
//         },
//         onError: (error: BackendError) => {
//             toast.error(translateWithFallback(t, error.detail))
//         }
//     })
// }

// export const useDeleteBankAccount = ({ onSuccess }: { onSuccess?: () => void }) => {
//     const { t } = useTranslation()
//     const queryClient = useQueryClient()

//     return useMutation({
//         mutationFn: profileApi.deleteBankAccount,
//         onSuccess: () => {
//             queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ME })
//             onSuccess?.()
//             toast.success(t("success.delete"))
//         },
//         onError: (error: BackendError) => {
//             toast.error(translateWithFallback(t, error.detail))
//         }
//     })
// }

// ========================
// Avatar
// ========================
export const useUploadAvatar = ({ onSuccess }: { onSuccess?: () => void }) => {
    const { t } = useTranslation()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: profileApi.uploadAvatar,
        onSuccess: (data) => {
            queryClient.setQueryData<UserProfileViewRes>(QUERY_KEYS.ME, (prev) => {
                if (!prev) return prev
                return {
                    ...prev,
                    ...data
                }
            })
            onSuccess?.()
            addToast({
                title: t("toast.success"),
                description: t("success.upload"),
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

export const useDeleteAvatar = ({ onSuccess }: { onSuccess?: () => void }) => {
    const { t } = useTranslation()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: profileApi.deleteAvatar,
        onSuccess: (data) => {
            queryClient.setQueryData<UserProfileViewRes>(QUERY_KEYS.ME, (prev) => {
                if (!prev) return prev
                return {
                    ...prev,
                    ...data
                }
            })
            onSuccess?.()
            addToast({
                title: t("toast.success"),
                description: translateWithFallback(t, data.message),
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

// citizen identity
export const useGetMyCitizenId = ({ enabled = true }: { enabled?: boolean } = {}) => {
    const query = useQuery({
        queryKey: [...QUERY_KEYS.ME, ...QUERY_KEYS.CITIZEN_IDENTITY],
        queryFn: profileApi.getMyCitizenId,
        enabled
    })
    return query
}

export const useUploadCitizenId = ({
    onSuccess,
    onError
}: {
    onSuccess?: () => void
    onError?: () => void
} = {}) => {
    const { t } = useTranslation()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: profileApi.uploadCitizenId,
        onSuccess: (data) => {
            queryClient.setQueryData<CitizenIdentityViewRes>(
                [...QUERY_KEYS.ME, ...QUERY_KEYS.CITIZEN_IDENTITY],
                (prev) => {
                    if (!prev) return data
                    return {
                        ...prev,
                        ...data
                    }
                }
            )
            onSuccess?.()
            addToast({
                title: t("toast.success"),
                description: t("success.upload"),
                color: "success"
            })
        },
        onError: (error: BackendError) => {
            onError?.()
            addToast({
                title: error.title || t("toast.error"),
                description: translateWithFallback(t, error.detail),
                color: "danger"
            })
        }
    })
}

export const useUpdateCitizenId = ({
    onSuccess,
    onError
}: {
    onSuccess?: () => void
    onError?: () => void
} = {}) => {
    const { t } = useTranslation()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: profileApi.updateCitizenId,
        onSuccess: (data) => {
            queryClient.setQueryData<CitizenIdentityViewRes>(
                [...QUERY_KEYS.ME, ...QUERY_KEYS.CITIZEN_IDENTITY],
                (prev) => {
                    if (!prev) return data
                    return {
                        ...prev,
                        ...data
                    }
                }
            )
            onSuccess?.()
            addToast({
                title: t("toast.success"),
                description: t("toast.update_success"),
                color: "success"
            })
        },
        onError: (error: BackendError) => {
            onError?.()
            addToast({
                title: error.title || t("toast.error"),
                description: translateWithFallback(t, error.detail),
                color: "danger"
            })
        }
    })
}

export const useDeleteCitizenId = ({
    onSuccess,
    onError
}: {
    onSuccess?: () => void
    onError?: () => void
} = {}) => {
    const { t } = useTranslation()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: profileApi.deleteCitizenId,
        onSuccess: () => {
            queryClient.removeQueries({
                queryKey: [...QUERY_KEYS.ME, ...QUERY_KEYS.CITIZEN_IDENTITY]
            })
            onSuccess?.()
            addToast({
                title: t("toast.success"),
                description: t("toast.delete_success"),
                color: "success"
            })
        },
        onError: (error: BackendError) => {
            onError?.()
            addToast({
                title: error.title || t("toast.error"),
                description: translateWithFallback(t, error.detail),
                color: "danger"
            })
        }
    })
}

// driver license
export const useGetMyDriverLicense = ({ enabled = true }: { enabled?: boolean } = {}) => {
    const query = useQuery({
        queryKey: [...QUERY_KEYS.ME, ...QUERY_KEYS.DRIVER_LICENSE],
        queryFn: profileApi.getMyDriverLicense,
        enabled
    })
    return query
}

export const useUploadDriverLicense = ({
    onSuccess,
    onError
}: {
    onSuccess?: () => void
    onError?: () => void
} = {}) => {
    const { t } = useTranslation()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: profileApi.uploadDriverLicense,
        onSuccess: (data) => {
            queryClient.setQueryData<DriverLicenseViewRes>(
                [...QUERY_KEYS.ME, ...QUERY_KEYS.DRIVER_LICENSE],
                (prev) => {
                    if (!prev) return data
                    return {
                        ...prev,
                        ...data
                    }
                }
            )
            onSuccess?.()
            addToast({
                title: t("toast.success"),
                description: t("success.upload"),
                color: "success"
            })
        },
        onError: (error: BackendError) => {
            onError?.()
            addToast({
                title: error.title || t("toast.error"),
                description: translateWithFallback(t, error.detail),
                color: "danger"
            })
        }
    })
}

export const useUpdateDriverLicense = ({
    onSuccess,
    onError
}: {
    onSuccess?: () => void
    onError?: () => void
} = {}) => {
    const { t } = useTranslation()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: profileApi.updateDriverLicense,
        onSuccess: (data) => {
            queryClient.setQueryData<DriverLicenseViewRes>(
                [...QUERY_KEYS.ME, ...QUERY_KEYS.DRIVER_LICENSE],
                (prev) => {
                    if (!prev) return data
                    return {
                        ...prev,
                        ...data
                    }
                }
            )
            onSuccess?.()
            addToast({
                title: t("toast.success"),
                description: t("toast.update_success"),
                color: "success"
            })
        },
        onError: (error: BackendError) => {
            onError?.()
            addToast({
                title: error.title || t("toast.error"),
                description: translateWithFallback(t, error.detail),
                color: "danger"
            })
        }
    })
}

export const useDeleteDriverLicense = ({
    onSuccess,
    onError
}: {
    onSuccess?: () => void
    onError?: () => void
} = {}) => {
    const { t } = useTranslation()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: profileApi.deleteDriverLicense,
        onSuccess: () => {
            queryClient.removeQueries({
                queryKey: [...QUERY_KEYS.ME, ...QUERY_KEYS.DRIVER_LICENSE]
            })
            onSuccess?.()
            addToast({
                title: t("toast.success"),
                description: t("review.delete_successfull"),
                color: "success"
            })
        },
        onError: (error: BackendError) => {
            onError?.()
            addToast({
                title: error.title || t("toast.error"),
                description: translateWithFallback(t, error.detail),
                color: "danger"
            })
        }
    })
}
