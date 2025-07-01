import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware';


interface LocaleState {
    locale: string;
    setLocale: (newLocale: string) => void;
}

const useLocaleStore = create<LocaleState>()(
    persist(
        (set) => ({
            locale: "en",
            setLocale: (newLocale: string) => set({ locale: newLocale }),
        }),
        {
            name: 'locale-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);

export default useLocaleStore;