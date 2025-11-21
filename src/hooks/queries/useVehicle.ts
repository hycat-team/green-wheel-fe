"use client"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"
import { QUERY_KEYS } from "@/constants/queryKey"
import { BackendError } from "@/models/common/response"
import { PaginationParams } from "@/models/common/request"
import { GetVehicleParams, UpdateVehicleReq } from "@/models/vehicle/schema/request"
import { VehicleViewRes } from "@/models/vehicle/schema/response"
import { vehicleApi } from "@/services/vehicleApi"
import { translateWithFallback } from "@/utils/helpers/translateWithFallback"
import { addToast } from "@heroui/toast"

export const useGetAllVehicles = ({
    params = {},
    pagination = {},
    enabled = true
}: {
    params?: GetVehicleParams
    pagination?: PaginationParams
    enabled?: boolean
} = {}) => {
    const queryClient = useQueryClient()
    return useQuery({
        queryKey: [...QUERY_KEYS.VEHICLES, params, pagination],
        queryFn: () => vehicleApi.getAll({ params, pagination }),
        initialData: () => {
            return queryClient.getQueryData([...QUERY_KEYS.VEHICLES, params, pagination])
        },
        enabled
    })
}

export const useGetVehicleById = ({
    vehicleId,
    enabled = true
}: {
    vehicleId: string
    enabled?: boolean
}) => {
    const queryClient = useQueryClient()
    return useQuery({
        queryKey: [...QUERY_KEYS.VEHICLES, vehicleId],
        queryFn: () => vehicleApi.getById(vehicleId),
        initialData: () => {
            return queryClient
                .getQueryData<VehicleViewRes[]>(QUERY_KEYS.VEHICLES)
                ?.find((vehicle) => vehicle.id === vehicleId)
        },
        enabled
    })
}

export const useCreateVehicle = ({
    onSuccess,
    onError
}: {
    onSuccess?: (vehicle: VehicleViewRes) => void
    onError?: () => void
} = {}) => {
    const { t } = useTranslation()
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: vehicleApi.create,
        onSuccess: (vehicle) => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.VEHICLES, exact: false })
            addToast({
                title: t("toast.success"),
                description: t("success.create"),
                color: "success"
            })
            onSuccess?.(vehicle)
        },
        onError: (error: BackendError) => {
            addToast({
                title: error.title || t("toast.error"),
                description: translateWithFallback(t, error.detail),
                color: "danger"
            })

            onError?.()
        }
    })
}

export const useUpdateVehicle = ({
    onSuccess,
    onError
}: {
    onSuccess?: (vehicle: VehicleViewRes) => void
    onError?: () => void
} = {}) => {
    const { t } = useTranslation()
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ vehicleId, payload }: { vehicleId: string; payload: UpdateVehicleReq }) =>
            vehicleApi.update({ vehicleId, payload }),
        onSuccess: (vehicle) => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.VEHICLES, exact: false })
            addToast({
                title: t("toast.success"),
                description: t("success.update"),
                color: "success"
            })
            onSuccess?.(vehicle)
        },
        onError: (error: BackendError) => {
            addToast({
                title: error.title || t("toast.error"),
                description: translateWithFallback(t, error.detail),
                color: "danger"
            })

            onError?.()
        }
    })
}

export const useDeleteVehicle = ({
    onSuccess,
    onError
}: {
    onSuccess?: () => void
    onError?: () => void
} = {}) => {
    const { t } = useTranslation()
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: vehicleApi.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.VEHICLES, exact: false })
            addToast({
                title: t("toast.success"),
                description: t("success.delete"),
                color: "success"
            })
            onSuccess?.()
        },
        onError: (error: BackendError) => {
            addToast({
                title: error.title || t("toast.error"),
                description: translateWithFallback(t, error.detail),
                color: "danger"
            })

            onError?.()
        }
    })
}

export const useCompleteMaintenanceVehicle = ({
    onSuccess,
    onError
}: {
    onSuccess?: () => void
    onError?: () => void
} = {}) => {
    const { t } = useTranslation()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: vehicleApi.completeMaintenance,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.VEHICLES, exact: false })
            addToast({
                title: t("toast.success"),
                description: t("success.update"),
                color: "success"
            })
            onSuccess?.()
        },
        onError: (error: BackendError) => {
            addToast({
                title: error.title || t("toast.error"),
                description: translateWithFallback(t, error.detail),
                color: "danger"
            })
            onError?.()
        }
    })
}
