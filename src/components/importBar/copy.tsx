"use client"
import useUserDataStore from "@/stores/userDataStore";
import { useEffect, useState } from "react";
import useCopyProfileStore from "@/stores/copyProfile";
import ProfileCard from "../card/profileCard";
import { AvatarProfileCardType, AvatarProfileStore } from "@/types";
import Image from "next/image";
import useListAvatarStore from "@/stores/avatarStore";
import { getNameChar } from "@/helper";
import useLocaleStore from "@/stores/localeStore";
import { useTranslations } from "next-intl";
import SelectCustomImage from "../select/customSelectImage";

export default function CopyImport() {
    const { avatars, setAvatar } = useUserDataStore();
    const {avatarSelected} = useListAvatarStore()
    const { locale } = useLocaleStore()
    const {
        selectedProfiles,
        listCopyAvatar,
        avatarCopySelected,
        setSelectedProfiles,
        filterCopy,
        setFilterCopy,
        setAvatarCopySelected
    } = useCopyProfileStore()
    const transI18n = useTranslations("DataPage")
    const [listPath, setListPath] = useState<Record<string, boolean>>({ "knight": false, "mage": false, "priest": false, "rogue": false, "shaman": false, "warlock": false, "warrior": false, "memory": false })
    const [listElement, setListElement] = useState<Record<string, boolean>>({ "fire": false, "ice": false, "imaginary": false, "physical": false, "quantum": false, "thunder": false, "wind": false })
    const [listRank, setListRank] = useState<Record<string, boolean>>({ "4": false, "5": false })
    const [message, setMessage] = useState({
        type: "",
        text: ""
    })

    const handleProfileToggle = (profile: AvatarProfileCardType) => {
        if (selectedProfiles.some((selectedProfile) => selectedProfile.key === profile.key)) {
            setSelectedProfiles(selectedProfiles.filter((selectedProfile) => selectedProfile.key !== profile.key));
            return;
        }
        setSelectedProfiles([...selectedProfiles, profile]);
    };

    useEffect(() => {
        setFilterCopy({
            ...filterCopy,
            locale: locale,
            path: Object.keys(listPath).filter((key) => listPath[key]),
            element: Object.keys(listElement).filter((key) => listElement[key]),
            rarity: Object.keys(listRank).filter((key) => listRank[key])
        })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [listPath, listRank, locale])

    const clearSelection = () => {
        setSelectedProfiles([]);
        setMessage({
            type: "success",
            text: transI18n("clearAll")
        })
    };

    const selectAll = () => {
        if (avatarCopySelected) {
            setSelectedProfiles(avatars[avatarCopySelected?.id.toString()].profileList.map((profile, index) => {
                if (!profile.lightcone?.item_id && Object.keys(profile.relics).length == 0) {
                    return null;
                }
                return {
                    key: index,
                    ...profile,
                } as AvatarProfileCardType
            }).filter((profile) => profile !== null));
        }
        setMessage({
            type: "success",
            text: transI18n("selectedAll")
        })
    };

    const handleCopy = () => {
        if (selectedProfiles.length === 0) {
            setMessage({
                type: "error",
                text: transI18n("pleaseSelectAtLeastOneProfile")
            });
            return;
        }
        if (!avatarCopySelected) {
            setMessage({
                type: "error",
                text: transI18n("noAvatarToCopySelected")
            });
            return;
        }
        if (!avatarSelected) {
            setMessage({
                type: "error",
                text: transI18n("noAvatarSelected")
            });
            return;
        }

        const newListProfile = avatars[avatarCopySelected.id.toString()].profileList.map((profile) => {
            if (!profile.lightcone?.item_id && Object.keys(profile.relics).length == 0) {
                return null;
            }
            return {
                ...profile,
                profile_name: profile.profile_name + ` - Copy: ${avatarCopySelected?.id}`,
            } as AvatarProfileStore
        }).filter((profile) => profile !== null);

        const newAvatar = {
            ...avatars[avatarSelected.id.toString()],
            profileList: avatars[avatarSelected.id.toString()].profileList.concat(newListProfile),
            profileSelect: avatars[avatarSelected.id.toString()].profileList.length - 1,
        }
        setAvatar(newAvatar);
        setSelectedProfiles([]);
        setMessage({
            type: "success",
            text: transI18n("copied")
        });
    };

    return (
        <div className="rounded-lg px-2 min-h-[60vh]">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-2">

                    <div className="mt-2 w-full">

                        <div className="flex items-start flex-col gap-2 mt-2 w-full">
                            <div>{transI18n("filter")}</div>
                            <div className="flex flex-wrap justify-start gap-10 mt-2 w-full">
                                {/* Path */}
                                <div>
                                    <div className="flex flex-wrap gap-2 justify-start items-center">
                                        {Object.entries(listPath).map(([key], index) => (
                                            <div
                                                key={index}
                                                onClick={() => {
                                                    setListPath((prev) => ({ ...prev, [key]: !prev[key] }))
                                                }}
                                                className="w-[50px] h-[50px] hover:bg-gray-600 grid items-center justify-items-center rounded-md shadow-md cursor-pointer"
                                                style={{
                                                    backgroundColor: listPath[key] ? "#374151" : "#6B7280"
                                                }}>
                                                <Image
                                                    src={`/icon/${key}.webp`}
                                                    alt={key}
                                                    className="h-[32px] w-[32px] object-contain rounded-md"
                                                    width={200}
                                                    height={200}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Element */}
                                <div>
                                    <div className="flex flex-wrap gap-2 justify-start items-center">
                                        {Object.entries(listElement).map(([key], index) => (
                                            <div
                                                key={index}
                                                onClick={() => {
                                                    setListElement((prev) => ({ ...prev, [key]: !prev[key] }))
                                                }}
                                                className="w-[50px] h-[50px] hover:bg-gray-600 grid items-center justify-items-center rounded-md shadow-md cursor-pointer"
                                                style={{
                                                    backgroundColor: listElement[key] ? "#374151" : "#6B7280"
                                                }}>
                                                <Image
                                                    src={`/icon/${key}.webp`}
                                                    alt={key}
                                                    className="h-[28px] w-[28px] 2xl:h-[40px] 2xl:w-[40px] object-contain rounded-md"
                                                    width={200}
                                                    height={200}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Rank */}
                                <div>
                                    <div className="flex flex-wrap gap-2 justify-end items-center">
                                        {Object.entries(listRank).map(([key], index) => (
                                            <div
                                                key={index}
                                                onClick={() => {
                                                    setListRank((prev) => ({ ...prev, [key]: !prev[key] }))
                                                }}
                                                className="w-[50px] h-[50px] hover:bg-gray-600 grid items-center justify-items-center rounded-md shadow-md cursor-pointer"
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
                        <div className="grid grid-cols-1 gap-2">
                            <div>
                                <div>{transI18n("characterName")}</div>
                                {listCopyAvatar.length > 0 && (
                                    <SelectCustomImage
                                        customSet={listCopyAvatar.map((avatar) => ({
                                            value: avatar.id.toString(),
                                            label: getNameChar(locale, avatar),
                                            imageUrl: `https://api.hakush.in/hsr/UI/avatarshopicon/${avatar.id}.webp`
                                        }))}
                                        excludeSet={[]}
                                        selectedCustomSet={avatarCopySelected?.id.toString() || ""}
                                        placeholder="Character Select"
                                        setSelectedCustomSet={(value) => setAvatarCopySelected(listCopyAvatar.find((avatar) => avatar.id.toString() === value) || null)}
                                    />
                                )}
                            </div>
                        </div>
                    </div>



                    {/* Selection Info */}
                    <div className="mt-6 flex items-center gap-4 bg-slate-800/50 p-4 rounded-lg">
                        <span className="text-blue-400 font-medium">
                            {transI18n("selectedProfiles")}: {selectedProfiles.length}
                        </span>
                        <button
                            onClick={clearSelection}
                            className="text-error/75 hover:text-error text-sm font-medium px-3 py-1 border border-error/75 rounded hover:bg-error/10 transition-colors cursor-pointer"
                        >
                            {transI18n("clearAll")}
                        </button>
                        <button
                            onClick={selectAll} 
                            className="text-primary/75 hover:text-primary text-sm font-medium px-3 py-1 border border-primary/75 rounded hover:bg-primary/10 transition-colors cursor-pointer">
                            {transI18n("selectAll")}
                        </button>
                        {selectedProfiles.length > 0 && (
                            <button
                                onClick={handleCopy}
                                className="text-success/75 hover:text-success text-sm font-medium px-3 py-1 border border-success/75 rounded hover:bg-success/10 transition-colors cursor-pointer">
                                {transI18n("copy")}
                            </button>
                        )}
                    </div>
                    {message.type && message.text && (
                        <div className={(message.type == "error" ? "text-error" : "text-success") + " text-lg mt-2"} >{message.type == "error" ? "😭" : "🎉"} {message.text}</div>
                    )}
                </div>

                {/* Character Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {avatarCopySelected && avatars[avatarCopySelected?.id.toString()]?.profileList.map((profile, index) => {
                        if (!profile.lightcone?.item_id && Object.keys(profile.relics).length == 0) {
                            return null;
                        }
                        return (
                            <ProfileCard
                                key={index}
                                profile={{ ...profile, key: index }}
                                selectedProfile={selectedProfiles}
                                onProfileToggle={handleProfileToggle}
                            />
                        )
                    })}
                </div>
            </div>
        </div>
    )
}