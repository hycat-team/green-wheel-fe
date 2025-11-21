"use client"

import React, { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { PencilSimple, TrashSimple } from "@phosphor-icons/react"
import {
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow,
    Spinner
} from "@heroui/react"

import { VehicleStatus } from "@/constants/enum"
import { VehicleModelViewRes, VehicleViewRes } from "@/models/vehicle/schema/response"
import { ButtonIconStyled, ButtonStyled } from "@/components/styled"
import { useCompleteMaintenanceVehicle } from "@/hooks"
import { StationViewRes } from "@/models/station/schema/response"

type VehicleWithStatus = VehicleViewRes & { status?: VehicleStatus; modelId?: string }

type TableVehicleManagementProps = {
    vehicles: VehicleWithStatus[]
    isStaff: boolean
    myStation: StationViewRes
    stationNameById: Record<string, string>
    vehicleModelsById: Record<string, VehicleModelViewRes>
    isLoading?: boolean
    isModelsLoading?: boolean
    onEdit?: (vehicle: VehicleWithStatus) => void
    onDelete?: (vehicle: VehicleWithStatus) => void
}

const STATUS_CLASS_MAP: Record<VehicleStatus, string> = {
    [VehicleStatus.Available]: "bg-emerald-100 text-emerald-700",
    [VehicleStatus.Unavailable]: "bg-slate-200 text-slate-600",
    [VehicleStatus.Rented]: "bg-blue-100 text-blue-700",
    [VehicleStatus.Maintenance]: "bg-orange-100 text-orange-700",
    [VehicleStatus.MissingNoReason]: "bg-rose-100 text-rose-700",
    [VehicleStatus.LateReturn]: "bg-purple-100 text-purple-700"
}

function resolveModel(
    vehicle: VehicleWithStatus,
    vehicleModelsById: Record<string, VehicleModelViewRes>
) {
    const rawModel = vehicle.model
    const modelId = rawModel?.id ?? vehicle.modelId ?? undefined
    return modelId ? vehicleModelsById[modelId] ?? rawModel : rawModel
}

function getStatusKey(status: VehicleWithStatus["status"]) {
    return typeof status === "number" && status in VehicleStatus
        ? VehicleStatus[status as VehicleStatus]
        : undefined
}

function humanizeStatusKey(k?: string) {
    return k
        ? k
              .toString()
              .toLowerCase()
              .replace(/_/g, " ")
              .replace(/\b\w/g, (c) => c.toUpperCase())
        : undefined
}

function getStatusClasses(status: VehicleWithStatus["status"]) {
    return status != null && status in STATUS_CLASS_MAP
        ? STATUS_CLASS_MAP[status as VehicleStatus]
        : "bg-slate-100 text-slate-600"
}

export function TableVehicleManagement({
    vehicles,
    isStaff,
    myStation,
    stationNameById,
    isLoading,
    vehicleModelsById,
    isModelsLoading,
    onEdit,
    onDelete
}: TableVehicleManagementProps) {
    const { t } = useTranslation()
    const completeMaintenance = useCompleteMaintenanceVehicle()

    const tUnsafe = t as unknown as (key: string, options?: any) => string

    const isTableLoading = Boolean(isLoading || isModelsLoading)

    const tableRows = useMemo(() => {
        return vehicles.map((vehicle) => {
            const isEditable = myStation.id === vehicle.stationId

            const resolvedModel = resolveModel(vehicle, vehicleModelsById)
            const statusKey = getStatusKey(vehicle.status)
            const normalizedStatusKey = statusKey?.toString().toLowerCase()

            const defaultLabel = humanizeStatusKey(statusKey) ?? t("vehicle.status_value_unknown")

            const statusLabel: string = normalizedStatusKey
                ? tUnsafe(`vehicle.status_value_${normalizedStatusKey}`)
                : defaultLabel

            const statusClasses = getStatusClasses(vehicle.status)

            const stationName =
                (t("table.unknown_station"),
                stationNameById[vehicle.stationId] ?? t("table.unknown_station"))
            const brandName =
                (resolvedModel &&
                "brandName" in (resolvedModel as any) &&
                typeof (resolvedModel as any).brandName === "string"
                    ? (resolvedModel as any).brandName
                    : resolvedModel?.brand?.name) ?? t("table.unknown_brand")

            const modelName = resolvedModel?.name ?? t("table.unknown_model")

            return (
                <TableRow key={vehicle.id} className="border-b border-slate-100 last:border-0">
                    <TableCell className="font-medium text-slate-900">
                        {vehicle.licensePlate}
                    </TableCell>

                    <TableCell className="text-slate-700">
                        <div className="flex flex-col">
                            <span className="font-semibold text-slate-900">{brandName}</span>
                            <span className="text-xs text-slate-500">{modelName}</span>
                        </div>
                    </TableCell>

                    <TableCell className="text-slate-700">{stationName}</TableCell>

                    <TableCell className="py-3 px-4">
                        <div className="flex justify-center">
                            <span
                                className={`inline-flex min-w-[120px] items-center justify-center rounded-full px-3 py-1 text-xs font-semibold ${statusClasses}`}
                            >
                                {statusLabel}
                            </span>
                        </div>
                    </TableCell>

                    <TableCell>
                        {isStaff ? (
                            <div className="flex items-center gap-3">
                                {vehicle.status === VehicleStatus.Maintenance && (
                                    <ButtonStyled
                                        variant="ghost"
                                        color="primary"
                                        isDisabled={!isEditable || completeMaintenance.isPending}
                                        onPress={() =>
                                            completeMaintenance.mutate({ vehicleId: vehicle.id })
                                        }
                                    >
                                        {t("vehicle.maintenance_complete")}
                                    </ButtonStyled>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                <ButtonIconStyled
                                    aria-label={t("common.edit")}
                                    isDisabled={!isEditable}
                                    onPress={() => onEdit?.(vehicle)}
                                    className="rounded-full bg-primary/10 text-primary transition hover:bg-primary/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                                >
                                    <PencilSimple size={16} weight="bold" aria-hidden />
                                </ButtonIconStyled>

                                <ButtonIconStyled
                                    aria-label={t("common.delete")}
                                    isDisabled={
                                        !isEditable ||
                                        isLoading ||
                                        vehicle.status !== VehicleStatus.Available
                                    }
                                    onPress={() => onDelete?.(vehicle)}
                                    className="rounded-full bg-rose-50 text-rose-600 transition hover:bg-rose-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2"
                                >
                                    <TrashSimple size={16} weight="bold" aria-hidden />
                                </ButtonIconStyled>
                            </div>
                        )}
                    </TableCell>
                </TableRow>
            )
        })
    }, [
        completeMaintenance,
        isLoading,
        isStaff,
        myStation.id,
        onDelete,
        onEdit,
        stationNameById,
        t,
        tUnsafe,
        vehicleModelsById,
        vehicles
    ])

    return (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
            <Table
                aria-label="Vehicle management table"
                removeWrapper
                className="min-w-full text-sm"
            >
                <TableHeader>
                    <TableColumn className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                        {t("vehicle.license_plate")}
                    </TableColumn>
                    <TableColumn className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                        {t("vehicle.model_name")}
                    </TableColumn>
                    <TableColumn className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                        {t("vehicle.station_name")}
                    </TableColumn>
                    <TableColumn className="py-3 px-4 text-center text-xs font-semibold uppercase tracking-wide text-slate-600">
                        {t("vehicle.status_label")}
                    </TableColumn>
                    <TableColumn className="w-30 py-3 px-6 text-center text-xs font-semibold uppercase tracking-wide text-slate-600">
                        {t("table.action")}
                    </TableColumn>
                </TableHeader>

                <TableBody
                    emptyContent={
                        isTableLoading ? (
                            <div className="flex items-center justify-center py-10">
                                <Spinner size="sm" />
                            </div>
                        ) : (
                            <span className="py-8 text-slate-500">
                                {t("vehicle.management_empty")}
                            </span>
                        )
                    }
                >
                    {tableRows}
                </TableBody>
            </Table>
        </div>
    )
}
