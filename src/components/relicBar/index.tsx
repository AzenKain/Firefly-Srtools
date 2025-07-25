"use client";
import useRelicStore from '@/stores/relicStore';
import useUserDataStore from '@/stores/userDataStore';
import { AffixDetail, RelicDetail } from '@/types';
import React, { useEffect, useMemo } from 'react';
import SelectCustomImage from '../select/customSelectImage';
import { calcAffixBonus, randomPartition, randomStep, replaceByParam } from '@/helper';
import useAffixStore from '@/stores/affixStore';
import { mapingStats } from '@/lib/constant';
import useAvatarStore from '@/stores/avatarStore';
import useModelStore from '@/stores/modelStore';
import useRelicMakerStore from '@/stores/relicMakerStore';
import { toast } from 'react-toastify';
import { useTranslations } from 'next-intl';
import cloneDeep from 'lodash/cloneDeep'

export default function RelicMaker() {
    const { avatars, setAvatars } = useUserDataStore()
    const { avatarSelected } = useAvatarStore()
    const { setIsOpenRelic } = useModelStore()
    const { mapRelicInfo } = useRelicStore()
    const { mapMainAffix, mapSubAffix} = useAffixStore()
    const transI18n = useTranslations("DataPage")
    const { 
        selectedRelicSlot, 
        selectedRelicSet, 
        selectedMainStat, 
        listSelectedSubStats,
        selectedRelicLevel,
        preSelectedSubStats,
        setSelectedRelicSet, 
        setSelectedMainStat, 
        setSelectedRelicLevel,
        setListSelectedSubStats,
        resetHistory,
        popHistory,
        addHistory, 
    } = useRelicMakerStore()

    const relicSets = useMemo(() => {
        const listSet: Record<string, RelicDetail> = {};
        for (const [key, value] of Object.entries(mapRelicInfo || {})) {
            let isOk = false;
            for (const key2 of Object.keys(value.Parts)) {
                if (key2.endsWith(selectedRelicSlot)) {
                    isOk = true;
                    break;
                }
            }
            if (isOk) {
                listSet[key] = value;
            }
        }
        return listSet;
    }, [mapRelicInfo, selectedRelicSlot]);

    const subAffixOptions = useMemo(() => {
        const listSet: Record<string, AffixDetail> = {};
        const subAffixMap = mapSubAffix["5"];
        const mainAffixMap = mapMainAffix["5" + selectedRelicSlot]
     
        if (Object.keys(subAffixMap || {}).length === 0 || Object.keys(mainAffixMap || {}).length === 0) return listSet;
        
        for (const [key, value] of Object.entries(subAffixMap)) {
            if (value.property !== mainAffixMap[selectedMainStat]?.property) {
                listSet[key] = value;
            }
        }
        return listSet;
    }, [mapSubAffix, mapMainAffix, selectedRelicSlot, selectedMainStat]);

    useEffect(() => {
        const subAffixMap = mapSubAffix["5"];
        const mainAffixMap = mapMainAffix["5" + selectedRelicSlot];
    
        if (!subAffixMap || !mainAffixMap) return;
    
        const mainProp = mainAffixMap[selectedMainStat]?.property;
        if (!mainProp) return;
    
        const newSubAffixes = cloneDeep(listSelectedSubStats);
        let updated = false;
    
        for (let i = 0; i < newSubAffixes.length; i++) {
            if (newSubAffixes[i].property === mainProp) {
                newSubAffixes[i].affixId = "";
                newSubAffixes[i].property = "";
                newSubAffixes[i].rollCount = 0;
                newSubAffixes[i].stepCount = 0;
                updated = true;
            }
        }
    
        if (updated) setListSelectedSubStats(newSubAffixes);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedMainStat, mapSubAffix, mapMainAffix, selectedRelicSlot]);

    const exSubAffixOptions = useMemo(() => {
        const listSet: Record<string, AffixDetail> = {};
        const subAffixMap = mapSubAffix["5"];
        const mainAffixMap = mapMainAffix["5" + selectedRelicSlot];

        if (!subAffixMap || !mainAffixMap) return listSet;

        for (const [key, value] of Object.entries(subAffixMap)) {
            const subAffix = listSelectedSubStats.find((item) => item.property === value.property);
            if (subAffix && value.property !== mainAffixMap[selectedMainStat]?.property) {
                listSet[key] = value;
            }
        }
        return listSet;
    }, [mapSubAffix, listSelectedSubStats, mapMainAffix, selectedRelicSlot, selectedMainStat]);

    const effectBonus = useMemo(() => {
        const affixSet = mapMainAffix?.["5" + selectedRelicSlot];
        if (!affixSet) return 0;

        const data = affixSet[selectedMainStat];
        if (!data) return 0;

        const stat = mapingStats?.[data.property];
        if (!stat) return 0;

        const value = data.base + data.step * selectedRelicLevel;

        if (stat.unit === "%") {
            return (value * 100).toFixed(1) + "%";
        }

        return value.toFixed(0) + stat.unit;
    }, [mapMainAffix, selectedRelicSlot, selectedMainStat, selectedRelicLevel]);
    
    const handleSubStatChange = (key: string, index: number, rollCount: number, stepCount: number) => {
        const newSubAffixes = cloneDeep(listSelectedSubStats);
        if (!subAffixOptions[key]) {
            newSubAffixes[index].affixId = "";
            newSubAffixes[index].property = "";
            newSubAffixes[index].rollCount = rollCount;
            newSubAffixes[index].stepCount = stepCount;
            setListSelectedSubStats(newSubAffixes);
            addHistory(index, newSubAffixes[index]);
            return;
        }
        newSubAffixes[index].affixId = key;
        newSubAffixes[index].property = subAffixOptions[key].property;
        newSubAffixes[index].rollCount = rollCount;
        newSubAffixes[index].stepCount = stepCount;
        setListSelectedSubStats(newSubAffixes);
        addHistory(index, newSubAffixes[index]);
    };

    const handlerRollback = (index: number) => {
        if (!preSelectedSubStats[index]) return;

        const keys = Object.keys(preSelectedSubStats[index]);
        if (keys.length <= 1) return;

        const newSubAffixes = cloneDeep(listSelectedSubStats);
        const listHistory = cloneDeep(preSelectedSubStats[index]);
        const secondLastKey = listHistory.length - 2;
        const preSubAffixes = { ...listHistory[secondLastKey] };
        newSubAffixes[index].rollCount = preSubAffixes.rollCount;
        newSubAffixes[index].stepCount = preSubAffixes.stepCount;
        setListSelectedSubStats(newSubAffixes);
        popHistory(index);
      };

    const resetSubStat = (index: number) => {
        const newSubAffixes = cloneDeep(listSelectedSubStats);
        resetHistory(index);
        newSubAffixes[index].affixId = "";
        newSubAffixes[index].property = "";
        newSubAffixes[index].rollCount = 0;
        newSubAffixes[index].stepCount = 0;
        setListSelectedSubStats(newSubAffixes);
    };

    const randomizeStats = () => {
        const newSubAffixes = cloneDeep(listSelectedSubStats);
        const exKeys = Object.keys(exSubAffixOptions);
        for (let i = 0; i < newSubAffixes.length; i++) {
            const keys = Object.keys(subAffixOptions).filter((key) => !exKeys.includes(key));
            const randomKey = keys[Math.floor(Math.random() * keys.length )];
            exKeys.push(randomKey);
            const randomValue = subAffixOptions[randomKey];
            newSubAffixes[i].affixId = randomKey;
            newSubAffixes[i].property = randomValue.property;
            newSubAffixes[i].rollCount = 0;
            newSubAffixes[i].stepCount = 0;
        }
        for (let i = 0; i < newSubAffixes.length; i++) {
            addHistory(i, newSubAffixes[i]);
        }
        setListSelectedSubStats(newSubAffixes);

    };

    const randomizeRolls = () => {
        const newSubAffixes = cloneDeep(listSelectedSubStats);
        const randomRolls = randomPartition(9, listSelectedSubStats.length);
        for (let i = 0; i < listSelectedSubStats.length; i++) {
            newSubAffixes[i].rollCount = randomRolls[i];
            newSubAffixes[i].stepCount = randomStep(randomRolls[i]);
        }
        setListSelectedSubStats(newSubAffixes);
        for (let i = 0; i < newSubAffixes.length; i++) {
            addHistory(i, newSubAffixes[i]);
        }
    };

    const handlerSaveRelic = () => {
        const avatar = avatars[avatarSelected?.id || ""];
        if (!selectedRelicSet || !selectedMainStat || !selectedRelicLevel || !selectedRelicSlot) {
            toast.error(transI18n("pleaseSelectAllOptions"));
            return;
        };
        if (avatar) {
            avatar.profileList[avatar.profileSelect].relics[selectedRelicSlot] = {
                level: selectedRelicLevel,
                relic_id: Number(`6${selectedRelicSet}${selectedRelicSlot}`),
                relic_set_id: Number(selectedRelicSet),
                main_affix_id: Number(selectedMainStat),
                sub_affixes: listSelectedSubStats.map((item) => {
                    return {
                        sub_affix_id: Number(item.affixId),
                        count: item.rollCount,
                        step: item.stepCount
                    }
                })
            }
        }
        setAvatars({ ...avatars });
        setIsOpenRelic(false);
        toast.success(transI18n("relicSavedSuccessfully"));
    }

    return (
        <div className="">
            <div className="border-b border-purple-500/30 px-6 py-4 mb-4">
                <h3 className="font-bold text-2xl text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-cyan-400">
                    {transI18n("relicMaker")}
                </h3>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">

                {/* Left Panel */}
                <div className="space-y-6">

                    {/* Set Configuration */}
                    <div className="bg-base-100 rounded-xl p-6 border border-slate-700">
                        <h2 className="text-xl font-bold mb-6 text-warning">{transI18n("mainSettings")}</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            {/* Main Stat */}
                            <div>
                                <label className="block text-lg font-medium mb-2">{transI18n("mainStat")}</label>
                                <SelectCustomImage
                                    customSet={Object.entries(mapMainAffix["5" + selectedRelicSlot] || {}).map(([key, value]) => ({
                                        value: key,
                                        label: mapingStats[value.property].name + " " + mapingStats[value.property].unit,
                                        imageUrl: mapingStats[value.property].icon
                                    }))}
                                    excludeSet={[]}
                                    selectedCustomSet={selectedMainStat}
                                    placeholder={transI18n("selectAMainStat")}
                                    setSelectedCustomSet={setSelectedMainStat}
                                />
                            </div>
                            {/* Relic Set Selection */}
                            <div>
                                <label className="block text-lg font-medium mb-2">{transI18n("set")}</label>
                                <SelectCustomImage
                                    customSet={Object.entries(relicSets).map(([key, value]) => ({
                                        value: key,
                                        label: value.Name,
                                        imageUrl: `https://api.hakush.in/hsr/UI/itemfigures/${value.Icon.match(/\d+/)?.[0]}.webp`
                                    }))}
                                    excludeSet={[]}
                                    selectedCustomSet={selectedRelicSet}
                                    placeholder={transI18n("selectASet")}
                                    setSelectedCustomSet={setSelectedRelicSet}
                                />
                            </div>
                        </div>

                        {/* Set Bonus Display */}
                        <div className="mb-6 py-4 bg-base-100 rounded-lg">
                            {selectedRelicSet !== "" ? Object.entries(mapRelicInfo[selectedRelicSet].RequireNum).map(([key, value]) => (
                                <div key={key} className="text-blue-300 text-sm mb-1">
                                    <span className="text-info font-bold">{key}-Pc:
                                        <div
                                            className="text-warning leading-relaxed font-bold"
                                            dangerouslySetInnerHTML={{
                                                __html: replaceByParam(
                                                    value.Desc,
                                                    value.ParamList || []
                                                )
                                            }}
                                        /> </span>
                                </div>
                            )) : <p className="text-blue-300 text-sm font-bold mb-1">{transI18n("pleaseSelectASet")}</p>}
                        </div>


                        {/* Rarity */}
                        <div className="grid grid-cols-2 items-center gap-4 mb-6">
                            <label className="block text-lg font-medium mb-2">{transI18n("rarity")}: {5} ⭐</label>
                            <label className="block text-lg font-medium mb-2">{transI18n("effectBonus")}: <span className="text-warning font-bold">{effectBonus}</span></label>
                        </div>

                        {/* Level */}
                        <div className="mb-6">
                            <label className="block text-lg font-medium mb-2">{transI18n("level")}</label>
                            <div className="bg-base-200 rounded-lg p-4">
                                <input
                                    type="range"
                                    min="0"
                                    max="15"
                                    value={selectedRelicLevel}
                                    onChange={(e) => setSelectedRelicLevel(parseInt(e.target.value))}
                                    className="range range-primary w-full"
                                />
                                <div className="text-center text-2xl font-bold mt-2">{selectedRelicLevel}</div>
                            </div>
                        </div>

                        {/* Save Button */}
                        <button onClick={handlerSaveRelic} className="btn btn-success w-full">
                            {transI18n("save")}
                        </button>
                    </div>
                </div>

                {/* Right Panel - Sub Stats */}
                <div className="space-y-4">
                    {/* Total Roll */}
                    <div className="bg-base-100 rounded-xl p-6 border border-slate-700 z-[1]">
                        <h3 className="text-lg font-bold mb-4">{transI18n("totalRoll")} {listSelectedSubStats.reduce((a, b) => a + b.rollCount, 0)}</h3>

                        <div className="grid grid-cols-2 gap-4">
                            <button
                                className="btn btn-outline btn-success"
                                onClick={randomizeStats}
                            >
                                {transI18n("randomizeStats")}
                            </button>
                            <button
                                className="btn btn-outline btn-success"
                                onClick={randomizeRolls}
                            >
                                {transI18n("randomizeRolls")}
                            </button>
                        </div>
                    </div>
                    {listSelectedSubStats.map((v, index) => (
                        <div key={index} className={`bg-base-100 rounded-xl p-4 border border-slate-700`}>
                            <div className="grid grid-cols-12 gap-2 items-center">

                                {/* Stat Selection */}
                                <div className="col-span-8">
                                    <SelectCustomImage
                                        customSet={Object.entries(subAffixOptions).map(([key, value]) => ({
                                            value: key,
                                            label: mapingStats[value.property].name + " " + mapingStats[value.property].unit,
                                            imageUrl: mapingStats[value.property].icon
                                        }))}
                                        excludeSet={Object.entries(exSubAffixOptions).map(([key, value]) => ({
                                            value: key,
                                            label: mapingStats[value.property].name + " " + mapingStats[value.property].unit,
                                            imageUrl: mapingStats[value.property].icon
                                        }))}
                                        selectedCustomSet={v.affixId}
                                        placeholder={transI18n("selectASubStat")}
                                        setSelectedCustomSet={(key) => handleSubStatChange(key, index, 0, 0)}
                                    />
                                </div>

                                {/* Current Value */}
                                <div className="col-span-4 text-center flex items-center justify-center gap-2">
                                    <span className="text-2xl font-mono">+{ }</span>
                                    <div className="text-xl font-bold text-info">{calcAffixBonus(subAffixOptions[v.affixId], v.stepCount, v.rollCount)}{mapingStats?.[subAffixOptions[v.affixId]?.property]?.unit || ""}</div>
                                </div>

                                {/* Roll Values */}
                                <div className="col-span-12 grid grid-cols-3 gap-1">
                                    <button
                                    onClick={() => handleSubStatChange(v.affixId, index, v.rollCount + 1, v.stepCount + 0)}
                                        className="btn btn-sm bg-white text-slate-800 hover:bg-gray-200 border-0"
                                    >
                                        {calcAffixBonus(subAffixOptions[v.affixId], 0 , v.rollCount + 1)}{mapingStats?.[subAffixOptions[v.affixId]?.property]?.unit || ""}
                                    </button>
                                    <button
                                    onClick={() => handleSubStatChange(v.affixId, index, v.rollCount + 1, v.stepCount + 1)}
                                        className="btn btn-sm bg-white text-slate-800 hover:bg-gray-200 border-0"
                                    >
                                        {calcAffixBonus(subAffixOptions[v.affixId], v.stepCount + 1, v.rollCount + 1)}{mapingStats?.[subAffixOptions[v.affixId]?.property]?.unit || ""}
                                    </button>
                                    <button
                                    onClick={() => handleSubStatChange(v.affixId, index, v.rollCount + 1, v.stepCount + 2)}
                                        className="btn btn-sm bg-white text-slate-800 hover:bg-gray-200 border-0"
                                    >
                                        {calcAffixBonus(subAffixOptions[v.affixId], v.stepCount + 2, v.rollCount + 1)}{mapingStats?.[subAffixOptions[v.affixId]?.property]?.unit || ""}
                                    </button>
                                </div>

                                {/* Reset Button & Roll Info */}
                                <div className="col-span-12 text-center">
                                    <div className="grid grid-cols-2 gap-1 items-center justify-items-start">
                                        <div className="flex items-center gap-2">
                                            <button
                                                className="btn btn-error btn-sm mb-1"
                                                onClick={() => resetSubStat(index)}
                                            >
                                                {transI18n("reset")}
                                            </button>
                                            <button
                                                className="btn btn-warning btn-sm mb-1"
                                                onClick={() => handlerRollback(index)}
                                            >
                                                -
                                            </button>
                                        </div>

                                        <div className="text-lg flex items-center gap-2 text-gray-400">
                                            <span className="font-bold">{transI18n("roll")}: <span className="text-info">{v.rollCount}</span></span>
                                            <span className="font-bold">{transI18n("step")}: <span className="text-info">{v.stepCount}</span></span>
                                        </div>
                                    </div>

                                </div>

                            </div>
                        </div>
                    ))}


                </div>
            </div>
        </div>
    );
};
