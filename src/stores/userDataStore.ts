import { ASConfigStore, AvatarStore, CEConfigStore, MOCConfigStore, PFConfigStore } from '@/types';
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware';


interface UserDataState {
    avatars: { [key: string]: AvatarStore };
    battle_type: string;
    moc_config: MOCConfigStore;
    pf_config: PFConfigStore;
    as_config: ASConfigStore;
    ce_config: CEConfigStore;
    setAvatars: (newAvatars: { [key: string]: AvatarStore }) => void;
    setAvatar: (newAvatar: AvatarStore) => void;
    setBattleType: (newBattleType: string) => void;
    setMocConfig: (newMocConfig: MOCConfigStore) => void;
    setPfConfig: (newPfConfig: PFConfigStore) => void;
    setAsConfig: (newAsConfig: ASConfigStore) => void;
    setCeConfig: (newCeConfig: CEConfigStore) => void;
}

const useUserDataStore = create<UserDataState>()(
    persist(
        (set) => ({
            avatars: {},
            battle_type: "",
            moc_config: {
                event_id: 0,
                challenge_id: 0,
                floor_side: "Upper",
                use_turbulence_buff: true,
                use_cycle_count: true,
                blessings: [],
                cycle_count: 0,
                stage_id: 0,
                monsters: [],
            },
            pf_config: {
                event_id: 0,
                challenge_id: 0,
                buff_id: 0,
                floor_side: "Upper",
                blessings: [],
                cycle_count: 0,
                stage_id: 0,
                monsters: [],
            },
            as_config: {
                event_id: 0,
                challenge_id: 0,
                buff_id: 0,
                floor_side: "Upper",
                blessings: [],
                cycle_count: 0,
                stage_id: 0,
                monsters: [],
            },
            ce_config: {
                blessings: [],
                cycle_count: 30,
                stage_id: 0,
                monsters: [],
            },
            setAvatars: (newAvatars: { [key: string]: AvatarStore }) => set({ avatars: newAvatars }),
            setAvatar: (newAvatar: AvatarStore) => set((state) => ({ avatars: { ...state.avatars, [newAvatar.avatar_id.toString()]: newAvatar } })),
            setBattleType: (newBattleType: string) => set({ battle_type: newBattleType }),
            setMocConfig: (newMocConfig: MOCConfigStore) => set({ moc_config: newMocConfig }),
            setPfConfig: (newPfConfig: PFConfigStore) => set({ pf_config: newPfConfig }),
            setAsConfig: (newAsConfig: ASConfigStore) => set({ as_config: newAsConfig }),
            setCeConfig: (newCeConfig: CEConfigStore) => set({ ce_config: newCeConfig }),
        }),
        {
            name: 'user-data-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);

export default useUserDataStore;