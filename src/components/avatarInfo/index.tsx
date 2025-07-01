"use client"

import { useRouter } from 'next/navigation'
import useAvatarStore from "@/stores/avatarStore"
import useUserDataStore from "@/stores/userDataStore";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import LightconeBar from '../lightconeBar'
import useLightconeStore from '@/stores/lightconeStore'
import { calcPromotion, calcRarity, replaceByParam } from '@/helper';
import { getSkillTree } from '@/helper/getSkillTree';
import { useTranslations } from 'next-intl';
import ParseText from '../parseText';
import useLocaleStore from '@/stores/localeStore';
import useModelStore from '@/stores/modelStore';
import useMazeStore from '@/stores/mazeStore';

export default function AvatarInfo() {
    const router = useRouter()
    const { avatarSelected, mapAvatarInfo } = useAvatarStore()
    const { Technique } = useMazeStore()
    const { avatars, setAvatars, setAvatar } = useUserDataStore()
    const { isOpenLightcone, setIsOpenLightcone } = useModelStore()
    const { listLightcone, mapLightconeInfo } = useLightconeStore()
    const transI18n = useTranslations("DataPage")
    const { locale } = useLocaleStore();
    const lightcone = useMemo(() => {
        if (!avatarSelected) return null;
        const avatar = avatars[avatarSelected.id];
        return avatar?.profileList[avatar.profileSelect]?.lightcone || null;
    }, [avatarSelected, avatars]);

    const lightconeDetail = useMemo(() => {
        if (!lightcone) return null;
        return listLightcone.find((item) => Number(item.id) === Number(lightcone.item_id)) || null;
    }, [lightcone, listLightcone]);



    const handleShow = (modalId: string) => {
        const modal = document.getElementById(modalId) as HTMLDialogElement | null;
        if (modal) {
            setIsOpenLightcone(true);
            modal.showModal();
        }
    };

    // Close modal handler
    const handleCloseModal = (modalId: string) => {
        setIsOpenLightcone(false);
        const modal = document.getElementById(modalId) as HTMLDialogElement | null;
        if (modal) {
            modal.close();
        }
    };

    // Handle ESC key to close modal
    useEffect(() => {
        if (!isOpenLightcone) {
            handleCloseModal("action_detail_modal");
            return;
        }

        const handleEscKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && isOpenLightcone) {
                handleCloseModal("action_detail_modal");
            }
        };

        window.addEventListener('keydown', handleEscKey);

        return () => window.removeEventListener('keydown', handleEscKey);
    }, [isOpenLightcone]);

    return (
        <div className="bg-base-100 max-h-[77vh] min-h-[50vh] overflow-y-scroll overflow-x-hidden">
            {avatarSelected && avatars[avatarSelected?.id || ""] && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full">
                    <div className="m-2 min-h-96">
                        <div className="container">
                            <div className="card bg-base-200 shadow-xl">
                                <div className="card-body">
                                    {/* Header */}
                                    <div className="flex items-center justify-between mb-6">
                                        <h2 className="card-title text-2xl font-bold flex items-center gap-2">
                                            <div className="w-2 h-8 bg-gradient-to-b from-success to-success/50 rounded-full"></div>
                                            {transI18n("characterSettings")}
                                        </h2>
                                    </div>

                                    <div className="space-y-6">
                                        {/* Level Control */}
                                        <div className="bg-base-100 rounded-xl p-6 border border-base-content/10">
                                            <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                                <div className="w-2 h-6 bg-gradient-to-b from-info to-info/50 rounded-full"></div>
                                                {transI18n("levelConfiguration")}
                                            </h4>

                                            <div className="form-control">
                                                <label className="label">
                                                    <span className="label-text font-medium">{transI18n("characterLevel")}</span>
                                                    <span className="label-text-alt text-info font-mono">{avatars[avatarSelected?.id || ""]?.level}/80</span>
                                                </label>
                                                <div className="relative">
                                                    <input
                                                        type="number"
                                                        min="1"
                                                        max="80"
                                                        value={avatars[avatarSelected?.id || ""]?.level}
                                                        onChange={(e) => {
                                                            const newLevel = Math.min(80, Math.max(1, parseInt(e.target.value) || 1));

                                                            setAvatars({ ...avatars, [avatarSelected?.id || ""]: { ...avatars[avatarSelected?.id || ""], level: newLevel, promotion: calcPromotion(newLevel) } });
                                                        }}
                                                        className="input input-bordered w-full pr-16 font-mono"
                                                        placeholder={transI18n("placeholderLevel")}
                                                    />
                                                    <div
                                                        onClick={() => {
                                                            setAvatars({ ...avatars, [avatarSelected?.id || ""]: { ...avatars[avatarSelected?.id || ""], level: 80, promotion: calcPromotion(80) } });
                                                        }}
                                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/60 cursor-pointer">
                                                        <span className="text-sm">{transI18n("max")}</span>
                                                    </div>
                                                </div>
                                                <div className="mt-2">
                                                    <input
                                                        type="range"
                                                        min="1"
                                                        max="80"
                                                        value={avatars[avatarSelected?.id || ""]?.level}
                                                        onChange={(e) => {
                                                            const newLevel = Math.min(80, Math.max(1, parseInt(e.target.value) || 1));
                                                            setAvatars({ ...avatars, [avatarSelected?.id || ""]: { ...avatars[avatarSelected?.id || ""], level: newLevel, promotion: calcPromotion(newLevel) } });
                                                        }}
                                                        className="range range-info range-sm w-full"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Energy Control */}
                                        <div className="bg-base-100 rounded-xl p-6 border border-base-content/10">
                                            <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                                <div className="w-2 h-6 bg-gradient-to-b from-warning to-warning/50 rounded-full"></div>
                                                {transI18n("ultimateEnergy")}
                                            </h4>

                                            <div className="form-control">
                                                <label className="label">
                                                    <span className="label-text font-medium">{transI18n("currentEnergy")}</span>
                                                    <span className="label-text text-warning font-mono">
                                                        {Math.round(avatars[avatarSelected?.id || ""]?.sp_value)}/{avatars[avatarSelected?.id || ""]?.sp_max}
                                                    </span>
                                                </label>
                                                <input
                                                    type="range"
                                                    min="0"
                                                    max={avatars[avatarSelected?.id || ""]?.sp_max}
                                                    value={avatars[avatarSelected?.id || ""]?.sp_value}
                                                    onChange={(e) => {
                                                        if (!avatars[avatarSelected?.id || ""]?.can_change_sp) return
                                                        const newSpValue = Math.min(avatars[avatarSelected?.id || ""]?.sp_max, Math.max(0, parseInt(e.target.value) || 0));
                                                        setAvatars({ ...avatars, [avatarSelected?.id || ""]: { ...avatars[avatarSelected?.id || ""], sp_value: newSpValue } });
                                                    }}
                                                    className="range range-warning range-sm w-full"
                                                />
                                                <div className="flex justify-between text-sm text-base-content/60 mt-1">
                                                    <span>0%</span>
                                                    <span className="font-mono text-warning">{((avatars[avatarSelected?.id || ""]?.sp_value / avatars[avatarSelected?.id || ""]?.sp_max) * 100).toFixed(1)}%</span>
                                                    <span>100%</span>
                                                </div>
                                                <div className="mt-3">
                                                    <button
                                                        className="btn btn-sm btn-outline btn-warning"
                                                        onClick={() => {
                                                            const newSpValue = Math.ceil(avatars[avatarSelected?.id || ""]?.sp_max / 2);
                                                            const newAvatar = { ...avatars[avatarSelected?.id || ""], sp_value: newSpValue }
                                                            console.log(newAvatar)
                                                            setAvatar(newAvatar)
                                                        }}
                                                    >
                                                        {transI18n("setTo50")}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Technique Toggle */}
                                        <div className="bg-base-100 rounded-xl p-6 border border-base-content/10">
                                            <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                                <div className="w-2 h-6 bg-gradient-to-b from-accent to-accent/50 rounded-full"></div>
                                                {transI18n("battleConfiguration")}
                                            </h4>

                                            <div className="form-control">
                                                <label className="grid grid-cols-1 gap-2 sm:grid-cols-2 label cursor-pointer">
                                                    <div className="flex items-center gap-2">
                                                        <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                                        </svg>
                                                        <span className="label-text font-medium">{transI18n("useTechnique")}</span>
                                                    </div>
                                                    <input
                                                        type="checkbox"
                                                        checked={avatars[avatarSelected?.id || ""]?.techniques.length > 0}
                                                        onChange={(e) => {
                                                            const techniques = e.target.checked ? Technique[avatarSelected?.id || ""]?.maze_buff : [];
                                                            const newAvatar = { ...avatars[avatarSelected?.id || ""], techniques };
                                                            setAvatar(newAvatar);
                                                        }}
                                                        className="toggle toggle-accent"
                                                    />
                                                </label>
                                                <div className="text-xs text-base-content/60 mt-1">
                                                    {transI18n("techniqueNote")}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Enhancement Selection */}
                                        {Object.entries(mapAvatarInfo[avatarSelected?.id || ""]?.Enhanced || {}).length > 0 && (
                                            <div className="bg-base-100 rounded-xl p-6 border border-base-content/10">
                                                <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                                    <svg className="w-5 h-5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437 1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008Z" />
                                                    </svg>
                                                    {transI18n("enhancement")}
                                                </h4>

                                                <div className="form-control">
                                                    <label className="label">
                                                        <span className="label-text font-medium">{transI18n("enhancementLevel")}</span>
                                                        <span className="label-text-alt text-secondary font-mono">
                                                            {avatars[avatarSelected?.id || ""]?.enhanced || transI18n("origin")}
                                                        </span>
                                                    </label>
                                                    <select
                                                        value={avatars[avatarSelected?.id || ""]?.enhanced || ""}
                                                        onChange={(e) => {
                                                            const newAvatar = avatars[avatarSelected?.id || ""]
                                                            if (newAvatar) {
                                                                newAvatar.enhanced = e.target.value
                                                                const skillTree = getSkillTree(e.target.value)
                                                                if (skillTree) {
                                                                    newAvatar.data.skills = skillTree
                                                                }
                                                                setAvatar(newAvatar)
                                                            }
                                                        }}
                                                        className="select select-bordered select-secondary"
                                                    >
                                                        <option value="">{transI18n("origin")}</option>
                                                        {Object.entries(mapAvatarInfo[avatarSelected?.id || ""]?.Enhanced || {}).map(([key, value]) => (
                                                            <option key={key} value={key}>
                                                                {key}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    <div className="text-xs text-base-content/60 mt-1">
                                                        {transI18n("enhancedNote")}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                    <div className="m-2 min-h-96">
                        <div className="container">
                            <div className="card bg-base-200 shadow-xl">
                                <div className="card-body">
                                    {/* Header */}
                                    <div className="flex items-center justify-between mb-6">
                                        <h2 className="card-title text-2xl font-bold flex items-center gap-2">
                                            <div className="w-2 h-8 bg-gradient-to-b from-primary to-secondary rounded-full"></div>
                                            {transI18n("lightconeEquipment")}
                                        </h2>
                                    </div>

                                    {lightcone && lightconeDetail ? (
                                        <div className="grid lg:grid-cols-3 gap-6">
                                            <div className="lg:col-span-3">
                                                {/* Level & Rank Controls */}
                                                <div className="bg-base-100 rounded-xl p-6 border border-base-content/10">
                                                    <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                                        <div className="w-2 h-6 bg-gradient-to-b from-accent to-accent/50 rounded-full"></div>
                                                        {transI18n("lightconeSettings")}
                                                    </h4>

                                                    <div className="grid md:grid-cols-2 gap-6">
                                                        {/* Level Input */}
                                                        <div className="form-control">
                                                            <label className="label">
                                                                <span className="label-text font-medium">{transI18n("level")}</span>
                                                                <span className="label-text-alt text-primary font-mono">{lightcone.level}/80</span>
                                                            </label>
                                                            <div className="relative">
                                                                <input
                                                                    type="number"
                                                                    min="1"
                                                                    max="80"
                                                                    value={lightcone.level || 1}
                                                                    onChange={(e) => {
                                                                        const newLightconeLevel = Math.min(80, Math.max(1, parseInt(e.target.value) || 1))
                                                                        const newLightcone = { ...lightcone, level: newLightconeLevel, promotion: calcPromotion(newLightconeLevel) }
                                                                        const newAvatar = { ...avatars[avatarSelected.id] }
                                                                        newAvatar.profileList[newAvatar.profileSelect].lightcone = newLightcone
                                                                        setAvatar(newAvatar)
                                                                    }}
                                                                    className="input input-bordered w-full pr-16 font-mono"
                                                                    placeholder={transI18n("placeholderLevel")}
                                                                />
                                                                <div
                                                                    onClick={() => {
                                                                        const newLightcone = { ...lightcone, level: 80, promotion: calcPromotion(80) }
                                                                        const newAvatar = { ...avatars[avatarSelected.id] }
                                                                        newAvatar.profileList[newAvatar.profileSelect].lightcone = newLightcone
                                                                        setAvatar(newAvatar)
                                                                    }}
                                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/60 cursor-pointer">
                                                                    <span className="text-sm">{transI18n("max")}</span>
                                                                </div>
                                                            </div>
                                                            <div className="mt-2">
                                                                <input
                                                                    type="range"
                                                                    min="1"
                                                                    max="80"
                                                                    value={lightcone.level || 1}
                                                                    onChange={(e) => {
                                                                        const newLightconeLevel = Math.min(80, Math.max(1, parseInt(e.target.value) || 1))
                                                                        const newLightcone = { ...lightcone, level: newLightconeLevel, promotion: calcPromotion(newLightconeLevel) }
                                                                        const newAvatar = { ...avatars[avatarSelected.id] }
                                                                        newAvatar.profileList[newAvatar.profileSelect].lightcone = newLightcone
                                                                        setAvatar(newAvatar)
                                                                    }}
                                                                    className="range range-primary range-sm"
                                                                />
                                                            </div>
                                                        </div>

                                                        {/* Rank Selection */}
                                                        <div className="form-control space-y-3">
                                                            {/* Header */}
                                                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                                                <span className="font-medium text-sm sm:text-base">{transI18n("superimpositionRank")}</span>
                                                                <span className="text-info font-mono text-lg sm:text-xl font-semibold">S{lightcone.rank}</span>
                                                            </div>

                                                            {/* Rank Buttons */}
                                                            <div className="w-full">
                                                                <div className="grid grid-cols-5 gap-1.5 sm:gap-2 md:grid-cols-3 xl:grid-cols-5 max-w-sm mx-auto sm:mx-0">
                                                                    {[1, 2, 3, 4, 5].map((r) => (
                                                                        <button
                                                                            key={r}
                                                                            onClick={() => {
                                                                                const newLightcone = { ...lightcone, rank: r }
                                                                                const newAvatar = { ...avatars[avatarSelected.id] }
                                                                                newAvatar.profileList[newAvatar.profileSelect].lightcone = newLightcone
                                                                                setAvatar(newAvatar)
                                                                            }}
                                                                            className={`
                                                                                btn btn-sm sm:btn-md font-mono font-semibold
                                                                                transition-all duration-200 hover:scale-105
                                                                                ${lightcone.rank === r
                                                                                    ? 'btn-primary shadow-lg'
                                                                                    : 'btn-outline btn-primary hover:btn-primary'
                                                                                }`}
                                                                        >
                                                                            S{r}
                                                                        </button>
                                                                    ))}
                                                                </div>
                                                            </div>

                                                            {/* Help Text */}
                                                            <div className="text-xs sm:text-sm text-base-content/60 text-center sm:text-left mt-2">
                                                                {transI18n("ranksNote")}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Action Buttons */}
                                                <div className="flex flex-wrap gap-3 mt-2">
                                                    <button
                                                        onClick={() => handleShow("action_detail_modal")}
                                                        className="btn btn-primary btn-lg flex-1 min-w-fit"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                                                        </svg>
                                                        {transI18n("changeLightcone")}
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            const newAvatar = { ...avatars[avatarSelected.id] }
                                                            newAvatar.profileList[newAvatar.profileSelect].lightcone = null
                                                            setAvatar(newAvatar)
                                                        }}
                                                        className="btn btn-warning btn-lg flex-1 min-w-fit"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                        {transI18n("removeLightcone")}
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Lightcone Image */}
                                            <div className="lg:col-span-1">
                                                <div className="">
                                                    <img
                                                        loading="lazy"
                                                        src={`https://api.hakush.in/hsr/UI/lightconemaxfigures/${lightconeDetail.id}.webp`}
                                                        className="w-full h-full rounded-lg object-cover shadow-lg"
                                                        alt="Lightcone"
                                                    />
                                                </div>
                                            </div>

                                            {/* Lightcone Info & Controls */}
                                            <div className="lg:col-span-2 space-y-6">
                                                {/* Basic Info */}
                                                {mapLightconeInfo[lightcone.item_id] && (
                                                    <div className="bg-base-300 rounded-xl p-6 border border-base-content/10">
                                                        <div className="flex flex-wrap items-center gap-3 mb-4">
                                                            <h3 className="text-2xl font-bold text-base-content">
                                                                <ParseText
                                                                    locale={locale}
                                                                    text={mapLightconeInfo[lightcone.item_id].Name}
                                                                />
                                                            </h3>
                                                            <div className="badge badge-outline badge-lg">
                                                                {transI18n(mapLightconeInfo[lightcone.item_id].BaseType.toLowerCase())}
                                                            </div>
                                                            <div className="badge badge-outline badge-lg">
                                                                {calcRarity(mapLightconeInfo[lightcone.item_id].Rarity) + "⭐"}
                                                            </div>
                                                            <div className="badge badge-outline badge-lg">
                                                                {"id: " + lightcone.item_id}
                                                            </div>
                                                        </div>

                                                        <div className="prose prose-sm max-w-none">
                                                            <div
                                                                className="text-base-content/80 leading-relaxed"
                                                                dangerouslySetInnerHTML={{
                                                                    __html: replaceByParam(
                                                                        mapLightconeInfo[lightcone.item_id].Refinements.Desc,
                                                                        mapLightconeInfo[lightcone.item_id].Refinements.Level[lightcone.rank.toString()]?.ParamList || []
                                                                    )
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                )}


                                            </div>
                                        </div>
                                    ) : (
                                        /* No Lightcone Equipped State */
                                        <div className="text-center py-12">
                                            <div
                                                onClick={() => handleShow("action_detail_modal")}
                                                className="w-24 h-24 mx-auto mb-6 bg-base-300 rounded-full flex items-center justify-center cursor-pointer"
                                            >
                                                <svg className="w-12 h-12 text-base-content/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                                </svg>
                                            </div>
                                            <h3 className="text-xl font-semibold mb-2">{transI18n("noLightconeEquipped")}</h3>
                                            <p className="text-base-content/60 mb-6">{transI18n("equipLightconeNote")}</p>
                                            <button
                                                onClick={() => handleShow("action_detail_modal")}
                                                className="btn btn-success btn-lg"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                                </svg>
                                                {transI18n("equipLightcone")}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <dialog id="action_detail_modal" className="modal backdrop-blur-sm">
                <div className="modal-box w-11/12 max-w-5xl bg-base-100 text-base-content border border-purple-500/50 shadow-lg shadow-purple-500/20">
                    <div className="sticky top-0 z-10">
                        <motion.button
                            whileHover={{ scale: 1.1, rotate: 90 }}
                            transition={{ duration: 0.2 }}
                            className="btn btn-circle btn-md absolute right-2 top-2 bg-red-600 hover:bg-red-700 text-white border-none"
                            onClick={() => handleCloseModal("action_detail_modal")}
                        >
                            ✕
                        </motion.button>
                    </div>
                    <LightconeBar />
                </div>

            </dialog>
        </div>

    );
}
