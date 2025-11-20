import i18n from "@/lib/i18n"
import {
    Sex,
    DispatchRequestStatus,
    DepositStatus,
    InvoiceStatus,
    RentalContractStatus,
    DamageStatus,
    VehicleStatus,
    InvoiceItemType,
    PaymentMethod,
    LicenseClass,
    OrderStatus,
    InvoiceType,
    TicketType,
    TicketStatus,
    VehicleChecklistType,
    RoleName,
    VehicleIssueResolutionOption,
    BusinessVariableKey
} from "./enum"

export const RoleNameLabels: Record<RoleName, string> = {
    [RoleName.SuperAdmin]: i18n.t("enum.super_admin"),
    [RoleName.Admin]: i18n.t("enum.admin"),
    [RoleName.Staff]: i18n.t("enum.staff"),
    [RoleName.Customer]: i18n.t("enum.customer")
}

export const SexLabels: Record<Sex, string> = {
    [Sex.Male]: i18n.t("enum.male"),
    [Sex.Female]: i18n.t("enum.female")
}

export const DispatchRequestStatusLabels: Record<DispatchRequestStatus, string> = {
    [DispatchRequestStatus.Pending]: i18n.t("enum.pending"),
    [DispatchRequestStatus.Approved]: i18n.t("enum.approved"),
    [DispatchRequestStatus.Assigned]: i18n.t("enum.assign"),
    [DispatchRequestStatus.Rejected]: i18n.t("enum.rejected"),
    [DispatchRequestStatus.Received]: i18n.t("enum.received"),
    [DispatchRequestStatus.Cancelled]: i18n.t("enum.cancelled")
}

export const DepositStatusLabels: Record<DepositStatus, string> = {
    [DepositStatus.Pending]: i18n.t("enum.pending"),
    [DepositStatus.Refunded]: i18n.t("enum.refunded"),
    [DepositStatus.Forfeited]: i18n.t("enum.forfeited")
}

export const InvoiceStatusLabels: Record<InvoiceStatus, string> = {
    [InvoiceStatus.Pending]: i18n.t("enum.pending"),
    [InvoiceStatus.Paid]: i18n.t("enum.paid"),
    [InvoiceStatus.Cancelled]: i18n.t("enum.cancelled")
}

export const RentalContractStatusLabels: Record<RentalContractStatus, string> = {
    [RentalContractStatus.RequestPending]: i18n.t("enum.request_pending"),
    [RentalContractStatus.PaymentPending]: i18n.t("enum.payment_pending"),
    [RentalContractStatus.Active]: i18n.t("enum.active"),
    [RentalContractStatus.Returned]: i18n.t("enum.returned"),
    [RentalContractStatus.Completed]: i18n.t("enum.completed"),
    [RentalContractStatus.Cancelled]: i18n.t("enum.cancelled"),
    [RentalContractStatus.UnavailableVehicle]: i18n.t("enum.unavailable_vehicle"),
    [RentalContractStatus.RefundPending]: i18n.t("enum.refund_pending")
}

export const VehicleIssueResolutionOptionLabels: Record<VehicleIssueResolutionOption, string> = {
    [VehicleIssueResolutionOption.Refund]: i18n.t("enum.refund"),
    [VehicleIssueResolutionOption.ChangeVehicle]: i18n.t("enum.change_vehicle")
}

export const DamageStatusLabels: Record<DamageStatus, string> = {
    [DamageStatus.Good]: i18n.t("enum.good"),
    [DamageStatus.Minor]: i18n.t("enum.minor"),
    [DamageStatus.Moderate]: i18n.t("enum.moderate"),
    [DamageStatus.Severe]: i18n.t("enum.severe"),
    [DamageStatus.Totaled]: i18n.t("enum.totaled")
}

export const VehicleStatusLabels: Record<VehicleStatus, string> = {
    [VehicleStatus.Available]: i18n.t("enum.available"),
    [VehicleStatus.Unavailable]: i18n.t("enum.unavailable"),
    [VehicleStatus.Rented]: i18n.t("enum.rented"),
    [VehicleStatus.Maintenance]: i18n.t("enum.maintenance"),
    [VehicleStatus.MissingNoReason]: i18n.t("enum.missing_no_reason"),
    [VehicleStatus.LateReturn]: i18n.t("enum.late_return")
}

export const InvoiceItemTypeLabels: Record<InvoiceItemType, string> = {
    [InvoiceItemType.BaseRental]: i18n.t("enum.base_rental"),
    [InvoiceItemType.Damage]: i18n.t("enum.damage"),
    [InvoiceItemType.LateReturn]: i18n.t("enum.late_return"),
    [InvoiceItemType.Cleaning]: i18n.t("enum.cleaning"),
    [InvoiceItemType.Penalty]: i18n.t("enum.penalty"),
    [InvoiceItemType.Refund]: i18n.t("enum.refund"),
    [InvoiceItemType.Other]: i18n.t("enum.other")
}

export const PaymentMethodLabels: Record<PaymentMethod, string> = {
    [PaymentMethod.Cash]: i18n.t("enum.cash"),
    [PaymentMethod.MomoWallet]: i18n.t("enum.momo_wallet")
}

