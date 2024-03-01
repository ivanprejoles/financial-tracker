import { create } from "zustand";

interface SwitchStore {
    isUpdated: boolean,
    onUpdate: () => void,
}

export const useSwitch = create<SwitchStore>((set) => ({
    isUpdated: false,
    onUpdate: () => set((state) => ({
        isUpdated: !state.isUpdated
    }))
}))

