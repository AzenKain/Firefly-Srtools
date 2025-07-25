import { ChallengeDetail, EventStageDetail } from "./mocDetail"

export interface PFDetail {
    Id: number
    Name: string
    Buff: BuffDetail
    Option: OptionDetail[]
    SubOption: OptionDetail[]
    BeginTime: string
    EndTime: string
    Level: PFLevel[]
}

export interface BuffDetail {
    Name: string | null
    Desc: string | null
    Param: number[]
}

export interface OptionDetail {
    Name: string
    Desc: string
    Param: number[]
}

export interface PFLevel {
    Id: number
    Name: string
    Challenge: ChallengeDetail[]
    DamageType1: string[]
    DamageType2: string[]
    MazeGroupID1: number
    MazeGroupID2: number
    NpcMonsterIDList1: number[]
    NpcMonsterIDList2: number[]
    EventIDList1: EventStageDetail[]
    EventIDList2: EventStageDetail[]
    InfiniteList1: Record<string, InfiniteWave>
    InfiniteList2: Record<string, InfiniteWave>
}

export interface InfiniteWave {
    InfiniteWaveID: number
    MonsterGroupIDList: number[]
    MaxMonsterCount: number
    MaxTeammateCount: number
    Ability: string
    ParamList: number[]
    ClearPreviousAbility: boolean
    EliteGroup: number
}
