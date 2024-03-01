import initialProfile from "@/lib/initial-profile";
import db from "@/lib/prismadb";
import { redirect } from "next/navigation";
import InitialModal from "@/components/modals/initial-modal";

const SetupPage = async () => {

    const profile = await initialProfile()

    const server = await db.store.findFirst({
        where: {
            profileId: profile.id
        }
    })

    if (server) {
        return redirect(`/server/${server.id}`)
    }

    return <InitialModal />
}
 
export default SetupPage;