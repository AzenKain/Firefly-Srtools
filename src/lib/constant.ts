export const listCurrentLanguage = {
    ja: "JP",
    ko: "KR",
    en: "US",
    vi: "VN",
    zh: "CN"
};

export const listCurrentLanguageApi : Record<string, string> = {
    ja: "jp",
    ko: "kr",
    en: "en",
    vi: "en",
    zh: "cn"
};

export const mapingStats = <Record<string, {name: string, icon: string, unit: string}> > {
    "HPDelta": {
        name:"HP",
        icon:"/icon/hp.webp",
        unit: ""
    },
    "AttackDelta": {
        name:"ATK",
        icon:"/icon/attack.webp",
        unit: ""
    },
    "HPAddedRatio": {
        name:"HP",
        icon:"/icon/hp.webp",
        unit: "%"
    },
    "AttackAddedRatio": {
        name:"ATK",
        icon:"/icon/attack.webp",
        unit: "%"
    },
    "DefenceDelta": {
        name:"DEF",
        icon:"/icon/defence.webp",
        unit: ""
    },
    "DefenceAddedRatio": {
        name:"DEF",
        icon:"/icon/defence.webp",
        unit: "%"
    },
    "SPDDelta": {
        name:"SPD",
        icon:"/icon/spd.webp",
        unit: ""
    },
    "CriticalChanceBase": {
        name:"CRIT Rate",
        icon:"/icon/crit-rate.webp",
        unit: "%"
    },
    "CriticalDamageBase": {
        name:"CRIT DMG",
        icon:"/icon/crit-damage.webp",
        unit: "%"
    },
    "HealRatioBase": {
        name:"Outgoing Healing Boost",
        icon:"/icon/healing-boost.webp",
        unit: "%"
    },
    "StatusProbabilityBase": {
        name:"Effect Hit Rate",
        icon:"/icon/effect-hit-rate.webp",
        unit: "%"
    },
    "StatusResistanceBase": {
        name:"Effect RES",
        icon:"/icon/effect-res.webp",
        unit: "%"
    },
    "BreakDamageAddedRatioBase": {
        name:"Break Effect",
        icon:"/icon/break-effect.webp",
        unit: "%"
    },
    "SpeedDelta": {
        name:"SPD",
        icon:"/icon/speed.webp",
        unit: ""
    },
    "PhysicalAddedRatio": {
        name:"Physical DMG Boost",
        icon:"/icon/physical.webp",
        unit: "%"
    },
    "FireAddedRatio": {
        name:"Fire DMG Boost",
        icon:"/icon/fire.webp",
        unit: "%"
    },
    "IceAddedRatio": {
        name:"Ice DMG Boost",
        icon:"/icon/ice.webp",
        unit: "%"
    },
    "ThunderAddedRatio": {
        name:"Thunder DMG Boost",
        icon:"/icon/thunder.webp",
        unit: "%"
    },
    "WindAddedRatio": {
        name:"Wind DMG Boost",
        icon:"/icon/wind.webp",
        unit: "%"
    },
    "QuantumAddedRatio": {
        name:"Quantum DMG Boost",
        icon:"/icon/quantum.webp",
        unit: "%"
    },
    "ImaginaryAddedRatio": {
        name:"Imaginary DMG Boost",
        icon:"/icon/imaginary.webp",
        unit: "%"
    },
    "SPRatioBase": {
        name:"Energy Regeneration Rate",
        icon:"/icon/energy-rate.webp",
        unit: "%"
    }
}