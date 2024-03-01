import currentProfile from "@/lib/current-profile"
import db from "@/lib/prismadb"
import { NextResponse } from "next/server"

export async function  POST(req: Request) {
    try {
        const { name } = await req.json()
        const profile = await currentProfile()

        if (!profile) {
            return new NextResponse("Unauthorized", {status: 401})
        }
        
        const server = await db.store.create({
            data: {
                profileId: profile.id,
                name
            }
        })

        return NextResponse.json(server)

    } catch (error) {
        console.log("[SERVER_POST]", error)
        return new NextResponse("Internal Error", {status:500})
    }
}