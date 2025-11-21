"use client"

import React, { useCallback, useState } from "react"
import { ModalStyled, ButtonStyled, ImageCropper } from "@/components/"
import { ModalContent, ModalBody, ModalHeader, Spinner } from "@heroui/react"
import { getCroppedImage } from "@/utils/helpers/image"
import { useTranslation } from "react-i18next"

type ImageUploaderModalProps = {
    isOpen: boolean
    onOpenChange: () => void
    onClose: () => void
    imgSrc: string | null
    setImgSrc: (src: string | null) => void
    setDisplayImg?: (src: string | undefined) => void
    aspect?: number
    cropShape?: "rect" | "round"
    cropSize: { width: number; height: number }
    label?: string
    uploadFn: (formData: FormData) => Promise<any>
    isUploadPending: boolean
}

export function ImageUploaderModal({
    isOpen,
    onOpenChange,
    onClose,
    imgSrc,
    setImgSrc,
    uploadFn,
    setDisplayImg,
    isUploadPending,
    aspect = 1,
    cropShape = "rect",
    cropSize,
    label
}: ImageUploaderModalProps) {
    const { t } = useTranslation()
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null)

    const handleUpload = useCallback(async () => {
        if (!imgSrc || !croppedAreaPixels) return

        const blob = await getCroppedImage(imgSrc, croppedAreaPixels)

        const formData = new FormData()
        formData.append("file", blob, "image.jpg")

        const res = await uploadFn(formData)
        if (!!res && typeof res.img === "string" && !!setDisplayImg) {
            setDisplayImg(res.img)
        }

        setImgSrc(null)
        onClose()
    }, [croppedAreaPixels, imgSrc, onClose, setDisplayImg, setImgSrc, uploadFn])

    return (
        <ModalStyled
            isOpen={isOpen}
            onOpenChange={() => {
                if (!isUploadPending) {
                    onOpenChange()
                }
            }}
            isDismissable={!isUploadPending}
        >
            <ModalContent className="w-full min-w-fit p-4">
                <ModalHeader className="px-3 py-2 self-center">{label}</ModalHeader>
                <ModalBody>
                    {imgSrc && (
                        <div className="flex flex-col items-center gap-4">
                            <ImageCropper
                                imgSrc={imgSrc}
                                onCropComplete={setCroppedAreaPixels}
                                aspect={aspect}
                                cropShape={cropShape}
                                cropSize={cropSize}
                            />
                            <div className="flex gap-3">
                                <ButtonStyled
                                    color="primary"
                                    onPress={handleUpload}
                                    isDisabled={isUploadPending}
                                >
                                    {isUploadPending ? (
                                        <Spinner color="white" />
                                    ) : (
                                        t("common.upload")
                                    )}
                                </ButtonStyled>
                                <ButtonStyled onPress={onClose} isDisabled={isUploadPending}>
                                    {t("common.cancel")}
                                </ButtonStyled>
                            </div>
                        </div>
                    )}
                </ModalBody>
            </ModalContent>
        </ModalStyled>
    )
}
