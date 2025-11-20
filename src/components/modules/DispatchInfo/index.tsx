"use client"

import { InputStyled, NumberInputStyled, SectionStyled, TableStyled } from "@/components"
import { DispatchRequestStatusColorMap } from "@/constants/colorMap"
import { DATE_TIME_VIEW_FORMAT } from "@/constants/constants"
import { DispatchRequestStatusLabels } from "@/constants/labels"
import { useDay } from "@/hooks"
import { DispatchViewRes } from "@/models/dispatch/schema/response"
import { Chip, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@heroui/react"
import React from "react"
import { useTranslation } from "react-i18next"

export function DispatchInfo({ dispatch }: { dispatch: DispatchViewRes }) {
    const { t } = useTranslation()
    const { formatDateTime } = useDay({ defaultFormat: DATE_TIME_VIEW_FORMAT })

    return (
        <>
            {/* Header */}
            <div className="text-center mb-10 space-y-2">
                <h1 className="text-3xl font-bold text-primary tracking-wide">
                    {t("dispatch.dispatch_detail")}
                </h1>
                <Chip variant="bordered" color={DispatchRequestStatusColorMap[dispatch.status]}>
                    {DispatchRequestStatusLabels[dispatch.status]}
                </Chip>
            </div>

            <div className="mb-3">{`${t("table.created_at")}: ${formatDateTime({
                date: dispatch.createdAt
            })}`}</div>

            {/* Station Info */}
            <SectionStyled title={t("dispatch.station_information")}>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full">
                    <div className="flex flex-col gap-3 w-full">
                        <h3 className="text-gray-800 font-semibold mb-1">
                            {t("dispatch.form_station")}
                        </h3>
                        <InputStyled
                            label={t("dispatch.station_id")}
                            value={dispatch?.fromStationId || "-"}
                            readOnly
                        />
                        <InputStyled
                            label={t("dispatch.station_name")}
                            value={dispatch?.fromStationName || "-"}
                            readOnly
                        />
                    </div>
                    <div className="hidden sm:block w-[5px] bg-default self-stretch"></div>
                    <div className="flex flex-col gap-3 w-full">
                        <h3 className="text-gray-800 font-semibold mb-1">
                            {t("dispatch.to_station")}
                        </h3>
                        <InputStyled
                            label={t("dispatch.station_id")}
                            value={dispatch?.toStationId}
                            readOnly
                        />
                        <InputStyled
                            label={t("dispatch.station_name")}
                            value={dispatch?.toStationName}
                            readOnly
                        />
                    </div>
                </div>
            </SectionStyled>

            <SectionStyled
                title={t("dispatch.requested_staffs_vehicles")}
                sectionClassName="w-full"
            >
                <div className="flex gap-3 flex-wrap sm:flex-nowrap">
                    <NumberInputStyled
                        label={t("dispatch.number_staff")}
                        className="w-50"
                        value={dispatch.description?.numberOfStaffs}
                        isReadOnly
                    />
                    <div className="hidden sm:block w-[5px] bg-default self-stretch"></div>
                    <TableStyled
                        classNames={{
                            base: "max-h-[250px] overflow-scroll"
                        }}
                    >
                        <TableHeader>
                            <TableColumn className="w-sm hidden md:table-cell">
                                {t("vehicle.model_id")}
                            </TableColumn>
                            <TableColumn>{t("vehicle_model.name")}</TableColumn>
                            <TableColumn>{t("common.quantity")}</TableColumn>
                        </TableHeader>
                        <TableBody
                            items={dispatch.description?.vehicles || []}
                            emptyContent={t("dispatch.no_vehicles_requested")}
                        >
                            {(item) => (
                                <TableRow key={item.modelId}>
                                    <TableCell className="hidden md:table-cell">
                                        {item.modelId}
                                    </TableCell>
                                    <TableCell>{item.modelName}</TableCell>
                                    <TableCell>{item.quantity}</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </TableStyled>
                </div>
            </SectionStyled>

            <SectionStyled title={t("dispatch.approved_staffs_vehicles")} sectionClassName="w-full">
                {dispatch.finalDescription && (
                    <div className="flex gap-3 flex-wrap sm:flex-nowrap">
                        <NumberInputStyled
                            label={t("dispatch.number_staff")}
                            className="w-50"
                            value={dispatch.finalDescription?.numberOfStaffs}
                            isReadOnly
                        />
                        <div className="hidden sm:block w-[5px] bg-default self-stretch"></div>
                        <TableStyled
                            classNames={{
                                base: "max-h-[250px] overflow-scroll"
                            }}
                        >
                            <TableHeader>
                                <TableColumn className="w-sm hidden md:table-cell">
                                    {t("vehicle.model_id")}
                                </TableColumn>
                                <TableColumn>{t("vehicle_model.name")}</TableColumn>
                                <TableColumn>{t("common.quantity")}</TableColumn>
                            </TableHeader>
                            <TableBody
                                items={dispatch.finalDescription?.vehicles || []}
                                emptyContent={t("dispatch.no_vehicles_requested")}
                            >
                                {(item) => (
                                    <TableRow key={item.modelId}>
                                        <TableCell className="hidden md:table-cell">
                                            {item.modelId}
                                        </TableCell>
                                        <TableCell>{item.modelName}</TableCell>
                                        <TableCell>{item.quantity}</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </TableStyled>
                    </div>
                )}
            </SectionStyled>
        </>
    )
}
