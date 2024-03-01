import NavBar from "./_components/NavBar";

const MainLayout = ({
    children
}: {
    children: React.ReactNode
}) => {   
    
    return (  
        <div className="h-full flex flex-col">
            <NavBar />
            <main className="pt-[56px] w-full h-full items-center">
                {children}
            </main>
        </div>
    );
}
 
export default MainLayout;