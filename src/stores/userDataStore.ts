import { AvatarStore, BattleConfigStore } from '@/types';
import { create } from 'zustand'
import { persist } from 'zustand/middleware';


interface UserDataState {
    avatars: { [key: string]: AvatarStore };
    battle_config: BattleConfigStore;
    setAvatars: (newAvatars: { [key: string]: AvatarStore }) => void;
    setAvatar: (newAvatar: AvatarStore) => void;
    setBattleConfig: (newBattleConfig: BattleConfigStore) => void;
}

const useUserDataStore = create<UserDataState>()(
    persist(
        (set) => ({
            avatars: {},
            battle_config: {
                battle_type: "",
                blessings: [],
                custom_stats: [],
                cycle_count: 0,
                stage_id: 0,
                path_resonance_id: 0,
                monsters: [],
            },
            setAvatars: (newAvatars: { [key: string]: AvatarStore }) => set({ avatars: newAvatars }),
            setAvatar: (newAvatar: AvatarStore) => set((state) => ({ avatars: { ...state.avatars, [newAvatar.avatar_id.toString()]: newAvatar } })),
            setBattleConfig: (newBattleConfig: BattleConfigStore) => set({ battle_config: newBattleConfig }),
        }),
        {
            name: 'user-data-storage',
        }
    )
);

export default useUserDataStore;