"use client"
import { useQuery } from '@tanstack/react-query'
import { fetchASByIdsNative, getASEventListApi } from '@/lib/api'
import { useEffect } from 'react'
import { listCurrentLanguageApi } from '@/lib/constant'
import useLocaleStore from '@/stores/localeStore'
import { toast } from 'react-toastify'
import useEventStore from '@/stores/eventStore'
import { EventStageDetail } from '@/types'

export const useFetchASData = () => {
    const { setASEvent, setMapASInfo } = useEventStore()
    const { locale } = useLocaleStore()
    const { data: dataAS, error: errorAS } = useQuery({
        queryKey: ['asData'],
        queryFn: getASEventListApi,
        select: (data) => data.sort((a, b) => Number(b.id) - Number(a.id)),
        staleTime: 1000 * 60 * 5,
    })

    const { data: dataASInfo, error: errorASInfo } = useQuery({
        queryKey: ['asInfoData', locale],
        queryFn: () =>
            fetchASByIdsNative(
                dataAS!.map((item) => item.id),
                listCurrentLanguageApi[locale.toLowerCase()]
            ),
        staleTime: 1000 * 60 * 5,
        enabled: !!dataAS,
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
        if (dataAS && !errorAS) {
            setASEvent(dataAS)
        } else if (errorAS) {
            toast.error("Failed to load AS data")
        }
    }, [dataAS, errorAS, setASEvent])

    useEffect(() => {
        if (dataASInfo && !errorASInfo) {
            setMapASInfo(dataASInfo)
        } else if (errorASInfo) {
            toast.error("Failed to load AS info data")
        }

    }, [dataASInfo, errorASInfo, setMapASInfo])
}
