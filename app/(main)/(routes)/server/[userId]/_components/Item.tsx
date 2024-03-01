'use client'

import { 
    DropdownMenu,
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";

import { cn } from "@/lib/utils";
import axios from "axios";

import {
    ChevronDown, 
    ChevronRight, 
    LucideIcon, 
    MoreHorizontal,
    Plus,
    Trash 
} from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

interface ItemProps {
    id?: string
    label: string,
    documentIcon?: string|number,
    documentInitialIcon?: string|number,
    storeId?: string,
    level?: number,
    active?: boolean,
    expanded?: boolean,
    isSearch?: boolean,
    onExpand?: () => void,
    onClick: () => void,
    onArchive?: () => void,
    onDelete?: () => void,
    icon: LucideIcon,
}

const Item = ({
    id,
    label,
    documentIcon,
    documentInitialIcon,
    storeId,
    level = 0,
    active,
    expanded,
    isSearch,
    onExpand,
    onClick,
    onArchive,
    onDelete,
    icon: Icon
}: ItemProps) => {

    const handleExpand = (
        event: React.MouseEvent<HTMLDivElement, MouseEvent>
    ) => {
        event.stopPropagation()
        onExpand?.()
    }

    const Router = useRouter()
    
    const onRedirect = () => {
        Router.push(`/server/${storeId}/document/${id}`)
    }

    const onCreate = async (
        event: React.MouseEvent<HTMLDivElement, MouseEvent>
    ) => {
        event.stopPropagation()

        if (!id) return
        
        if (expanded) {
            onExpand?.()
        }

        await axios.post('/api/transaction', { idReference: id, storeId})
            .catch((error) => {
                console.log(error)
            })
            .then(() => {
                onExpand?.()
                //router push for next document
            })
    }

    const ChevronIcon = expanded ? ChevronDown : ChevronRight;

    
    
    return (  
        <div
            onClick={() => {(!!id) ? onRedirect() : onClick()}}
            role="button"
            style={{
                paddingLeft: level ? `${(level * 12) + 12}px` : '12px'
            }}
            className={cn(
                'group minh-[27px] text-sm py-1 pr-3 w-full hover:bg-primary/5 flex items-center text-muted-foreground font-medium',
                active && 'bg-primary/5 text-primary'
            )}
        >
            {!!id && (
                <div 
                    role="button"
                    className="h-full rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600 mr-1"
                    onClick={handleExpand}
                >
                    <ChevronIcon
                        className="h-4 w-4 shrink-0 text-muted-foreground/50"
                    />
                </div>
            )}
            {(documentIcon || documentIcon === 0) ? (
                <>
                    <div className={cn(
                        'shrink-0 mr-2 text-[8px]',
                        (typeof documentInitialIcon == 'number' && documentInitialIcon <  0) ? 'text-red-600' : 'text-yellow-500'
                    )}>
                        {documentInitialIcon}
                    </div>
                    <div className={cn(
                        'shrink-0 mr-2 text-[10px]',
                        (typeof documentIcon == 'number' && documentIcon < 0) ? 'text-red-400' : 'text-green-500'
                    )}>
                            {documentIcon}
                    </div>
                </>
            ) : (
                <Icon className="shrink-0 h-[18px] w-[18px] mr-2 text-muted-foreground"/>
            )}
            <span className="truncate max-w-[100px]" >
                {label}
            </span>
            {isSearch && (
                <kbd className="ml-auto mr-4 pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 text-[10px] font-medium text-muted-foreground opacity-100">
                    <span className="text-start">⌘</span>K
                </kbd>
            )}
            {!!id && (
                <div className="ml-auto flex items-center gap-x-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger
                            onClick={(e) => e.stopPropagation()}
                            asChild
                        >
                            <div 
                                role="button"
                                className="opacity-0 group-hover:opacity-100 h-full ml-auto rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600"
                            >
                                <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                            </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            className="w-60"
                            align="start"
                            side="right"
                            forceMount
                        >
                            <DropdownMenuItem onClick={onClick}>
                                Update
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={onArchive}>
                                Archive
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={onDelete}>
                                Delete
                            </DropdownMenuItem>
                            
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <div 
                        role="button"
                        onClick={onCreate}
                        className="opacity-0 group-hover:opacity-100 h-full ml-auto rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600"
                    >
                        <Plus className="h-4 w-4 text-muted-foreground" />
                    </div>
                </div>
            )}
        </div>
    );
}

Item.Skeleton = function ItemSkeleton({ level }: {level?: number}) {
    return (
        <div 
            style={{
                paddingLeft: level ? `${(level * 12) + 25}px` : '12px'
            }}
            className="flex gap-x-2 py-[3px]"
        >
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-[30%]" />
        </div>
    )
}
 
export default Item;