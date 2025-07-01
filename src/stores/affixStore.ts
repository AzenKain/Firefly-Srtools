import { AffixDetail } from '@/types';
import { create } from 'zustand'

interface AffixState {
    mapMainAffix: Record<string, Record<string, AffixDetail>>;
    mapSubAffix: Record<string, Record<string, AffixDetail>>;
    setMapMainAffix: (newMainAffix: Record<string, Record<string, AffixDetail>>) => void;
    setMapSubAffix: (newSubAffix: Record<string, Record<string, AffixDetail>>) => void;
}

const useAffixStore = create<AffixState>((set, get) => ({
    mapMainAffix: {},
    mapSubAffix: {},
    setMapMainAffix: (newMainAffix: Record<string, Record<string, AffixDetail>>) => set({ mapMainAffix: newMainAffix }),
    setMapSubAffix: (newSubAffix: Record<string, Record<string, AffixDetail>>) => set({ mapSubAffix: newSubAffix }),
}));

export default useAffixStore;