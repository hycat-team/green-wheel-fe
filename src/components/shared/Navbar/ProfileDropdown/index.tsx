"use client"

import React, { useCallback } from "react"
import { DropdownTrigger, DropdownMenu, DropdownItem, User, Spinner } from "@heroui/react"
import { useTranslation } from "react-i18next"
import { DropdownStyled } from "@/components"
import { useGetMe, useLogout } from "@/hooks"
import Link from "next/link"
import { DEFAULT_AVATAR_URL } from "@/constants/constants"
import { useRouter } from "next/navigation"
import { RoleName } from "@/constants/enum"

type DropdownLinkItem = {
    key: string
    href?: string
    label: string
    color?: "danger"
}

export const buildItems = ({
    roleName,
    defaultItems,
    customerItems = [],
    staffItems = [],
    adminItems = [],
    superAdminItems = [],
    bottomItems = []
}: {
    roleName?: RoleName
    defaultItems: DropdownLinkItem[]
    customerItems?: DropdownLinkItem[]
    staffItems?: DropdownLinkItem[]
    adminItems?: DropdownLinkItem[]
    superAdminItems?: DropdownLinkItem[]
    bottomItems?: DropdownLinkItem[]
}) => {
    const roleItemsMap: Record<RoleName, DropdownLinkItem[]> = {
        [RoleName.Customer]: customerItems,
        [RoleName.Staff]: staffItems,
        [RoleName.SuperAdmin]: superAdminItems,
        [RoleName.Admin]: adminItems
    }
    const combinedItems = [...defaultItems, ...(roleName ? roleItemsMap[roleName] : [])]

    const uniqueItems: DropdownLinkItem[] = []
    const seenKeys = new Set<string>()

    for (const tab of combinedItems) {
        if (seenKeys.has(tab.key)) continue
        seenKeys.add(tab.key)
        uniqueItems.push(tab)
    }

    uniqueItems.push(...bottomItems)
    return uniqueItems
}

export function ProfileDropdown({ onOpen = undefined }: { onOpen?: () => void }) {
    const { t } = useTranslation()
    const router = useRouter()
    const logoutMutation = useLogout({ onSuccess: () => router.replace("/") })

    const { data: user, isLoading: isGetMeLoading, isError: isGetMeError } = useGetMe()

    const defaultItems: DropdownLinkItem[] = [
        {
            key: "profile",
            href: "/profile",
            label: t("user.profile")
        }
    ]

    const bottomItems: DropdownLinkItem[] = [
        { key: "logout", label: t("navbar.logout") as string, color: "danger" }
    ]

    const customerItems: DropdownLinkItem[] = [
        {
            key: "rental_bookings",
            href: "/rental-bookings",
            label: t("user.rental_bookings")
        },
        {
            key: "customer_support",
            href: "/customer-supports",
            label: t("ticket.customer_support")
        }
    ]

    const adminItems: DropdownLinkItem[] = [
        {
            key: "dashboard",
            href: "/dashboard",
            label: t("staff.dashboard")
        }
    ]

    const superAdminItems: DropdownLinkItem[] = [
        {
            key: "dashboard",
            href: "/dashboard",
            label: t("staff.dashboard")
        }
    ]

    const staffItems: DropdownLinkItem[] = [
        {
            key: "dashboard",
            href: "/dashboard",
            label: t("staff.dashboard")
        }
    ]

    const dropdownItems = buildItems({
        roleName: user?.role?.name as RoleName | undefined,
        defaultItems,
        superAdminItems,
        adminItems,
        staffItems,
        customerItems,
        bottomItems
    })

    const handleLogout = useCallback(async () => {
        await logoutMutation.mutateAsync()
    }, [logoutMutation])

    // handle get me error
    if (isGetMeLoading || isGetMeError) return <Spinner />

    return (
        <div className="gap-4 flex items-center">
            <DropdownStyled
                classNames={{
                    content: "min-w-fit"
                }}
            >
                <DropdownTrigger>
                    <User
                        id="navbar-user"
                        as="button"
                        avatarProps={{
                            isBordered: true,
                            src: user?.avatarUrl || DEFAULT_AVATAR_URL
                        }}
                        className="transition-transform"
                        name={user?.firstName.trim() || ""}
                        classNames={{
                            name: "hidden sm:block text-[16px] font-bold"
                        }}
                        onClick={() => onOpen?.()}
                    />
                </DropdownTrigger>
                <DropdownMenu className="max-w-fit" variant="flat">
                    {dropdownItems.map((item) =>
                        item.href ? (
                            <DropdownItem
                                id={item.key === "profile" ? "navbar-profile" : ""}
                                key={item.key}
                                as={Link}
                                href={item.href}
                                className="block pr-5"
                            >
                                {item.label}
                            </DropdownItem>
                        ) : (
                            <DropdownItem
                                key={item.key}
                                textValue={item.label}
                                color={item.color}
                                className="block pr-5"
                                onPress={handleLogout}
                            >
                                {item.label}
                            </DropdownItem>
                        )
                    )}
                </DropdownMenu>
            </DropdownStyled>
        </div>
    )
}
