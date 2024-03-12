"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Search, Undo } from "lucide-react";
import { Spinner } from "@/components/spinner";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { HookDocuments } from "@/type";
import { useDocuments } from "@/hooks/use-documents";

interface TrashBoxProps {
    storeId: string
}

export const ArchiveBox = ({
    storeId
}: TrashBoxProps) => {
    const Router = useRouter();
    const params = useParams();

    const [archive, setArchive] = useState<{
        [key: string]: HookDocuments
    }|undefined>(undefined)
    const [search, setSearch] = useState("");
    
    const {
        documents,
        addBulkDocumentArrays,
        addBulkDocuments
    } = useDocuments()
    
    useEffect(() => {
        const getTrash = async () => {
            await axios.post(`/api/archive`, {
                    storeId
                })
                .catch((error) => {
                    console.log(error)
                })
                .then((response) => {
                    const objectArchive = Object.fromEntries(
                        response?.data.map((document: HookDocuments) => [document.id, document])
                    );
                    setArchive(objectArchive)
                })
        }
        getTrash()
    }, [])

    let filteredDocuments;
    if (archive) {
        filteredDocuments = Object.values(archive).filter((item) => {
          return item.title.toLowerCase().includes(search.toLowerCase());
        });
    }

  const onClick = (documentId: string) => {
    console.log('archive')
    Router.push(`/server/${storeId}/document/${documentId}`);
  };


    const onRestore = async (
      event: React.MouseEvent<HTMLDivElement, MouseEvent>,
      document: HookDocuments,
    ) => {
        event.stopPropagation();
    
        await axios.patch(`/api/archive/${document.id}`, {
            storeId,
            isArchive: false,
        })
        .catch((error) => {
            console.log(error)
        })
        .then((response) => {   
            const objectWithIdAsKeys: {[key: string]: HookDocuments} = {[response?.data.id]: response?.data}

            addBulkDocuments(objectWithIdAsKeys)

            for (const [key, value] of Object.entries(objectWithIdAsKeys)) {
                if (documents[value.idReference]) {
                    addBulkDocumentArrays(value.idReference, [key])
                }
                if (archive?.[key]) {
                    const newData = { ...archive };
                    // Delete the entry with the specified id
                    delete newData[key];
                    // Update the state with the new object
                    setArchive({ ...newData });
                }
            }
            Router.push(`/server/${storeId}`)
        })
    };

    if (archive === undefined) {
        return (
        <div className="h-full flex items-center justify-center p-4">
            <Spinner size="lg" />
        </div>    
        );
    }

    return (
        <div className="text-sm">
        <div className="flex items-center gap-x-1 p-2">
            <Search className="h-4 w-4" />
            <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-7 px-2 focus-visible:ring-transparent bg-secondary"
            placeholder="Filter by page title..."
            />
        </div>
        <div className="mt-2 px-1 pb-1">
            <p className="hidden last:block text-xs text-center text-muted-foreground pb-2">
            No documents found.
            </p>
            {filteredDocuments?.map((document) => (
            <div
                key={document.id}
                role="button"
                onClick={() => onClick(document.id)}
                className="text-sm rounded-sm w-full hover:bg-primary/5 flex items-center text-primary justify-between"
            >
                <span className="truncate pl-2">
                    {document.title}
                </span>
                <div className="flex items-center">
                    <div
                        onClick={(e) => onRestore(e, document)}
                        role="button"
                        className="rounded-sm p-2 hover:bg-neutral-200 dark:hover:bg-neutral-600"
                    >
                        <Undo className="h-4 w-4 text-muted-foreground" />
                    </div>
                </div>
            </div>
            ))}
        </div>
        </div>
    );
};