import currentProfile from "@/lib/current-profile"
import db from "@/lib/prismadb"
import { HookDocuments } from "@/type"
import { NextResponse } from "next/server"

export async function PATCH (
    req: Request,
    { params } : {params: {trashId: string}}
) {
    try {
        const profile = await currentProfile()

        const {
            isDeleted
        } = await req.json()
        
        if (!profile) {
            return new NextResponse('Unauthorized', {status:401})
        }

        let recoveredTrash: any = await db.transactions.update({
            where: {
                profileId: profile.id,
                id: params.trashId
            },
            data: {
                isDeleted
            }
        })

        const documentType: HookDocuments = {
            ...recoveredTrash,
            createdAt: recoveredTrash.createdAt.toISOString(),
            updatedAt: recoveredTrash.updatedAt.toISOString(),
            childrenKey: []
        }
        
        return NextResponse.json(documentType)
        
    } catch (error) {
        console.log("[TRASH UPDATE]", error)
        return new NextResponse('Internal Error', {status: 500})
    }
}

export async function DELETE (
    req: Request,
    { params } : {params: {trashId: string}}
) {
    try {
        const profile = await currentProfile()

        const {
            storeId
        } = await req.json()
        console.log(storeId)

        const transaction = await db.transactions.deleteMany({
            where: {
                storeId,
                isDeleted: true,
                id: params.trashId,
                profileId: profile?.id

            }
        });

       return NextResponse.json(transaction)

    } catch (error) {
        console.log("[TRASH DELETE]", error)
        return new NextResponse('Internal Error', {status: 500})
    }
}