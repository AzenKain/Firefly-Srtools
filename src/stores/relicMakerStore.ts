import { create } from 'zustand'

interface RelicMakerState {
    selectedRelicSlot: string;
    selectedMainStat: string;
    selectedRelicSet: string;
    selectedRelicLevel: number;
    listSelectedSubStats: {
        property: string,
        affixId: string,
        rollCount: number,
        stepCount: number
    }[];
    preSelectedSubStats: Record<string, {
        property: string,
        affixId: string,
        rollCount: number,
        stepCount: number
    }[]>;
    setSelectedRelicSlot: (newSelectedRelicSlot: string) => void;
    setSelectedRelicSet: (newSelectedRelicSet: string) => void;
    setSelectedMainStat: (newSelectedMainStat: string) => void;
    setSelectedRelicLevel: (newSelectedRelicLevel: number) => void;
    setListSelectedSubStats: (newSubAffixes: { property: string, affixId: string, rollCount: number, stepCount: number }[]) => void;
    resetHistory: (index: number | null) => void;
    resetSubStat: () => void;
    popHistory: (index: number) => void;
    addHistory: (index: number, affix: { property: string, affixId: string, rollCount: number, stepCount: number }) => void;

}

const useRelicMakerStore = create<RelicMakerState>((set, get) => ({
    selectedRelicSlot: "",
    selectedMainStat: "",
    selectedRelicSet: "",
    selectedRelicLevel: 15,
    listSelectedSubStats: [
        {
            property: "",
            affixId: "",
            rollCount: 0,
            stepCount: 0
        },
        {
            property: "",
            affixId: "",
            rollCount: 0,
            stepCount: 0
        },
        {
            property: "",
            affixId: "",
            rollCount: 0,
            stepCount: 0
        },
        {
            property: "",
            affixId: "",
            rollCount: 0,
            stepCount: 0
        },
    ],
    preSelectedSubStats: {
        "0": [
            {
                property: "",
                affixId: "",
                rollCount: 0,
                stepCount: 0
            },
        ],
        "1": [
            {
                property: "",
                affixId: "",
                rollCount: 0,
                stepCount: 0
            },
        ],
        "2": [
            {
                property: "",
                affixId: "",
                rollCount: 0,
                stepCount: 0
            },
        ],
        "3": [
            {
                property: "",
                affixId: "",
                rollCount: 0,
                stepCount: 0
            },
        ],
    },
    resetSubStat: () => set({
        listSelectedSubStats: [
            {
                property: "",
                affixId: "",
                rollCount: 0,
                stepCount: 0
            },
            {
                property: "",
                affixId: "",
                rollCount: 0,
                stepCount: 0
            },
            {
                property: "",
                affixId: "",
                rollCount: 0,
                stepCount: 0
            },
            {
                property: "",
                affixId: "",
                rollCount: 0,
                stepCount: 0
            },
        ],
    }),
    setSelectedRelicSlot: (newSelectedRelicSlot: string) => set({ selectedRelicSlot: newSelectedRelicSlot }),
    setSelectedRelicSet: (newSelectedRelicSet: string) => set({ selectedRelicSet: newSelectedRelicSet }),
    setSelectedMainStat: (newSelectedMainStat: string) => set({ selectedMainStat: newSelectedMainStat }),
    setSelectedRelicLevel: (newSelectedRelicLevel: number) => set({ selectedRelicLevel: newSelectedRelicLevel }),
    setListSelectedSubStats: (newSubAffixes) => set(() => ({
        listSelectedSubStats: newSubAffixes.map(item => ({ ...item }))
    })),
    resetHistory: (index: number | null) => set((state) => {
        if (index !== null) {
            return {
                preSelectedSubStats: {
                    "0": [
                        {
                            property: "",
                            affixId: "",
                            rollCount: 0,
                            stepCount: 0
                        },
                    ],
                    "1": [
                        {
                            property: "",
                            affixId: "",
                            rollCount: 0,
                            stepCount: 0
                        },
                    ],
                    "2": [
                        {
                            property: "",
                            affixId: "",
                            rollCount: 0,
                            stepCount: 0
                        },
                    ],
                    "3": [
                        {
                            property: "",
                            affixId: "",
                            rollCount: 0,
                            stepCount: 0
                        },
                    ],
                }
            }
        } else if (index !== null) {
            const newPreSelectedSubStats = { ...state.preSelectedSubStats };
            newPreSelectedSubStats[index] = [
                {
                    property: "",
                    affixId: "",
                    rollCount: 0,
                    stepCount: 0
                },
            ]
            return {
                preSelectedSubStats: newPreSelectedSubStats
            }
        }
        return {}
    }),
    popHistory: (index: number) => set((state) => {
        const newPreSelectedSubStats = { ...state.preSelectedSubStats };
        const copied = state.preSelectedSubStats[index].map(item => ({ ...item }));
        copied.pop();
        newPreSelectedSubStats[index] = copied;
        return { preSelectedSubStats: newPreSelectedSubStats };
    }),
    addHistory: (index, affix) => set((state) => {
        const newPreSelectedSubStats = { ...state.preSelectedSubStats };

        const currentList = state.preSelectedSubStats[index];
        const copied = currentList ? currentList.map(item => ({ ...item })) : [
            { property: "", affixId: "", rollCount: 0, stepCount: 0 },
            { property: "", affixId: "", rollCount: 0, stepCount: 0 },
            { property: "", affixId: "", rollCount: 0, stepCount: 0 },
            { property: "", affixId: "", rollCount: 0, stepCount: 0 },
        ];

        if (copied) {
            const newAffix = { ...affix };
            copied.push(newAffix);
            newPreSelectedSubStats[index] = copied;
            return { preSelectedSubStats: newPreSelectedSubStats };
        }
        return {}
    }),
}));

export default useRelicMakerStore;