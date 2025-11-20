"use client"

import React from "react"
import { useImageUploadModal, useUploadDriverLicense, useUploadDriverLicenseById } from "@/hooks"
import { ButtonIconStyled, ImagesUploaderModal } from "@/components/"
import { useTranslation } from "react-i18next"
import { DriverLicenseViewRes } from "@/models/driver-license/schema/response"
import { Camera } from "lucide-react"
import { cn } from "@heroui/react"

export function DriverLicenseUploader({
    btnClassName = "",
    customerId,
    onSuccess
}: {
    btnClassName?: string
    customerId?: string
    // callback onSuccess để nhận được nguyên dữ liệu trả về từ API (bao gồm imageUrl).
    //  Nhờ vậy component cha (ví dụ EditUserModal) có thể cập nhật ngay phần preview mà không cần gọi lại server.
    //  Nếu không thêm kiểu và không truyền dữ liệu, callback chỉ chạy như “đã xong” nhưng không có thông tin nào để cập nhật giao diện..
    onSuccess?: (data: DriverLicenseViewRes) => void
}) {
    const { t } = useTranslation()
    const { isOpen, onOpen, onOpenChange, onClose } = useImageUploadModal()
    const uploadDriverLicenseById = useUploadDriverLicenseById({
        userId: customerId || "",
        onError: onClose,
        onSuccess: (data) => {
            onSuccess?.(data)
        }
    })
    const uploadDriverLicense = useUploadDriverLicense({ onError: onClose })

    const currentUpload = customerId ? uploadDriverLicenseById : uploadDriverLicense

    return (
        <>
            <ButtonIconStyled
                color="primary"
                variant="ghost"
                isDisabled={currentUpload.isPending}
                className={cn(
                    "w-fit px-4 py-2 rounded-lg flex items-center justify-center",
                    btnClassName
                )}
                onPress={onOpen}
            >
                <Camera size={18} fontWeight="fill" />
                {t("user.upload_driver_license")}
            </ButtonIconStyled>
            <ImagesUploaderModal
                key={isOpen ? "open" : "closed"}
                label={`${t("user.upload_driver_license")} - ${t("user.b1_or_higher")}`}
                notes={t("user.upload_first_then_back_image")}
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                onClose={onClose}
                cropShape="rect"
                cropSize={{ width: 700, height: 437.5 }}
                uploadFn={currentUpload.mutateAsync}
                isUploadPending={currentUpload.isPending}
                minAmount={2}
                maxAmount={2}
                listClassName="md:grid-cols-2"
            />
        </>
    )

    // return (
    //     <>
    //         <ImageUploadButton
    //             label={t("user.upload_driver_license")}
    //             onFileSelect={onFileSelect}
    //             btnClassName={btnClassName}
    //         />
    //         <ImageUploaderModal
    //             label={t("user.upload_driver_license")}
    //             imgSrc={imgSrc}
    //             setImgSrc={setImgSrc}
    //             isOpen={isOpen}
    //             onOpenChange={onOpenChange}
    //             onClose={onClose}
    //             uploadFn={currentUpload.mutateAsync}
    //             isUploadPending={currentUpload.isPending}
    //             cropShape="rect"
    //             cropSize={{ width: 700, height: 437.5 }}
    //         />
    //     </>
    // )
}
