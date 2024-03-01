import { Transactions } from '@prisma/client'
import { create } from 'zustand'

interface ItemStore {
    items: Transactions[] | [],
    onAdd: (element: Transactions[]) => void,
}

export const useItems = create<ItemStore>((set) => ({
    items: [],
    onAdd: (element) => set((state) => ({
        items: [...state.items, ...element]
    }))
}))
    