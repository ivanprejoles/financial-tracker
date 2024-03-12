import currentProfile from "@/lib/current-profile"
import { NextResponse } from "next/server"
import db from '@/lib/prismadb';

export async function POST (req: Request) {
    try {
        const profile = await currentProfile()
        const {storeId , idReference} = await req.json()

        if (!profile) {
            return new NextResponse('Unauthorized', {status: 401})
        }

        let transaction:any = await db.transactions.create({
            data: {
                storeId,
                profileId: profile.id,
                idReference
            }
        })

        transaction = {
            ...transaction,
            createdAt: transaction.createdAt.toISOString(),
            updatedAt: transaction.updatedAt.toISOString(),
            childrenKey: []
        }
        
        return NextResponse.json(transaction)

    } catch (error) {
        console.log('[SERVER ERROR]', error)
        return new NextResponse('Internal Error', {status: 500})
    }
}

export async function GET (req: Request) {
    try {

        const profile = await currentProfile()
        const {documentId} = await req.json()

        if (!profile) {
            return new NextResponse('Unauthorized', {status: 401})
        }
        
        let transaction = await db.transactions.findUnique({
            where: {
                profileId: profile?.id,
                id: documentId
            }
        })
        
        return NextResponse.json(transaction)
        
    } catch (error) {
        console.log('[SERVER ERROR]', error)
        return new NextResponse('Internal Error', {status: 500})  
    }
}