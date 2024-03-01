'use client'

import {useMediaQuery} from 'usehooks-ts'

import ItemList from "./ItemList";
import { cn } from "@/lib/utils";
import { Archive, ChevronsLeft, MenuIcon, PlusCircle, Search, Trash } from "lucide-react";
import { usePathname } from "next/navigation";
import { useRouter } from "next/router";
import React, { ElementRef, useEffect, useRef, useState } from "react";
import Item from './Item';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import axios from 'axios';
import { useSwitch } from '@/hooks/use-switch';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface SidebarNavigationProps {
    userId: string
}

const SidebarNavigation = ({
    userId
} : SidebarNavigationProps) => {

    const pathname = usePathname()
    const isMobile = useMediaQuery('(max-width: 768px)')
    // const profile = await currentProfile()
    const isResizingRef = useRef(false)
    const sidebarRef = useRef<ElementRef<'aside'>>(null)
    const navbarRef = useRef<ElementRef<'div'>>(null)
    const [isResetting, setIsResetting] = useState(false)
    const [isCollapsed, setIsCollapsed] = useState(isMobile)

    const {onUpdate} = useSwitch()

    useEffect(() => {
        if (isMobile) {
            collapse()
        } else {
            resetWidth()
        }
    }, [isMobile])

    useEffect(() => {
        if (isMobile) {
            collapse()
        }
    }, [pathname, isMobile])

    const handleMouseDown = (
        event: React.MouseEvent<HTMLDivElement, MouseEvent>
    ) =>  {
        event.preventDefault()
        event.stopPropagation()

        isResizingRef.current = true;
        document.addEventListener('mousemove', handleMouseMove)
        document.addEventListener('mouseup', handleMouseUp)
    }

    const handleMouseMove = (event: MouseEvent) => {
        if (!isResizingRef.current) return
        let newWidth = event.clientX

        if (newWidth < 240) newWidth = 240
        if (newWidth > 480) newWidth = 480

        if (sidebarRef.current && navbarRef.current) {
            sidebarRef.current.style.width = `${newWidth}px`
            navbarRef.current.style.setProperty('left', `${newWidth}px`)
            navbarRef.current.style.setProperty('width', `calc(100% - ${newWidth}px)`)
            navbarRef.current.style.cursor = 'cursor';
        }
    }

    const handleMouseUp = () => {
        isResizingRef.current = false
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
    }

    const resetWidth = () => {
        if (sidebarRef.current && navbarRef.current) {
            setIsCollapsed(false)
            setIsResetting(true)

            sidebarRef.current.style.width = isMobile ? '100%' : '240px'
            navbarRef.current.style.setProperty(
                'width',
                isMobile ? '0' : 'calc(100% - 240px)'
            )
            navbarRef.current.style.setProperty(
                'left',
                isMobile ? '100%' : '240px'
            )
            setTimeout(() => setIsResetting(false), 300)
        }
    }

    const collapse = () => {
        if (sidebarRef.current && navbarRef.current) {
            setIsCollapsed(true)
            setIsResetting(true)

            sidebarRef.current.style.width = '0'
            navbarRef.current.style.setProperty('width', '100%')
            navbarRef.current.style.setProperty('left', '0')

            setTimeout(() => setIsResetting(false), 300)
        }
    }

    const handleCreate = async () => {
        onUpdate()
    }
    
    return (
        <>
            <aside
                ref={sidebarRef} 
                className={cn(
                    'group/sidebar h-full bg-secondary overflow-y-auto relative w-60 flex flex-col z-[40]',
                    isResetting && 'transition-all ease-in-out duration-300',
                    isMobile && 'w-0',
                )}
            >
                <div
                    onClick={collapse}
                    role="button"
                    className={cn(
                        'h-6 w-6 text-muted-foreground rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600 absolute top-3 right-2 opacity-0 group-hover/sidebar:opacity-100 transition'
                    )}
                >
                    <ChevronsLeft className="h-6 w-6"/>
                </div>
                <div className="h-full w-full p-2 pr-2 flex flex-col">
                    <Item
                        label="Search"
                        icon={Search}
                        isSearch
                        onClick={() => {}}
                    />
                    <Item 
                        label="New Page"
                        icon={PlusCircle}
                        onClick={handleCreate}
                    />
                    <ScrollArea className="flex-1 w-full overflow-y-auto">
                        <ItemList storeId={userId}/>
                    </ScrollArea>
                    <Popover>
                        <PopoverTrigger className='w-full mt-4'>
                            <Item
                                label='Archive'
                                icon={Archive}
                                onClick={() => {}}
                            />
                        </PopoverTrigger>
                        <PopoverContent 
                            className='p-0 w-72'
                            side={isMobile ? 'bottom' : 'right'}
                        >
                            <p>Archive</p>
                        </PopoverContent>
                    </Popover>
                    <Popover>
                        <PopoverTrigger className='w-full mt-4'>
                            <Item
                                label='Trash'
                                icon={Trash}
                                onClick={() => {}}
                            />
                        </PopoverTrigger>
                        <PopoverContent 
                            className='p-0 w-72'
                            side={isMobile ? 'bottom' : 'right'}
                        >
                            <p>Trash can</p>
                        </PopoverContent>
                    </Popover>
                </div>
                <div 
                    onMouseDown={handleMouseDown}
                    onClick={resetWidth}
                    className="opacity-0 group-hover/sidebar:opacity-100 transition cursor-ew-resize absolute h-full w-1 bg-primary/10 right-0 top-0" 
                />
            </aside>
            <div 
                ref={navbarRef}
                className={cn(
                    'absolute    z-40 left-60 w-[calc(100%-240px)]',
                    isResetting && 'transition-all ease-in-out duration-300',
                    isMobile && 'left-0 w-full'
                )}
            >
                <nav className="bg-transparent px-3 py-2 w-full">
                    {isCollapsed && <MenuIcon onClick={resetWidth}
                    role='button' className='h-6 w-6 text-muted-foreground' />}
                </nav>
            </div>
        </>     
    );
}
 
export default SidebarNavigation;