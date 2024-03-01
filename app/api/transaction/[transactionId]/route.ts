import currentProfile from "@/lib/current-profile"
import db from "@/lib/prismadb"
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
        
        const newTransaction = await db.transactions.update({
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

        return NextResponse.json(newTransaction)

    } catch (error) {
        console.log('[SERVER_ID_PATCH]', error)
        return new NextResponse('Internal error', {status: 500})
    }
}