// export const SupportRequestStatusLabels: Record<SupportRequestStatus, string> = {
//     [SupportRequestStatus.Pending]: i18n.t("enum.pending"),
//     [SupportRequestStatus.InProgress]: i18n.t("enum.in_progress"),
//     [SupportRequestStatus.Resolved]: i18n.t("enum.resolved")
// }

// export const SupportRequestTypeLabels: Record<SupportRequestType, string> = {
//     [SupportRequestType.Technical]: i18n.t("enum.technical"),
//     [SupportRequestType.Payment]: i18n.t("enum.payment"),
//     [SupportRequestType.Other]: i18n.t("enum.other")
// }

// export const StaffReportStatusLabels: Record<StaffReportStatus, string> = {
//     [StaffReportStatus.Pending]: i18n.t("enum.pending"),
//     [StaffReportStatus.InProgress]: i18n.t("enum.in_progress"),
//     [StaffReportStatus.Resolved]: i18n.t("enum.resolved")
// }

// export const StaffReportTypeLabels: Record<StaffReportType, string> = {
//     [StaffReportType.Internal]: i18n.t("enum.internal"),
//     [StaffReportType.RelatedToSupport]: i18n.t("enum.related_to_support"),
//     [StaffReportType.Other]: i18n.t("enum.other")
// }

export const TicketTypeLabels: Record<TicketType, string> = {
    [TicketType.CustomerSupport]: i18n.t("enum.customer_support"),
    [TicketType.StaffReport]: i18n.t("enum.staff_report"),
    [TicketType.Contact]: i18n.t("enum.contact")
}

export const TicketStatusLabels: Record<TicketStatus, string> = {
    [TicketStatus.Pending]: i18n.t("enum.pending"),
    [TicketStatus.Resolve]: i18n.t("enum.resolve"),
    [TicketStatus.EscalatedToAdmin]: i18n.t("enum.escalated_to_admin")
}

export const LicenseClassLabels: Record<LicenseClass, string> = {
    [LicenseClass.B]: i18n.t("enum.b"),
    [LicenseClass.B1]: i18n.t("enum.b1"),
    [LicenseClass.B2]: i18n.t("enum.b2"),
    [LicenseClass.B3]: i18n.t("enum.b3"),
    [LicenseClass.C]: i18n.t("enum.c"),
    [LicenseClass.C1]: i18n.t("enum.c1"),
    [LicenseClass.C1E]: i18n.t("enum.c1e"),
    [LicenseClass.CE]: i18n.t("enum.ce"),
    [LicenseClass.D]: i18n.t("enum.d"),
    [LicenseClass.D1]: i18n.t("enum.d1"),
    [LicenseClass.D1E]: i18n.t("enum.d1e"),
    [LicenseClass.D2]: i18n.t("enum.d2"),
    [LicenseClass.D2E]: i18n.t("enum.d2e"),
    [LicenseClass.DE]: i18n.t("enum.de"),
    [LicenseClass.E]: i18n.t("enum.e"),
    [LicenseClass.F]: i18n.t("enum.f"),
    [LicenseClass.BE]: i18n.t("enum.be")
}

export const OrderStatusLabels: Record<OrderStatus, string> = {
    [OrderStatus.All]: i18n.t("enum.all"),
    [OrderStatus.Pending]: i18n.t("enum.pending"),
    [OrderStatus.AwaitingDeposit]: i18n.t("enum.awaiting_deposit"),
    [OrderStatus.Confirmed]: i18n.t("enum.confirmed"),
    [OrderStatus.InUse]: i18n.t("enum.in_use"),
    [OrderStatus.Returned]: i18n.t("enum.returned"),
    [OrderStatus.Overdue]: i18n.t("enum.overdue"),
    [OrderStatus.Completed]: i18n.t("enum.completed"),
    [OrderStatus.Cancelled]: i18n.t("enum.cancelled")
}

export const InvoiceTypeLabels: Record<InvoiceType, string> = {
    [InvoiceType.Handover]: i18n.t("enum.handover_invoice"),
    [InvoiceType.Return]: i18n.t("enum.return_invoice"),
    [InvoiceType.Refund]: i18n.t("enum.refund_invoice"),
    [InvoiceType.Other]: i18n.t("enum.other_invoice"),
    [InvoiceType.Reservation]: i18n.t("enum.reservation_invoice")
}

export const VehicleChecklistTypeLabels: Record<VehicleChecklistType, string> = {
    [VehicleChecklistType.OutOfContract]: i18n.t("enum.out_of_contract"),
    [VehicleChecklistType.Handover]: i18n.t("enum.handover"),
    [VehicleChecklistType.Return]: i18n.t("enum.return")
}

export const BusinessVariableKeyLabels: Record<BusinessVariableKey, string> = {
    [BusinessVariableKey.LateReturnFeePerHour]: i18n.t("enum.late_return_fee_per_hour"),
    [BusinessVariableKey.CleaningFee]: i18n.t("enum.cleaning_fee"),
    [BusinessVariableKey.BaseVAT]: i18n.t("enum.base_vat"),
    [BusinessVariableKey.MaxLateReturnHours]: i18n.t("enum.max_late_return_hours"),
    [BusinessVariableKey.RentalContractBufferDay]: i18n.t("enum.rental_contract_buffer_day"),
    [BusinessVariableKey.RefundCreationDelayDays]: i18n.t("enum.refund_creation_delay_days")
}
