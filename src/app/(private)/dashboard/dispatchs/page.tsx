"use client"
import { ButtonIconStyled, EnumPicker, SpinnerStyled, TableStyled } from "@/components"
import { DispatchRequestStatusColorMap } from "@/constants/colorMap"
import { DATE_TIME_VIEW_FORMAT } from "@/constants/constants"
import { DispatchRequestStatus, RoleName } from "@/constants/enum"
import { DispatchRequestStatusLabels } from "@/constants/labels"
import { useDay, useGetAllDispatch, useGetMe, useNavigateOnClick } from "@/hooks"
import { DispatchQueryParams } from "@/models/dispatch/schema/request"
import { Chip, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@heroui/react"
import { Plus } from "lucide-react"

import Link from "next/link"
import React, { useEffect, useRef, useState } from "react"
import { useTranslation } from "react-i18next"

export default function DispatchPage() {
    const handleNavigateClick = useNavigateOnClick()
    const { t } = useTranslation()
    const { formatDateTime } = useDay({ defaultFormat: DATE_TIME_VIEW_FORMAT })

    const { data: user, isLoading: isUserLoading } = useGetMe()
    const isAdmin = user?.role?.name === RoleName.Admin
    const stationId = isAdmin ? user?.station?.id : undefined

    const [filter, setFilter] = useState<DispatchQueryParams>({
        fromStation: stationId,
        toStation: stationId
    })
    const { data: dispatches, isLoading } = useGetAllDispatch({
        params: filter
    })

    const hasLoadInit = useRef(false)
    useEffect(() => {
        if (hasLoadInit.current) return
        if (isUserLoading) return
        setFilter((prev) => {
            return {
                ...prev,
                fromStation: stationId,
                toStation: stationId
            }
        })
        hasLoadInit.current = true
    }, [isUserLoading, stationId])

    return (
        <div className="max-w-6xl mx-auto w-full">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-3 mb-6">
                <h1 className="text-3xl font-bold">{t("table.dispatch_managerment")}</h1>
                {isAdmin && (
                    <Link href="/dashboard/dispatchs/new">
                        <ButtonIconStyled className="btn-gradient rounded-lg">
                            <Plus />
                        </ButtonIconStyled>
                    </Link>
                )}
            </div>

            {/* Filter section */}
            <div className="w-fit mb-3">
                <EnumPicker
                    label={t("table.status")}
                    labels={DispatchRequestStatusLabels}
                    value={filter.status}
                    onChange={(val) => {
                        setFilter((prev) => {
                            return {
                                ...prev,
                                status: val as DispatchRequestStatus | undefined
                            }
                        })
                    }}
                />
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-xl border border-gray-200 bg-gray-50/70 shadow-sm">
                {isLoading ? (
                    <SpinnerStyled />
                ) : (
                    <TableStyled
                        aria-label={t("dispatch.dispatch_table")}
                        className="min-w-full text-sm md:text-base"
                        classNames={{
                            base: "max-h-[500px] overflow-auto"
                        }}
                        removeWrapper
                    >
                        <TableHeader>
                            <TableColumn className="text-center text-gray-700 font-semibold">
                                {t("table.no")}
                            </TableColumn>
                            <TableColumn className="text-center text-gray-700 font-semibold">
                                {t("table.from_station")}
                            </TableColumn>
                            <TableColumn className="text-center text-gray-700 font-semibold">
                                {t("table.to_station")}
                            </TableColumn>
                            <TableColumn className="w-16 text-center text-gray-700 font-semibold">
                                {t("dispatch.number_staff")}
                            </TableColumn>
                            <TableColumn className="w-16 text-center text-gray-700 font-semibold">
                                {t("dispatch.number_vehicle")}
                            </TableColumn>
                            <TableColumn className="text-center text-gray-700 font-semibold">
                                {t("table.created_at")}
                            </TableColumn>
                            <TableColumn className="text-center text-gray-700 font-semibold">
                                {t("table.status")}
                            </TableColumn>
                        </TableHeader>

                        <TableBody>
                            {dispatches?.length ? (
                                dispatches.map((item, index) => {
                                    const fromStation = item.fromStationName || "—"
                                    const toStation = item.toStationName || "—"
                                    const statusLabel = DispatchRequestStatusLabels[item.status]

                                    return (
                                        <TableRow
                                            key={item.id}
                                            className="hover:bg-white transition-all duration-200 border-b border-gray-200 cursor-pointer"
                                            onMouseDown={handleNavigateClick(
                                                `/dashboard/dispatchs/${item.id}`
                                            )}
                                        >
                                            <TableCell className="text-center text-gray-700 font-medium">
                                                {index + 1}
                                            </TableCell>
                                            <TableCell className="text-center text-gray-700">
                                                {fromStation}
                                            </TableCell>
                                            <TableCell className="text-center text-gray-700">
                                                {toStation}
                                            </TableCell>
                                            <TableCell className="text-center text-gray-700">
                                                {item.description?.numberOfStaffs || 0}
                                            </TableCell>
                                            <TableCell className="text-center text-gray-700">
                                                {item.description?.vehicles?.reduce(
                                                    (sum, v) => sum + v.quantity,
                                                    0
                                                ) ?? 0}
                                            </TableCell>
                                            <TableCell className="text-center text-gray-700">
                                                {formatDateTime({
                                                    date: item.createdAt
                                                })}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <Chip
                                                    variant="bordered"
                                                    color={
                                                        DispatchRequestStatusColorMap[item.status]
                                                    }
                                                >
                                                    {statusLabel}
                                                </Chip>
                                            </TableCell>
                                        </TableRow>
                                    )
                                })
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={7}
                                        className="text-center py-10 text-gray-500 italic"
                                    >
                                        ...
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </TableStyled>
                )}
            </div>
        </div>
    )
}
