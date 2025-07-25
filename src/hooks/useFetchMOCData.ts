"use client"
import { useQuery } from '@tanstack/react-query'
import { fetchMOCByIdsNative, getMOCEventListApi } from '@/lib/api'
import { useEffect } from 'react'
import { listCurrentLanguageApi } from '@/lib/constant'
import useLocaleStore from '@/stores/localeStore'
import { toast } from 'react-toastify'
import useEventStore from '@/stores/eventStore'
import { EventStageDetail, MocDetail } from '@/types'

export const useFetchMOCData = () => {
    const { setMOCEvent, setMapMOCInfo } = useEventStore()
    const { locale } = useLocaleStore()
    const { data: dataMOC, error: errorMOC } = useQuery({
        queryKey: ['mocData'],
        queryFn: getMOCEventListApi,
        select: (data) => data.sort((a, b) => Number(b.id) - Number(a.id)),
        staleTime: 1000 * 60 * 5,
    })

    const { data: dataMOCInfo, error: errorMOCInfo } = useQuery({
        queryKey: ['mocInfoData', locale],
        queryFn: async () => {
            const result = await fetchMOCByIdsNative(
                dataMOC!.map((item) => item.id),
                listCurrentLanguageApi[locale.toLowerCase()]
            );
            return result;
        },
        staleTime: 1000 * 60 * 5,
        select: (data) => {
            const newData = { ...data }
            for (const key in newData) {
                for (const item of newData[key]) {
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
        enabled: !!dataMOC,
    });

    useEffect(() => {
        if (dataMOC && !errorMOC) {
            setMOCEvent(dataMOC)
        } else if (errorMOC) {
            toast.error("Failed to load MOC data")
        }
    }, [dataMOC, errorMOC, setMOCEvent])

    useEffect(() => {
        if (dataMOCInfo && !errorMOCInfo) {
            setMapMOCInfo(dataMOCInfo as Record<string, MocDetail[]>)
        } else if (errorMOCInfo) {
            toast.error("Failed to load MOC info data")
        }

    }, [dataMOCInfo, errorMOCInfo, setMapMOCInfo])
}
