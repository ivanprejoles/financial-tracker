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
    
        let transaction = await db.transactions.update({
            where: {
                storeId,
                id,
                profileId: profile.id
            },
            data: {
                isArchive
            }
        })
    
        if (transaction) {
            return NextResponse.json(transaction)   
        }

    } catch (error) {
        console.log("[DOCUMENT ARCHIVE]", error)
        return new NextResponse("Internal Error", {status:500})
    }
}