
import useUserDataStore from "@/stores/userDataStore";
import useAvatarStore from "@/stores/avatarStore";
import { CharacterDetail } from "@/types";

export function getAvatarNotExist(): Record<string, CharacterDetail> {
    const { avatars } = useUserDataStore.getState()
    const { mapAvatarInfo } = useAvatarStore.getState()
    const listAvatarId = Object.keys(avatars)
    const listAvatarNotExist = Object.keys(mapAvatarInfo).filter((avatarId) => !listAvatarId.includes(avatarId))
    return listAvatarNotExist.reduce((acc, avatarId) => {
        acc[avatarId] = mapAvatarInfo[avatarId]
        return acc
    }, {} as Record<string, CharacterDetail>)
}
