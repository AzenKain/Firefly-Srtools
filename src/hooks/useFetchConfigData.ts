"use client"
import { useQuery } from '@tanstack/react-query'
import { getConfigMazeApi, getMainAffixApi, getSubAffixApi } from '@/lib/api'
import useAffixStore from '@/stores/affixStore'
import useMazeStore from '@/stores/mazeStore'
import { useEffect } from 'react'
import { toast } from 'react-toastify'

export const useFetchConfigData = () => {

    const { setMapMainAffix, setMapSubAffix } = useAffixStore()
    const { setAllMazeData } = useMazeStore()

    const { data, error } = useQuery({
        queryKey: ['initialConfigData'],
        queryFn: async () => {
            const [maze, main, sub] = await Promise.all([
                getConfigMazeApi(),
                getMainAffixApi(),
                getSubAffixApi(),
            ])
            return { maze, main, sub }
        },
        staleTime: 1000 * 60 * 5,
    })

    useEffect(() => {
        if (data && !error) {
            setAllMazeData(data.maze)
            setMapMainAffix(data.main)
            setMapSubAffix(data.sub)
        }
        else if (error) {
            toast.error("Failed to load initial config data")
        }
    }, [data, error, setAllMazeData, setMapMainAffix, setMapSubAffix])
}
