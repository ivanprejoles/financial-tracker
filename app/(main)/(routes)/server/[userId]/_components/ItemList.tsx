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

interface ItemListProps {
    parentReference?: string
    level?: number,
    storeId?: string,
    onUpdate?: (id: string, previousVal: number, newVal: number) => void,
    onArchive?: (listing: Transactions) => void,
    onDelete?: (listing: Transactions) => void,
}

const ItemList = ({
    parentReference,
    level = 0,
    storeId,
    onUpdate,
    onArchive,
    onDelete
}: ItemListProps) => {

    const Params = useParams()
    const Router = useRouter()

    const {isUpdated} = useSwitch()
    const {updatedId, onOpen, onValueAdd, changedValue,} = useUpdateModal()
    
    const [isInitial, setIsInitial] = useState(true)
    const [expanded, setExpanded] = useState<Record<string, boolean>>({})
    const [itemListings, setItemListings] = useState<Transactions[]>([])  

    useEffect(() => {
        const readyToUpdate = Object.values(changedValue).find( item => item.level === 0) 
        if (readyToUpdate) {
            valueUpdateAxios()
        }
    }, [changedValue])

    useEffect(() => {
        if (Object.keys(changedValue).length !== 0 && updatedId) {
            itemListings.forEach(item => {
                if (item.id === updatedId) {
                    const {itemValue, parentValue} = changedValue[item.id]
                    onValueAdd(item.id, parentValue, (-itemValue + parentValue) + item.parentValue, level)
                    if (level !== 0) {
                        onUpdate?.(item.idReference, item.parentValue, (-itemValue + parentValue) + item.parentValue)
                    } else {
                        window.location.reload()
                    }              
                }
            })  
        } 
    }, [updatedId, level])
    
    // item list drilling
    const valueUpdate = (id: string, previousVal: number, newVal: number) => {

        const itemListing = itemListings.find(item => item.id === id)

        if (itemListing) {  


            onValueAdd(itemListing.id, itemListing.initialValue, (- previousVal + newVal) + itemListing.parentValue, level)

            if (level !== 0) {
                onUpdate?.(itemListing.idReference, itemListing.parentValue, (- previousVal + newVal) + itemListing.parentValue)
                // to reset updatedId to use item update item again for useeffect dependency
            }
        }
    }

    //archive
    const documentArchive = async (document: Transactions) => {

        await axios.patch('/api/archive', {storeId, id: document.id, isArchive: !document.isArchive})
                    .catch((error) => {
                        console.log(error)
                    })
                    .then((response) => {
                        //refresh page
                        window.location.reload()
                    })
    }

    //delete
    const documentDelete = async (document: Transactions) => {

        await axios.patch('/api/trash', {storeId, id: document.id, isDeleted: !document.isDeleted})
                    .catch((error) => {
                        console.log(error)
                    })
                    .then((response) => {
                        //refresh page in the method
                        onUpdate?.(document.idReference, document.parentValue, (-document.initialValue + 0) + document.parentValue)
                    })
    }
    
    const valueUpdateAxios = async () => {
        if (level === 0) {
            await axios.patch('/api/transactions', {values:changedValue, storeId})
                .catch((error) => {
                    return console.log(error)
                })
                .then((response) => {
                    console.log(response?.data)
                    return window.location.reload()
                })
        }
    }
    
    // item list modal
    const onExpand = (documentId: string) => {
        setExpanded(prevExpanded => ({
            ...prevExpanded,
            [documentId]: !prevExpanded[documentId]
        }))
    }
        
    // useeffect for getting all data or adding an item
    useEffect(() => {

        // getItems if initially opened
        const getItems = async () => {
            await axios.post('/api/transactions', {idReference: parentReference, storeId})
                .catch((error) => {
                    return console.log(error)
                })  
                .then((response) => {
                    return setItemListings(response?.data)
                })
        }

        // addItem if not parent
        const addItem = async () => {
            await axios.post('/api/transaction', {storeId})
                .catch((error) => {
                    console.log(error)
                })
                .then((response) => {
                    setItemListings(Previous => [...Previous, response?.data])
                })
        }

        if (isInitial) {
            getItems()
            setIsInitial(false)
        } else {
            if (!parentReference) addItem()
        }
        
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [parentReference, storeId, isUpdated])




    if (itemListings === undefined) {
        return (
            <>
               <Item.Skeleton level={level} />
               <Item.Skeleton level={level} />
            </>
        )
    }

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

                        onClick={() => onOpen(listing)}
                        onExpand={() => onExpand(listing.id)}
                        onArchive={() => documentArchive(listing)}
                        onDelete={() => documentDelete(listing)}

                        icon={FileIcon}
                        documentIcon={listing.parentValue}
                        documentInitialIcon={listing.initialValue}
                    />
                    {expanded[listing.id] && (
                        <ItemList
                            parentReference={listing.id}
                            level={level + 1}
                            storeId={storeId}

                            onUpdate={(id, previousVal, newVal) => valueUpdate(id, previousVal, newVal)}
                        />
                    )}
                </div>
            ))}
        </>
    );
}


 
export default ItemList;