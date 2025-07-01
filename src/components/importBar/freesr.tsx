"use client"

import useFreeSRStore from "@/stores/freesrStore";
import useModelStore from "@/stores/modelStore";
import useUserDataStore from "@/stores/userDataStore";
import { CharacterInfoCardType } from "@/types";
import { useState } from "react";
import CharacterInfoCard from "../card/characterInfoCard";
import { freeSRJsonSchema } from "@/zod";
import { toast } from "react-toastify";
import { converterOneFreeSRDataToAvatarStore } from "@/helper";
import { useTranslations } from "next-intl";

export default function FreeSRImport() {
    const { avatars, setAvatar, setBattleConfig } = useUserDataStore();
    const { isOpenImport, setIsOpenImport } = useModelStore()
    const [isLoading, setIsLoading] = useState(false)
    const [Error, setError] = useState("")
    const { freeSRData, setFreeSRData, selectedCharacters, setSelectedCharacters } = useFreeSRStore()
    const transI18n = useTranslations("DataPage")

    const handleCharacterToggle = (character: CharacterInfoCardType) => {
        if (selectedCharacters.some((selectedCharacter) => selectedCharacter.key === character.key)) {
            setSelectedCharacters(selectedCharacters.filter((selectedCharacter) => selectedCharacter.key !== character.key));
            return;
        }
        setSelectedCharacters([...selectedCharacters, character]);
    };

    const clearSelection = () => {
        setSelectedCharacters([]);
    };

    const selectAll = () => {
        if (freeSRData) {
            setSelectedCharacters(Object.entries(freeSRData?.avatars).map(([key, character]) => {
                const lightcone = freeSRData.lightcones.find((lightcone) => lightcone.equip_avatar === character.avatar_id)
                const relics = freeSRData.relics.filter((relic) => relic.equip_avatar === character.avatar_id)
                return {
                    key: character.avatar_id,
                    avatar_id: character.avatar_id,
                    rank: character.data.rank ?? 0,
                    level: character.level,
                    lightcone: {
                        level: lightcone?.level ?? 0,
                        rank: lightcone?.rank ?? 0,
                        item_id: lightcone?.item_id ?? "",
                    },
                    relics: relics.map((relic) => ({
                        level: relic.level,
                        relic_id: relic.relic_id,
                        relic_set_id: relic.relic_set_id,
                    })),
                } as CharacterInfoCardType
            }));
        }
    };

    const handlerReadFile = (event: React.ChangeEvent<HTMLInputElement>) => {
        setIsLoading(true)
        const file = event.target.files?.[0];
        if (!file) {
            setSelectedCharacters([])
            setFreeSRData(null)
            setError(transI18n("pleaseSelectAFile"))
            setIsLoading(false)
            return
        }
        if (!file.name.endsWith(".json") || file.type !== "application/json") {
            setSelectedCharacters([])
            setFreeSRData(null)
            setError(transI18n("fileMustBeAValidJsonFile"))
            setIsLoading(false)
            return
        }

        if (file) {

            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target?.result as string);
                    const parsed = freeSRJsonSchema.parse(data)
                    setFreeSRData(parsed)
                    setError("")

                    setSelectedCharacters(Object.entries(parsed?.avatars || {}).map(([key, character]) => {
                        const lightcone = parsed?.lightcones.find((lightcone) => lightcone.equip_avatar === character.avatar_id)
                        const relics = parsed?.relics.filter((relic) => relic.equip_avatar === character.avatar_id)
                        return {
                            key: character.avatar_id,
                            avatar_id: character.avatar_id,
                            rank: character.data.rank ?? 0,
                            level: character.level,
                            lightcone: {
                                level: lightcone?.level ?? 0,
                                rank: lightcone?.rank ?? 0,
                                item_id: lightcone?.item_id ?? "",
                            },
                            relics: relics?.map((relic) => ({
                                level: relic.level,
                                relic_id: relic.relic_id,
                                relic_set_id: relic.relic_set_id,
                            })) ?? [],
                        } as CharacterInfoCardType
                    }));
                } catch (error) {
                    setSelectedCharacters([])
                    setFreeSRData(null)
                    setError(transI18n("fileIsNotAValidFreeSRJsonFile"))
                }
            };
            reader.readAsText(file);
            setIsLoading(false)
        }
        setIsLoading(false)
    };

    const handleImport = () => {
        if (selectedCharacters.length === 0) {
            setError(transI18n("pleaseSelectAtLeastOneCharacter"));
            return;
        }
        if (!freeSRData) {
            setError(transI18n("noDataToImport"));
            return;
        }
        setError("");

        const listAvatars = { ...avatars }
        const filterData = Object.entries(freeSRData?.avatars || {}).filter(([key, character]) => selectedCharacters.some((selectedCharacter) => selectedCharacter.avatar_id === character.avatar_id))
        filterData.forEach(([key, character]) => {
            const newAvatar = { ...listAvatars[character.avatar_id] }
            if (Object.keys(newAvatar).length !== 0) {
                newAvatar.level = character.level
                newAvatar.promotion = character.promotion
                newAvatar.data = {
                    rank: character.data.rank ?? 0,
                    skills: character.data.skills
                }
                const newProfile = converterOneFreeSRDataToAvatarStore(freeSRData, newAvatar.profileList.length, character.avatar_id)
                if (newProfile) {
                    newAvatar.profileList.push(newProfile)
                    newAvatar.profileSelect = newAvatar.profileList.length - 1
                }
                setAvatar(newAvatar)
            }

        })
        setBattleConfig(freeSRData?.battle_config)
        setIsOpenImport(false)
        toast.success(transI18n("importFreeSRDataSuccess"))
    }

    return (
        <div className="bg-slate-900 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-white text-2xl font-bold mb-6">{transI18n("freeSRImport")}</h1>

                    <div className="flex gap-4 items-center mb-6">
                        <fieldset className="fieldset">
                            <legend className="fieldset-legend">{transI18n("pickAFile")}</legend>
                            <input type="file" accept=".json" className="file-input file-input-info" onChange={handlerReadFile} />
                            <label className="label">{transI18n("onlySupportFreeSRJsonFile")}</label>
                        </fieldset>

                        {selectedCharacters.length > 0 && (
                            <button onClick={handleImport} className="btn btn-primary rounded-lg transition-colors">
                                {transI18n("import")}
                            </button>
                        )}
                    </div>
                    {Error && (
                        <div className="text-error text-base mt-2">😭 {Error}</div>
                    )}


                    {/* Selection Info */}
                    <div className="mt-6 flex items-center gap-4 bg-slate-800/50 p-4 rounded-lg">
                        <span className="text-blue-400 font-medium">
                            {transI18n("selectedCharacters")}: {selectedCharacters.length}
                        </span>
                        <button
                            onClick={clearSelection}
                            className="text-error/75 hover:text-error text-sm font-medium px-3 py-1 border border-error/75 rounded hover:bg-error/10 transition-colors cursor-pointer"
                        >
                            {transI18n("clearAll")}
                        </button>
                        <button onClick={selectAll} className="text-primary/75 hover:text-primary text-sm font-medium px-3 py-1 border border-primary/75 rounded hover:bg-primary/10 transition-colors cursor-pointer">
                            {transI18n("selectAll")}
                        </button>
                    </div>
                </div>
                {isLoading && (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                    </div>
                )}
                {/* Character Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {Object.entries(freeSRData?.avatars || {}).map(([key, character]) => {
                        const lightcone = freeSRData?.lightcones.find((lightcone) => lightcone.equip_avatar === character.avatar_id)
                        const relics = freeSRData?.relics.filter((relic) => relic.equip_avatar === character.avatar_id)
                        return (
                            <CharacterInfoCard
                                key={character.avatar_id}
                                character={{
                                    key: character.avatar_id,
                                    avatar_id: character.avatar_id,
                                    rank: character.data.rank ?? 0,
                                    level: character.level,
                                    lightcone: {
                                        level: lightcone?.level ?? 0,
                                        rank: lightcone?.rank ?? 0,
                                        item_id: lightcone?.item_id ?? "",
                                    },
                                    relics: relics?.map((relic) => ({
                                        level: relic.level,
                                        relic_id: relic.relic_id,
                                        relic_set_id: relic.relic_set_id,
                                    })) ?? [],
                                } as CharacterInfoCardType
                                }
                                selectedCharacters={selectedCharacters}
                                onCharacterToggle={handleCharacterToggle}
                            />
                        )
                    })}
                </div>
            </div>
        </div>
    )
}