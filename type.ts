import { Transactions } from "@prisma/client";

export type HookDocuments = Omit<
    Transactions, 
    'createdAt'|'updatedAt'|'childrenKey'
> & {
    createdAt: string,
    updatedAt: string,
    childrenKey: string[]
}
