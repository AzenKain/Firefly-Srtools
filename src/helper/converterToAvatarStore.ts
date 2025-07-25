import { AvatarEnkaDetail, AvatarProfileStore, AvatarStore, CharacterDetail, FreeSRJson, RelicStore } from "@/types";

function safeNumber(val: string | number | null, fallback = 0): number {
    if (!val) return fallback;
    const num = Number(val);
    return Number.isFinite(num) && num !== 0 ? num : fallback;
}

export function converterToAvatarStore(data: Record<string, CharacterDetail>): { [key: string]: AvatarStore } {
    return Object.fromEntries(
        Object.entries(data).map(([key, value]) => [
            key,
            {
                owner_uid: 0,
                avatar_id: Number(key),
                data: {
                    rank: 0,
                    skills: Object.values(value.SkillTrees).reduce((acc, dataPointEntry) => {
                        const firstEntry = Object.values(dataPointEntry)[0];
                        if (firstEntry) {
                            acc[firstEntry.PointID] = firstEntry.MaxLevel;
                        }
                        return acc;
                    }, {} as Record<string, number>)
                },
                level: 80,
                promotion: 6,
                techniques: [],
                sp_max: safeNumber(value.SPNeed, 100),
                can_change_sp: safeNumber(value.SPNeed) !== 0,
                sp_value: Math.ceil(safeNumber(value.SPNeed) / 2),
                profileSelect: 0,
                enhanced: "",
                profileList: [{
                    profile_name: "Default",
                    lightcone: null,
                    relics: {} as Record<string, RelicStore>
                } as AvatarProfileStore]
            }
        ])
    ) as { [key: string]: AvatarStore }
}

export function converterOneEnkaDataToAvatarStore(data: AvatarEnkaDetail, count: number): AvatarProfileStore | null  {
    if (!data.equipment && (!data.relicList || data.relicList.length === 0)) return null
    const profile: AvatarProfileStore = {
        profile_name: `Enka Profile ${count}`,
        lightcone: {
            level: data.equipment.level,
            item_id: data.equipment.tid,
            rank: data.equipment.rank,
            promotion: data.equipment.promotion,
        },
        relics: Object.fromEntries(data.relicList.map((relic) => [relic.tid.toString()[relic.tid.toString().length - 1], {
            level: relic.level,
            relic_id: relic.tid,
            relic_set_id: parseInt(relic.tid.toString().slice(1, -1), 10),
            main_affix_id: relic.mainAffixId,
            sub_affixes: relic.subAffixList.map((subAffix) => ({
                sub_affix_id: subAffix.affixId,
                count: subAffix.cnt,
                step: subAffix.step ?? 0
            }))
        }]))
    }
    return profile
}


export function converterOneFreeSRDataToAvatarStore(data: FreeSRJson, count: number , avatar_id: number): AvatarProfileStore | null  {
    const lightcone = data.lightcones.find((lightcone) => lightcone.equip_avatar === avatar_id)
    const relics = data.relics.filter((relic) => relic.equip_avatar === avatar_id)
    if (!lightcone && (!relics || relics.length === 0)) return null
    const relicsMap = {} as Record<string, RelicStore>

    relics.forEach((relic) => {
        relicsMap[relic.relic_id.toString()[relic.relic_id.toString().length - 1]] = {
            level: relic.level,
            relic_id: relic.relic_id,
            relic_set_id: relic.relic_set_id,
            main_affix_id: relic.main_affix_id,
            sub_affixes: relic.sub_affixes.map((subAffix) => ({
                sub_affix_id: subAffix.sub_affix_id,
                count: subAffix.count,
                step: subAffix.step ?? 0
            }))
        }
    })

    const profile: AvatarProfileStore = {
        profile_name: `FreeSR Profile ${count}`,
        lightcone: {
            level: lightcone?.level ?? 0,
            item_id: lightcone?.item_id ?? 0,
            rank: lightcone?.rank ?? 0,
            promotion: lightcone?.promotion ?? 0,
        },
        relics: relicsMap
    }
    return profile
}
