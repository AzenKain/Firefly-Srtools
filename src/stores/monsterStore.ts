import { MonsterBasic, MonsterDetail } from '@/types';
import { create } from 'zustand'


interface MonsterState {
    listMonster: MonsterBasic[];
    mapMonster: Record<string, MonsterBasic>;
    mapMonsterInfo: Record<string, MonsterDetail>;
    setListMonster: (newListMonster: MonsterBasic[]) => void;
    setMapMonsterInfo: (monsterId: string, newMonster: MonsterDetail) => void;
    setAllMapMonsterInfo: (newMonster: Record<string, MonsterDetail>) => void;
    setMapMonster: (monsterId: string, newMonster: MonsterBasic) => void;
    setAllMapMonster: (newMonster: Record<string, MonsterBasic>) => void;
}

const useMonsterStore = create<MonsterState>((set) => ({
    listMonster: [],
    mapMonster: {},
    mapMonsterInfo: {},
    setListMonster: (newListMonster: MonsterBasic[]) => set({ listMonster: newListMonster }),
    setMapMonster: (monsterId: string, newMonster: MonsterBasic) => set((state) => ({ mapMonster: { ...state.mapMonster, [monsterId]: newMonster } })),
    setAllMapMonster: (newMonster: Record<string, MonsterBasic>) => set({ mapMonster: newMonster }),
    setMapMonsterInfo: (monsterId: string, newMonster: MonsterDetail) => set((state) => ({ mapMonsterInfo: { ...state.mapMonsterInfo, [monsterId]: newMonster } })),
    setAllMapMonsterInfo: (newMonster: Record<string, MonsterDetail>) => set({ mapMonsterInfo: newMonster }),
}));

export default useMonsterStore;