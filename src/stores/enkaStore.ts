import { CharacterInfoCardType, EnkaResponse } from '@/types';
import { create } from 'zustand'

interface EnkaState {
    selectedCharacters: CharacterInfoCardType[];
    enkaData: EnkaResponse | null;
    uidInput: string;
    setSelectedCharacters: (newListAvatar: CharacterInfoCardType[]) => void;
    setEnkaData: (newEnkaData: EnkaResponse) => void;
    setUidInput: (newUidInput: string) => void;
}

const useEnkaStore = create<EnkaState>((set, get) => ({
    selectedCharacters: [],
    enkaData: null,
    uidInput: "",
    setUidInput: (newUidInput: string) => set({ uidInput: newUidInput }),
    setSelectedCharacters: (newListAvatar: CharacterInfoCardType[]) => set({ selectedCharacters: newListAvatar }),
    setEnkaData: (newEnkaData: EnkaResponse) => set({ enkaData: newEnkaData }),
}));

export default useEnkaStore;