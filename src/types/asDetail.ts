import { ChallengeDetail, EventStageDetail } from "./mocDetail"
import { BuffDetail, OptionDetail } from "./pfDetail"

export interface ASDetail {
    Id: number
    Name: string
    Buff: BuffDetail
    BuffList1: OptionDetail[]
    BuffList2: OptionDetail[]
    BeginTime: string
    EndTime: string
    Level: ASLevel[]
}

export interface ASLevel {
    Id: number
    Name: string
    Challenge: ChallengeDetail[]
    DamageType1: string[]
    DamageType2: string[]
    MazeGroupID1: number
    MazeGroupID2: number
    BossMonsterID1: number
    BossMonsterID2: number
    BossMonsterID1SkillList: number[]
    BossMonsterID2SkillList: number[]
    BossMonsterConfig1: BossMonsterConfig
    BossMonsterConfig2: BossMonsterConfig
    EventIDList1: EventStageDetail[]
    EventIDList2: EventStageDetail[]
}

export interface BossMonsterConfig {
    Difficulty: number
    DifficultyList: number[]
    TagList: BossTag[]
    DifficultyGuideList: BossDifficultyGuide[]
    TextGuideList: string[]
    PhaseList: BossPhase[]
}

export interface BossTag {
    Name: string
    Desc: string
    Param: number[]
    SkillID: number | null
    ParamFix: number[]
    Child: BossChildTag[]
}

export interface BossChildTag {
    Name: string
    Desc: string
    Param: number[]
}

export interface BossDifficultyGuide {
    Desc: string
    Param: number[]
    SkillID: number | null
    ParamFix: number[]
}

export interface BossPhase {
    Name: string
    Desc: string
    Answer: string
    Difficulty: number
    SkillList: number[]
}