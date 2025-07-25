"use client"

import { useEffect, useMemo } from "react";
import SelectCustomText from "../select/customSelectText";
import useEventStore from "@/stores/eventStore";
import { getLocaleName, replaceByParam } from "@/helper";
import useLocaleStore from "@/stores/localeStore";
import useUserDataStore from "@/stores/userDataStore";
import useMonsterStore from "@/stores/monsterStore";
import Image from "next/image";
import { MonsterStore } from "@/types";
import cloneDeep from 'lodash/cloneDeep'
import useMazeStore from "@/stores/mazeStore";
import { useTranslations } from "next-intl";

export default function MocBar() {
    const { MOCEvent, mapMOCInfo } = useEventStore()
    const { listMonster } = useMonsterStore()
    const { locale } = useLocaleStore()
    const {
        moc_config,
        setMocConfig
    } = useUserDataStore()
    const { MOC } = useMazeStore()

    const transI18n = useTranslations("DataPage")

    const challengeSelected = useMemo(() => {
        return mapMOCInfo[moc_config.event_id.toString()]?.find((moc) => moc.Id === moc_config.challenge_id)
    }, [moc_config, mapMOCInfo])

    useEffect(() => {
        const challenge = mapMOCInfo[moc_config.event_id.toString()]?.find((moc) => moc.Id === moc_config.challenge_id)
        if (moc_config.event_id !== 0 && moc_config.challenge_id !== 0 && challenge) {
            const newBattleConfig = cloneDeep(moc_config)
            newBattleConfig.cycle_count = 0
            if (moc_config.use_cycle_count) {
                newBattleConfig.cycle_count = challenge.Countdown
            }
            newBattleConfig.blessings = []
            if (moc_config.use_turbulence_buff && MOC[moc_config.challenge_id.toString()]) {
                newBattleConfig.blessings.push({
                    id: Number(MOC[moc_config.challenge_id.toString()].maze_buff),
                    level: 1
                })
            }
            newBattleConfig.monsters = []
            newBattleConfig.stage_id = 0
            if ((moc_config.floor_side === "Upper" || moc_config.floor_side === "Upper -> Lower") && challenge.EventIDList1.length > 0) {
                newBattleConfig.stage_id = challenge.EventIDList1[0].StageID
                for (const wave of challenge.EventIDList1[0].MonsterList) {
                    const newWave: MonsterStore[] = []
                    for (const value of Object.values(wave)) {
                        newWave.push({
                            monster_id: Number(value),
                            level: challenge.EventIDList1[0].Level,
                            amount: 1,
                        })
                    }
                    newBattleConfig.monsters.push(newWave)
                }
            }
            if ((moc_config.floor_side === "Lower" || moc_config.floor_side === "Lower -> Upper") && challenge.EventIDList2.length > 0) {
                newBattleConfig.stage_id = challenge.EventIDList2[0].StageID
                for (const wave of challenge.EventIDList2[0].MonsterList) {
                    const newWave: MonsterStore[] = []
                    for (const value of Object.values(wave)) {
                        newWave.push({
                            monster_id: Number(value),
                            level: challenge.EventIDList2[0].Level,
                            amount: 1,
                        })
                    }
                    newBattleConfig.monsters.push(newWave)
                }
            }
            if (moc_config.floor_side === "Lower -> Upper" && challenge.EventIDList1.length > 0) {
                for (const wave of challenge.EventIDList1[0].MonsterList) {
                    const newWave: MonsterStore[] = []
                    for (const value of Object.values(wave)) {
                        newWave.push({
                            monster_id: Number(value),
                            level: challenge.EventIDList1[0].Level,
                            amount: 1,
                        })
                    }
                    newBattleConfig.monsters.push(newWave)
                }
            } else if (moc_config.floor_side === "Upper -> Lower" && challenge.EventIDList2.length > 0) {
                for (const wave of challenge.EventIDList2[0].MonsterList) {
                    const newWave: MonsterStore[] = []
                    for (const value of Object.values(wave)) {
                        newWave.push({
                            monster_id: Number(value),
                            level: challenge.EventIDList2[0].Level,
                            amount: 1,
                        })
                    }
                    newBattleConfig.monsters.push(newWave)
                }
            }
            setMocConfig(newBattleConfig)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        moc_config.event_id,
        moc_config.challenge_id,
        moc_config.floor_side,
        mapMOCInfo,
        MOC,
        moc_config.use_cycle_count,
        moc_config.use_turbulence_buff,
    ])

    return (
        <div className="container mx-auto px-4 py-8 relative">

            {/* Title Card */}
            <div className="rounded-xl p-4 mb-2 border border-warning">
                <div className="mb-4 w-full">
                    <SelectCustomText
                        customSet={MOCEvent.map((moc) => ({
                            id: moc.id,
                            name: getLocaleName(locale, moc),
                            time: `${moc.begin} - ${moc.end}`,
                        }))}
                        excludeSet={[]}
                        selectedCustomSet={moc_config.event_id.toString()}
                        placeholder={transI18n("selectMOCEvent")}
                        setSelectedCustomSet={(id) => setMocConfig({ ...moc_config, event_id: Number(id), challenge_id: 0 })}
                    />
                </div>
                {/* Settings */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">

                    <div className="flex items-center gap-2">
                        <label className="label">
                            <span className="label-text font-bold text-success">{transI18n("floor")}:{" "}</span>
                        </label>
                        <select
                            value={moc_config.challenge_id}
                            className="select select-success"
                            onChange={(e) => setMocConfig({ ...moc_config, challenge_id: Number(e.target.value) })}
                        >
                            <option value={0} disabled={true}>Select a Floor</option>
                            {mapMOCInfo[moc_config.event_id.toString()]?.map((moc) => (
                                <option key={moc.Id} value={moc.Id}>{moc.Id % 100}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex items-center gap-2">
                        <label className="label">
                            <span className="label-text font-bold text-success">{transI18n("side")}:{" "}</span>
                        </label>
                        <select
                            value={moc_config.floor_side}
                            className="select select-success"
                            onChange={(e) => setMocConfig({ ...moc_config, floor_side: e.target.value })}
                        >
                            <option value={0} disabled={true}>{transI18n("selectSide")}</option>
                            <option value="Upper">{transI18n("upper")}</option>
                            <option value="Lower">{transI18n("lower")}</option>
                            <option value="Upper -> Lower">{transI18n("upperToLower")}</option>
                            <option value="Lower -> Upper">{transI18n("lowerToUpper")}</option>
                        </select>
                    </div>

                    <div className="flex items-center gap-2">
                        <label className="label cursor-pointer">
                            <span
                                onClick={() => setMocConfig({ ...moc_config, use_cycle_count: !moc_config.use_cycle_count })}
                                className="label-text font-bold text-success cursor-pointer"
                            >
                                {transI18n("useCycleCount")} {" "}
                            </span>
                            <input
                                type="checkbox"
                                checked={moc_config.use_cycle_count}
                                onChange={(e) => setMocConfig({ ...moc_config, use_cycle_count: e.target.checked })}
                                className="checkbox checkbox-primary"
                            />
                        </label>
                    </div>
                </div>

                {/* Turbulence Buff */}
                <div className="bg-base-200/20 rounded-lg p-4 border border-purple-500/20">
                    <div className="flex items-center space-x-2 mb-2">
                        <input
                            type="checkbox"
                            checked={moc_config.use_turbulence_buff}
                            onChange={(e) => setMocConfig({ ...moc_config, use_turbulence_buff: e.target.checked })}
                            className="checkbox checkbox-primary"
                        />
                        <span
                            onClick={() => setMocConfig({ ...moc_config, use_turbulence_buff: !moc_config.use_turbulence_buff })}
                            className="font-bold text-success cursor-pointer">
                            {transI18n("useTurbulenceBuff")}
                        </span>
                    </div>
                    {challengeSelected && challengeSelected?.Desc ? (
                        <div
                            className="text-base"
                            dangerouslySetInnerHTML={{
                                __html: replaceByParam(
                                    challengeSelected?.Desc || "",
                                    challengeSelected?.Param || []
                                )
                            }}
                        />
                    ) : (
                        <div className="text-base">{transI18n("noTurbulenceBuff")}</div>
                    )}
                </div>
            </div>

            {/* Enemy Waves */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* First Half */}
                <div className="rounded-xl p-4 mt-2 border border-warning">
                    <h2 className="text-2xl font-bold mb-6 text-info">{transI18n("firstHalfEnemies")}</h2>

                    {challengeSelected && challengeSelected?.EventIDList1?.length > 0 && challengeSelected?.EventIDList1[0].MonsterList.map((wave, waveIndex) => (
                        <div key={waveIndex} className="mb-6">
                            <h3 className="text-lg font-semibold mb-t">{transI18n("wave")} {waveIndex + 1}</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {Object.values(wave).map((waveValue, enemyIndex) => (
                                    <div
                                        key={enemyIndex}
                                        className="rounded-xl p-2 border border-white/10 shadow-md hover:border-white/20 hover:shadow-lg transition"
                                    >
                                        <div className="flex items-center space-x-3">
                                            <div className="relative w-20 h-20 rounded-full overflow-hidden flex-shrink-0 border border-white/10 shadow-sm">
                                                <Image
                                                    src={`https://api.hakush.in/hsr/UI/monstermiddleicon/${listMonster.find((monster) => monster.child.includes(waveValue))?.icon?.split("/")?.pop()?.replace(".png", "")}.webp`}
                                                    alt="Enemy Icon"
                                                    width={376}
                                                    height={512}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>

                                            <div className="flex flex-col">
                                                <div className="text-sm font-semibold">Lv. {challengeSelected?.EventIDList1[0].Level}</div>
                                                <div className="flex items-center space-x-1 mt-1">
                                                    {listMonster
                                                        .find((monster) => monster.child.includes(waveValue))
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
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Second Half */}
                <div className="rounded-xl p-4 mt-2 border border-warning">
                    <h2 className="text-2xl font-bold mb-6 text-info">{transI18n("secondHalfEnemies")}</h2>

                    {challengeSelected && challengeSelected?.EventIDList2?.length > 0 && challengeSelected?.EventIDList2[0].MonsterList.map((wave, waveIndex) => (
                        <div key={waveIndex} className="mb-6">
                            <h3 className="text-lg font-semibold mb-t">{transI18n("wave")} {waveIndex + 1}</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {Object.values(wave).map((waveValue, enemyIndex) => (
                                    <div
                                        key={enemyIndex}
                                        className="rounded-xl p-2 border border-white/10 shadow-md hover:border-white/20 hover:shadow-lg transition"
                                    >

                                        <div className="flex items-center space-x-3">
                                            <div className="relative w-20 h-20 rounded-full overflow-hidden flex-shrink-0 border border-white/10 shadow-sm">
                                                <Image
                                                    src={`https://api.hakush.in/hsr/UI/monstermiddleicon/${listMonster.find((monster) => monster.child.includes(waveValue))?.icon?.split("/")?.pop()?.replace(".png", "")}.webp`}
                                                    alt="Enemy Icon"
                                                    width={376}
                                                    height={512}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>

                                            <div className="flex flex-col">
                                                <div className="text-sm font-semibold">Lv. {challengeSelected?.EventIDList1[0].Level}</div>
                                                <div className="flex items-center space-x-1 mt-1">
                                                    {listMonster
                                                        .find((monster) => monster.child.includes(waveValue))
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
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}