"use client"
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useFormik } from "formik"
import * as Yup from "yup"
import { fromDate } from "@internationalized/date"
import { useTranslation } from "react-i18next"
import { AutocompleteItem, cn, DateValue, Spinner } from "@heroui/react"
import { MapPinAreaIcon } from "@phosphor-icons/react"
import { AutocompleteStyled, DateTimeStyled } from "@/components"
import { useBookingFilterStore, useDay, useGetAllStations, useGetAllVehicleSegments } from "@/hooks"
import { BackendError } from "@/models/common/response"
import { translateWithFallback } from "@/utils/helpers/translateWithFallback"
import { DEFAULT_TIMEZONE, MAX_HOUR, MIN_HOUR } from "@/constants/constants"
import dayjs from "dayjs"
import { useSearchVehicleModels } from "@/hooks/queries/useVehicleModel"
import { SearchModelParams } from "@/models/vehicle/schema/request"
import { debouncedWrapper } from "@/utils/helpers/axiosHelper"
import { addToast } from "@heroui/toast"

function calcDates(isStaff: boolean) {
    const zonedNow = fromDate(new Date(), DEFAULT_TIMEZONE)

    const requiredNow = isStaff ? zonedNow.add({ minutes: 30 }) : zonedNow.add({ hours: 3 })

    const isAfterMax = requiredNow.hour >= MAX_HOUR
    const isBeforeMin = requiredNow.hour < MIN_HOUR

    const initialStart =
        isBeforeMin || isAfterMax
            ? zonedNow
                  .set({ hour: MIN_HOUR, minute: 0, second: 0, millisecond: 0 })
                  .add({ days: isAfterMax ? 1 : 0 })
            : zonedNow
                  .set({
                      hour: zonedNow.hour,
                      minute: Math.ceil(zonedNow.minute / 5) * 5,
                      second: 0,
                      millisecond: 0
                  })
                  .add({
                      hours: isStaff ? 0 : 3,
                      minutes: isStaff ? 30 : 0
                  })

    return {
        minStartDate: initialStart,
        minEndDate: initialStart.add({ days: 1 })
    }
}

