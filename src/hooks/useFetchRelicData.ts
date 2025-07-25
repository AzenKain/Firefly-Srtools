"use client"
import { useQuery } from '@tanstack/react-query'
import { fetchRelicsByIdsNative, getRelicSetListApi } from '@/lib/api'
import { useEffect } from 'react'
import useRelicStore from '@/stores/relicStore'
import { listCurrentLanguageApi } from '@/lib/constant'
import useLocaleStore from '@/stores/localeStore'
import { toast } from 'react-toastify'

export const useFetchRelicData = () => {
    const { setListRelic, setAllMapRelicInfo } = useRelicStore()
    const { locale } = useLocaleStore()
    const { data: dataRelic, error: errorRelic } = useQuery({
        queryKey: ['relicData'],
        queryFn: getRelicSetListApi,
        staleTime: 1000 * 60 * 5,
    })

    const { data: dataRelicInfo, error: errorRelicInfo } = useQuery({
        queryKey: ['relicInfoData', locale],
        queryFn: () =>
            fetchRelicsByIdsNative(
                dataRelic!.map((item) => item.id),
                listCurrentLanguageApi[locale.toLowerCase()]
            ),
        staleTime: 1000 * 60 * 5,
        enabled: !!dataRelic,
    });

    useEffect(() => {
        if (dataRelic && !errorRelic) {
            setListRelic(dataRelic)
        } else if (errorRelic) {
            toast.error("Failed to load relic data")
        }
    }, [dataRelic, errorRelic, setListRelic])

    useEffect(() => {
        if (dataRelicInfo && !errorRelicInfo) {
            setAllMapRelicInfo(dataRelicInfo)
        } else if (errorRelicInfo) {
            toast.error("Failed to load relic info data")
        }

    }, [dataRelicInfo, errorRelicInfo, setAllMapRelicInfo])
}
