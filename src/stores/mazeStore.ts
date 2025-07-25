import { AffixDetail, ASConfigMaze, AvatarConfigMaze, ConfigMaze, MOCConfigMaze, PFConfigMaze, StageConfigMaze } from '@/types';
import { create } from 'zustand'

interface MazeState {
    Technique: Record<string, AvatarConfigMaze>;
    MOC: Record<string, MOCConfigMaze>;
    AS: Record<string, ASConfigMaze>;
    PF: Record<string, PFConfigMaze>;
    Stage: Record<string, StageConfigMaze>;
    setTechnique: (newTechnique: Record<string, AvatarConfigMaze>) => void;
    setMOC: (newMOC: Record<string, MOCConfigMaze>) => void;
    setAS: (newAS: Record<string, ASConfigMaze>) => void;
    setPF: (newPF: Record<string, PFConfigMaze>) => void;
    setStage: (newStage: Record<string, StageConfigMaze>) => void;
    setAllMazeData: (newData: ConfigMaze) => void;
}

const useMazeStore = create<MazeState>((set) => ({
    Technique: {},
    MOC: {},
    AS: {},
    PF: {},
    Stage: {},
    setTechnique: (newTechnique: Record<string, AvatarConfigMaze>) => set({ Technique: newTechnique }),
    setMOC: (newMOC: Record<string, MOCConfigMaze>) => set({ MOC: newMOC }),
    setAS: (newAS: Record<string, ASConfigMaze>) => set({ AS: newAS }),
    setPF: (newPF: Record<string, PFConfigMaze>) => set({ PF: newPF }),
    setStage: (newStage: Record<string, StageConfigMaze>) => set({ Stage: newStage }),
    setAllMazeData: (newData: ConfigMaze) => set({ Technique: newData.Avatar, MOC: newData.MOC, AS: newData.AS, PF: newData.PF, Stage: newData.Stage }),
}));

export default useMazeStore;