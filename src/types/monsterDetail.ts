export interface MonsterChild {
    Id: number
    AttackModifyRatio: number
    DefenceModifyRatio: number
    EliteGroup: number
    HPModifyRatio: number
    SpeedModifyRatio: number
    SpeedModifyValue: number | null
    StanceModifyRatio: number
    HardLevelGroup: number
    StanceWeakList: string[]
}

export interface MonsterDetail {
    Rank: string
    AttackBase: number
    DefenceBase: number
    HPBase: number
    SpeedBase: number
    StanceBase: number
    StatusResistanceBase: number
    child: MonsterChild[]
}
