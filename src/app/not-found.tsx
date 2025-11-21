"use client"

import React from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ButtonStyled } from "@/components"
import { useTranslation } from "react-i18next"

export default function NotFound() {
    const { t } = useTranslation()
    return (
        <div className="relative flex h-screen w-full flex-col justify-center items-center overflow-hidden bg-gradient-to-br from-primary/90 via-emerald-900 to-gray-900 text-white mt-[-6.25rem]">
            {/* Hiệu ứng background mờ nhẹ */}
            <motion.div
                className="absolute top-[10rem] inset-0 
                bg-[url('/images/VF9_Highlights-pt.png')] bg-cover bg-center opacity-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.15 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
            />

            {/* Con số 404 lớn */}
            <div className="relative top-[-11rem] left-[1rem] flex items-center justify-center select-none">
                <motion.h1
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="absolute text-[35vw] font-extrabold leading-none text-white/10"
                >
                    404
                </motion.h1>

                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                    className="text-center z-10"
                >
                    <h2 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white drop-shadow-lg">
                        {t("errors.not_found")}
                    </h2>
                    <p className="mt-4 text-gray-200 text-lg md:text-xl font-light">
                        {t("errors.not_found_description")}
                    </p>

                    {/* Nút Home chính giữa */}
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="mt-10"
                    >
                        <Link href="/">
                            <ButtonStyled className="px-6 py-3 rounded-xl text-base font-semibold shadow-md bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 transition-all">
                                {t("errors.go_home")}
                            </ButtonStyled>
                        </Link>
                    </motion.div>
                </motion.div>
            </div>

            {/* Gradient ánh sáng chuyển động */}
            <motion.div
                className="absolute bottom-0 left-0 w-[80vw] h-[80vw] rounded-full bg-primary-500/12 blur-[200px]"
                animate={{ x: [0, 50, 0], y: [0, -30, 0] }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            />
            {/* <motion.div
                className="absolute top-0 right-0 w-[60vw] h-[60vw] rounded-full bg-teal-400/10 blur-[180px]"
                animate={{ x: [0, -40, 0], y: [0, 20, 0] }}
                transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            /> */}
        </div>
    )
}
