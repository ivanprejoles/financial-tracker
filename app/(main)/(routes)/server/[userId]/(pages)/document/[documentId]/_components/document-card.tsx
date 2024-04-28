'use client'

import { useEffect, useState } from "react";
import ChildrenCard from "./children-card";
import DataCard from "./data-card";
import { Skeleton } from "@/components/ui/skeleton";

interface DocumentCardProps {
    document: any,
    documents: any[] | undefined
}

const DocumentCard = ({
    document,
    documents
}: DocumentCardProps) => {
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    if (!isMounted) {
        return (
            <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <Skeleton className="h-[105px] rounded-xl flex-1" />
                    <Skeleton className="h-[105px] rounded-xl flex-1" />
                    <Skeleton className="h-[105px] rounded-xl flex-1" />
                </div>
                <Skeleton className="h-[200px] rounded-xl w-full" />
            </>
        )
    }
    
    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <DataCard
                    label="Title"
                    value={document?.title}
                />
                <DataCard
                    label="Item Financial"
                    value={document?.initialValue}
                    shouldFormat
                    
                />
                <DataCard
                    label="Overall Financial"
                    value={document?.parentValue}
                    shouldFormat
                />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-5 grid-rows-1 md:grid-rows-1 gap-4 mb-4">
                <div className="row-span-full col-start-1 col-end-3 md:row-start-1">
                    <DataCard
                        label="Description"
                        value={(document && document?.description.length > 0) ? document?.description : 'No description yet'}
                    />
                </div>
                <div className="row-span-full md:col-start-3 col-span-full flex flex-col gap-4 row-start-2 md:row-start-1">
                    {(documents && documents.length > 0) 
                        ? (documents?.map((document) => (
                            <ChildrenCard
                                key={document.id}
                                title={document.title}
                                initialValue={document.initialValue}
                                rootedValue={document.parentValue}
                                isArchive={document.isArchive}
                                createdAt={document.createdAt}
                                updatedAt={document.updatedAt}

                            />))) 
                        : (
                            <DataCard
                                label="No child document"
                                value='empty document'
                            />)
                    }
                </div>
            </div>
        </>  
    );
}
 
export default DocumentCard;