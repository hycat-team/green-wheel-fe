"use client"
import React, { useCallback, useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import {
    AutocompleteStyled,
    ButtonIconStyled,
    EnumPicker,
    InputStyled,
    PaginationStyled,
    TableContractStaff
} from "@/components"
import { useGetAllRentalContracts, useGetAllStations } from "@/hooks"
import { useFormik } from "formik"
import { FunnelSimple, MapPinAreaIcon } from "@phosphor-icons/react"
import { RentalContractStatusLabels } from "@/constants/labels"
import { ContractQueryParams } from "@/models/rental-contract/schema/request"
import { BackendError } from "@/models/common/response"
import { translateWithFallback } from "@/utils/helpers/translateWithFallback"
import { AutocompleteItem } from "@heroui/react"
import { PaginationParams } from "@/models/common/request"
import { SearchIcon } from "lucide-react"
import { addToast } from "@heroui/toast"

export default function StaffContractsPage() {
    const { t } = useTranslation()

    const [filter, setFilter] = useState<ContractQueryParams>({})
    const [pagination, setPagination] = useState<PaginationParams>({ pageSize: 5 })
    const { data, isFetching, refetch } = useGetAllRentalContracts({ params: filter, pagination })

    const {
        data: stations,
        isLoading: isGetStationsLoading,
        error: getStationsError
    } = useGetAllStations()

    const handleSubmit = useCallback(
        async (params: ContractQueryParams) => {
            setFilter(params)
            await refetch()
            setPagination((prev) => {
                return {
                    ...prev,
                    pageNumber: 1
                }
            })
        },
        [refetch]
    )

    const formik = useFormik<ContractQueryParams>({
        initialValues: {},
        onSubmit: handleSubmit
    })

    // Load station
    useEffect(() => {
        if (getStationsError) {
            const error = getStationsError as BackendError
            addToast({
                title: error.title || t("toast.error"),
                description: translateWithFallback(t, error.detail),
                color: "danger"
            })
        }
    }, [getStationsError, isGetStationsLoading, stations, t])

    return (
        <div>
            <div className="text-3xl mb-6 font-bold">
                <p>{t("staff.sidebar_bookings")}</p>
            </div>

            <div className="mb-4">
                <form
                    onSubmit={formik.handleSubmit}
                    className="w-full bg-white border border-gray-200 shadow-sm rounded-xl p-5 
                                 flex flex-col gap-6 md:gap-8"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                            <FunnelSimple size={22} className="text-primary" />
                            {t("staff.booking_filter")}
                        </h3>
                        <ButtonIconStyled
                            type="submit"
                            isLoading={isFetching}
                            className="btn-gradient rounded-lg"
                        >
                            <SearchIcon />
                        </ButtonIconStyled>
                    </div>

                    {/* Filter inputs */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-2">
                        <AutocompleteStyled
                            label={t("vehicle_model.station")}
                            items={stations}
                            startContent={<MapPinAreaIcon className="text-xl" />}
                            selectedKey={formik.values.stationId}
                            onSelectionChange={(id) => {
                                formik.setFieldValue("stationId", id)
                                formik.handleSubmit()
                            }}
                        >
                            {(stations ?? []).map((item) => (
                                <AutocompleteItem key={item.id}>{item.name}</AutocompleteItem>
                            ))}
                        </AutocompleteStyled>
                        <EnumPicker
                            label={t("table.status")}
                            labels={RentalContractStatusLabels}
                            value={formik.values.status ?? null}
                            onChange={(val) => {
                                formik.setFieldValue("status", val)
                                formik.handleSubmit()
                            }}
                        />
                        <InputStyled
                            label={t("table.phone")}
                            value={formik.values.phone}
                            onChange={(value) => formik.setFieldValue("phone", value.target.value)}
                            onClear={() => formik.setFieldValue("phone", "")}
                        />
                        <InputStyled
                            label={t("table.citizen_id")}
                            value={formik.values.citizenIdentityNumber}
                            onChange={(value) =>
                                formik.setFieldValue("citizenIdentityNumber", value.target.value)
                            }
                            onClear={() => formik.setFieldValue("citizenIdentityNumber", "")}
                        />
                        <InputStyled
                            label={t("table.driver_license")}
                            value={formik.values.driverLicenseNumber}
                            onChange={(value) =>
                                formik.setFieldValue("driverLicenseNumber", value.target.value)
                            }
                            onClear={() => formik.setFieldValue("driverLicenseNumber", "")}
                        />
                    </div>
                </form>
            </div>
            {/* Table */}
            <TableContractStaff
                contracts={data?.items ?? []}
                params={formik.values}
                pagination={pagination}
            />

            <div className="mt-6 flex justify-center">
                <PaginationStyled
                    page={data?.pageNumber ?? 1}
                    total={data?.totalPages ?? 10}
                    onChange={(page: number) =>
                        setPagination((prev) => {
                            return {
                                ...prev,
                                pageNumber: page
                            }
                        })
                    }
                />
            </div>
        </div>
    )
}
