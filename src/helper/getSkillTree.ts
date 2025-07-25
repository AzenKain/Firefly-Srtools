import useAvatarStore from "@/stores/avatarStore"

export function getSkillTree(enhanced: string) {
    const { avatarSelected, mapAvatarInfo } = useAvatarStore.getState()

    if (!avatarSelected) return null;
    if (enhanced != "") return Object.values(mapAvatarInfo[avatarSelected.id || ""]?.Enhanced[enhanced].SkillTrees || {}).reduce((acc, dataPointEntry) => {
        const firstEntry = Object.values(dataPointEntry)[0];
        if (firstEntry) {
            acc[firstEntry.PointID] = firstEntry.MaxLevel;
        }
        return acc;
    }, {} as Record<string, number>)

    return Object.values(mapAvatarInfo[avatarSelected.id || ""]?.SkillTrees).reduce((acc, dataPointEntry) => {
        const firstEntry = Object.values(dataPointEntry)[0];
        if (firstEntry) {
            acc[firstEntry.PointID] = firstEntry.MaxLevel;
        }
        return acc;
    }, {} as Record<string, number>);
}
