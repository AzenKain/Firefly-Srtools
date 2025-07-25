"use client"
import { useQuery } from '@tanstack/react-query'
import { getMonsterDetailApi, getMonsterListApi } from '@/lib/api'
import { useEffect } from 'react'
import { toast } from 'react-toastify'
import useMonsterStore from '@/stores/monsterStore'

export const useFetchMonsterData = () => {
    const { setAllMapMonster, setListMonster, setAllMapMonsterInfo } = useMonsterStore()
    const { data: dataMonster, error: errorMonster } = useQuery({
        queryKey: ['monsterData'],
        queryFn: getMonsterListApi,
        staleTime: 1000 * 60 * 5,
    })
    const { data: dataMonsterInfo, error: errorMonsterInfo } = useQuery({
        queryKey: ['monsterInfoData'],
        queryFn: getMonsterDetailApi,
        staleTime: 1000 * 60 * 5,
    })

    useEffect(() => {
        if (dataMonster && !errorMonster) {
            setListMonster(dataMonster.list.sort((a, b) => Number(b.id) - Number(a.id)))
            setAllMapMonster(dataMonster.map)
        } else if (errorMonster) {
            toast.error("Failed to load monster data")
        }
    }, [dataMonster, errorMonster, setAllMapMonster, setListMonster])

    useEffect(() => {
        if (dataMonsterInfo && !errorMonsterInfo) {
            setAllMapMonsterInfo(dataMonsterInfo)
        } else if (errorMonsterInfo) {
            toast.error("Failed to load monster info data")
        }
    }, [dataMonsterInfo, errorMonsterInfo, setAllMapMonsterInfo])
}
