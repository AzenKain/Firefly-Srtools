"use client"
import Image from "next/image"
import { useEffect, useState } from "react"
import CharacterCard from "../card/characterCard"
import useLocaleStore from "@/stores/localeStore"
import useAvatarStore from "@/stores/avatarStore"
import { useTranslations } from "next-intl"
import { useFetchASData, useFetchAvatarData, useFetchConfigData, useFetchLightconeData, useFetchMOCData, useFetchMonsterData, useFetchPFData, useFetchRelicData } from "@/hooks"

export default function AvatarBar() {
    const [listElement, setListElement] = useState<Record<string, boolean>>({ "fire": false, "ice": false, "imaginary": false, "physical": false, "quantum": false, "thunder": false, "wind": false })
    const [listPath, setListPath] = useState<Record<string, boolean>>({ "knight": false, "mage": false, "priest": false, "rogue": false, "shaman": false, "warlock": false, "warrior": false, "memory": false })
    const { listAvatar, setAvatarSelected, setFilter, filter } = useAvatarStore()
    const transI18n = useTranslations("DataPage")
    const { locale } = useLocaleStore()

    useFetchConfigData()
    useFetchAvatarData()
    useFetchLightconeData()
    useFetchRelicData()
    useFetchMonsterData()
    useFetchPFData()
    useFetchMOCData()
    useFetchASData()
    
    useEffect(() => {
        setFilter({ ...filter, locale: locale, element: Object.keys(listElement).filter((key) => listElement[key]), path: Object.keys(listPath).filter((key) => listPath[key]) })
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
                                {Object.keys(listElement).map((key, index) => (
                                    <div
                                        key={index}
                                        onClick={() => {
                                            setListElement((prev) => ({ ...prev, [key]: !prev[key] }))
                                        }}
                                        className="hover:bg-gray-600 grid items-center justify-items-center cursor-pointer rounded-md shadow-lg"
                                        style={{
                                            backgroundColor: listElement[key] ? "#374151" : "#6B7280"
                                        }}>
                                        <Image src={ `/icon/${key}.webp`}
                                            alt={key}
                                            className="h-[28px] w-[28px] 2xl:h-[40px] 2xl:w-[40px] object-contain rounded-md"
                                            width={200}
                                            height={200} />
                                    </div>
                                ))}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-8 mb-1 mx-1 gap-2 overflow-y-auto w-full max-h-[17vh] min-h-[5vh]">
                                {Object.keys(listPath).map((key, index) => (
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

                                        <Image src={`/icon/${key}.webp`}
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
