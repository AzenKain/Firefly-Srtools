import { AvatarProfileCardType, CharacterBasic, FilterAvatarType } from '@/types';
import { create } from 'zustand'

interface CopyProfileState {
    selectedProfiles: AvatarProfileCardType[];
    listCopyAvatar: CharacterBasic[];
    listRawCopyAvatar: CharacterBasic[];
    filterCopy: FilterAvatarType;
    avatarCopySelected: CharacterBasic | null;
    setSelectedProfiles: (newListAvatar: AvatarProfileCardType[]) => void;
    setAvatarCopySelected: (newAvatarSelected: CharacterBasic | null) => void;
    setFilterCopy: (newFilter: FilterAvatarType) => void;
    setListCopyAvatar: (newListAvatar: CharacterBasic[]) => void;
}

const useCopyProfileStore = create<CopyProfileState>((set, get) => ({
    selectedProfiles: [],
    listCopyAvatar: [],
    listRawCopyAvatar: [],
    filterCopy: {
        name: "",
        path: [],
        element: [],
        rarity: [],
        locale: "",
    },
    avatarCopySelected: null,
    setListCopyAvatar: (newListAvatar: CharacterBasic[]) => set({ listCopyAvatar: newListAvatar, listRawCopyAvatar: newListAvatar }),
    setAvatarCopySelected: (newAvatarSelected: CharacterBasic | null) => set({ avatarCopySelected: newAvatarSelected }),
    setFilterCopy: (newFilter: FilterAvatarType) => {
        set({ filterCopy: newFilter })
        if (newFilter.locale === "") {
            return
        }
        let filteredList = get().listRawCopyAvatar;
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
        set({ listCopyAvatar: filteredList });
    },
    setSelectedProfiles: (newListAvatar: AvatarProfileCardType[]) => set({ selectedProfiles: newListAvatar }),
}));

export default useCopyProfileStore;