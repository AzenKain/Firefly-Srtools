import { create } from 'zustand'


interface ModelState {
    isOpenLightcone: boolean;
    isOpenRelic: boolean;
    isOpenAvatar: boolean;
    isOpenCreateProfile: boolean;
    isOpenImport: boolean;
    isOpenCopy: boolean;
    setIsOpenLightcone: (newIsOpenLightcone: boolean) => void;
    setIsOpenRelic: (newIsOpenRelic: boolean) => void;
    setIsOpenAvatar: (newIsOpenAvatar: boolean) => void;
    setIsOpenCreateProfile: (newIsOpenCreateProfile: boolean) => void;
    setIsOpenImport: (newIsOpenImport: boolean) => void;
    setIsOpenCopy: (newIsOpenCopy: boolean) => void;
}

const useModelStore = create<ModelState>((set, get) => ({
    isOpenLightcone: false,
    isOpenRelic: false,
    isOpenAvatar: false,
    isOpenCreateProfile: false,
    isOpenImport: false,
    isOpenCopy: false,
    setIsOpenLightcone: (newIsOpenLightcone: boolean) => set({ isOpenLightcone: newIsOpenLightcone }),
    setIsOpenRelic: (newIsOpenRelic: boolean) => set({ isOpenRelic: newIsOpenRelic }),
    setIsOpenAvatar: (newIsOpenAvatar: boolean) => set({ isOpenAvatar: newIsOpenAvatar }),
    setIsOpenCreateProfile: (newIsOpenCreateProfile: boolean) => set({ isOpenCreateProfile: newIsOpenCreateProfile }),
    setIsOpenImport: (newIsOpenImport: boolean) => set({ isOpenImport: newIsOpenImport }),
    setIsOpenCopy: (newIsOpenCopy: boolean) => set({ isOpenCopy: newIsOpenCopy }),
}));

export default useModelStore;