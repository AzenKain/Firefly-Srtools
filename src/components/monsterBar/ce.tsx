"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
    Plus,
    Trash2,
    ChevronUp,
    ChevronDown,
    Search,
} from "lucide-react";

import useMazeStore from "@/stores/mazeStore";
import useUserDataStore from "@/stores/userDataStore";
import useMonsterStore from "@/stores/monsterStore";
import useLocaleStore from "@/stores/localeStore";
import { getLocaleName } from "@/helper";
import Image from "next/image";
import { MonsterBasic } from "@/types";
import { cloneDeep } from "lodash";
import { useTranslations } from "next-intl";


export default function CeBar() {
    const [searchTerm, setSearchTerm] = useState("");
    const [showSearchWaveId, setShowSearchWaveId] = useState<number | null>(null);
    const { Stage } = useMazeStore()
    const { ce_config, setCeConfig } = useUserDataStore()
    const { listMonster } = useMonsterStore()
    const { locale } = useLocaleStore()
    const filteredMonsters = useMemo(() => {
        const newlistMonster = new Set<MonsterBasic>()
        for (const monster of listMonster) {
            if (getLocaleName(locale, monster).toLowerCase().includes(searchTerm.toLowerCase())) {
                newlistMonster.add(monster)
            }
            if (monster.id.toLowerCase().includes(searchTerm.toLowerCase())) {
                newlistMonster.add(monster)
            }
        }
        return Array.from(newlistMonster)
    }, [listMonster, locale, searchTerm]);
    const transI18n = useTranslations("DataPage")
    const [showSearchStage, setShowSearchStage] = useState(false)
    const [stageSearchTerm, setStageSearchTerm] = useState("")
    const [stagePage, setStagePage] = useState(1)
    const pageSize = 30

    const stageList = useMemo(() => Object.values(Stage).map((stage) => ({
        id: stage.stage_id.toString(),
        name: `${stage.stage_type} (${stage.stage_id})`,
    })), [Stage])

    const filteredStages = useMemo(() => stageList.filter((s) =>
        s.name.toLowerCase().includes(stageSearchTerm.toLowerCase())
    ), [stageList, stageSearchTerm])

    const paginatedStages = useMemo(() => filteredStages.slice(
        (stagePage - 1) * pageSize,
        stagePage * pageSize
    ), [filteredStages, stagePage, pageSize])

    const hasMorePages = useMemo(() => stagePage * pageSize < filteredStages.length, [stagePage, filteredStages])

    useEffect(() => {
        setStagePage(1)
    }, [stageSearchTerm])

    return (
        <div className="container mx-auto p-6 z-4" onClick={() => {
            setShowSearchWaveId(null)
            setShowSearchStage(false)
        }}>
            <div className="mb-4 w-full relative">
                <div className="flex items-center justify-center gap-2">
                    <Search className="w-6 h-6" />
                    <button
                        className="btn btn-outline w-[95%] text-left"
                        onClick={(e) => {
                            e.stopPropagation()
                            setShowSearchStage(true)
                        }}
                    >
                        <span className="text-left"> {transI18n("stage")}: {stageList.find((s) => s.id === ce_config.stage_id.toString())?.name || transI18n("selectStage")}</span>
                    </button>
                </div>
                {showSearchStage && (
                    <div className="absolute top-full mt-2 w-full z-50 border bg-base-200 border-slate-600 rounded-lg p-4 shadow-lg">
                        <div className="flex items-center gap-2 mb-2">
                            <Search className="w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder={transI18n("searchStage")}
                                className="input input-sm w-full placeholder-slate-400"
                                value={stageSearchTerm}
                                onChange={(e) => setStageSearchTerm(e.target.value)}
                                autoFocus
                            />
                        </div>

                        <div className="max-h-60 overflow-y-auto space-y-1">
                            {paginatedStages.length > 0 ? (
                                <>
                                    {paginatedStages.map((stage) => (
                                        <div
                                            key={stage.id}
                                            className="p-2 hover:bg-primary/20 rounded cursor-pointer"
                                            onClick={() => {
                                                setCeConfig({ ...ce_config, stage_id: Number(stage.id), cycle_count: 30 })
                                                setShowSearchStage(false)
                                                setStageSearchTerm("")
                                            }}
                                        >
                                            {stage.name}
                                        </div>
                                    ))}


                                </>
                            ) : (
                                <div className="text-sm text-center py-4">{transI18n("noStageFound")}</div>
                            )}
                        </div>
                        {paginatedStages.length > 0 && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                <button
                                    disabled={stagePage === 1}
                                    className="btn btn-sm btn-outline btn-success mt-2"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        setStagePage(stagePage - 1)
                                    }}
                                >
                                    {transI18n("previous")}
                                </button>

                                <button
                                    disabled={!hasMorePages}
                                    className="btn btn-sm btn-outline btn-success mt-2"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        setStagePage(stagePage + 1)
                                    }}
                                >
                                    {transI18n("next")}
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className="relative max-w-7xl mx-auto space-y-6">
                {ce_config.monsters.map((wave, waveIndex) => (
                    <div key={waveIndex} className="card border border-slate-700/50 ">
                        <div className="card-body p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-bold text-white">{transI18n("wave")} {waveIndex + 1}</h2>
                                <div className="flex gap-2">
                                    <button
                                        disabled={waveIndex === 0}
                                        onClick={(e) => {
                                            e.stopPropagation()

                                            const newCeConfig = cloneDeep(ce_config)
                                            const waves = newCeConfig.monsters
                                            const temp = waves[waveIndex - 1]
                                            waves[waveIndex - 1] = waves[waveIndex]
                                            waves[waveIndex] = temp

                                            setCeConfig(newCeConfig)
                                        }}
                                        className="btn btn-sm btn-success"
                                    >
                                        <ChevronUp className="w-4 h-4" />
                                    </button>

                                    <button
                                        disabled={waveIndex === ce_config.monsters.length - 1}
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            const newCeConfig = cloneDeep(ce_config)
                                            const waves = newCeConfig.monsters
                                            const temp = waves[waveIndex + 1]
                                            waves[waveIndex + 1] = waves[waveIndex]
                                            waves[waveIndex] = temp

                                            setCeConfig(newCeConfig)
                                        }}
                                        className="btn btn-sm btn-success">
                                        <ChevronDown className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            const newCeConfig = cloneDeep(ce_config)
                                            newCeConfig.monsters.splice(waveIndex, 1)
                                            setCeConfig(newCeConfig)
                                        }}
                                        className="btn btn-sm btn-error">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 w-full h-full">
                                {wave.map((member, memberIndex) => (
                                    <div key={memberIndex} className="relative group z-7 w-full h-full">
                                        <div className="card border hover:border-slate-500 transition-colors w-full h-full">
                                            <div className="card-body p-4">
                                                <button
                                                    className="btn btn-xs btn-error absolute -top-2 -right-2 opacity-50 group-hover:opacity-100 transition-opacity"
                                                    onClick={() => {
                                                        const newCeConfig = cloneDeep(ce_config)
                                                        newCeConfig.monsters[waveIndex].splice(memberIndex, 1)
                                                        setCeConfig(newCeConfig)
                                                    }}
                                                >
                                                    <Trash2 className="w-3 h-3" />
                                                </button>


                                                <div className="flex justify-center">
                                                    <Image
                                                        src={`https://api.hakush.in/hsr/UI/monstermiddleicon/${listMonster.find((monster2) => monster2.child.includes(member.monster_id))?.icon?.split("/")?.pop()?.replace(".png", "")}.webp`}
                                                        alt="Enemy Icon"
                                                        width={376}
                                                        height={512}
                                                        className=" object-contain w-20 h-20 overflow-hidden"
                                                    />
                                                </div>

                                                <div className="flex justify-center gap-1 mb-2">
                                                    {listMonster
                                                        .find((monster) => monster.child.includes(member.monster_id))
                                                        ?.weak?.map((icon, iconIndex) => (
                                                            <Image
                                                                src={`/icon/${icon.toLowerCase()}.webp`}
                                                                alt={icon}
                                                                className="h-[28px] w-[28px] 2xl:h-[40px] 2xl:w-[40px] object-contain rounded-md border border-white/20 shadow-sm"
                                                                width={200}
                                                                height={200}
                                                                key={iconIndex}
                                                            />
                                                        ))}
                                                </div>
                                                <div className="text-center flex flex-col items-center justify-center">
                                                    <div className="text-sm font-medium">
                                                        {getLocaleName(locale, listMonster.find((monster) => monster.child.includes(member.monster_id)))}
                                                    </div>
                                                    <div className="flex items-center gap-1 mt-1">
                                                        <span className="text-sm">Lv.</span>
                                                        <input
                                                            type="number"
                                                            className="w-16 text-center input input-sm"
                                                            value={member.level}

                                                            onChange={(e) => {
                                                                try {
                                                                    Number(e.target.value)
                                                                } catch {
                                                                    return;
                                                                }
                                                                if (Number(e.target.value) < 1 || Number(e.target.value) > 95) return;
                                                                const newCeConfig = cloneDeep(ce_config)
                                                                newCeConfig.monsters[waveIndex][memberIndex].level = Number(e.target.value)
                                                                setCeConfig(newCeConfig)
                                                            }}
                                                        />
                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {/* Add Member Button + Search */}
                                <div className="relative flex items-start justify-center w-full h-full">
                                    <button
                                        className="btn btn-outline btn-primary w-full h-full border-dashed"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setShowSearchWaveId(waveIndex)
                                        }}
                                    >
                                        <Plus className="w-8 h-8" />
                                    </button>

                                    {showSearchWaveId === waveIndex && (
                                        <div className="absolute top-full mt-2 w-72 z-50 border bg-base-200 border-slate-600 rounded-lg p-4 shadow-lg">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Search className="w-4 h-4" />
                                                <input
                                                    type="text"
                                                    placeholder={transI18n("searchMonster")}
                                                    className="input input-sm w-full placeholder-slate-400"
                                                    value={searchTerm}
                                                    onChange={(e) => setSearchTerm(e.target.value)}
                                                    autoFocus
                                                />
                                            </div>

                                            <div className="max-h-60 overflow-y-auto space-y-1">
                                                {filteredMonsters.length > 0 ? (
                                                    filteredMonsters.map((monster) => (
                                                        <div
                                                            key={monster.id}
                                                            className="flex items-center gap-2 p-2 hover:bg-success/40 rounded cursor-pointer"
                                                            onClick={() => {
                                                                const newCeConfig = cloneDeep(ce_config)
                                                                newCeConfig.monsters[waveIndex].push({
                                                                    monster_id: Number(monster.id),
                                                                    level: 95,
                                                                    amount: 1,
                                                                })
                                                                setCeConfig(newCeConfig)
                                                                setShowSearchWaveId(null);
                                                            }}
                                                        >
                                                            <div className="relative w-8 h-8 rounded-full overflow-hidden flex-shrink-0 border border-white/10 shadow-sm">
                                                                {listMonster.find((monster2) => monster2.child.includes(Number(monster.id)))?.icon?.split("/")?.pop()?.replace(".png", "") && (
                                                                    <Image
                                                                        src={`https://api.hakush.in/hsr/UI/monstermiddleicon/${listMonster.find((monster2) => monster2.child.includes(Number(monster.id)))?.icon?.split("/")?.pop()?.replace(".png", "")}.webp`}
                                                                        alt="Enemy Icon"
                                                                        width={376}
                                                                        height={512}
                                                                        className="w-full h-full object-cover"
                                                                    />
                                                                )}
                                                            </div>
                                                            <span className="">{getLocaleName(locale, monster)} {`(${monster.id})`}</span>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="text-sm text-center py-4">
                                                        {transI18n("noMonstersFound")}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Add New Wave Button */}
                <div className="card backdrop-blur-sm border border-slate-700/50 border-dashed">
                    <div className="card-body p-8">
                        <button
                            onClick={() => {
                                const newCeConfig = cloneDeep(ce_config)
                                newCeConfig.monsters.push([])
                                setCeConfig(newCeConfig)
                            }}
                            className="btn btn-primary btn-lg w-full">
                            <Plus className="w-6 h-6 mr-2" />
                            {transI18n("addNewWave")}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
