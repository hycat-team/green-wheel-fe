"use client"

import { buildTabs, Sidebar, SidebarItem } from "@/components"
import { RoleName } from "@/constants/enum"
import { useGetMe } from "@/hooks"
import React from "react"
import { useTranslation } from "react-i18next"

export function DashboardSidebar({ className }: { className?: string }) {
    const { data: user } = useGetMe()
    const { t } = useTranslation()

    const defaultTabs: SidebarItem[] = []

    const staffTabs: SidebarItem[] = [
        {
            key: "/dashboard/rental-bookings",
            label: t("staff.sidebar_bookings"),
            href: "/dashboard/rental-bookings"
        },
        {
            key: "/dashboard/vehicle-checklists",
            label: t("staff.sidebar_vehicle_checklists"),
            href: "/dashboard/vehicle-checklists"
        },
        {
            key: "/dashboard/vehicles",
            label: t("admin.sidebar_vehicle_management"),
            href: "/dashboard/vehicles"
        },
        {
            key: "/dashboard/users",
            label: t("staff.sidebar_user_management"),
            href: "/dashboard/users"
        },
        {
            key: "/dashboard/customer-supports",
            label: t("staff.sidebar_customer_supports"),
            href: "/dashboard/customer-supports"
        },
        {
            key: "/dashboard/contacts",
            label: t("staff.sidebar_contact"),
            href: "/dashboard/contacts"
        },
        {
            key: "/dashboard/feedbacks",
            label: t("staff.sidebar_feedback"),
            href: "/dashboard/feedbacks"
        },
        {
            key: "/dashboard/reports",
            label: t("staff.sidebar_reports"),
            href: "/dashboard/reports"
        }
    ]

    const superAdminTabs: SidebarItem[] = [
        {
            key: "/dashboard/statistic",
            label: t("admin.statistic"),
            href: "/dashboard/statistic"
        },
        {
            key: "/dashboard/rental-bookings",
            label: t("staff.sidebar_bookings"),
            href: "/dashboard/rental-bookings"
        },
        {
            key: "/dashboard/dispatchs",
            label: t("admin.dispatch"),
            href: "/dashboard/dispatchs"
        },
        {
            key: "/dashboard/fleets",
            label: t("admin.sidebar_fleet"),
            href: "/dashboard/fleets"
        },
        {
            key: "/dashboard/admins",
            label: t("super_admin.sidebar_admin_management"),
            href: "/dashboard/admins"
        },
        {
            key: "/dashboard/system-settings",
            label: t("system.system_setting"),
            href: "/dashboard/system-settings"
        }
    ]

    const adminTabs: SidebarItem[] = [
        {
            key: "/dashboard/station-statistic",
            label: t("admin.sidebar_admin_statistic"),
            href: "/dashboard/station-statistic"
        },
        {
            key: "/dashboard/rental-bookings",
            label: t("staff.sidebar_bookings"),
            href: "/dashboard/rental-bookings"
        },
        {
            key: "/dashboard/vehicles",
            label: t("admin.sidebar_vehicle_management"),
            href: "/dashboard/vehicles"
        },
        {
            key: "/dashboard/vehicle-components",
            label: t("admin.sidebar_vehicle_components"),
            href: "/dashboard/vehicle-components"
        },
        {
            key: "/dashboard/staffs",
            label: t("admin.sidebar_staff_management"),
            href: "/dashboard/staffs"
        },
        {
            key: "/dashboard/dispatchs",
            label: t("admin.dispatch"),
            href: "/dashboard/dispatchs"
        },
        {
            key: "/dashboard/reports",
            label: t("staff.sidebar_reports"),
            href: "/dashboard/reports"
        },
        {
            key: "/dashboard/customer-supports",
            label: t("staff.sidebar_customer_supports"),
            href: "/dashboard/customer-supports"
        }
    ]

    const tabs = buildTabs({
        roleName: user?.role?.name as RoleName | undefined,
        defaultTabs,
        staffTabs,
        superAdminTabs,
        adminTabs
    })

    return <Sidebar isDashboard={true} user={user} tabs={tabs} className={className} />
}
