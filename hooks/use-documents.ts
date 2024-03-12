import { HookDocuments } from "@/type";
import { Transactions } from "@prisma/client";
import { create } from "zustand";

interface useDocumentsStore {
    documents: {
        [key: string]: HookDocuments
    },
    addBulkDocuments: (bulk: { [key: string]: HookDocuments }) => void,
    addBulkDocumentArrays: (documentId: string, bulk: string[]) => void,
    deleteBulkDocuments: (keys: string[]) => void,
    resetDocuments: () => void,
    updateDocument: (document: HookDocuments) => void

}

export const useDocuments = create<useDocumentsStore>((set) => ({
    documents: {
        '': {
            id: '',
            idReference: 'root',
            isArchive: false,
            isDeleted: false,
            initialValue: 0,
            parentValue: 0,
            title: '',
            description: '',
            storeId: '',
            profileId: '',
            createdAt: '',
            updatedAt: '',
            childrenKey: []
        }
    },
    updateDocument: (document) => set((state) => {

        const { childrenKey, ...restDocument } = document;

        return {
            ...state,
            documents: {
                ...state.documents,
                [document.id]: {
                    ...state.documents[document.id],
                    ...restDocument
                }
            }
        }
    }),
    addBulkDocuments: (bulk) => set((state) => ({
        ...state,
        documents: {
            ...state.documents,
            ...bulk
        }
    })),
    addBulkDocumentArrays: (key, bulk) => set((state) => {
        const existingChildrenKey = state.documents[key].childrenKey;
        // Filter out duplicates from bulk
        const uniqueBulk = bulk.filter(item => !existingChildrenKey.includes(item));

        
        return {
            ...state,
            documents: {
                ...state.documents,
                [key]: {
                    ...state.documents[key],
                    childrenKey: [
                        ...state.documents[key].childrenKey,
                        ...uniqueBulk
                    ]
                }
            }
        };
    }),
    deleteBulkDocuments: (keys) => set((state) => ({
        ...state,
        documents: keys.reduce((newDocuments, key) => {
            delete newDocuments[key];
            return newDocuments;
        }, { ...state.documents })
    })),
    resetDocuments: () => set((state) => ({
        ...state,
        documents: {
            '': {
                id: '',
                idReference: 'root',
                isArchive: false,
                isDeleted: false,
                initialValue: 0,
                parentValue: 0,
                title: '',
                description: '',
                storeId: '',
                profileId: '',
                createdAt: '',
                updatedAt: '',
                childrenKey: []
            }
        }
    }))
}))