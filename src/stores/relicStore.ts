import { FilterRelicType, RelicDetail, RelicBasic } from '@/types';
import { create } from 'zustand'

interface RelicState {
    listRelic: RelicBasic[];
    listRawRelic: RelicBasic[];
    filter: FilterRelicType;
    mapRelicInfo: Record<string, RelicDetail>;
    setListRelic: (newListRelic: RelicBasic[]) => void;
    setFilter: (newFilter: FilterRelicType) => void;
    setMapRelicInfo: (lightconeId: string, newRelic: RelicDetail) => void;
    setAllMapRelicInfo: (newRelic: Record<string, RelicDetail>) => void;
}

const useRelicStore = create<RelicState>((set, get) => ({
    listRelic: [],
    listRawRelic: [],
    mapRelicInfo: {},
    filter: {
        name: "",
        type: [],
        locale: "",
        rarity: [],
    },
    setListRelic: (newListRelic: RelicBasic[]) => set({ listRelic: newListRelic, listRawRelic: newListRelic }),
    setFilter: (newFilter: FilterRelicType) => {
        set({ filter: newFilter })
        
        if (newFilter.locale === "") {
            return
        }
        let filteredList = get().listRawRelic;
        if (newFilter.name && newFilter.locale)  {
            filteredList = filteredList.filter((relic) => {
                return relic.lang?.get(newFilter.locale)?.toLowerCase().includes(newFilter.name.toLowerCase()) ?? false;
            });
        }
        set({ listRelic: filteredList });
    },
    setMapRelicInfo: (lightconeId: string, newRelic: RelicDetail) => set((state) => ({ mapRelicInfo: { ...state.mapRelicInfo, [lightconeId]: newRelic } })),
    setAllMapRelicInfo: (newRelic: Record<string, RelicDetail>) => set({ mapRelicInfo: newRelic }),
}));

export default useRelicStore;