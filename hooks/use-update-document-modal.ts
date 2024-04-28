import { HookDocuments } from "@/type";
import { Transactions } from "@prisma/client";
import { create } from "zustand";

interface useUpdateStore {
    changedValue: {[key: string]: {itemValue: number, parentValue: number, level: number}},
    // parentString: string|null,
    data: HookDocuments|undefined,
    updatedId: string|undefined,
    index: number|null,
    isOpen: boolean,
    onOpen: (value: HookDocuments) => void,
    onClose: () => void,
    onValueAdd: (id: string, itemValue: number, parentValue: number, level: number) => void,
    onValueReset: () => void,
    updatedIdReset: () => void
}

export const useUpdateModal = create<useUpdateStore>((set) => ({
    //value storage
    changedValue: {},
    updatedId: undefined,
    // parentString: null,
    data: undefined,
    index:null,
    isOpen: false,
    onOpen: (value) => set({isOpen: true, data: value}),
    onClose: () => set({isOpen: false, data: undefined}),
    //onupdated values
    onValueAdd: (id, itemValue, parentValue, level) => {
        set((state) => ({
            ...state,
            changedValue: {
                ...state.changedValue,
                [id]: { itemValue, parentValue, level }
            }
        }));
    },
    onValueReset: () => set((state) => ({
        ...state,
        changedValue: {

        },
    })),
    updatedIdReset: () => set(() => ({
        updatedId: undefined
    }))
}))