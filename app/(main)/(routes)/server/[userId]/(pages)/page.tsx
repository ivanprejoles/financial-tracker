'use client'

import Image from "next/image";
import { useState } from "react";
import axios from 'axios'

import { Button } from "@/components/ui/button";
import { useSwitch } from "@/hooks/use-switch";
import { HookDocuments } from "@/type";
import { useDocuments } from "@/hooks/use-documents";

interface ServerPageProps {
    params: {
        userId: string
    }
}

const ServerPage = ({
    params
}: ServerPageProps) => {
    
    const {
        addBulkDocuments,
        addBulkDocumentArrays
    } = useDocuments()

    const [isCreating, setIsCreating] = useState(false)

    const {onUpdate, isUpdated} = useSwitch()
    
    const handleCreate = async () => {
        setIsCreating(true)
        await axios.post('/api/transaction', {storeId: params.userId})
            .catch((error) => {
                console.log(error)
            })
            .then((response) => {
                if (response?.data) {
                    const typedDocument: { [key:string]: HookDocuments} = {
                        [response.data.id] : response.data
                    }

                    addBulkDocuments(typedDocument)
                    addBulkDocumentArrays('', [response.data.id])
                }
                
            })
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
                onClick={handleCreate}
                disabled={isCreating}
            >
                Add First Transaction
            </Button>
        </div>
    );
}
 
export default ServerPage;