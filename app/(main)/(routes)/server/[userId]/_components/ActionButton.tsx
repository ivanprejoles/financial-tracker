'use client'

import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

const ActionButton = () => {
    return (  
        <div className="relative w-full">
            <Button className="w-full flex justify-start gap-4" size={"sm"}>
                <PlusCircle size={30} />
                <p>Add Transaction</p>
            </Button>
        </div>
    );
}
 
export default ActionButton;