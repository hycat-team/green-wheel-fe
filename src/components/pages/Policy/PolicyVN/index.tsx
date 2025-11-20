"use client"

import { BusinessVariableViewRes } from "@/models/business-variables/schema/respone"
import { formatCurrencyWithSymbol } from "@/utils/helpers/currency"
import React from "react"
import { highlight } from "../helper"
import {
    BAO_MAT,
    DAT_COC,
    DAT_GIAM_HUY,
    DV_MO_TA,
    GIAO_TRA_XE,
    GIOI_HAN_TRACH_NHIEM,
    INTRO_DINH_NGHIA,
    INTRO_MUC_DICH,
    NHAC_NO_CANH_BAO,
    PHI_CO_BAN,
    QUY_DINH_KHAC,
    THANH_TOAN,
    TRACH_NHIEM_KH
} from "./content"

export function PolicyPageVN({
    lateReturnFee,
    maxLateReturnHours,
    refundCreationDelayDays
}: {
    lateReturnFee: BusinessVariableViewRes
    maxLateReturnHours: BusinessVariableViewRes
    refundCreationDelayDays: BusinessVariableViewRes
}) {
    // Từ khóa cần nổi bật (điều chỉnh theo ngữ cảnh GW)
    const HIGHLIGHTS = [
        "Green Wheel",
        "GW",
        "ĐKC",
        "Đơn Thuê Xe",
        "Kênh Thông Tin",
        "Khách Hàng",
        "Người Sử Dụng",
        "Bảng Kiểm Tra Tình Trạng Xe",
        "Hóa Đơn Giữ Chỗ",
        "Hóa Đơn Bàn Giao Xe",
        "Phí Thuê Xe",
        "Đặt Dịch Vụ",
        "Phí Thuê Xe",
        "Phí Đặt Cọc",
        "Phí Phát Sinh",
        "Phí Bồi Thường",
        "Chi Phí",
        "Ngày Làm Việc",
        "Giờ Làm Việc",
        "cấn trừ",
        "hoàn trả",
        "thu hồi xe",
        "07:00",
        "17:00",
        `${refundCreationDelayDays.value.toString()} ngày`,
        "24 tiếng",
        "Xe",
        formatCurrencyWithSymbol(lateReturnFee.value)
    ]

    const PHI_TRE_HAN = String.raw`- Phí trễ hạn được tính từ sau khi ${
        maxLateReturnHours.value
    } tiếng so với thời gian trả xe trên đơn thuê, mỗi 1 tiếng trễ sẽ tính thêm ${formatCurrencyWithSymbol(
        lateReturnFee.value
    )}`

    // render đã bôi đậm
    const intro_muc_dich = highlight(INTRO_MUC_DICH, HIGHLIGHTS)
    const intro_dinh_nghia = highlight(
        INTRO_DINH_NGHIA.replace(
            "{{refundCreationDelayDays}}",
            refundCreationDelayDays.value.toString()
        ),
        HIGHLIGHTS
    )
    const dv_mo_ta = highlight(DV_MO_TA, HIGHLIGHTS)
    const dat_giam_huy = highlight(DAT_GIAM_HUY, HIGHLIGHTS)
    const phi_co_ban = highlight(PHI_CO_BAN, HIGHLIGHTS)
    const phi_tre_han = highlight(PHI_TRE_HAN, HIGHLIGHTS)
    // const phi_tra_som = highlight(PHI_TRA_SOM, HIGHLIGHTS)
    const nhac_no = highlight(NHAC_NO_CANH_BAO, HIGHLIGHTS)
    const dat_coc = highlight(
        DAT_COC.replace("{{refundCreationDelayDays}}", refundCreationDelayDays.value.toString()),
        HIGHLIGHTS
    )
    const thanh_toan = highlight(THANH_TOAN, HIGHLIGHTS)
    const giao_tra_xe = highlight(GIAO_TRA_XE, HIGHLIGHTS)
    const trach_nhiem_kh = highlight(TRACH_NHIEM_KH, HIGHLIGHTS)
    const gioi_han_trach_nhiem = highlight(GIOI_HAN_TRACH_NHIEM, HIGHLIGHTS)
    const bao_mat = highlight(BAO_MAT, HIGHLIGHTS)
    const quy_dinh_khac = highlight(QUY_DINH_KHAC, HIGHLIGHTS)

    return (
        <main className="max-w-5xl mx-auto px-6 py-12 text-justify">
            <header className="text-center mb-10">
                <h1 className="text-3xl font-bold text-green-600 uppercase">
                    <span>CÔNG TY CỔ PHẦN THƯƠNG MẠI VÀ DỊCH VỤ</span>
                    <span className="block mt-1">GREEN WHEEL</span>
                </h1>
                <h2 className="text-xl font-semibold mt-3 text-gray-800 dark:text-gray-200">
                    ĐIỀU KHOẢN CHUNG
                </h2>
            </header>

            <article className="prose dark:prose-invert max-w-none leading-relaxed">
                {/* PHẦN I */}
                <section className="mb-8">
                    <h2 className="text-2xl font-bold">PHẦN I. GIỚI THIỆU</h2>

                    <h3 className="mt-4 text-xl font-bold">1. MỤC ĐÍCH</h3>
                    <div
                        className="whitespace-pre-wrap font-sans text-[17px] sm:text-[18px]"
                        dangerouslySetInnerHTML={{ __html: intro_muc_dich }}
                    />

                    <h3 className="mt-6 text-xl font-bold">2. ĐỊNH NGHĨA</h3>
                    <div
                        className="whitespace-pre-wrap font-sans text-[17px] sm:text-[18px]"
                        dangerouslySetInnerHTML={{ __html: intro_dinh_nghia }}
                    />
                </section>

                {/* PHẦN II */}
                <section className="mb-8">
                    <h2 className="text-2xl font-bold">PHẦN II. ĐIỀU KHOẢN CHUNG</h2>

                    <h3 className="mt-4 text-xl font-bold">1. DỊCH VỤ CỦA GREEN WHEEL</h3>
                    <div
                        className="whitespace-pre-wrap font-sans text-[17px] sm:text-[18px]"
                        dangerouslySetInnerHTML={{ __html: dv_mo_ta }}
                    />

                    <h3 className="mt-6 text-xl font-bold">2. ĐẶT, HỦY DỊCH VỤ</h3>
                    <div
                        className="whitespace-pre-wrap font-sans text-[17px] sm:text-[18px]"
                        dangerouslySetInnerHTML={{ __html: dat_giam_huy }}
                    />

                    <h3 className="mt-6 text-xl font-bold">3. NGUYÊN TẮC TÍNH PHÍ &amp; PHỤ PHÍ</h3>

                    <h4 className="mt-4 text-lg font-bold">3.1. Phí Cơ Bản</h4>
                    <div
                        className="whitespace-pre-wrap font-sans text-[17px] sm:text-[18px]"
                        dangerouslySetInnerHTML={{ __html: phi_co_ban }}
                    />

                    <h4 className="mt-4 text-lg font-bold">3.2. Phí trả Xe trễ hạn</h4>
                    <div
                        className="whitespace-pre-wrap font-sans text-[17px] sm:text-[18px]"
                        dangerouslySetInnerHTML={{ __html: phi_tre_han }}
                    />

                    {/* <h4 className="mt-4 text-lg font-bold">3.3. Phí trả Xe trước hạn</h4>
                    <div
                        className="whitespace-pre-wrap font-sans text-[17px] sm:text-[18px]"
                        dangerouslySetInnerHTML={{ __html: phi_tra_som }}
                    /> */}

                    <h4 className="mt-4 text-lg font-bold">3.3. Nhắc nợ &amp; Cảnh báo</h4>
                    <div
                        className="whitespace-pre-wrap font-sans text-[17px] sm:text-[18px]"
                        dangerouslySetInnerHTML={{ __html: nhac_no }}
                    />

                    <h3 className="mt-6 text-xl font-bold">4. KHOẢN ĐẶT CỌC</h3>
                    <div
                        className="whitespace-pre-wrap font-sans text-[17px] sm:text-[18px]"
                        dangerouslySetInnerHTML={{ __html: dat_coc }}
                    />

                    <h3 className="mt-6 text-xl font-bold">5. THANH TOÁN</h3>
                    <div
                        className="whitespace-pre-wrap font-sans text-[17px] sm:text-[18px]"
                        dangerouslySetInnerHTML={{ __html: thanh_toan }}
                    />

                    <h3 className="mt-6 text-xl font-bold">6. GIAO / TRẢ XE</h3>
                    <div
                        className="whitespace-pre-wrap font-sans text-[17px] sm:text-[18px]"
                        dangerouslySetInnerHTML={{ __html: giao_tra_xe }}
                    />

                    <h3 className="mt-6 text-xl font-bold">7. TRÁCH NHIỆM CỦA KHÁCH HÀNG</h3>
                    <div
                        className="whitespace-pre-wrap font-sans text-[17px] sm:text-[18px]"
                        dangerouslySetInnerHTML={{ __html: trach_nhiem_kh }}
                    />

                    <h3 className="mt-6 text-xl font-bold">8. GIỚI HẠN TRÁCH NHIỆM</h3>
                    <div
                        className="whitespace-pre-wrap font-sans text-[17px] sm:text-[18px]"
                        dangerouslySetInnerHTML={{ __html: gioi_han_trach_nhiem }}
                    />

                    {/* <h3 className="mt-6 text-xl font-bold">9. BẤT KHẢ KHÁNG</h3>
          <div
            className="whitespace-pre-wrap font-sans text-[17px] sm:text-[18px]"
            dangerouslySetInnerHTML={{ __html: bat_kha_khang }}
          /> */}

                    <h3 className="mt-6 text-xl font-bold">9. BẢO MẬT THÔNG TIN</h3>
                    <div
                        className="whitespace-pre-wrap font-sans text-[17px] sm:text-[18px]"
                        dangerouslySetInnerHTML={{ __html: bao_mat }}
                    />

                    <h3 className="mt-6 text-xl font-bold">10. QUY ĐỊNH KHÁC</h3>
                    <div
                        className="whitespace-pre-wrap font-sans text-[17px] sm:text-[18px]"
                        dangerouslySetInnerHTML={{ __html: quy_dinh_khac }}
                    />
                </section>

                {/* <p className="text-center italic mt-10 text-gray-500">
          © 2025 Công ty Cổ phần Thương mại và Dịch Vụ Green Wheel – Mọi quyền được bảo lưu.
        </p> */}
            </article>
        </main>
    )
}
