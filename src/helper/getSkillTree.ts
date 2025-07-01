import useAvatarStore from "@/stores/avatarStore"
import useUserDataStore from "@/stores/userDataStore"

export function getSkillTree(enhanced: string) {
    const { avatarSelected, mapAvatarInfo } = useAvatarStore.getState()

    if (!avatarSelected) return null;
    if (enhanced != "") return Object.entries(mapAvatarInfo[avatarSelected.id || ""]?.Enhanced[enhanced].SkillTrees || {}).reduce((acc, [pointName, dataPointEntry]) => {
        const firstEntry = Object.values(dataPointEntry)[0];
        if (firstEntry) {
            acc[firstEntry.PointID] = firstEntry.MaxLevel;
        }
        return acc;
    }, {} as Record<string, number>)

    return Object.entries(mapAvatarInfo[avatarSelected.id || ""]?.SkillTrees).reduce((acc, [pointName, dataPointEntry]) => {
        const firstEntry = Object.values(dataPointEntry)[0];
        if (firstEntry) {
            acc[firstEntry.PointID] = firstEntry.MaxLevel;
        }
        return acc;
    }, {} as Record<string, number>);
}
