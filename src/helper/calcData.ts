import { mapingStats } from "@/lib/constant"
import { AffixDetail } from "@/types"

export function calcPromotion(level: number) {
    if (level < 20) {
        return 0
    }
    if (level < 30) {
        return 1
    }
    if (level < 40) {
        return 2
    }
    if (level < 50) {
        return 3
    }
    if (level < 60) {
        return 4
    }
    if (level < 70) {
        return 5
    }
    return 6
}


export function calcRarity(rarity: string) {
    if (rarity.includes("5")) {
        return 5
    }
    if (rarity.includes("4")) {
        return 4
    }
    if (rarity.includes("3")) {
        return 3
    }
    return 1
}

export const calcAffixBonus = (affix: AffixDetail, stepCount: number, rollCount: number) => {
    const data = affix;
    if (!data) return 0;
    if (mapingStats?.[data.property].unit === "%") {
        return ((data.base * rollCount + data.step * stepCount) * 100).toFixed(1);
    }
    if (mapingStats?.[data.property].name === "SPD") {
        return (data.base * rollCount + data.step * stepCount).toFixed(1);
    }
    return (data.base * rollCount + data.step * stepCount).toFixed(0);
}