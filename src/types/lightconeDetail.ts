export interface LightConeDetail {
    Name: string;
    Desc: string;
    Rarity: string;
    BaseType: string;
    Refinements: RefinementDetail;
    Stats: StatEntryDetail[];
}

interface RefinementDetail {
    Name: string;
    Desc: string;
    Level: Record<string, {
        ParamList: number[];
    }>;
}

interface StatEntryDetail {
    EquipmentID: number;
    Promotion?: number;
    PromotionCostList: PromotionCost[];
    PlayerLevelRequire?: number;
    WorldLevelRequire?: number;
    MaxLevel: number;
    BaseHP: number;
    BaseHPAdd: number;
    BaseAttack: number;
    BaseAttackAdd: number;
    BaseDefence: number;
    BaseDefenceAdd: number;
}

interface PromotionCost {
    $type: string;
    ItemID: number;
    ItemNum: number;
    Rarity: string;
}
