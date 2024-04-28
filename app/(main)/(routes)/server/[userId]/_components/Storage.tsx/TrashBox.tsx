"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Search, Trash, Undo } from "lucide-react";
import { Spinner } from "@/components/spinner";
import { Input } from "@/components/ui/input";
import { ConfirmModal } from "@/components/modals/confirm-modal";
import axios from "axios";
import { HookDocuments } from "@/type";
import { useDocuments } from "@/hooks/use-documents";

interface TrashBoxProps {
    storeId: string
}

export const TrashBox = ({
    storeId
}: TrashBoxProps) => {

    const router = useRouter();
    const params = useParams();
    const {
        documents,
        addBulkDocumentArrays,
        addBulkDocuments
    } = useDocuments()

    const [trash, setTrash] = useState<{
        [key: string]: HookDocuments
    }|undefined>(undefined)
    const [search, setSearch] = useState("");
    
    
    useEffect(() => {
        const getTrash = async () => {
            await axios.post(`/api/trash`, {
                    storeId
                })
                .catch((error) => {
                    console.log(error)
                })
                .then((response) => {
                    const objectTrash = Object.fromEntries(
                        response?.data.map((document: HookDocuments) => [document.id, document])
                    );
                    setTrash(objectTrash)
                })
        }
        getTrash()
    }, [])

    let filteredDocuments;
    if (trash) {
        filteredDocuments = Object.values(trash).filter((item) => {
          return item.title.toLowerCase().includes(search.toLowerCase());
        });
    }

  const onClick = (documentId: string) => {
    router.push(`/server/${storeId}/document/${documentId}`);
  };

  const onRemove = async (documentId: string) => {
    try {
      await axios.delete(`/api/trash/${documentId}`, {
        data: {
          storeId
        }
      })
      .catch((error) => {
        console.log(error);
      })
      .then((response) => {
        if (trash?.[documentId]) {
          const newData = { ...trash };
          // Delete the entry with the specified id
          delete newData[documentId];
          // Update the state with the new object
          setTrash({ ...newData });
        }
      });
      if (params.documentId === documentId) {
        router.push(`/server/${storeId}`);
      }
    } catch (error) {
       console.log(error);
    }
  };
   

    const onRestore = async (
      event: React.MouseEvent<HTMLDivElement, MouseEvent>,
      document: HookDocuments,
    ) => {
        event.stopPropagation();

        const changedTrash : { [key: string]: { rootedValue: number } } = depthLoop(document, false)
    
        await axios.patch(`/api/trash`, {
            storeId,
            id: document.id,
            isDeleted: false,
            documents: changedTrash
        })
        .catch((error) => {
            console.log(error)
        })
        .then((response:any) => {
          const objectWithIdAsKeys = Object.fromEntries(
            response?.data.map((document: HookDocuments) => {
                return [
                    document.id,
                    {
                        ...document,
                        childrenKey: [...documents[document.id].childrenKey]
                    }
                ];
            })
        );
            addBulkDocuments(objectWithIdAsKeys)
            for (const [key, value] of Object.entries(objectWithIdAsKeys)) {
                if (documents[value.idReference]) {
                    addBulkDocumentArrays(value.idReference, [key])
                }
                if (trash?.[key]) {
                    const newData = { ...trash };
                    // Delete the entry with the specified id
                    delete newData[key];
                    // Update the state with the new object
                    setTrash({ ...newData });
                }
            }
        })
    };


    const depthLoop = (document: HookDocuments, isDeleted: boolean) => {

        const updatedDocuments: {
            [key: string] : {
                rootedValue: number
            }
        } = {}

        let depth = document.idReference
        let fixedRootedValue = document.parentValue

        if (trash) {
            while (depth) {
                if (trash[depth] === undefined) {
                    break;
                }

                let changingDocument = trash[depth]
                updatedDocuments[depth] = {
                    rootedValue: (isDeleted) 
                                        ? Number((changingDocument.parentValue - fixedRootedValue).toFixed(2))
                                        : Number((changingDocument.parentValue + fixedRootedValue).toFixed(2))
                }
                
                depth = changingDocument.idReference

                if (depth === 'root' ) {
                    return updatedDocuments;
                }
            }
        }

        while (depth) {
            if (documents[depth] === undefined) {
                break;
            }

            let changingDocument = documents[depth]
            updatedDocuments[depth] = {
                rootedValue: (isDeleted) 
                                    ? Number((changingDocument.parentValue - fixedRootedValue).toFixed(2))
                                    : Number((changingDocument.parentValue + fixedRootedValue).toFixed(2))
            }
            
            depth = changingDocument.idReference

            if (depth === 'root' ) {
                break;
            }
        }

        return updatedDocuments
    }

    if (trash === undefined) {
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
              <ConfirmModal onConfirm={() => onRemove(document.id)}>
                <div
                  role="button"
                  className="rounded-sm p-2 hover:bg-neutral-200 dark:hover:bg-neutral-600"
                >
                  <Trash className="h-4 w-4 text-muted-foreground" />
                </div>
              </ConfirmModal>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};