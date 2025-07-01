import { AffixDetail, ASConfigMaze, AvatarConfigMaze, ConfigMaze, MOCConfigMaze, PFConfigMaze } from '@/types';
import { create } from 'zustand'

interface MazeState {
    Technique: Record<string, AvatarConfigMaze>;
    MOC: Record<string, MOCConfigMaze>;
    AS: Record<string, ASConfigMaze>;
    PF: Record<string, PFConfigMaze>;
    setTechnique: (newTechnique: Record<string, AvatarConfigMaze>) => void;
    setMOC: (newMOC: Record<string, MOCConfigMaze>) => void;
    setAS: (newAS: Record<string, ASConfigMaze>) => void;
    setPF: (newPF: Record<string, PFConfigMaze>) => void;
    setAllData: (newData: ConfigMaze) => void;
}

const useMazeStore = create<MazeState>((set) => ({
    Technique: {},
    MOC: {},
    AS: {},
    PF: {},
    setTechnique: (newTechnique: Record<string, AvatarConfigMaze>) => set({ Technique: newTechnique }),
    setMOC: (newMOC: Record<string, MOCConfigMaze>) => set({ MOC: newMOC }),
    setAS: (newAS: Record<string, ASConfigMaze>) => set({ AS: newAS }),
    setPF: (newPF: Record<string, PFConfigMaze>) => set({ PF: newPF }),
    setAllData: (newData: ConfigMaze) => set({ Technique: newData.Avatar, MOC: newData.MOC, AS: newData.AS, PF: newData.PF }),
}));

export default useMazeStore;