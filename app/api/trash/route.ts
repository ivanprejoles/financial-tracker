import currentProfile from "@/lib/current-profile"
import db from "@/lib/prismadb"
import { HookDocuments } from "@/type"
import { Transactions } from "@prisma/client"
import { NextResponse } from "next/server"


export async function PATCH (req: Request) {
    try {

        const profile = await currentProfile()
        
        const {
            documents,
            storeId,
            id,
            isDeleted
        } = await req.json()

        if (!profile) {
            return new NextResponse('Unauthorized', {status: 401})
        }

        // Separate transactions for clarity and potential performance gain
        const updateParentValues = await db.$transaction(async (db) => {
            const mappedUpdates = Object.keys(documents).map((item) => {
                return db.transactions.update({
                    where: {
                        id: item,
                        profileId: profile.id,
                        storeId,
                    },
                    data: {
                        parentValue: documents[item].rootedValue,
                    },
                });
            });
    
            return await Promise.all(mappedUpdates);
        });
    
        // Update isDeleted for the specific ID within a separate transaction
        const updateIsDeleted = await db.$transaction(async (db) => {
            return await db.transactions.update({
            where: {
                storeId,
                id,
                profileId: profile.id,
            },
            data: {
                isDeleted,
            },
            });
        });

        const combinedResults:any[] = [
            ...updateParentValues,
            updateIsDeleted, // Might be null if no matching ID found
        ]


        combinedResults.forEach((item: Transactions, index: number) => {
            combinedResults[index] = {
              ...item,
              createdAt: item.createdAt.toISOString(),
              updatedAt: item.updatedAt.toISOString(),
              childrenKey: []
            }
        });

        if (Object.keys(combinedResults).length > 0) {
            return NextResponse.json(combinedResults)
        }

    } catch (error) {
        console.log("[DOCUMENT DELETED]", error)
        return new NextResponse('Internal Error', {status: 500})
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

        let trash: any = await db.transactions.findMany({
            where: {
                storeId,
                isDeleted: true
                
            },
            orderBy: {
                createdAt: 'asc'
            }
        })

        Object.keys(trash).forEach((key: any) => {
            trash[key] = {
                ...trash[key],
                createdAt: trash[key].createdAt.toISOString(),
                updatedAt: trash[key].updatedAt.toISOString(),
                childrenKey: []
            }
        })

        return NextResponse.json(trash)

    } catch (error) {
        console.log("[TRASH GET]", error)
        return new NextResponse('Internal Error', {status: 500})
    }
}