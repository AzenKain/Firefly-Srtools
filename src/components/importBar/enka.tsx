"use client"
import { useState } from "react";
import CharacterInfoCard from "../card/characterInfoCard";
import useEnkaStore from "@/stores/enkaStore";
import { SendDataThroughProxy } from "@/lib/api";
import { CharacterInfoCardType, EnkaResponse } from "@/types";
import useUserDataStore from "@/stores/userDataStore";
import { converterOneEnkaDataToAvatarStore } from "@/helper";
import useModelStore from "@/stores/modelStore";
import { toast } from "react-toastify";
import { useTranslations } from "next-intl";

export default function EnkaImport() {
    const {
        uidInput,
        setUidInput,
        enkaData,
        selectedCharacters,
        setSelectedCharacters,
        setEnkaData,
    } = useEnkaStore();
    const transI18n = useTranslations("DataPage")
    const { avatars, setAvatar } = useUserDataStore();
    const { isOpenImport, setIsOpenImport } = useModelStore()
    const [isLoading, setIsLoading] = useState(false)
    const [Error, setError] = useState("")

    const handlerFetchData = async () => {
        if (!uidInput) {
            setError(transI18n("pleaseEnterUid"))
            return;
        }
        setIsLoading(true)
        const data : EnkaResponse = await SendDataThroughProxy({data: {serverUrl: "https://enka.network/api/hsr/uid/" + uidInput, method: "GET"}})
        if (data) {
            setEnkaData(data)
            setSelectedCharacters(data.detailInfo.avatarDetailList.map((character) => {
                return {
                    key: character.avatarId,
                    avatar_id: character.avatarId,
                    rank: character.rank ?? 0,
                    level: character.level,
                    lightcone: {
                        level: character.equipment.level,
                        rank: character.equipment.rank,
                        item_id: character.equipment.tid,
                    },
                    relics: character.relicList.map((relic) => ({
                        level: relic.level,
                        relic_id: relic.tid,
                        relic_set_id: parseInt(relic.tid.toString().slice(1, -1), 10),
                    })),
                } as CharacterInfoCardType
            }))
            setError("")
        } else {
            setError(transI18n("failedToFetchEnkaData"))
        }
        setIsLoading(false)
    }

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
        if (enkaData) {
            setSelectedCharacters(enkaData?.detailInfo.avatarDetailList.map((character) => {
                return {
                    key: character.avatarId,
                    avatar_id: character.avatarId,
                    rank: character.rank ?? 0,
                    level: character.level,
                    lightcone: {
                        level: character.equipment.level,
                        rank: character.equipment.rank,
                        item_id: character.equipment.tid,
                    },
                    relics: character.relicList.map((relic) => ({
                        level: relic.level,
                        relic_id: relic.tid,
                        relic_set_id: parseInt(relic.tid.toString().slice(1, -1), 10),
                    })),
                } as CharacterInfoCardType
            }));
        }
    };

    const handleImport = () => {
        if (selectedCharacters.length === 0) {
            setError(transI18n("pleaseSelectAtLeastOneCharacter"));
            return;
        }
        if (!enkaData) {
            setError(transI18n("noDataToImport"));
            return;
        }
        setError("");
        const listAvatars = { ...avatars }
        const filterData = enkaData.detailInfo.avatarDetailList.filter((character) => selectedCharacters.some((selectedCharacter) => selectedCharacter.avatar_id === character.avatarId))
        filterData.forEach((character) => {
            const newAvatar = { ...listAvatars[character.avatarId.toString()] }
            if (Object.keys(newAvatar).length !== 0) {
                newAvatar.level = character.level
                newAvatar.promotion = character.promotion
                newAvatar.data = {
                    rank: character.rank ?? 0,
                    skills: character.skillTreeList.reduce((acc, skill) => {
                        acc[skill.pointId] = skill.level;
                        return acc;
                    }, {} as Record<string, number>),
                }
                const newProfile = converterOneEnkaDataToAvatarStore(character, newAvatar.profileList.length)
                if (newProfile) {
                    newAvatar.profileList.push()
                    newAvatar.profileSelect = newAvatar.profileList.length - 1
                }
                setAvatar(newAvatar)
            }

        })
        setIsOpenImport(false)
        toast.success(transI18n("importEnkaDataSuccess"))
    };

    return (
        <div className="bg-slate-900 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-white text-2xl font-bold mb-6">HSR UID</h1>

                    <div className="flex gap-4 items-center mb-6">
                        <input
                            type="text"
                            value={uidInput}
                            onChange={(e) => setUidInput(e.target.value)}
                            className="bg-slate-800 text-white px-4 py-3 rounded-lg border border-slate-700 flex-1 max-w-md focus:outline-none focus:border-blue-500"
                            placeholder="Enter UID"
                        />
                        <button onClick={handlerFetchData} className="btn btn-success rounded-lg transition-colors">
                            {transI18n("getData")}
                        </button>
                        {selectedCharacters.length > 0 && (
                            <button onClick={handleImport} className="btn btn-primary rounded-lg transition-colors">
                                {transI18n("import")}
                            </button>
                        )}
                    </div>
                    {Error && (
                        <div className="text-error text-base mt-2">😭 {Error}</div>
                    )}

                    {/* Player Info */}
                    {enkaData && (
                        <div className="text-white space-y-2">
                            <div className="text-lg">Name: {enkaData.detailInfo.nickname}</div>
                            <div className="text-lg">UID: {enkaData.detailInfo.uid}</div>
                            <div className="text-lg">Level: {enkaData.detailInfo.level}</div>
                        </div>
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
                    {enkaData?.detailInfo.avatarDetailList.map((character, index) => (
                        <CharacterInfoCard
                            key={character.avatarId}
                            character={{
                                key: character.avatarId,
                                avatar_id: character.avatarId,
                                rank: character.rank ?? 0,
                                level: character.level,
                                lightcone: {
                                    level: character.equipment.level,
                                    rank: character.equipment.rank,
                                    item_id: character.equipment.tid,
                                },
                                relics: character.relicList.map((relic) => ({
                                    level: relic.level,
                                    relic_id: relic.tid,
                                    relic_set_id: parseInt(relic.tid.toString().slice(1, -1), 10),
                                })),
                            } as CharacterInfoCardType
                            }
                            selectedCharacters={selectedCharacters}
                            onCharacterToggle={handleCharacterToggle}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}