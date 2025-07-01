"use client"

import { useEffect, useState } from "react"
import Image from "next/image";
import useLocaleStore from "@/stores/localeStore"
import useLightconeStore from "@/stores/lightconeStore";
import LightconeCard from "../card/lightconeCard";
import useUserDataStore from "@/stores/userDataStore";
import useAvatarStore from "@/stores/avatarStore";
import useModelStore from "@/stores/modelStore";
import { useTranslations } from "next-intl";

export default function LightconeBar() {
    const [listPath, setListPath] = useState<Record<string, boolean>>({ "knight": false, "mage": false, "priest": false, "rogue": false, "shaman": false, "warlock": false, "warrior": false, "memory": false })
    const [listRank, setListRank] = useState<Record<string, boolean>>({ "3": false, "4": false, "5": false })
    const { locale } = useLocaleStore()
    const { listLightcone, filter, setFilter } = useLightconeStore()
    const { setAvatar, avatars } = useUserDataStore()
    const { avatarSelected } = useAvatarStore()
    const { setIsOpenLightcone } = useModelStore()
    const transI18n = useTranslations("DataPage")
    useEffect(() => {
        setFilter({
            ...filter,
            locale: locale,
            path: Object.keys(listPath).filter((key) => listPath[key]),
            rarity: Object.keys(listRank).filter((key) => listRank[key])
        })
    }, [listPath, listRank, locale])

    return (
        <div>
            <div className="border-b border-purple-500/30 px-6 py-4 mb-4">
                <h3 className="font-bold text-2xl text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-cyan-400">
                    {transI18n("lightConeSetting")}
                </h3>
            </div>
            <div className="mt-2 w-full">
                <div className="flex items-start flex-col gap-2">
                    <div>Search</div>
                    <input
                        value={filter.name}
                        onChange={(e) => setFilter({ ...filter, name: e.target.value, locale: locale })}
                        type="text" placeholder="LightCone Name" className="input input-accent mt-1 w-full"
                    />
                </div>
                <div className="flex items-start flex-col gap-2 mt-2 w-full">
                    <div>Filter</div>
                    <div className="grid grid-cols-12 mt-1 w-full">
                        <div className="grid justify-items-start col-span-8">
                            <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-8 mb-1 mx-1 gap-2">
                                {Object.entries(listPath).map(([key, value], index) => (
                                    <div
                                        key={index}
                                        onClick={() => {
                                            setListPath((prev) => ({ ...prev, [key]: !prev[key] }))
                                        }}
                                        className="w-[50px] h-[50px] hover:bg-gray-600 grid items-center justify-items-center rounded-md shadow-lg cursor-pointer"
                                        style={{
                                            backgroundColor: listPath[key] ? "#374151" : "#6B7280"
                                        }}>
                                        <Image src={"https://api.hakush.in/hsr/UI/pathicon/" + key + ".webp"}
                                            alt={key}
                                            className="h-[32px] w-[32px] object-contain rounded-md "
                                            width={200}
                                            height={200} />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="grid justify-items-end col-span-4 w-full">
                            <div className="grid grid-cols-1 sm:grid-cols-3 mb-1 mx-1 gap-2">
                                {Object.entries(listRank).map(([key, value], index) => (
                                    <div
                                        key={index}
                                        onClick={() => {
                                            setListRank((prev) => ({ ...prev, [key]: !prev[key] }))
                                        }}
                                        className="w-[50px] h-[50px] hover:bg-gray-600 grid items-center justify-items-center rounded-md shadow-lg cursor-pointer"
                                        style={{
                                            backgroundColor: listRank[key] ? "#374151" : "#6B7280"
                                        }}>
                                        <div className="font-bold text-white h-[32px] w-[32px] text-center flex items-center justify-center">{key}*</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-8 mt-2 gap-2">
                {listLightcone.map((item, index) => (
                    <div key={index} onClick={() => {
                        if (avatarSelected) {
                            const avatar = avatars[avatarSelected.id]
                            avatar.profileList[avatar.profileSelect].lightcone = {
                                level: 80,
                                item_id: Number(item.id),
                                rank: 1,
                                promotion: 6
                            }
                            setAvatar({ ...avatar })
                            setIsOpenLightcone(false)
                        }
                    }}>
                        <LightconeCard data={item} />
                    </div>
                ))}
            </div>
        </div>
    )
}