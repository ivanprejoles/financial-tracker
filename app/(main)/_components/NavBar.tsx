import { UserButton, auth } from "@clerk/nextjs";
import { ModeToggle } from "./ModeToggle";
import Search from "./Search";
import ItemSwitcher from "./ItemSwitcher";
import db from "@/lib/prismadb";
import { redirect } from "next/navigation";
import currentProfile from "@/lib/current-profile";

const NavBar = async () => {
    const profile = await currentProfile()


    if (!profile) {
        return redirect('/')
    }

    const servers = await db.store.findMany({
        where: {
        profileId: profile.id
        }
    })

    return (  
        <div className="w-full fixed flex flex-row justify-between items-center p-3 h-[56px] shadow-sm z-50 bg-[#2121] dark:bg-[#5a5858] text-white dark:text-black">
            <ItemSwitcher items={servers} />
            <Search />
            <div className="flex flex-row items-center gap-4">
                <ModeToggle />
                <UserButton afterSignOutUrl="/"/>
            </div>
        </div>
    );
}
 
export default NavBar;