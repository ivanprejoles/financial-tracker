import currentProfile from "@/lib/current-profile"
import db from "@/lib/prismadb"
import { HookDocuments } from "@/type"
import { Transactions } from "@prisma/client"
import { NextResponse } from "next/server"

export async function PATCH (
    req: Request,
    {params} : {params: {transactionId: string}}
) {
    try {

        const profile = await currentProfile()
        const {title, description, initialValue} = await req.json()
        
        if (!profile) {
            return new NextResponse('Unauthorized', {status: 401})
        }
        
        let newTransaction = await db.transactions.update({
            where: {
                profileId: profile.id,
                id: params.transactionId,
            },
            data: {
                title,
                description,
                initialValue,
            }
        })

        const transactionType: HookDocuments = {
            ...newTransaction,
            createdAt: newTransaction.createdAt.toISOString(),
            updatedAt: newTransaction.updatedAt.toISOString(),
            childrenKey: []
        }

        return NextResponse.json(transactionType)

    } catch (error) {
        console.log('[SERVER_ID_PATCH]', error)
        return new NextResponse('Internal error', {status: 500})
    }
}