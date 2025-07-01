export interface SubAffix {
    sub_affix_id: number;
    count: number;
    step: number;
}

export interface RelicJson {
    level: number;
    relic_id: number;
    relic_set_id: number;
    main_affix_id: number;
    sub_affixes: SubAffix[];
    internal_uid: number;
    equip_avatar: number;
}

export interface LightconeJson {
    level: number;
    item_id: number;
    equip_avatar: number;
    rank: number;
    promotion: number;
    internal_uid: number;
}
export interface AvatarData {
    rank: number,
    skills: { [key: string]: number }
}

export interface AvatarJson {
    owner_uid: number;
    avatar_id: number;
    data: AvatarData;
    level: number;
    promotion: number;
    techniques: number[];
    sp_value: number;
    sp_max: number;
}
export interface MonsterJson {
    monster_id: number;
    level: number;
    amount: number;
}

export interface DynamicKeyJson {
    key: string;
    value: number;
}

//BattleBuff
export interface BattleBuffJson {
    level: number;
    id: number;
    dynamic_key?: DynamicKeyJson;
}

export interface BattleConfigJson {
    battle_type: string;
    blessings: BattleBuffJson[]
    custom_stats: SubAffix[];
    cycle_count: number;
    stage_id: number;
    path_resonance_id: number;
    monsters: MonsterJson[][];
}

export interface FreeSRJson {
    lightcones: LightconeJson[];
    relics: RelicJson[];
    avatars: { [key: string]: AvatarJson };
    battle_config: BattleConfigJson;
}

export interface PSResponse {
    status: number;
    message: string;
}

