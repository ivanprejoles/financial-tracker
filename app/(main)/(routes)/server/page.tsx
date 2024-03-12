import db from "@/lib/prismadb"
import { redirect, useRouter } from "next/navigation"

import initialProfile from "@/lib/initial-profile"

import InitialModal from "@/components/modals/initial-modal"

const ServerPage =async () => {
    const profile = await initialProfile()
    const Router = useRouter()

    const server = await db.store.findFirst({
        where: {
            profileId: profile.id
        }
    })

    if (server) {
        Router.push(`/server/${server.id}`)
    }

    return <InitialModal />
}
 
export default ServerPage;