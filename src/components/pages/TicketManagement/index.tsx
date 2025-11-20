"use client"

import {
    ButtonIconStyled,
    CreateTicketModal,
    EnumPicker,
    PaginationStyled,
    TicketCard
} from "@/components"
import { TicketStatus, TicketType } from "@/constants/enum"
import { TicketStatusLabels, TicketTypeLabels } from "@/constants/labels"
import { PaginationParams } from "@/models/common/request"
import { PageResult } from "@/models/common/response"
import { TicketFilterParams } from "@/models/ticket/schema/request"
import { TicketViewRes } from "@/models/ticket/schema/response"
import { Spinner, useDisclosure } from "@heroui/react"
import { UseQueryResult } from "@tanstack/react-query"
import { Plus } from "lucide-react"
import React from "react"
import { useTranslation } from "react-i18next"

export default function TicketManagement({
    isEditable,
    isAdmin = false,
    filterState,
    paginations,
    queryResult,
    createType = undefined
}: {
    isEditable: boolean
    isAdmin?: boolean
    filterState: [TicketFilterParams, React.Dispatch<React.SetStateAction<TicketFilterParams>>]
    paginations: [PaginationParams, React.Dispatch<React.SetStateAction<PaginationParams>>]
    queryResult: UseQueryResult<PageResult<TicketViewRes>, Error>
    createType?: TicketType
}) {
    const { t } = useTranslation()
    const [filter, setFilter] = filterState
    const [pagination, setPagination] = paginations

    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure()

    return (
        <div>
            {filter.type != undefined && (
                <div className="text-3xl mb-3 font-bold">
                    <p>{TicketTypeLabels[filter.type]}</p>
                </div>
            )}

            <div className="mb-3 flex gap-3 items-center">
                <EnumPicker
                    label={t("table.status")}
                    labels={TicketStatusLabels}
                    value={filter.status}
                    onChange={async (key) => {
                        setFilter((prev) => {
                            return {
                                ...prev,
                                status: key == null ? undefined : (key as TicketStatus)
                            }
                        })
                        await queryResult.refetch()
                        setPagination((prev) => {
                            return {
                                ...prev,
                                pageNumber: 1
                            }
                        })
                    }}
                    className="max-w-60"
                />
                {createType !== undefined && (
                    <>
                        <ButtonIconStyled
                            isLoading={queryResult.isLoading}
                            className="btn-gradient rounded-lg"
                            onPress={onOpen}
                        >
                            <Plus />
                        </ButtonIconStyled>
                        <CreateTicketModal
                            status={filter.status}
                            pagination={pagination}
                            isOpen={isOpen}
                            onOpenChange={onOpenChange}
                            onClose={onClose}
                            type={createType}
                        />
                    </>
                )}
            </div>

            {queryResult.isLoading ? (
                <Spinner className="md:min-w-[60rem]" />
            ) : (
                <div className="grid grid-cols-[repeat(auto-fill,minmax(17rem,1fr))] gap-5">
                    {(queryResult.data?.items ?? []).map((item) => (
                        <TicketCard
                            key={item.id}
                            isEditable={isEditable}
                            isAdmin={isAdmin}
                            ticket={item}
                            filter={filter}
                            pagination={pagination}
                        />
                    ))}
                </div>
            )}
            <div className="mt-6 flex justify-center">
                <PaginationStyled
                    page={queryResult.data?.pageNumber ?? 1}
                    total={queryResult.data?.totalPages ?? 10}
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
