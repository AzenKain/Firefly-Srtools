import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware';


interface ConnectState {
    connectionType: string;
    privateType: string;
    serverUrl: string;
    username: string;
    password: string;
    setConnectionType: (newConnectionType: string) => void;
    setPrivateType: (newPrivateType: string) => void;
    setServerUrl: (newServerUrl: string) => void;
    setUsername: (newUsername: string) => void;
    setPassword: (newPassword: string) => void;
}

const useConnectStore = create<ConnectState>()(
    persist(
        (set) => ({
            connectionType: "FireflyGo",
            privateType: "Local",
            serverUrl: "http://localhost:21000",
            username: "",
            password: "",
            setConnectionType: (newConnectionType: string) => set({ connectionType: newConnectionType }),
            setPrivateType: (newPrivateType: string) => set({ privateType: newPrivateType }),
            setServerUrl: (newServerUrl: string) => set({ serverUrl: newServerUrl }),
            setUsername: (newUsername: string) => set({ username: newUsername }),
            setPassword: (newPassword: string) => set({ password: newPassword }),
        }),
        {
            name: 'connect-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);

export default useConnectStore;