export function FilterVehicleRental({
    className = "",
    isStaff,
    setIsSearching
}: {
    className?: string
    isStaff: boolean
    setIsSearching: (isSearching: boolean) => void
}) {
    const { t } = useTranslation()
    const { formatDateTime, toZonedDateTime, normalizeDateByMinuteStep } = useDay()

    // setup date time
    const [{ minStartDate, minEndDate }, setDates] = useState(() => calcDates(isStaff))
    useEffect(() => {
        const updateDates = () => setDates(calcDates(isStaff))
        updateDates()

        const now = new Date()
        const delay = 60000 - (now.getSeconds() * 1000 + now.getMilliseconds())

        const timeout = setTimeout(() => {
            updateDates()
            const interval = setInterval(updateDates, 60000)

            intervalCleanup = () => clearInterval(interval)
        }, delay)

        let intervalCleanup: () => void = () => {}

        return () => {
            clearTimeout(timeout)
            intervalCleanup()
        }
    }, [isStaff])

    const {
        data: stations,
        isLoading: isGetStationsLoading,
        error: getStationsError
    } = useGetAllStations()

    const {
        data: vehicleSegments,
        isLoading: isGetVehicleSegmentsLoading,
        error: getVehicleSegmentsError
    } = useGetAllVehicleSegments()

    // manage filter store
    const stationId = useBookingFilterStore((s) => s.stationId)
    const segmentId = useBookingFilterStore((s) => s.segmentId)
    const startDate = useBookingFilterStore((s) => s.startDate)
    const endDate = useBookingFilterStore((s) => s.endDate)
    const setStationId = useBookingFilterStore((s) => s.setStationId)
    const setSegmentId = useBookingFilterStore((s) => s.setSegmentId)
    const setStartDate = useBookingFilterStore((s) => s.setStartDate)
    const setEndDate = useBookingFilterStore((s) => s.setEndDate)
    const setFilteredVehicleModels = useBookingFilterStore((s) => s.setFilteredVehicleModels)

    // filter
    const [filter, setFilter] = useState<SearchModelParams>({
        stationId: stationId || "",
        startDate: startDate || formatDateTime({ date: minStartDate }),
        endDate: endDate || formatDateTime({ date: minEndDate }),
        segmentId
    })

    // Load station
    useEffect(() => {
        if (stationId || (stations && !isGetStationsLoading && stations!?.length > 0)) {
            setFilter((prev) => ({
                ...prev,
                stationId: stationId || stations![0].id
            }))
            setStationId(stationId || stations![0].id)
        }
        if (getStationsError) {
            const error = getStationsError as BackendError
            // toast.error(translateWithFallback(t, error.detail))
            addToast({
                title: error.title || t("toast.error"),
                description: translateWithFallback(t, error.detail),
                color: "danger"
            })
        }
    }, [getStationsError, isGetStationsLoading, setStationId, stationId, stations, t])

    // Load segment
    useEffect(() => {
        if (getVehicleSegmentsError) {
            const error = getVehicleSegmentsError as BackendError
            addToast({
                title: error.title || t("toast.error"),
                description: translateWithFallback(t, error.detail),
                color: "danger"
            })
        }
    }, [getVehicleSegmentsError, t])

    useEffect(() => {
        if (!startDate) setStartDate(formatDateTime({ date: minStartDate }))
        if (!endDate) setEndDate(formatDateTime({ date: minEndDate }))
    }, [endDate, formatDateTime, minEndDate, minStartDate, setEndDate, setStartDate, startDate])

    // =========================
    // Handle submit filter
    // =========================
    const { refetch } = useSearchVehicleModels({
        query: filter
    })
    const debouncedSearch = useMemo(
        () =>
            debouncedWrapper(
                async (params: SearchModelParams) => {
                    setFilter(params)
                },
                500,
                () => setIsSearching(true),
                () => setIsSearching(false)
            ),
        [setIsSearching]
    )

    // =========================
    // Declare formik
    // =========================
    //  Validation schema
    const bookingSchema = useMemo(
        () =>
            Yup.object().shape({
                stationId: Yup.string().required(),
                startDate: Yup.string()
                    .required(t("vehicle_filter.start_date_require"))
                    .test(
                        "is-valid-start-date",
                        !isStaff
                            ? t("vehicle_filter.invalid_start_date")
                            : t("vehicle_filter.invalid_start_date_staff"),
                        (value) => {
                            const valueDatetime = toZonedDateTime(value)
                            return (
                                !!valueDatetime &&
                                valueDatetime.compare(minStartDate) >= 0 &&
                                valueDatetime.hour >= MIN_HOUR &&
                                valueDatetime.hour <= MAX_HOUR
                            )
                        }
                    ),
                endDate: Yup.string()
                    .required(t("vehicle_filter.return_date_require"))
                    .test(
                        "is-valid-end-date-range",
                        t("vehicle_filter.invalid_end_date_range"),
                        (value) => {
                            const valueDatetime = toZonedDateTime(value)
                            return (
                                !!valueDatetime &&
                                valueDatetime.hour >= MIN_HOUR &&
                                valueDatetime.hour <= MAX_HOUR
                            )
                        }
                    )
                    .test(
                        "is-valid-min-end-date",
                        t("vehicle_filter.min_end_date"),
                        function (this: Yup.TestContext, value) {
                            const { startDate } = this.parent as { startDate?: string }
                            if (!startDate || !value) return true
                            const startDateTmp = startDate.split("+")[0]
                            value = value.split("+")[0]

                            return dayjs(startDateTmp).isBefore(
                                dayjs(value).add(-1, "day").add(1, "minute")
                            )
                        }
                    )
            }),
        [isStaff, minStartDate, t, toZonedDateTime]
    )

    //  useFormik
    const formik = useFormik<SearchModelParams>({
        initialValues: filter,
        enableReinitialize: filter.stationId !== "",
        validationSchema: bookingSchema,
        validateOnChange: false,
        validateOnBlur: false,
        validateOnMount: true,
        onSubmit: async () => {
            setStationId(formik.values.stationId)
            setSegmentId(formik.values.segmentId)
            setStartDate(formik.values.startDate)
            setEndDate(formik.values.endDate)
            await debouncedSearch(formik.values)
            formik.setSubmitting(false)
        }
    })

    const handleStartDateChange = useCallback(
        async (value: DateValue | null) => {
            if (!value) {
                formik.setFieldValue("startDate", null)
                return
            }

            const prevValue = toZonedDateTime(formik.values.startDate)
            const rounded = normalizeDateByMinuteStep(value, prevValue || undefined)

            const date = formatDateTime({ date: rounded })
            await formik.setFieldValue("startDate", date)

            // if start date > end date, then update end date
            if (
                !dayjs(date).isBefore(dayjs(formik.values.endDate).add(-1, "day").add(1, "minute"))
            ) {
                const newEndDate = formatDateTime({
                    date: rounded.add({ days: 1 })
                })
                await formik.setFieldValue("endDate", newEndDate)
                formik.validateField("endDate")
            }
            formik.handleSubmit()
        },
        [formatDateTime, formik, normalizeDateByMinuteStep, toZonedDateTime]
    )

    const handleEndDateChange = useCallback(
        async (value: DateValue | null) => {
            if (!value) {
                formik.setFieldValue("endDate", null)
                return
            }

            const prevValue = toZonedDateTime(formik.values.endDate)
            const rounded = normalizeDateByMinuteStep(value, prevValue || undefined)

            const date = formatDateTime({ date: rounded })
            await formik.setFieldValue("endDate", date)

            // if end date < start date, then update start date
            if (
                !dayjs(formik.values.startDate).isBefore(
                    dayjs(date).add(-1, "day").add(1, "minute")
                )
            ) {
                const newStartDate = formatDateTime({
                    date: rounded.add({ days: -1 })
                })
                await formik.setFieldValue("startDate", newStartDate)
                formik.validateField("startDate")
            }

            formik.handleSubmit()
        },
        [formatDateTime, formik, normalizeDateByMinuteStep, toZonedDateTime]
    )

    // revalidate if min start date is change
    useEffect(() => {
        formik.validateField("startDate")
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [minStartDate])

    useEffect(() => {
        if (formik.errors.startDate || formik.errors.endDate || !filter.stationId) {
            setFilteredVehicleModels([])
            return
        }
        const run = async () => {
            const { data } = await refetch()
            setFilteredVehicleModels(data || [])
        }
        run()
    }, [filter, formik.errors.endDate, formik.errors.startDate, refetch, setFilteredVehicleModels])

    // load filtered vehicle when enter page and if form is valid
    const hasLoadInit = useRef(false)
    useEffect(() => {
        if (hasLoadInit.current) return
        if (!formik.isValid || !filter.stationId) return
        const run = async () => {
            await debouncedSearch(filter)
        }
        run()
        hasLoadInit.current = true
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formik.isValid, debouncedSearch])

    if (
        isGetStationsLoading ||
        getStationsError ||
        isGetVehicleSegmentsLoading ||
        getVehicleSegmentsError
    )
        return <Spinner />

    return (
        <>
            <form
                id="vehicle-search-filters"
                onSubmit={formik.handleSubmit}
                className={cn(
                    "bg-secondary border border-gray-300 rounded-4xl shadow-2xl",
                    "px-8 py-3 mx-auto min-w-fit max-w-screen md:w-3xl lg:w-4xl",
                    "flex gap-4 justify-center flex-col sm:flex-row",
                    className
                )}
            >
                {/* Left section */}
                <div>
                    <div className="grid md:flex gap-4">
                        <span id="station-select">
                            <AutocompleteStyled
                                id="station-select"
                                className="md:w-50"
                                label={t("vehicle_model.station")}
                                items={stations}
                                startContent={<MapPinAreaIcon className="text-xl" />}
                                selectedKey={formik.values.stationId}
                                onSelectionChange={async (id) => {
                                    await formik.setFieldValue("stationId", id)
                                    formik.handleSubmit()
                                }}
                                isClearable={false}
                                isRequired
                            >
                                {(stations ?? []).map((item) => (
                                    <AutocompleteItem key={item.id}>{item.name}</AutocompleteItem>
                                ))}
                            </AutocompleteStyled>
                        </span>

                        <span id="segment-select">
                            <AutocompleteStyled
                                className="md:w-36"
                                label={t("vehicle_model.segment")}
                                items={vehicleSegments}
                                selectedKey={formik.values.segmentId}
                                onSelectionChange={async (id) => {
                                    await formik.setFieldValue("segmentId", id)
                                    formik.handleSubmit()
                                }}
                            >
                                {(vehicleSegments ?? []).map((item) => (
                                    <AutocompleteItem key={item.id}>{item.name}</AutocompleteItem>
                                ))}
                            </AutocompleteStyled>
                        </span>
                    </div>
                    <div className="hidden md:block text-left">{`${t("station.address")}: ${
                        stations?.find((station) => station.id === formik.values.stationId)?.address
                    }`}</div>
                </div>

                {/* Right section */}
                <div className="md:min-w-xl">
                    <div className="grid md:flex gap-4">
                        {/* STARTDate */}
                        <DateTimeStyled
                            id="pick-up-select"
                            label={t("vehicle_model.start_date_time")}
                            value={toZonedDateTime(formik.values.startDate)}
                            minValue={minStartDate}
                            isInvalid={!!formik.errors.startDate}
                            onChange={async (value) => {
                                await handleStartDateChange(value)
                            }}
                            isRequired
                        />

                        {/* ENDDate */}
                        <DateTimeStyled
                            id="return-select"
                            label={t("vehicle_model.end_date_time")}
                            value={toZonedDateTime(formik.values.endDate)}
                            minValue={
                                toZonedDateTime(formik.values.startDate)?.add({ days: 1 }) ||
                                minEndDate
                            }
                            isInvalid={!!formik.errors.endDate}
                            onChange={async (value) => {
                                await handleEndDateChange(value)
                            }}
                            isRequired
                        />
                    </div>
                    <div>
                        <div className="text-warning-600 text-small font-semibold text-left">
                            {formik.errors.startDate}
                        </div>
                        <div className="text-warning-600 text-small font-semibold text-left">
                            {formik.errors.endDate}
                        </div>
                    </div>
                </div>
            </form>
        </>
    )
}
