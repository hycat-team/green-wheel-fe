"use client"

import { BusinessVariableViewRes } from "@/models/business-variables/schema/respone"
import { formatCurrencyWithSymbol } from "@/utils/helpers/currency"
import React from "react"
import { highlight } from "../helper"
import {
    BASE_FEE,
    BOOKING_CANCEL,
    CUSTOMER_RESPONSIBILITY,
    DEPOSIT,
    HANDOVER_RETURN,
    INTRO_DEFINITIONS,
    INTRO_PURPOSE,
    LIABILITY_LIMIT,
    MISC,
    PAYMENT,
    PRIVACY,
    REMINDER_NOTICE,
    SERVICE_DESCRIPTION
} from "./content"

export function PolicyPageEN({
    lateReturnFee,
    maxLateReturnHours,
    refundCreationDelayDays
}: {
    lateReturnFee: BusinessVariableViewRes
    maxLateReturnHours: BusinessVariableViewRes
    refundCreationDelayDays: BusinessVariableViewRes
}) {
    // Keywords to highlight
    const HIGHLIGHTS = [
        "Green Wheel",
        "GW",
        "GTCs",
        "GTC",
        "Rental Agreement",
        "Information Channels",
        "Customers",
        "Customer",
        "User",
        "Vehicle Checklist",
        "Rental Fee",
        "Service Booking",
        "Reservation Invoice",
        "Handover Invoice",
        "Rental Fee",
        "Deposit Fee",
        "Additional Fee",
        "Damage Fee",
        "Cost",
        "Working Day",
        "Working Hours",
        "offset",
        "non-refundable",
        "refunded",
        "refund",
        "vehicle repossession",
        "07:00",
        "17:00",
        `${refundCreationDelayDays.value.toString()} days`,
        "24 hours",
        "Vehicle",
        formatCurrencyWithSymbol(lateReturnFee.value)
    ]

    const LATE_RETURN_FEE = String.raw`- A late return fee applies ${
        maxLateReturnHours.value
    } hour(s) after the scheduled return time stated in the Rental Agreement. For every additional hour, an extra charge of ${formatCurrencyWithSymbol(
        lateReturnFee.value
    )} will be applied.`

    const intro_purpose = highlight(INTRO_PURPOSE, HIGHLIGHTS)
    const intro_definitions = highlight(
        INTRO_DEFINITIONS.replace(
            "{{refundCreationDelayDays}}",
            refundCreationDelayDays.value.toString()
        ),
        HIGHLIGHTS
    )
    const service_desc = highlight(SERVICE_DESCRIPTION, HIGHLIGHTS)
    const booking_cancel = highlight(BOOKING_CANCEL, HIGHLIGHTS)
    const base_fee = highlight(BASE_FEE, HIGHLIGHTS)
    const late_fee = highlight(LATE_RETURN_FEE, HIGHLIGHTS)
    const reminder_notice = highlight(REMINDER_NOTICE, HIGHLIGHTS)
    const deposit = highlight(
        DEPOSIT.replace("{{refundCreationDelayDays}}", refundCreationDelayDays.value.toString()),
        HIGHLIGHTS
    )
    const payment = highlight(PAYMENT, HIGHLIGHTS)
    const handover_return = highlight(HANDOVER_RETURN, HIGHLIGHTS)
    const customer_resp = highlight(CUSTOMER_RESPONSIBILITY, HIGHLIGHTS)
    const liability_limit = highlight(LIABILITY_LIMIT, HIGHLIGHTS)
    const privacy = highlight(PRIVACY, HIGHLIGHTS)
    const misc = highlight(MISC, HIGHLIGHTS)

    return (
        <main className="max-w-5xl mx-auto px-6 py-12 text-justify">
            <header className="text-center mb-10">
                <h1 className="text-3xl font-bold text-green-600 uppercase">
                    <span>GREEN WHEEL TRADING AND SERVICE JOINT STOCK COMPANY</span>
                </h1>
                <h2 className="text-xl font-semibold mt-3 text-gray-800 dark:text-gray-200">
                    GENERAL TERMS AND CONDITIONS
                </h2>
            </header>

            <article className="prose dark:prose-invert max-w-none leading-relaxed">
                {/* PART I */}
                <section className="mb-8">
                    <h2 className="text-2xl font-bold">PART I. INTRODUCTION</h2>

                    <h3 className="mt-4 text-xl font-bold">1. PURPOSE</h3>
                    <div
                        className="whitespace-pre-wrap font-sans text-[17px] sm:text-[18px]"
                        dangerouslySetInnerHTML={{ __html: intro_purpose }}
                    />

                    <h3 className="mt-6 text-xl font-bold">2. DEFINITIONS</h3>
                    <div
                        className="whitespace-pre-wrap font-sans text-[17px] sm:text-[18px]"
                        dangerouslySetInnerHTML={{ __html: intro_definitions }}
                    />
                </section>

                {/* PART II */}
                <section className="mb-8">
                    <h2 className="text-2xl font-bold">PART II. GENERAL TERMS</h2>

                    <h3 className="mt-4 text-xl font-bold">1. GREEN WHEEL SERVICE</h3>
                    <div
                        className="whitespace-pre-wrap font-sans text-[17px] sm:text-[18px]"
                        dangerouslySetInnerHTML={{ __html: service_desc }}
                    />

                    <h3 className="mt-6 text-xl font-bold">2. BOOKING AND CANCELLATION</h3>
                    <div
                        className="whitespace-pre-wrap font-sans text-[17px] sm:text-[18px]"
                        dangerouslySetInnerHTML={{ __html: booking_cancel }}
                    />

                    <h3 className="mt-6 text-xl font-bold">3. FEES & SURCHARGES</h3>

                    <h4 className="mt-4 text-lg font-bold">3.1. Base Fee</h4>
                    <div
                        className="whitespace-pre-wrap font-sans text-[17px] sm:text-[18px]"
                        dangerouslySetInnerHTML={{ __html: base_fee }}
                    />

                    <h4 className="mt-4 text-lg font-bold">3.2. Late Return Fee</h4>
                    <div
                        className="whitespace-pre-wrap font-sans text-[17px] sm:text-[18px]"
                        dangerouslySetInnerHTML={{ __html: late_fee }}
                    />

                    <h4 className="mt-4 text-lg font-bold">3.3. Reminders & Warnings</h4>
                    <div
                        className="whitespace-pre-wrap font-sans text-[17px] sm:text-[18px]"
                        dangerouslySetInnerHTML={{ __html: reminder_notice }}
                    />

                    <h3 className="mt-6 text-xl font-bold">4. DEPOSIT</h3>
                    <div
                        className="whitespace-pre-wrap font-sans text-[17px] sm:text-[18px]"
                        dangerouslySetInnerHTML={{ __html: deposit }}
                    />

                    <h3 className="mt-6 text-xl font-bold">5. PAYMENT</h3>
                    <div
                        className="whitespace-pre-wrap font-sans text-[17px] sm:text-[18px]"
                        dangerouslySetInnerHTML={{ __html: payment }}
                    />

                    <h3 className="mt-6 text-xl font-bold">6. VEHICLE HANDOVER AND RETURN</h3>
                    <div
                        className="whitespace-pre-wrap font-sans text-[17px] sm:text-[18px]"
                        dangerouslySetInnerHTML={{ __html: handover_return }}
                    />

                    <h3 className="mt-6 text-xl font-bold">7. CUSTOMER RESPONSIBILITIES</h3>
                    <div
                        className="whitespace-pre-wrap font-sans text-[17px] sm:text-[18px]"
                        dangerouslySetInnerHTML={{ __html: customer_resp }}
                    />

                    <h3 className="mt-6 text-xl font-bold">8. LIMITATION OF LIABILITY</h3>
                    <div
                        className="whitespace-pre-wrap font-sans text-[17px] sm:text-[18px]"
                        dangerouslySetInnerHTML={{ __html: liability_limit }}
                    />

                    <h3 className="mt-6 text-xl font-bold">9. PRIVACY & DATA PROTECTION</h3>
                    <div
                        className="whitespace-pre-wrap font-sans text-[17px] sm:text-[18px]"
                        dangerouslySetInnerHTML={{ __html: privacy }}
                    />

                    <h3 className="mt-6 text-xl font-bold">10. MISCELLANEOUS</h3>
                    <div
                        className="whitespace-pre-wrap font-sans text-[17px] sm:text-[18px]"
                        dangerouslySetInnerHTML={{ __html: misc }}
                    />
                </section>
            </article>
        </main>
    )
}
