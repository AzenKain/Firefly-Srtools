interface PrivacySettingInfo {
    displayCollection: boolean
    displayRecord: boolean
    displayRecordTeam: boolean
    displayOnlineStatus: boolean
    displayDiary: boolean
}

interface ChallengeInfo {
    // Thêm các field cụ thể nếu có
}

interface RecordInfo {
    achievementCount: number
    bookCount: number
    avatarCount: number
    equipmentCount: number
    musicCount: number
    relicCount: number
    challengeInfo: ChallengeInfo
    maxRogueChallengeScore: number
}


interface SubAffix {
    affixId: number
    cnt: number
    step?: number
}

interface FlatProp {
    type: string
    value: number
}

interface RelicFlat {
    props: FlatProp[]
    setName: string
    setID: number
}

interface Relic {
    mainAffixId: number
    subAffixList: SubAffix[]
    tid: number
    type: number
    level: number
    _flat: RelicFlat
}

interface SkillTree {
    pointId: number
    level: number
}

interface EquipmentFlat {
    props: FlatProp[]
    name: string
}

interface Equipment {
    rank: number
    tid: number
    promotion: number
    level: number
    _flat: EquipmentFlat
}

export interface AvatarEnkaDetail {
    relicList: Relic[]
    level: number
    promotion: number
    rank?: number
    skillTreeList: SkillTree[]
    equipment: Equipment
    avatarId: number
    _assist?: boolean
}

interface DetailInfo {
    worldLevel: number
    privacySettingInfo: PrivacySettingInfo
    headIcon: number
    signature: string
    avatarDetailList: AvatarEnkaDetail[]
    platform: string
    recordInfo: RecordInfo
    uid: number
    level: number
    nickname: string
    isDisplayAvatar: boolean
    friendCount: number
    personalCardId: number
}

export interface EnkaResponse {
    detailInfo: DetailInfo
    ttl: number
    uid: string
}
