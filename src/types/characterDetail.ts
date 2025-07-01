export interface CharacterDetail {
    Name: string;
    Desc: string;
    CharaInfo: CharacterInfo;
    Rarity: string;
    AvatarVOTag: string;
    SPNeed: number | null;
    BaseType: string;
    DamageType: string;
    Ranks: Record<string, RankType>;
    Skills: Record<string, SkillType>;
    SkillTrees: Record<string, Record<string, SkillTreePoint>>;
    Memosprite: Memosprite;
    Unique: Record<string, UniqueAbility>;
    Stats: Record<string, Stat>;
    Relics: Relics;
    Enhanced: Record<string, EnhancedType>;
}

export interface EnhancedType {
    Descs: string[];
    ChangeRankList: any;
    ChangeSkillTreeList: any;
    Ranks: Record<string, RankType>;
    Skills: Record<string, SkillType>;
    SkillTrees: Record<string, Record<string, SkillTreePoint>>;
}

export interface CharacterInfo {
    Camp: string | null;
    VA: VoiceActors;
    Stories: Record<string, string | null>;
    Voicelines: string[];
}

export interface VoiceActors {
    Chinese: string | null;
    Japanese: string | null;
    Korean: string | null;
    English: string | null;
}

export interface RankType {
    Id: number;
    Name: string;
    Desc: string;
    ParamList: number[];
}

export interface SkillType {
    Id: number;
    Name: string;
    Desc: string;
    Type: string;
    Tag: string;
    SPBase: number | null;
    BPNeed: number;
    BPAdd: number;
    ShowStanceList: number[];
    SkillComboValueDelta: number | null;
    Level: Record<string, LevelParams>;
}

export interface LevelParams {
    Level: number;
    ParamList: number[];
}

export interface SkillTreePoint {
    Anchor: string;
    AvatarPromotionLimit: number | null;
    AvatarLevelLimit: number | null;
    DefaultUnlock: boolean;
    Icon: string;
    LevelUpSkillID: number[];
    MaterialList: ItemConfigRow[];
    MaxLevel: number;
    ParamList: any[];
    PointID: number;
    PointName: string | null;
    PointDesc: string | null;
    PointTriggerKey: number;
    PointType: number;
    PrePoint: string[];
    StatusAddList: any[];
}

export interface ItemConfigRow {
    $type: string;
    ItemID: number;
    ItemNum: number;
    Rarity: string;
}

export interface Memosprite {
    Name: string;
    Icon: string;
    HPBase: string;
    HPInherit: string;
    HPSkill: number | null;
    SpeedBase: string;
    SpeedInherit: string;
    SpeedSkill: number;
    Aggro: number;
    Skills: Record<string, SpriteSkill>;
    Talent: Record<string, any>;
}

export interface SpriteSkill {
    Name: string;
    Desc: string | null;
    Type: string | null;
    Tag: string;
    SPBase: number | null;
    BPNeed: number;
    BPAdd: number | null;
    ShowStanceList: number[];
    SkillComboValueDelta: number | null;
    Level: Record<string, LevelParams>;
}

export interface UniqueAbility {
    Tag: string;
    Name: string;
    Desc: string;
    Param: number[];
}

export interface Stat {
    AttackBase: number;
    AttackAdd: number;
    DefenceBase: number;
    DefenceAdd: number;
    HPBase: number;
    HPAdd: number;
    SpeedBase: number;
    CriticalChance: number;
    CriticalDamage: number;
    BaseAggro: number;
    Cost: ItemConfigRow[];
}

export interface Relics {
    AvatarID: number;
    Set4IDList: number[];
    Set2IDList: number[];
    PropertyList3: string[];
    PropertyList4: string[];
    PropertyList5: string[];
    PropertyList6: string[];
    PropertyList: RelicRecommendProperty[];
    SubAffixPropertyList: string[];
    ScoreRankList: number[];
}

export interface RelicRecommendProperty {
    $type: string;
    RelicType: string;
    PropertyType: string;
}
