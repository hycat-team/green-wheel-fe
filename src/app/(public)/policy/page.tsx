import { PolicyPageEN, PolicyPageVN } from "@/components"
import { BusinessVariableKey } from "@/constants/enum"
import { BusinessVariableViewRes } from "@/models/business-variables/schema/respone"
import { businessVariablesServerApi } from "@/services/businessVariablesServerApi"
import { cookies } from "next/headers"
import React from "react"

export default async function PolicyPage() {
    const cookieStore = await cookies()
    const locale = cookieStore.get("i18next")?.value || "en"

    let businessVariables: BusinessVariableViewRes[] = []
    try {
        businessVariables = await businessVariablesServerApi.getBusinessVariables()
    } catch (err) {
        if (process.env.NODE_ENV === "development") {
            console.error("Fetch business variables failed:", err)
        }
    }

    const lateReturnFee = businessVariables.find(
        (v) => v.key === BusinessVariableKey.LateReturnFeePerHour
    ) || {
        id: "",
        key: BusinessVariableKey.LateReturnFeePerHour,
        value: 10000
    }

    const maxLateReturnHours = businessVariables.find(
        (v) => v.key === BusinessVariableKey.MaxLateReturnHours
    ) || {
        id: "",
        key: BusinessVariableKey.MaxLateReturnHours,
        value: 1
    }

    const refundCreationDelayDays = businessVariables.find(
        (v) => v.key === BusinessVariableKey.RefundCreationDelayDays
    ) || {
        id: "",
        key: BusinessVariableKey.RefundCreationDelayDays,
        value: 10
    }

    return (
        <div className="w-full max-w-5xl px-3 py-6 md:py-8 md:px-12 bg-white rounded-2xl shadow-lg">
            {locale === "vi" ? (
                <PolicyPageVN
                    lateReturnFee={lateReturnFee}
                    maxLateReturnHours={maxLateReturnHours}
                    refundCreationDelayDays={refundCreationDelayDays}
                />
            ) : (
                <PolicyPageEN
                    lateReturnFee={lateReturnFee}
                    maxLateReturnHours={maxLateReturnHours}
                    refundCreationDelayDays={refundCreationDelayDays}
                />
            )}
        </div>
    )
}
