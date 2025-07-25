import { create } from 'zustand'


interface ModelState {
    isOpenLightcone: boolean;
    isOpenRelic: boolean;
    isOpenAvatar: boolean;
    isOpenCreateProfile: boolean;
    isOpenImport: boolean;
    isOpenCopy: boolean;
    isOpenMonster: boolean;
    isOpenConnect: boolean;
    setIsOpenConnect: (newIsOpenConnect: boolean) => void;
    setIsOpenMonster: (newIsOpenMonster: boolean) => void;
    setIsOpenLightcone: (newIsOpenLightcone: boolean) => void;
    setIsOpenRelic: (newIsOpenRelic: boolean) => void;
    setIsOpenAvatar: (newIsOpenAvatar: boolean) => void;
    setIsOpenCreateProfile: (newIsOpenCreateProfile: boolean) => void;
    setIsOpenImport: (newIsOpenImport: boolean) => void;
    setIsOpenCopy: (newIsOpenCopy: boolean) => void;
}

const useModelStore = create<ModelState>((set) => ({
    isOpenLightcone: false,
    isOpenRelic: false,
    isOpenAvatar: false,
    isOpenCreateProfile: false,
    isOpenImport: false,
    isOpenCopy: false,
    isOpenMonster: false,
    isOpenConnect: false,
    setIsOpenConnect: (newIsOpenConnect: boolean) => set({ isOpenConnect: newIsOpenConnect }),
    setIsOpenMonster: (newIsOpenMonster: boolean) => set({ isOpenMonster: newIsOpenMonster }),
    setIsOpenLightcone: (newIsOpenLightcone: boolean) => set({ isOpenLightcone: newIsOpenLightcone }),
    setIsOpenRelic: (newIsOpenRelic: boolean) => set({ isOpenRelic: newIsOpenRelic }),
    setIsOpenAvatar: (newIsOpenAvatar: boolean) => set({ isOpenAvatar: newIsOpenAvatar }),
    setIsOpenCreateProfile: (newIsOpenCreateProfile: boolean) => set({ isOpenCreateProfile: newIsOpenCreateProfile }),
    setIsOpenImport: (newIsOpenImport: boolean) => set({ isOpenImport: newIsOpenImport }),
    setIsOpenCopy: (newIsOpenCopy: boolean) => set({ isOpenCopy: newIsOpenCopy }),
}));

export default useModelStore;