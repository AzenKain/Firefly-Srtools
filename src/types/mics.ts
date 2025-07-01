export type AvatarDataStore = {
    rank: number,
    skills: { [key: string]: number }
}
export type LightconeStore = {
    level: number;
    item_id: number;
    rank: number;
    promotion: number;
}

export type SubAffixStore = {
    sub_affix_id: number;
    count: number;
    step: number;
}
export type RelicStore = {
    level: number;
    relic_id: number;
    relic_set_id: number;
    main_affix_id: number;
    sub_affixes: SubAffixStore[];
}

export type AvatarProfileStore = {
    profile_name: string,
    lightcone: LightconeStore | null,
    relics: Record<string, RelicStore>
}

export type AvatarStore = {
    owner_uid: number;
    avatar_id: number;
    data: AvatarDataStore;
    level: number;
    promotion: number;
    techniques: number[];
    sp_value: number;
    sp_max: number;
    can_change_sp: boolean;
    enhanced: string;
    profileSelect: number;
    profileList: AvatarProfileStore[]
}

export type MonsterStore = {
    monster_id: number;
    level: number;
    amount: number;
}

export type DynamicKeyStore = {
    key: string;
    value: number;
}

export type BattleBuffStore = {
    level: number;
    id: number;
    dynamic_key?: DynamicKeyStore;
}

export type BattleConfigStore = {
    battle_type: string;
    blessings: BattleBuffStore[]
    custom_stats: SubAffixStore[];
    cycle_count: number;
    stage_id: number;
    path_resonance_id: number;
    monsters: MonsterStore[][];
}
