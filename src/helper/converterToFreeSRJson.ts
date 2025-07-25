import { ASConfigStore, AvatarJson, AvatarStore, BattleConfigJson, CEConfigStore, FreeSRJson, LightconeJson, MOCConfigStore, PFConfigStore, RelicJson } from "@/types";


export function converterToFreeSRJson(
    avatars: Record<string, AvatarStore>,
    battle_type: string,
    moc_config: MOCConfigStore,
    pf_config: PFConfigStore,
    as_config: ASConfigStore,
    ce_config: CEConfigStore,
): FreeSRJson {
    const lightcones: LightconeJson[] = []
    const relics: RelicJson[] = []
    let battleJson: BattleConfigJson
    if (battle_type === "MOC") {
        battleJson = {
            battle_type: battle_type,
            blessings: moc_config.blessings,
            custom_stats: [],
            cycle_count: moc_config.cycle_count,
            stage_id: moc_config.stage_id,
            path_resonance_id: 0,
            monsters: moc_config.monsters,
        }
    } else if (battle_type === "PF") {
        battleJson = {
            battle_type: battle_type,
            blessings: pf_config.blessings,
            custom_stats: [],
            cycle_count: pf_config.cycle_count,
            stage_id: pf_config.stage_id,
            path_resonance_id: 0,
            monsters: pf_config.monsters,
        }
    } else if (battle_type === "AS") {
        battleJson = {
            battle_type: battle_type,
            blessings: as_config.blessings,
            custom_stats: [],
            cycle_count: as_config.cycle_count,
            stage_id: as_config.stage_id,
            path_resonance_id: 0,
            monsters: as_config.monsters,
        }
    } else if (battle_type === "CE") {
        battleJson = {
            battle_type: battle_type,
            blessings: ce_config.blessings,
            custom_stats: [],
            cycle_count: ce_config.cycle_count,
            stage_id: ce_config.stage_id,
            path_resonance_id: 0,
            monsters: ce_config.monsters,
        }
    } else {
        battleJson = {
            battle_type: battle_type,
            blessings: [],
            custom_stats: [],
            cycle_count: 0,
            stage_id: 0,
            path_resonance_id: 0,
            monsters: [],
        }
    }

    const avatarsJson: { [key: string]: AvatarJson } = {}
    let internalUidLightcone = 0
    let internalUidRelic = 0
    Object.entries(avatars).forEach(([avatarId, avatar]) => {
        avatarsJson[avatarId] = {
            owner_uid: avatar.owner_uid,
            avatar_id: avatar.avatar_id,
            data: avatar.data,
            level: avatar.level,
            promotion: avatar.promotion,
            techniques: avatar.techniques,
            sp_value: avatar.sp_value,
            sp_max: avatar.sp_max,
        }
        const currentProfile = avatar.profileList[avatar.profileSelect]
        if (currentProfile.lightcone && currentProfile.lightcone.item_id !== 0) {
            const newLightcone: LightconeJson = {
                level: currentProfile.lightcone.level,
                item_id: currentProfile.lightcone.item_id,
                rank: currentProfile.lightcone.rank,
                promotion: currentProfile.lightcone.promotion,
                internal_uid: internalUidLightcone,
                equip_avatar: avatar.avatar_id,
            }
            internalUidLightcone++
            lightcones.push(newLightcone)
        }

        if (currentProfile.relics) {
            ["1", "2", "3", "4", "5", "6"].forEach(slot => {
                const relic = currentProfile.relics[slot]
                if (relic && relic.relic_id !== 0) {
                    const newRelic: RelicJson = {
                        level: relic.level,
                        relic_id: relic.relic_id,
                        relic_set_id: relic.relic_set_id,
                        main_affix_id: relic.main_affix_id,
                        sub_affixes: relic.sub_affixes,
                        internal_uid: internalUidRelic,
                        equip_avatar: avatar.avatar_id,
                    }
                    internalUidRelic++
                    relics.push(newRelic)
                }
            })
        }

    })

    return {
        lightcones,
        relics,
        avatars: avatarsJson,
        battle_config: battleJson,
    }
}