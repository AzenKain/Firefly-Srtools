"use client"
import { useQuery } from '@tanstack/react-query'
import { fetchLightconesByIdsNative, getLightconeListApi } from '@/lib/api'
import { useEffect } from 'react'
import useLightconeStore from '@/stores/lightconeStore'
import { listCurrentLanguageApi } from '@/lib/constant'
import useLocaleStore from '@/stores/localeStore'
import { toast } from 'react-toastify'

export const useFetchLightconeData = () => {
    const { setListLightcone, setAllMapLightconeInfo } = useLightconeStore()
    const { locale } = useLocaleStore()
    const { data: dataLightcone, error: errorLightcone } = useQuery({
        queryKey: ['lightconeData'],
        queryFn: getLightconeListApi,
        select: (data) => data.sort((a, b) => Number(b.id) - Number(a.id)),
        staleTime: 1000 * 60 * 5,
    })

    const { data: dataLightconeInfo, error: errorLightconeInfo } = useQuery({
        queryKey: ['lightconeInfoData', locale],
        queryFn: () =>
            fetchLightconesByIdsNative(
                dataLightcone!.map((item) => item.id),
                listCurrentLanguageApi[locale.toLowerCase()]
            ),
        staleTime: 1000 * 60 * 5,
        enabled: !!dataLightcone,
    });

    useEffect(() => {
        if (dataLightcone && !errorLightcone) {
            setListLightcone(dataLightcone)
        } else if (errorLightcone) {
            toast.error("Failed to load lightcone data")
        }
    }, [dataLightcone, errorLightcone, setListLightcone])

    useEffect(() => {
        if (dataLightconeInfo && !errorLightconeInfo) {
            setAllMapLightconeInfo(dataLightconeInfo)
        } else if (errorLightconeInfo) {
            toast.error("Failed to load lightcone info data")
        }

    }, [dataLightconeInfo, errorLightconeInfo, setAllMapLightconeInfo])
}
