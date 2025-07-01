import { LightConeBasic, FilterLightconeType, LightConeDetail } from '@/types';
import { create } from 'zustand'

interface LightconeState {
    listLightcone: LightConeBasic[];
    listRawLightcone: LightConeBasic[];
    filter: FilterLightconeType;
    mapLightconeInfo: Record<string, LightConeDetail>;
    setListLightcone: (newListLightcone: LightConeBasic[]) => void;
    setFilter: (newFilter: FilterLightconeType) => void;
    setMapLightconeInfo: (lightconeId: string, newLightcone: LightConeDetail) => void;
    setAllMapLightconeInfo: (newLightcone: Record<string, LightConeDetail>) => void;
}

const useLightconeStore = create<LightconeState>((set, get) => ({
    listLightcone: [],
    listRawLightcone: [],
    mapLightconeInfo: {},
    filter: {
        name: "",
        path: [],
        locale: "",
        rarity: [],
    },
    setListLightcone: (newListLightcone: LightConeBasic[]) => set({ listLightcone: newListLightcone, listRawLightcone: newListLightcone }),
    setFilter: (newFilter: FilterLightconeType) => {
        set({ filter: newFilter })
        
        if (newFilter.locale === "") {
            return
        }
        let filteredList = get().listRawLightcone;
        if (newFilter.name && newFilter.locale)  {
            filteredList = filteredList.filter((lightcone) => {
                return lightcone.lang?.get(newFilter.locale)?.toLowerCase().includes(newFilter.name.toLowerCase()) ?? false;
            });
        }
        if (newFilter.path && newFilter.path.length > 0) {
            filteredList = filteredList.filter((lightcone) => {
                return newFilter.path.some((path) => lightcone.baseType?.toLowerCase().includes(path.toLowerCase())) ?? false;
            });
        }
        if (newFilter.rarity && newFilter.rarity.length > 0) {
            filteredList = filteredList.filter((lightcone) => {
                return newFilter.rarity.some((rarity) => lightcone.rank?.toLowerCase().includes(rarity.toLowerCase())) ?? false;
            });
        }
        set({ listLightcone: filteredList });
    },
    setMapLightconeInfo: (lightconeId: string, newLightcone: LightConeDetail) => set((state) => ({ mapLightconeInfo: { ...state.mapLightconeInfo, [lightconeId]: newLightcone } })),
    setAllMapLightconeInfo: (newLightcone: Record<string, LightConeDetail>) => set({ mapLightconeInfo: newLightcone }),
}));

export default useLightconeStore;