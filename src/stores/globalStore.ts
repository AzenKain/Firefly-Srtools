import { create } from 'zustand'

interface GlobalState {
    isConnectPS: boolean;
    setIsConnectPS: (newIsConnectPS: boolean) => void;
}

const useGlobalStore = create<GlobalState>((set, get) => ({
    isConnectPS: false,
    setIsConnectPS: (newIsConnectPS: boolean) => set({ isConnectPS: newIsConnectPS }),
}));

export default useGlobalStore;