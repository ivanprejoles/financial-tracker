import currentProfile from "@/lib/current-profile";
import { redirectToSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

const DocumentPage = async ({
    params
}: {
    params: { userId: string }
}) => {
    const profile = await currentProfile()
    const Router = useRouter()

    if (!profile) {
        return redirectToSignIn()
    }

    if (params.userId) {
        Router.push(`/server/${params.userId}`)
    }
}
 
export default DocumentPage;