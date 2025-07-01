import { AvatarJson, AvatarStore, BattleConfigJson, BattleConfigStore, FreeSRJson, LightconeJson, RelicJson } from "@/types";
import useUserDataStore from "@/stores/userDataStore";

export function converterToFreeSRJson(avatars: Record<string, AvatarStore>, battle_config: BattleConfigStore): FreeSRJson {
    const lightcones: LightconeJson[] = []
    const relics: RelicJson[] = []
    const battleJson: BattleConfigJson = {
        battle_type: battle_config.battle_type,
        blessings: battle_config.blessings,
        custom_stats: battle_config.custom_stats,
        cycle_count: battle_config.cycle_count,
        stage_id: battle_config.stage_id,
        path_resonance_id: battle_config.path_resonance_id,
        monsters: battle_config.monsters,
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