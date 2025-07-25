import { CharacterInfoCardType, FreeSRJson } from '@/types';
import { create } from 'zustand'

interface FreeSRState {
    selectedCharacters: CharacterInfoCardType[];
    freeSRData: FreeSRJson | null;
    setSelectedCharacters: (newListAvatar: CharacterInfoCardType[]) => void;
    setFreeSRData: (newFreeSRData: FreeSRJson | null) => void;
}

const useFreeSRStore = create<FreeSRState>((set) => ({
    selectedCharacters: [],
    freeSRData: null,
    setSelectedCharacters: (newListAvatar: CharacterInfoCardType[]) => set({ selectedCharacters: newListAvatar }),
    setFreeSRData: (newFreeSRData: FreeSRJson | null) => set({ freeSRData: newFreeSRData }),
}));

export default useFreeSRStore;