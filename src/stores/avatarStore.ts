import { CharacterBasic, CharacterDetail, FilterAvatarType } from '@/types';
import { create } from 'zustand'


interface AvatarState {
    listAvatar: CharacterBasic[];
    listRawAvatar: CharacterBasic[];
    filter: FilterAvatarType;
    avatarSelected: CharacterBasic | null;
    mapAvatarInfo: Record<string, CharacterDetail>;
    setListAvatar: (newListAvatar: CharacterBasic[]) => void;
    setAvatarSelected: (newAvatarSelected: CharacterBasic) => void;
    setFilter: (newFilter: FilterAvatarType) => void;
    setMapAvatarInfo: (avatarId: string, newCharacter: CharacterDetail) => void;
    setAllMapAvatarInfo: (newCharacter: Record<string, CharacterDetail>) => void;
}

const useAvatarStore = create<AvatarState>((set, get) => ({
    listAvatar: [],
    listRawAvatar: [],
    filter: {
        name: "",
        path: [],
        element: [],
        rarity: [],
        locale: "",
    },
    avatarSelected: null,
    mapAvatarInfo: {},
    setListAvatar: (newListAvatar: CharacterBasic[]) => set({ listAvatar: newListAvatar, listRawAvatar: newListAvatar }),
    setAvatarSelected: (newAvatarSelected: CharacterBasic) => set({ avatarSelected: newAvatarSelected }),
    setFilter: (newFilter: FilterAvatarType) => {
        set({ filter: newFilter })
        if (newFilter.locale === "") {
            return
        }
        let filteredList = get().listRawAvatar;
        if (newFilter.name) {
            filteredList = filteredList.filter((avatar) => {
                return avatar.lang?.get(newFilter.locale)?.toLowerCase().includes(newFilter.name.toLowerCase()) ?? false;
            });
        }
        if (newFilter.path.length > 0) {
            filteredList = filteredList.filter((avatar) => {
                return newFilter.path.some((path) => avatar.baseType?.toLowerCase().includes(path.toLowerCase())) ?? false;
            });
        }
        if (newFilter.element.length > 0) {
            filteredList = filteredList.filter((avatar) => {
                return newFilter.element.some((element) => avatar.damageType?.toLowerCase().includes(element.toLowerCase())) ?? false;
            });
        }
        if (newFilter.rarity.length > 0) {
            filteredList = filteredList.filter((avatar) => {
                return newFilter.rarity.some((rarity) => avatar.rank?.toLowerCase().includes(rarity.toLowerCase())) ?? false;
            });
        }
        set({ listAvatar: filteredList });
    },
    setMapAvatarInfo: (avatarId: string, newCharacter: CharacterDetail) => set((state) => ({ mapAvatarInfo: { ...state.mapAvatarInfo, [avatarId]: newCharacter } })),
    setAllMapAvatarInfo: (newCharacter: Record<string, CharacterDetail>) => set((state) => ({ mapAvatarInfo: { ...state.mapAvatarInfo, ...newCharacter } })),
}));

export default useAvatarStore;