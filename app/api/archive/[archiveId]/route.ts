import currentProfile from "@/lib/current-profile"
import db from "@/lib/prismadb"
import { HookDocuments } from "@/type"
import { NextResponse } from "next/server"

export async function PATCH (
    req: Request,
    { params }: {params: {archiveId: string}}
) {
    try {
        const profile = await currentProfile()
        
        const {
            storeId,
            isArchive
        } = await req.json()

        if (!profile) {
            return new NextResponse('Unauthorized', {status: 401})
        }

        let recoveredArchive: any = await db.transactions.update({
            where: {
                profileId: profile.id,
                storeId,
                id: params.archiveId
            },
            data: {
                isArchive
            }
        })
        
        const documentType: HookDocuments = {
            ...recoveredArchive,
            createdAt: recoveredArchive.createdAt.toISOString(),
            updatedAt: recoveredArchive.updatedAt.toISOString(),
            childrenKey: []
        }

        return NextResponse.json(documentType)
        
    } catch (error) {
        console.log("[ARCHIVE UPDATE]", error)
        return new NextResponse('Internal Error', {status: 500})
    }
}