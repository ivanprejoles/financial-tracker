'use client'

import { Transactions } from "@prisma/client";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Item from "./Item";
import { cn } from "@/lib/utils";
import { FileIcon} from "lucide-react";
import { useSwitch } from "@/hooks/use-switch";
import { useUpdateModal } from "@/hooks/use-update-document-modal";
import { useDocuments } from "@/hooks/use-documents";
import { HookDocuments } from "@/type";

interface ItemListProps {
    parentReference?: string
    storeId: string,
    level?: number,
    onClick?: (id: string, previousVal: number, newVal: number) => void,
    onArchive?: (listing: HookDocuments) => void,
    onDelete?: (listing: HookDocuments) => void,
}

const ItemList = ({
    parentReference = '',
    level = 0,
    storeId,
}: ItemListProps) => {

    // IMPORT AREA
    const Params = useParams()
    const Router = useRouter()
    const {onOpen} = useUpdateModal()
    const {
        documents, 
        addBulkDocuments,
        addBulkDocumentArrays,
        updateDocument
    } = useDocuments()
    
    // STATE AND VARIABLE AREA
    const [expanded, setExpanded] = useState<Record<string, boolean>>({})
    let itemListings:HookDocuments[]|undefined;
    
    itemListings= documents[parentReference]?.childrenKey
    ?.filter((key) => documents[key]?.isDeleted === false && documents[key]?.isArchive === false)
    ?.map((key) => documents[key]);


    // USE EFFECT AREA
    // get all data by reference to documents
    useEffect(() => {
        // init of data wrapping
        const data: { [key: string]: string|undefined} = {
            ['storeId']: storeId,
            ['idReference']: parentReference
        }

        // if parent reference is first or null
        if (parentReference) {
            data['idReference'] = parentReference;
        }

        //api request all data
        const getDocumentsFromDb = async () => {
            await axios.post('/api/transactions', data)
                .catch((error) => {
                    console.log(error)
                })
                .then((response) => {
                    //add to document as bulk
                    const objectWithIdAsKeys = Object.fromEntries(
                        response?.data.map((document: HookDocuments) => [document.id, document])
                    );
                    addToDocumentsHook(objectWithIdAsKeys)
                    //add to documents item's key reference as array
                    const documentsId = Object.keys(objectWithIdAsKeys)
                    addToDocumentChildrenHook(documentsId)
                })
        }
        // starts here to know if first getting of document
        if (documents[parentReference] && documents[parentReference].childrenKey.length === 0) {
            getDocumentsFromDb()
        }
    }, []);


    // EVENT AREA
    // add to ducment hook
    const addToDocumentsHook = (documents: { [key:string]: HookDocuments}) => {
        addBulkDocuments(documents)
    };

    // add to document hooks array
    const addToDocumentChildrenHook = (childrenId: string[]) => {
        addBulkDocumentArrays(parentReference, childrenId)
    };

    // archive document
    const documentArchive = async (
        document: HookDocuments
    ) => {

        await axios.patch('/api/archive', {
            storeId, 
            id: document.id, 
            isArchive: !document.isArchive
        })
        .catch((error) => {
            console.log(error)
        })
        .then((response) => {
            const objectValue: HookDocuments = response?.data
            updateDocument(objectValue)
        })
    }

    // delete document
    const documentDelete = async (
        document: HookDocuments
    ) => {

        const changedDocument = onTrash(document, true)

        await axios.patch('/api/trash', {
            storeId, 
            id: document.id, 
            isDeleted: !document.isDeleted,
            documents: changedDocument          
        })
        .catch((error) => {
            console.log(error)
        })
        .then((response) => {
            const hookDocuments: HookDocuments[] = Object.values(response?.data)
            for (let value of hookDocuments) {
                updateDocument(value)
            }
        })
    }

    const onTrash = (
        document: HookDocuments, 
        isDeleted: boolean,
    ) => {
        const updatedDocuments: {
            [key: string] : {
                rootedValue: number
            }
        } = {}
        let depth = document.idReference
        let fixedRootedValue = document.parentValue
        while (depth) {
            let changingDocument = documents[depth]
            updatedDocuments[depth] = {
                rootedValue: (isDeleted) 
                                    ? (changingDocument.parentValue - fixedRootedValue)
                                    : (changingDocument.parentValue + fixedRootedValue)
            }
            if (depth === 'root' ) {
                break;
            }
            depth = changingDocument.idReference
        }
        return updatedDocuments
    }

    // item list modal
    const onExpand = (documentId: string) => {
        setExpanded(prevExpanded => ({
            ...prevExpanded,
            [documentId]: !prevExpanded[documentId]
        }))
    }
        
    if (itemListings === undefined) {
        return (
          <>
            <Item.Skeleton level={level} />
            {level === 0 && (
              <>
                <Item.Skeleton level={level} />
                <Item.Skeleton level={level} />
              </>
            )}
          </>
        );
    };

    return ( 
        <>
            <p 
                className={cn(
                    'hidden text-sm font-medium text-muted-foreground/80',
                    expanded && 'last:block',
                    level === 0 && 'hidden'
                )}
            >
                No pages inside
            </p>
            {itemListings.map((listing) => (
                <div key={listing.id}>
                    <Item 
                        label={listing.title}
                        id={listing.id}
                        storeId={storeId}
                        

                        level={level}

                        active={Params.documentId === listing.id}
                        expanded={expanded[listing.id]}

                        onArchive={() => documentArchive(listing)}
                        onDelete={() => documentDelete(listing)}

                        onUpdate={() => onOpen(listing)}
                        onExpand={() => onExpand(listing.id)}
                        onClick={() => {
                            Router.push(`/server/${storeId}/document/${listing.id}`)
                        }}

                        icon={FileIcon}
                        documentIcon={listing.parentValue}
                        documentInitialIcon={listing.initialValue}
                    />
                    {expanded[listing.id] && (
                        <ItemList
                            parentReference={listing.id}
                            level={level + 1}
                            storeId={storeId}
                        />
                    )}
                </div>
            ))}
        </>
    );
}


 
export default ItemList;