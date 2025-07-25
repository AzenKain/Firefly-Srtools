"use client"
import { useQuery } from '@tanstack/react-query'
import { fetchPFByIdsNative, getPFEventListApi } from '@/lib/api'
import { useEffect } from 'react'
import { listCurrentLanguageApi } from '@/lib/constant'
import useLocaleStore from '@/stores/localeStore'
import { toast } from 'react-toastify'
import useEventStore from '@/stores/eventStore'
import { EventStageDetail } from '@/types'

export const useFetchPFData = () => {
    const { setPFEvent, setMapPFInfo } = useEventStore()
    const { locale } = useLocaleStore()
    const { data: dataPF, error: errorPF } = useQuery({
        queryKey: ['pfData'],
        queryFn: getPFEventListApi,
        select: (data) => data.sort((a, b) => Number(b.id) - Number(a.id)),
        staleTime: 1000 * 60 * 5,
    })

    const { data: dataPFInfo, error: errorPFInfo } = useQuery({
        queryKey: ['pfInfoData', locale],
        queryFn: () =>
            fetchPFByIdsNative(
                dataPF!.map((item) => item.id),
                listCurrentLanguageApi[locale.toLowerCase()]
            ),
        staleTime: 1000 * 60 * 5,
        enabled: !!dataPF,
        select: (data) => {
            const newData = { ...data }
            for (const key in newData) {
                for (const item of newData[key].Level) {
                    item.EventIDList1 = item.EventIDList1.map((event: EventStageDetail) => ({
                        ...event,
                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                        MonsterList: event.MonsterList.map(({ $type, ...rest }) => rest)
                    }))
                    item.EventIDList2 = item.EventIDList2.map((event: EventStageDetail) => ({
                        ...event,
                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                        MonsterList: event.MonsterList.map(({ $type, ...rest }) => rest)
                    }))
                }
            }
            return newData
        },
    });

    useEffect(() => {
        if (dataPF && !errorPF) {
            setPFEvent(dataPF)
        } else if (errorPF) {
            toast.error("Failed to load PF data")
        }
    }, [dataPF, errorPF, setPFEvent])

    useEffect(() => {
        if (dataPFInfo && !errorPFInfo) {
            setMapPFInfo(dataPFInfo)
        } else if (errorPFInfo) {
            toast.error("Failed to load PF info data")
        }

    }, [dataPFInfo, errorPFInfo, setMapPFInfo])
}
