"use client"

import React from "react"
import { VehicleManagementView, SpinnerStyled } from "@/components"
import { useGetMe } from "@/hooks"
import { RoleName } from "@/constants/enum"

export default function VehicleManagementPage() {
    const { data: user } = useGetMe()

    if (!user || !user.station || !user.role) return <SpinnerStyled />

    const isStaff = user.role.name === RoleName.Staff

    return <VehicleManagementView isStaff={isStaff} myStation={user.station} />
}
