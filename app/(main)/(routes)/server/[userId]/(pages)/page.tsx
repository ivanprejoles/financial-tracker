'use client'

import Image from "next/image";
import { useCallback, useState } from "react";
import axios from 'axios'

import { Button } from "@/components/ui/button";
import { useItems } from "@/hooks/use-transaction";
import { useSwitch } from "@/hooks/use-switch";

interface ServerPageProps {
    params: {
        userId: string
    }
}

const ServerPage = ({
    params
}: ServerPageProps) => {
    
    const [isCreating, setIsCreating] = useState(false)

    const {onUpdate, isUpdated} = useSwitch()
    
    const createNewTransaction = async () => {
        setIsCreating(true)
        onUpdate()
        setTimeout(() => {
            setIsCreating(false)
        }, 400);
        console.log(isUpdated)
    }
    

    return (  
        <div className="flex flex-col items-center justify-center h-full">
            <Image
                src="/images/empty.png"
                height="300"
                width="300"
                alt="Empty"
                className="dark:hidden"
            />
            <Image
                src="/images/empty-dark.png"
                height="400"
                width="400"
                alt="Empty"
                className="hidden dark:block"
            />
            <Button 
                variant='destructive' 
                className="bg-indigo-600 hover:bg-indigo-500"
                onClick={createNewTransaction}
                disabled={isCreating}
            >
                Add First Transaction
            </Button>
        </div>
    );
}
 
export default ServerPage;