export enum RoleName {
    SuperAdmin = "SuperAdmin",
    Admin = "Admin",
    Staff = "Staff",
    Customer = "Customer"
}

export enum Sex {
    Male = 0,
    Female = 1
}
// Có thể map ngược DispatchRequestStatus[1] → "Approved".
export enum DispatchRequestStatus {
    Pending = 0,
    Approved = 1,
    Assigned = 2,
    Received = 3,
    Rejected = 4,
    Cancelled = 5
}

export enum DepositStatus {
    Pending = 0,
    Refunded = 1,
    Forfeited = 2
}

export enum InvoiceStatus {
    Pending = 0,
    Paid = 1,
    Cancelled = 2
}

export enum InvoiceType {
    Reservation = 0,
    Handover = 1,
    Return = 2,
    Refund = 3,
    Other = 4
}

export enum RentalContractStatus {
    RequestPending = 0,
    PaymentPending = 1,
    Active = 2,
    Returned = 3,
    Completed = 4,
    Cancelled = 5,
    UnavailableVehicle = 6,
    RefundPending = 7
}

export enum VehicleIssueResolutionOption {
    Refund = 0,
    ChangeVehicle = 1
}

export enum DamageStatus {
    Good = 0,
    Minor = 1,
    Moderate = 2,
    Severe = 3,
    Totaled = 4
}

export enum VehicleStatus {
    Available = 0,
    Unavailable = 1,
    Rented = 2,
    Maintenance = 3,
    MissingNoReason = 4,
    LateReturn = 5
}

export enum InvoiceItemType {
    BaseRental = 0,
    Damage = 1,
    LateReturn = 2,
    Cleaning = 3,
    Penalty = 4, //PHẠT NGUỘI
    Refund = 5,
    Other = 6
}

export enum PaymentMethod {
    Cash = 0,
    MomoWallet = 1
}

export enum TicketType {
    CustomerSupport = 0,
    StaffReport = 1,
    Contact = 2
}

export enum TicketStatus {
    Pending = 0,
    Resolve = 1,
    EscalatedToAdmin = 2
}

export enum LicenseClass {
    B = 0,
    B1 = 1,
    B2 = 2,
    B3 = 3,
    C = 4,
    C1 = 5,
    C1E = 6,
    CE = 7,
    D = 8,
    D1 = 9,
    D1E = 10,
    D2 = 11,
    D2E = 12,
    DE = 13,
    E = 14,
    F = 15,
    BE = 16
}

export enum OrderStatus {
    All = 0,
    Pending = 1,
    AwaitingDeposit = 2,
    Confirmed = 3,
    InUse = 4,
    Returned = 5,
    Overdue = 6,
    Completed = 7,
    Cancelled = 8
}

export enum VehicleChecklistType {
    OutOfContract = 0,
    Handover = 1,
    Return = 2
}

export enum BusinessVariableKey {
    LateReturnFeePerHour = 0,
    CleaningFee = 1,
    BaseVAT = 2,
    MaxLateReturnHours = 3,
    RentalContractBufferDay = 4,
    RefundCreationDelayDays = 5
}
