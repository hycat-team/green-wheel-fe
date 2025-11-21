"use client"

import React, { useCallback, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { useFormik } from "formik"
import * as Yup from "yup"
import type { Selection } from "@heroui/react"
import { FunnelSimple } from "@phosphor-icons/react"
import { SearchIcon, Plus } from "lucide-react"

import {
    ButtonIconStyled,
    FilterTypeOption,
    FilterTypeStyle,
    InputStyled,
    PaginationStyled,
    TableVehicleManagement,
    useModalDisclosure
} from "@/components"

import { VehicleStatus } from "@/constants/enum"
import { VehicleModelViewRes, VehicleViewRes } from "@/models/vehicle/schema/response"

import {
    useCreateVehicle,
    useDeleteVehicle,
    useGetAllStations,
    useGetAllVehicleModels,
    useGetAllVehicles,
    useUpdateVehicle
} from "@/hooks"

import {
    VehicleCreateModal,
    VehicleEditModal,
    VehicleDeleteModal
} from "@/components/modals/Vehicle"

import {
    CreateVehicleReq,
    GetVehicleParams,
    UpdateVehicleReq
} from "@/models/vehicle/schema/request"

import { PaginationParams } from "@/models/common/request"
import { LICENSE_PLATE_REGEX } from "@/constants/regex"
import { StationViewRes } from "@/models/station/schema/response"

type VehicleWithStatus = VehicleViewRes & { status?: VehicleStatus; modelId?: string }
type VehicleFilterFormValues = {
    licensePlate: string
    stationId: string | null
    status: string | null
}
type VehicleEditFormValues = {
    licensePlate: string
    stationId: string
    modelId: string
    status: string | null
}

// chỉ lấy number enum
const STATUS_VALUES = Object.values(VehicleStatus).filter(
    (v): v is VehicleStatus => typeof v === "number"
)

export function VehicleManagementView({
    isStaff,
    myStation
}: {
    isStaff: boolean
    myStation: StationViewRes
}) {
    const { t } = useTranslation()

    // ==== local state ====
    const [filter, setFilter] = useState<GetVehicleParams>({ stationId: myStation.id })
    const [pagination, setPagination] = useState<PaginationParams>({ pageSize: 10 })
    const [editingVehicle, setEditingVehicle] = useState<VehicleWithStatus | null>(null)
    const [deletingVehicle, setDeletingVehicle] = useState<VehicleWithStatus | null>(null)

    const createModal = useModalDisclosure()
    const editModal = useModalDisclosure()
    const deleteModal = useModalDisclosure()

    // ==== queries ====
    const { data: stations = [] } = useGetAllStations({ enabled: true })
    const { data: vehiclesPage, isFetching: isFetchingVehicles } = useGetAllVehicles({
        params: filter,
        pagination,
        enabled: true
    })
    const { data: vehicleModels = [], isFetching: isFetchingVehicleModels } =
        useGetAllVehicleModels({ query: {} })

    // ==== derive vừa đủ (như UserManagement) ====
    const stationOptions = useMemo(
        () => stations.map((s) => ({ key: s.id, label: s.name })),
        [stations]
    )

    const stationSelectOptions = useMemo(
        () => stationOptions.map((o) => ({ id: o.key, label: o.label })),
        [stationOptions]
    )

    const stationNameById = useMemo(
        () =>
            stations.reduce<Record<string, string>>((acc, s) => {
                acc[s.id] = s.name
                return acc
            }, {}),
        [stations]
    )

    const statusLabelMap = useMemo<Record<VehicleStatus, string>>(
        () => ({
            [VehicleStatus.Available]: t("vehicle.status_value_available"),
            [VehicleStatus.Unavailable]: t("vehicle.status_value_unavailable"),
            [VehicleStatus.Rented]: t("vehicle.status_value_rented"),
            [VehicleStatus.Maintenance]: t("vehicle.status_value_maintenance"),
            [VehicleStatus.MissingNoReason]: t("vehicle.status_value_missingnoreason"),
            [VehicleStatus.LateReturn]: t("vehicle.status_value_latereturn")
        }),
        [t]
    )

    const statusOptions = useMemo(
        () =>
            STATUS_VALUES.map((s) => ({
                key: s.toString(),
                label: statusLabelMap[s] ?? t("vehicle.status_value_unknown")
            })),
        [statusLabelMap, t]
    )

    const vehicleModelsById = useMemo(
        () =>
            vehicleModels.reduce<Record<string, VehicleModelViewRes>>((acc, m) => {
                acc[m.id] = m
                return acc
            }, {}),
        [vehicleModels]
    )

    const vehicleModelOptions = useMemo(
        () => vehicleModels.map((m) => ({ id: m.id, label: (m.name || "").trim() || m.name })),
        [vehicleModels]
    )

    const vehicles = useMemo<VehicleWithStatus[]>(() => {
        const items = (vehiclesPage?.items ?? []) as VehicleWithStatus[]
        return items.map((v) => ({ ...v, modelId: v.modelId ?? v.model?.id }))
    }, [vehiclesPage])

    const totalPages = vehiclesPage?.totalPages ?? 1
    const currentPage = vehiclesPage?.pageNumber ?? pagination.pageNumber ?? 1

    const filterSchema = useMemo(
        () =>
            Yup.object({
                licensePlate: Yup.string().trim(),
                stationId: Yup.string().trim().nullable(),
                status: Yup.string().nullable()
            }),
        []
    )

    const createSchema = useMemo(
        () =>
            Yup.object({
                licensePlate: Yup.string()
                    .trim()
                    .matches(LICENSE_PLATE_REGEX, t("vehicle.license_plate_format"))
                    .required(t("common.required")),
                stationId: Yup.string().trim().required(t("common.required")),
                modelId: Yup.string().trim().required(t("common.required"))
            }),
        [t]
    )

    const editSchema = useMemo(
        () =>
            Yup.object({
                licensePlate: Yup.string()
                    .trim()
                    .matches(LICENSE_PLATE_REGEX, t("vehicle.license_plate_format"))
                    .required(t("common.required")),
                stationId: Yup.string().trim().required(t("common.required")),
                modelId: Yup.string().trim().required(t("common.required")),
                status: Yup.string().nullable()
            }),
        [t]
    )

    const onApplyFilter = useCallback((values: VehicleFilterFormValues) => {
        const next: GetVehicleParams = {}
        const plate = values.licensePlate?.trim()
        if (plate) next.licensePlate = plate
        if (values.stationId) next.stationId = values.stationId
        if (values.status) next.status = Number(values.status) as VehicleStatus

        setFilter(next)
        setPagination((p) => ({ ...p, pageNumber: 1 }))
    }, [])

    const filterFormik = useFormik<VehicleFilterFormValues>({
        initialValues: { licensePlate: "", stationId: myStation.id, status: null },
        validationSchema: filterSchema,
        onSubmit: onApplyFilter
    })

    const createMutation = useCreateVehicle()
    const createFormik = useFormik<CreateVehicleReq>({
        initialValues: { licensePlate: "", modelId: "", stationId: myStation.id },
        validationSchema: createSchema,
        onSubmit: (v, helpers) => {
            const payload: CreateVehicleReq = {
                licensePlate: v.licensePlate.trim(),
                modelId: v.modelId.trim(),
                stationId: v.stationId
            }
            createMutation.mutate(payload, {
                onSuccess: () => {
                    helpers.resetForm()
                    createModal.onClose()
                }
            })
        }
    })

    const updateMutation = useUpdateVehicle()
    const editFormik = useFormik<VehicleEditFormValues>({
        enableReinitialize: true,
        initialValues: {
            licensePlate: editingVehicle?.licensePlate ?? "",
            stationId: editingVehicle?.stationId ?? "",
            modelId: editingVehicle?.model?.id ?? editingVehicle?.modelId ?? "",
            status: editingVehicle?.status != null ? editingVehicle.status.toString() : null
        },
        validationSchema: editSchema,
        onSubmit: (values, helpers) => {
            if (!editingVehicle) return
            const payload: UpdateVehicleReq = {}

            const plate = values.licensePlate.trim()
            if (plate && plate !== editingVehicle.licensePlate) payload.licensePlate = plate
            if (values.stationId && values.stationId !== editingVehicle.stationId)
                payload.stationId = values.stationId
            if (values.modelId && values.modelId !== editingVehicle.model?.id)
                payload.modelId = values.modelId

            if (values.status !== null && values.status !== "") {
                const nextSt = Number(values.status) as VehicleStatus
                if (editingVehicle.status !== nextSt) payload.status = nextSt
            }

            if (Object.keys(payload).length === 0) {
                helpers.resetForm()
                editModal.onClose()
                setEditingVehicle(null)
                return
            }

            updateMutation.mutate(
                { vehicleId: editingVehicle.id, payload },
                {
                    onSuccess: () => {
                        helpers.resetForm()
                        setEditingVehicle(null)
                        editModal.onClose()
                    }
                }
            )
        }
    })

    const deleteMutation = useDeleteVehicle()
    const handleConfirmDelete = useCallback(() => {
        if (!deletingVehicle) return
        deleteMutation.mutate(deletingVehicle.id, {
            onSuccess: () => {
                setDeletingVehicle(null)
                deleteModal.onClose()
            }
        })
    }, [deleteMutation, deletingVehicle, deleteModal])

    const onStationFilterChange = useCallback(
        (keys: Selection) => {
            if (keys === "all") {
                filterFormik.setFieldValue("stationId", null)
                return
            }
            const [v] = Array.from(keys)
            filterFormik.setFieldValue("stationId", v != null ? String(v) : null)
        },
        [filterFormik]
    )

    const onStatusFilterChange = useCallback(
        (keys: Selection) => {
            if (keys === "all") {
                filterFormik.setFieldValue("status", null)
                return
            }
            const [v] = Array.from(keys)
            filterFormik.setFieldValue("status", v != null ? String(v) : null)
        },
        [filterFormik]
    )

    const onOpenEdit = useCallback(
        (v: VehicleWithStatus) => {
            setEditingVehicle(v)
            editModal.onOpen()
        },
        [editModal]
    )
    const onCloseEdit = useCallback(() => {
        editFormik.resetForm()
        setEditingVehicle(null)
        editModal.onClose()
    }, [editFormik, editModal])

    const onOpenDelete = useCallback(
        (v: VehicleWithStatus) => {
            setDeletingVehicle(v)
            deleteModal.onOpen()
        },
        [deleteModal]
    )
    const onCloseDelete = useCallback(() => {
        setDeletingVehicle(null)
        deleteModal.onClose()
    }, [deleteModal])

    return (
        <div className="space-y-6 mb-12">
            {/* Header */}
            <header>
                <h1 className="text-3xl font-bold text-slate-900">
                    {t("admin.vehicle_management_title")}
                </h1>
            </header>

            {/* Filter card */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-6">
                <form onSubmit={filterFormik.handleSubmit} className="space-y-5">
                    <div className="flex items-center gap-2 text-slate-800">
                        <FunnelSimple size={22} className="text-primary" />
                        <h3 className="text-lg font-semibold">{t("admin.vehicle_filter_title")}</h3>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 lg:items-end">
                        <InputStyled
                            label={t("vehicle.license_plate")}
                            placeholder={t("vehicle.license_plate_placeholder")}
                            value={filterFormik.values.licensePlate}
                            onChange={(e) =>
                                filterFormik.setFieldValue("licensePlate", e.target.value)
                            }
                            onClear={() => filterFormik.setFieldValue("licensePlate", "")}
                            isClearable
                        />

                        <FilterTypeStyle
                            label={t("vehicle.station_name")}
                            placeholder={t("vehicle.station_placeholder")}
                            selectedKeys={
                                filterFormik.values.stationId
                                    ? new Set([filterFormik.values.stationId])
                                    : new Set([])
                            }
                            disallowEmptySelection={false}
                            isClearable
                            onSelectionChange={onStationFilterChange}
                        >
                            {stationOptions.map((o) => (
                                <FilterTypeOption key={o.key}>{o.label}</FilterTypeOption>
                            ))}
                        </FilterTypeStyle>

                        <FilterTypeStyle
                            label={t("vehicle.status_label")}
                            placeholder={t("vehicle.status_placeholder")}
                            selectedKeys={
                                filterFormik.values.status
                                    ? new Set([filterFormik.values.status])
                                    : new Set([])
                            }
                            disallowEmptySelection={false}
                            isClearable
                            onSelectionChange={onStatusFilterChange}
                        >
                            {statusOptions.map((o) => (
                                <FilterTypeOption key={o.key}>{o.label}</FilterTypeOption>
                            ))}
                        </FilterTypeStyle>

                        <div className="h-full flex w-full gap-2 justify-end items-center">
                            <ButtonIconStyled
                                type="submit"
                                isDisabled={isFetchingVehicles}
                                aria-label={t("common.search")}
                                className="btn-gradient rounded-lg"
                            >
                                <SearchIcon />
                            </ButtonIconStyled>

                            <ButtonIconStyled
                                type="button"
                                onPress={createModal.onOpen}
                                aria-label={t("admin.vehicle_new_button")}
                                className="btn-gradient rounded-lg"
                            >
                                <Plus />
                            </ButtonIconStyled>
                        </div>
                    </div>
                </form>
            </div>

            {/* table */}
            <TableVehicleManagement
                vehicles={vehicles}
                isStaff={isStaff}
                myStation={myStation}
                stationNameById={stationNameById}
                vehicleModelsById={vehicleModelsById}
                isLoading={isFetchingVehicles}
                isModelsLoading={isFetchingVehicleModels}
                onEdit={onOpenEdit}
                onDelete={onOpenDelete}
            />

            {/* pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center pt-2">
                    <PaginationStyled
                        page={currentPage}
                        total={totalPages}
                        onChange={(next: number) =>
                            setPagination((p) => ({ ...p, pageNumber: next }))
                        }
                        showControls
                    />
                </div>
            )}

            {/* create modal */}
            <VehicleCreateModal
                isOpen={createModal.isOpen}
                onOpenChange={createModal.onOpenChange}
                onClose={() => {
                    createFormik.resetForm()
                    createModal.onClose()
                }}
                // stationOptions={stationSelectOptions}
                vehicleModelOptions={vehicleModelOptions}
                isModelLoading={isFetchingVehicleModels}
                formik={createFormik}
                isSubmitting={createMutation.isPending}
            />

            {/* edit modal */}
            <VehicleEditModal
                isOpen={editModal.isOpen}
                onOpenChange={editModal.onOpenChange}
                onClose={onCloseEdit}
                stationOptions={stationSelectOptions}
                statusOptions={statusOptions}
                vehicleModelOptions={vehicleModelOptions}
                isModelLoading={isFetchingVehicleModels}
                formik={editFormik}
                isSubmitting={updateMutation.isPending}
            />

            {/* delete modal */}
            <VehicleDeleteModal
                isOpen={deleteModal.isOpen}
                onOpenChange={deleteModal.onOpenChange}
                onClose={onCloseDelete}
                vehicle={
                    deletingVehicle
                        ? {
                              id: deletingVehicle.id,
                              licensePlate: deletingVehicle.licensePlate,
                              stationId: deletingVehicle.stationId
                          }
                        : null
                }
                stationNameById={stationNameById}
                isSubmitting={deleteMutation.isPending}
                onConfirm={handleConfirmDelete}
            />
        </div>
    )
}

export default VehicleManagementView
