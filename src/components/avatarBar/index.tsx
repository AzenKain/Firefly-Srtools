"use client"
import { getCharacterListApi, fetchCharactersByIdsNative, getConfigMazeApi, getLightconeListApi, fetchLightconesByIdsNative, fetchRelicsByIdsNative, getRelicSetListApi, getMainAffixApi, getSubAffixApi } from "@/lib/api"
import Image from "next/image"
import { useEffect, useState } from "react"
import CharacterCard from "../card/characterCard"
import useLocaleStore from "@/stores/localeStore"
import { listCurrentLanguageApi } from "@/lib/constant"
import useAvatarStore from "@/stores/avatarStore"
import useUserDataStore from "@/stores/userDataStore"
import { converterToAvatarStore, getAvatarNotExist } from "@/helper"
import useLightconeStore from "@/stores/lightconeStore"
import useRelicStore from "@/stores/relicStore"
import useAffixStore from "@/stores/affixStore"
import useMazeStore from "@/stores/mazeStore"
import { useTranslations } from "next-intl"

export default function AvatarBar() {
    const [listElement, setListElement] = useState<Record<string, boolean>>({ "fire": false, "ice": false, "imaginary": false, "physical": false, "quantum": false, "thunder": false, "wind": false })
    const [listPath, setListPath] = useState<Record<string, boolean>>({ "knight": false, "mage": false, "priest": false, "rogue": false, "shaman": false, "warlock": false, "warrior": false, "memory": false })
    const { listAvatar, setListAvatar, setAvatarSelected, setFilter, filter, setAllMapAvatarInfo, avatarSelected } = useAvatarStore()
    const { setAvatars, avatars } = useUserDataStore()
    const transI18n = useTranslations("DataPage")
    const { locale } = useLocaleStore()
    const { setListLightcone, setAllMapLightconeInfo } = useLightconeStore()
    const { setListRelic, setAllMapRelicInfo } = useRelicStore()
    const { setMapMainAffix, setMapSubAffix } = useAffixStore()
    const { setAllData } = useMazeStore()

    useEffect(() => {
        const fetchData = async () => {
            // Maze
            const maze = await getConfigMazeApi()
            setAllData(maze)

            // Affix
            const mapMainAffix = await getMainAffixApi()
            setMapMainAffix(mapMainAffix)

            const mapSubAffix = await getSubAffixApi()
            setMapSubAffix(mapSubAffix)
        }
        fetchData()
    }, [])

    useEffect(() => {
        const fetchData = async () => {
            // Avatar
            const listAvatar = await getCharacterListApi()
            listAvatar.sort((a, b) => {
                const aHasRelease = typeof a.release === 'number';
                const bHasRelease = typeof b.release === 'number';
                if (!aHasRelease && !bHasRelease) return 0;
                if (!aHasRelease) return -1;
                if (!bHasRelease) return 1;
                return b.release! - a.release!;
            });

            const mapAvatar = await fetchCharactersByIdsNative(listAvatar.map((item) => item.id), listCurrentLanguageApi[locale.toLowerCase()])
            setListAvatar(listAvatar)
            setAllMapAvatarInfo(mapAvatar)
            const avatarStore = converterToAvatarStore(getAvatarNotExist())
            if (Object.keys(avatarStore).length > 0) {
                setAvatars({ ...avatars, ...avatarStore })
            }
            if (!avatarSelected) {
                setAvatarSelected(listAvatar[0])
            }

            // Lightcone
            const listLightcone = await getLightconeListApi()
            listLightcone.sort((a, b) => Number(b.id) - Number(a.id))
            setListLightcone(listLightcone)
            const mapLightcone = await fetchLightconesByIdsNative(listLightcone.map((item) => item.id), listCurrentLanguageApi[locale.toLowerCase()])
            setAllMapLightconeInfo(mapLightcone)


            // Relic
            const listRelic = await getRelicSetListApi()
            setListRelic(listRelic)
            const mapRelic = await fetchRelicsByIdsNative(listRelic.map((item) => item.id), listCurrentLanguageApi[locale.toLowerCase()])
            setAllMapRelicInfo(mapRelic)
        }
        fetchData()
    }, [locale])


    useEffect(() => {
        setFilter({ ...filter, locale: locale, element: Object.keys(listElement).filter((key) => listElement[key]), path: Object.keys(listPath).filter((key) => listPath[key]) })
    }, [locale, listElement, listPath])

    return (
        <div className="grid grid-flow-row h-full auto-rows-max w-full">
            <div className="h-full rounded-lg mx-2 py-2">
                <div className="container">
                    <div className="flex flex-col h-full gap-2">
                        <div className="flex flex-col gap-2">
                            <div className="flex justify-center">
                                <input type="text"
                                    placeholder={transI18n("placeholderCharacter")}
                                    className="input input-bordered input-primary w-full max-w-xs"
                                    value={filter.name}
                                    onChange={(e) => setFilter({ ...filter, name: e.target.value, locale: locale })}
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-7 mb-1 mx-1 gap-2 w-full max-h-[17vh] min-h-[5vh] overflow-y-auto">
                                {Object.entries(listElement).map(([key, value], index) => (
                                    <div
                                        key={index}
                                        onClick={() => {
                                            setListElement((prev) => ({ ...prev, [key]: !prev[key] }))
                                        }}
                                        className="hover:bg-gray-600 grid items-center justify-items-center cursor-pointer rounded-md shadow-lg"
                                        style={{
                                            backgroundColor: listElement[key] ? "#374151" : "#6B7280"
                                        }}>
                                        <Image src={"https://api.hakush.in/hsr/UI/element/" + key + ".webp"}
                                            alt={key}
                                            className="h-[28px] w-[28px] 2xl:h-[40px] 2xl:w-[40px] object-contain rounded-md"
                                            width={200}
                                            height={200} />
                                    </div>
                                ))}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-8 mb-1 mx-1 gap-2 overflow-y-auto w-full max-h-[17vh] min-h-[5vh]">
                                {Object.entries(listPath).map(([key, value], index) => (
                                    <div
                                        key={index}
                                        onClick={() => {
                                            setListPath((prev) => ({ ...prev, [key]: !prev[key] }))
                                        }}
                                        className="hover:bg-gray-600 grid items-center justify-items-center rounded-md shadow-lg cursor-pointer"
                                        style={{
                                            backgroundColor: listPath[key] ? "#374151" : "#6B7280"
                                        }}
                                    >

                                        <Image src={"https://api.hakush.in/hsr/UI/pathicon/" + key + ".webp"}
                                            alt={key}
                                            className="h-[28px] w-[28px] 2xl:h-[40px] 2xl:w-[40px] object-contain rounded-md"
                                            width={200}
                                            height={200} />
                                    </div>
                                ))}

                            </div>
                        </div>

                        <div className="flex items-start h-full">
                            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 w-full h-[65vh] overflow-y-scroll overflow-x-hidden">
                                {listAvatar.map((item, index) => (
                                    <div key={index} onClick={() => setAvatarSelected(item)}>
                                        <CharacterCard data={item} />
                                    </div>
                                ))}
                            </ul>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}
