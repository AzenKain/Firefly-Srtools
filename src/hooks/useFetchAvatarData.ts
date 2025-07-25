"use client"
import { useQuery } from '@tanstack/react-query'
import { fetchCharactersByIdsNative, getCharacterListApi } from '@/lib/api'
import { useEffect } from 'react'
import { toast } from 'react-toastify'
import useAvatarStore from '@/stores/avatarStore'
import { listCurrentLanguageApi } from '@/lib/constant'
import useLocaleStore from '@/stores/localeStore'
import { converterToAvatarStore, getAvatarNotExist } from '@/helper'
import useUserDataStore from '@/stores/userDataStore'

export const useFetchAvatarData = () => {
    const { setAvatars, avatars } = useUserDataStore()
    const { setListAvatar, setAllMapAvatarInfo, setAvatarSelected } = useAvatarStore()
    const { locale } = useLocaleStore()
    const { data: dataAvatar, error: errorAvatar } = useQuery({
        queryKey: ['avatarData'],
        queryFn: getCharacterListApi,
        select: (data) => data.sort((a, b) => {
            const aHasRelease = typeof a.release === 'number';
            const bHasRelease = typeof b.release === 'number';
            if (!aHasRelease && !bHasRelease) return 0;
            if (!aHasRelease) return -1;
            if (!bHasRelease) return 1;
            return b.release! - a.release!;
        }),
        staleTime: 1000 * 60 * 5,
    })

    const { data: dataAvatarInfo, error: errorAvatarInfo } = useQuery({
        queryKey: ['avatarInfoData', locale],
        queryFn: () =>
          fetchCharactersByIdsNative(
            dataAvatar!.map((item) => item.id),
            listCurrentLanguageApi[locale.toLowerCase()]
          ),
        staleTime: 1000 * 60 * 5,
        enabled: !!dataAvatar,
      });

    useEffect(() => {
        if (dataAvatar && !errorAvatar) {
            setListAvatar(dataAvatar)
            setAvatarSelected(dataAvatar[0])
            const avatarStore = converterToAvatarStore(getAvatarNotExist())
            if (Object.keys(avatarStore).length > 0) {
                setAvatars({ ...avatars, ...avatarStore })
            }
        } else if (errorAvatar) {
            toast.error("Failed to load avatar data")
        }
    }, [dataAvatar, errorAvatar, setAvatarSelected, setAvatars, setListAvatar, avatars])

    useEffect(() => {
        if (dataAvatarInfo && !errorAvatarInfo) {
            setAllMapAvatarInfo(dataAvatarInfo)
        } else if (errorAvatarInfo) {
            toast.error("Failed to load avatar info data")
        }
    }, [dataAvatarInfo, errorAvatarInfo, setAllMapAvatarInfo])
}
