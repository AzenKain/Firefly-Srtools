import { MocDetail, EventBasic, PFDetail, ASDetail } from '@/types';
import { create } from 'zustand'


interface EventState {
    MOCEvent: EventBasic[];
    mapMOCInfo: Record<string, MocDetail[]>;
    PFEvent: EventBasic[];
    mapPFInfo: Record<string, PFDetail>;
    ASEvent: EventBasic[];
    mapASInfo: Record<string, ASDetail>;
    setMOCEvent: (newListEvent: EventBasic[]) => void;
    setMapMOCInfo: (newMapMOCInfo: Record<string, MocDetail[]>) => void;
    setPFEvent: (newListEvent: EventBasic[]) => void;
    setMapPFInfo: (newMapPFInfo: Record<string, PFDetail>) => void;
    setASEvent: (newListEvent: EventBasic[]) => void;
    setMapASInfo: (newMapASInfo: Record<string, ASDetail>) => void;
}

const useEventStore = create<EventState>((set) => ({
    MOCEvent: [],
    mapMOCInfo: {},
    PFEvent: [],
    mapPFInfo: {},
    ASEvent: [],
    mapASInfo: {},
    setMOCEvent: (newListEvent: EventBasic[]) => set({ MOCEvent: newListEvent }),
    setMapMOCInfo: (newMapMOCInfo: Record<string, MocDetail[]>) => set({ mapMOCInfo: newMapMOCInfo }),
    setPFEvent: (newListEvent: EventBasic[]) => set({ PFEvent: newListEvent }),
    setMapPFInfo: (newMapPFInfo: Record<string, PFDetail>) => set({ mapPFInfo: newMapPFInfo }),
    setASEvent: (newListEvent: EventBasic[]) => set({ ASEvent: newListEvent }),
    setMapASInfo: (newMapASInfo: Record<string, ASDetail>) => set({ mapASInfo: newMapASInfo }),
}));

export default useEventStore;