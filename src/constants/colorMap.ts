import {
    DamageStatus,
    DispatchRequestStatus,
    InvoiceStatus,
    RentalContractStatus,
    TicketStatus,
    VehicleChecklistType,
    VehicleStatus
} from "./enum"

export const DamageStatusColorMap: Record<
    DamageStatus,
    "success" | "warning" | "default" | "danger"
> = {
    [DamageStatus.Good]: "success",
    [DamageStatus.Minor]: "default",
    [DamageStatus.Moderate]: "warning",
    [DamageStatus.Severe]: "danger",
    [DamageStatus.Totaled]: "danger"
}

export const DispatchRequestStatusColorMap: Record<
    DispatchRequestStatus,
    "warning" | "success" | "danger" | "default"
> = {
    [DispatchRequestStatus.Pending]: "default",
    [DispatchRequestStatus.Approved]: "warning",
    [DispatchRequestStatus.Assigned]: "success",
    [DispatchRequestStatus.Rejected]: "danger",
    [DispatchRequestStatus.Received]: "success",
    [DispatchRequestStatus.Cancelled]: "default"
}

export const TicketStatusColorMap: Record<TicketStatus, "warning" | "success" | "danger"> = {
    [TicketStatus.Pending]: "warning",
    [TicketStatus.Resolve]: "success",
    [TicketStatus.EscalatedToAdmin]: "danger"
}

export const VehicleChecklistTypeColorMap: Record<
    VehicleChecklistType,
    "success" | "warning" | "default"
> = {
    [VehicleChecklistType.Handover]: "success",
    [VehicleChecklistType.Return]: "warning",
    [VehicleChecklistType.OutOfContract]: "default"
}

export const RentalContractStatusColorMap: Record<RentalContractStatus, string> = {
    [RentalContractStatus.RequestPending]: "bg-yellow-100 text-yellow-700",
    [RentalContractStatus.PaymentPending]: "bg-amber-100 text-amber-700",
    [RentalContractStatus.Active]: "bg-blue-100 text-blue-700",
    [RentalContractStatus.Returned]: "bg-emerald-100 text-emerald-700",
    [RentalContractStatus.Completed]: "bg-green-600 text-white",
    [RentalContractStatus.Cancelled]: "bg-red-100 text-red-700",
    [RentalContractStatus.UnavailableVehicle]: "bg-gray-200 text-gray-700",
    [RentalContractStatus.RefundPending]: "bg-orange-100 text-orange-700"
}

export const VehicleStatusColorMap: Record<VehicleStatus, string> = {
    [VehicleStatus.Available]: "bg-emerald-100 text-emerald-700",
    [VehicleStatus.Unavailable]: "bg-slate-200 text-slate-600",
    [VehicleStatus.Rented]: "bg-blue-100 text-blue-700",
    [VehicleStatus.Maintenance]: "bg-orange-100 text-orange-700",
    [VehicleStatus.MissingNoReason]: "bg-rose-100 text-rose-700",
    [VehicleStatus.LateReturn]: "bg-purple-100 text-purple-700"
}

export const InvoiceStatusColorMap: Record<InvoiceStatus, "success" | "warning" | "danger"> = {
    [InvoiceStatus.Paid]: "success",
    [InvoiceStatus.Pending]: "warning",
    [InvoiceStatus.Cancelled]: "danger"
}
