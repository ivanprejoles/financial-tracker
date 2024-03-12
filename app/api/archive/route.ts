import currentProfile from "@/lib/current-profile";
import db from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function PATCH (
    req: Request,
) {
    try {
        const profile = await currentProfile()
    
        const {
            storeId, 
            id, 
            isArchive
        } = await req.json()
    
        if (!profile) {
            return new NextResponse('Unauthorized', {status: 401})
        }
    
        let transaction: any = await db.transactions.update({
            where: {
                storeId,
                id,
                profileId: profile.id
            },
            data: {
                isArchive
            }
        })

        transaction = {
            ...transaction,
            createdAt: transaction.createdAt.toISOString(),
            updatedAt: transaction.updatedAt.toISOString(),
            childrenKey: []
        }
    
        if (transaction) {
            return NextResponse.json(transaction)   
        }

    } catch (error) {
        console.log("[DOCUMENT ARCHIVE]", error)
        return new NextResponse("Internal Error", {status:500})
    }
}

export async function POST (req: Request) {
    try {
        const profile = await currentProfile()

        const {
            storeId
        } = await req.json()

        if (!profile) {
            return new NextResponse('Unauthorized', {status: 401})
        }

        let archive: any = await db.transactions.findMany({
            where: {
                storeId,
                isArchive: true
                
            },
            orderBy: {
                createdAt: 'asc'
            }
        })

        Object.keys(archive).forEach((key: any) => {
            archive[key] = {
                ...archive[key],
                createdAt: archive[key].createdAt.toISOString(),
                updatedAt: archive[key].updatedAt.toISOString(),
                childrenKey: []
            }
        })

        return NextResponse.json(archive)

    } catch (error) {
        console.log("[ARCHIVE GET]", error)
        return new NextResponse('Internal Error', {status: 500})
    }
}