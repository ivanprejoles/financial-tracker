import { redirectToSignIn } from "@clerk/nextjs";
import SidebarNavigation from "./_components/SidebarNavigation";
import currentProfile from "@/lib/current-profile";
import db from "@/lib/prismadb";
import { redirect } from "next/navigation";

const ServerLayout = async ({
    children,
    params
}: {
    children: React.ReactNode,
    params: {userId: string}
}) => {
    const profile = await currentProfile()

    if (!profile) {
        return redirectToSignIn()
    }

    const server = await db.store.findUnique({
        where: {
            id: params.userId,
            profileId: profile.id
        }
    })

    if (!server) {
        return redirect('/')
    }

    return ( 
        <div className="h-full flex dark:bg-[#1F1F1F]">
                <SidebarNavigation userId={params.userId}/>
            <main className="flex-1 h-full overflow-y-auto">
                {children}
            </main>
        </div>
    );
}
 
export default ServerLayout;

//important for userId as store, needs by itsmlist, and item