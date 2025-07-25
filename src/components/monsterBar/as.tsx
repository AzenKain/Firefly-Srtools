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

export default function AsBar() {
    const { ASEvent, mapASInfo } = useEventStore()
    const { listMonster } = useMonsterStore()
    const { locale } = useLocaleStore()
    const {
        as_config,
        setAsConfig
    } = useUserDataStore()
    const { AS } = useMazeStore()

    const transI18n = useTranslations("DataPage")
    const challengeSelected = useMemo(() => {
        return mapASInfo[as_config.event_id.toString()]?.Level.find((as) => as.Id === as_config.challenge_id)
    }, [as_config, mapASInfo])

    const eventSelected = useMemo(() => {
        return mapASInfo[as_config.event_id.toString()]
    }, [as_config, mapASInfo])

    const buffList = useMemo(() => {
        const challenge = AS[as_config.event_id.toString()];
        if (!challenge) return { buffList: [], buffId: [] };

        if (as_config.floor_side === "Upper" || as_config.floor_side === "Upper -> Lower") {
            return {
                buffList: eventSelected?.BuffList1 ?? [],
                buffId: challenge.buff_1 ?? [],
            };
        }

        if (as_config.floor_side === "Lower" || as_config.floor_side === "Lower -> Upper") {
            return {
                buffList: eventSelected?.BuffList2 ?? [],
                buffId: challenge.buff_2 ?? [],
            };
        }
        return { buffList: [], buffId: [] };
    }, [AS, as_config.event_id, as_config.floor_side, eventSelected?.BuffList1, eventSelected?.BuffList2]);


    useEffect(() => {
        const challenge = mapASInfo[as_config.event_id.toString()]?.Level.find((as) => as.Id === as_config.challenge_id)
        if (as_config.event_id !== 0 && as_config.challenge_id !== 0 && challenge) {
            const newBattleConfig = cloneDeep(as_config)
            newBattleConfig.cycle_count = 4

            newBattleConfig.blessings = []
            if (as_config.buff_id !== 0) {
                newBattleConfig.blessings.push({
                    id: as_config.buff_id,
                    level: 1
                })
            }
            if (AS[as_config.challenge_id.toString()]) {
                newBattleConfig.blessings.push({
                    id: Number(AS[as_config.challenge_id.toString()].maze_buff),
                    level: 1
                })
            }

            newBattleConfig.monsters = []
            newBattleConfig.stage_id = 0
            if ((as_config.floor_side === "Upper" || as_config.floor_side === "Upper -> Lower") && challenge.EventIDList1.length > 0) {
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
            if ((as_config.floor_side === "Lower" || as_config.floor_side === "Lower -> Upper") && challenge.EventIDList2.length > 0) {
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
            if (as_config.floor_side === "Lower -> Upper" && challenge.EventIDList1.length > 0) {
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
            } else if (as_config.floor_side === "Upper -> Lower" && challenge.EventIDList2.length > 0) {
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
            setAsConfig(newBattleConfig)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        as_config.event_id,
        as_config.challenge_id,
        as_config.floor_side,
        as_config.buff_id,
        mapASInfo,
        AS,
    ])


    return (
        <div className="container mx-auto px-4 py-8 relative">

            {/* Title Card */}
            <div className="rounded-xl p-4 mb-2 border border-warning">
                <div className="mb-4 w-full">
                    <SelectCustomText
                        customSet={ASEvent.filter(as => as.lang.get(locale)).map((as) => ({
                            id: as.id,
                            name: getLocaleName(locale, as),
                            time: `${as.begin} - ${as.end}`,
                        }))}
                        excludeSet={[]}
                        selectedCustomSet={as_config.event_id.toString()}
                        placeholder={transI18n("selectASEvent")}
                        setSelectedCustomSet={(id) => setAsConfig({ ...as_config, event_id: Number(id), challenge_id: 0, buff_id: 0 })}
                    />
                </div>
                {/* Settings */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">

                    <div className="flex items-center gap-2">
                        <label className="label">
                            <span className="label-text font-bold text-success">{transI18n("floor")}:{" "}</span>
                        </label>
                        <select
                            value={as_config.challenge_id}
                            className="select select-success"
                            onChange={(e) => setAsConfig({ ...as_config, challenge_id: Number(e.target.value) })}
                        >
                            <option value={0} disabled={true}>{transI18n("selectFloor")}</option>
                            {mapASInfo[as_config.event_id.toString()]?.Level.map((as) => (
                                <option key={as.Id} value={as.Id}>{as.Id % 10}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex items-center gap-2">
                        <label className="label">
                            <span className="label-text font-bold text-success">{transI18n("side")}:{" "}</span>
                        </label>
                        <select
                            value={as_config.floor_side}
                            className="select select-success"
                            onChange={(e) => setAsConfig({ ...as_config, floor_side: e.target.value })}
                        >
                            <option value={0} disabled={true}>{transI18n("selectSide")}</option>
                            <option value="Upper">{transI18n("upper")}</option>
                            <option value="Lower">{transI18n("lower")}</option>
                            <option value="Upper -> Lower">{transI18n("upperToLower")}</option>
                            <option value="Lower -> Upper">{transI18n("lowerToUpper")}</option>
                        </select>
                    </div>
                </div>
                {eventSelected && (
                    <div className="mb-4 w-full">
                        <SelectCustomText
                            customSet={
                                Array.isArray(buffList?.buffList) && Array.isArray(buffList?.buffId)
                                    ? buffList.buffList.map((buff, index) => ({
                                        id: buffList.buffId?.[index]?.toString() || "",
                                        name: buff?.Name || "",
                                        description: replaceByParam(buff?.Desc || "", buff?.Param || []),
                                    }))
                                    : []
                            }
                            excludeSet={[]}
                            selectedCustomSet={as_config?.buff_id?.toString()}
                            placeholder={transI18n("selectBuff")}
                            setSelectedCustomSet={(id) => setAsConfig({ ...as_config, buff_id: Number(id) })}
                        />
                    </div>
                )}
                {/* Turbulence Buff */}
                <div className="bg-base-200/20 rounded-lg p-4 border border-purple-500/20">
                    <h2 className="text-2xl font-bold mb-2 text-info">{transI18n("turbulenceBuff")}</h2>
                    {eventSelected && eventSelected.Buff?.Name ? (
                        <div
                            className="text-base"
                            dangerouslySetInnerHTML={{
                                __html: replaceByParam(
                                    eventSelected.Buff?.Desc || "",
                                    eventSelected.Buff?.Param || []
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