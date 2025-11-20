"use client"
import React from "react"
import { motion } from "framer-motion"
import { ButtonStyled } from "@/components"
import { Handshake, Leaf, Lightning } from "@phosphor-icons/react"
import { useTypewriter } from "@/hooks/reuseable/useTypewriter"

import Link from "next/link"
import { useTranslation } from "react-i18next"
import Image from "next/image"

export default function AboutPage() {
    const { t } = useTranslation()

    const [title, titleDone] = useTypewriter(t("about_us.about_us"), 50)
    const [desc] = useTypewriter(t("about_us.green_wheel_description"), 12, 300)

    const visionContent = [
        {
            title: t("about_us.towards_a_greener_future"),
            desc: t("about_us.ev_sustainability_belief"),
            icon: <Leaf size={48} weight="duotone" className="text-green-500" />
        },
        {
            title: t("about_us.customer_centric_approach"),
            desc: t("about_us.customer_experience_focus"),
            icon: <Handshake size={48} weight="duotone" className="text-blue-500" />
        },
        {
            title: t("about_us.continuous_innovation"),
            desc: t("about_us.innovation_description"),
            icon: <Lightning size={48} weight="duotone" className="text-yellow-500" />
        }
    ]

    return (
        <div className="w-full overflow-hidden mt-[-6.25rem]">
            <div className="relative w-full h-[70vh] flex items-center justify-center overflow-hidden ">
                <div className="absolute inset-0">
                    <Image
                        src="https://baovephapluat.vn/data/images/0/2021/11/12/hienbt/8.jpg"
                        alt="Green Wheel electric cars"
                        fill
                        className="object-cover opacity-70"
                    />
                </div>
                <div className="absolute bg-black/50 z-10 min-w-full inset-0 h-full" />
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="absolute z-20 text-center text-white max-w-2xl px-4 my-20"
                >
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-200">
                        {title}
                        {!titleDone && <span className="animate-pulse">|</span>}
                    </h1>
                    <p className="text-lg text-gray-200 leading-relaxed">
                        {desc}
                        {desc.length > 0 && desc.length < 120 && (
                            <span className="animate-pulse">|</span>
                        )}
                    </p>
                </motion.div>
            </div>
            {/* <section className="min-h-screen bg-white dark:bg-gray-950 "> */}
            <section>
                {/* Hero section */}

                {/* Introduction */}
                <div className="max-w-6xl mx-auto px-6 py-20">
                    <div className="grid md:grid-cols-2 gap-10 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -40 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                                {t("about_us.our_mission")}
                            </h2>
                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                                {t("about_us.green_wheel_mission")}
                            </p>
                            {/* <ButtonStyled color="primary" variant="solid" className="btn-gradient">
                                {t("about_us.learn_more")}
                            </ButtonStyled> */}
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 40 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                            className="flex justify-center"
                        >
                            <Image
                                src="https://sohanews.sohacdn.com/2020/4/14/777-15868600258581111429648.jpg"
                                alt="Eco friendly driving"
                                width={500}
                                height={350}
                                className="rounded-2xl shadow-lg object-cover"
                            />
                        </motion.div>
                    </div>
                </div>

                {/* Vision & Values */}
                {/* <div className="bg-gray-50 dark:bg-gray-900 py-20"> */}
                <div className="py-20">
                    <div className="max-w-6xl mx-auto px-6">
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="text-3xl font-bold mb-6 text-gray-900 dark:text-white"
                        >
                            <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
                                {t("about_us.vision_and_core_values")}
                            </h2>
                        </motion.div>
                        <div className="grid md:grid-cols-3 gap-8">
                            {visionContent.map((item, key) => (
                                <motion.div
                                    key={key}
                                    initial={{ opacity: 0, y: 40 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{
                                        delay: key * 0.1,
                                        duration: 0.5,
                                        ease: "easeOut"
                                    }}
                                    whileHover={{
                                        scale: 1.05,
                                        transition: { duration: 0.3, ease: "easeOut" }
                                    }}
                                    className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md"
                                >
                                    <div className="text-4xl mb-4">{item.icon}</div>
                                    <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                                        {item.title}
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-300">{item.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Contact CTA */}
                <div className="py-20 text-center">
                    <motion.h3
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-3xl font-bold mb-6 text-gray-900 dark:text-white"
                    >
                        {t("about_us.join_us_greener_future")}
                    </motion.h3>
                    <ButtonStyled
                        as={Link}
                        href="/contact"
                        color="primary"
                        size="lg"
                        className="btn-gradient"
                    >
                        {t("about_us.contact_us")}
                    </ButtonStyled>
                </div>
            </section>
        </div>
    )
}
