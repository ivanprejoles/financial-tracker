'use client'

import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "@/components/ui/command";
import { Popover, PopoverContent } from "@/components/ui/popover";
import { useCreateModal } from "@/hooks/use-create-store";
import { useDocuments } from "@/hooks/use-documents";
import { cn } from "@/lib/utils";
import { PopoverTrigger } from "@radix-ui/react-popover";
import { Check, ChevronsUpDown, PlusCircle, Store as StoreIcon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type PopoverTriggerProps = React.ComponentPropsWithoutRef<typeof PopoverTrigger>

interface StoreSwitcherProps extends PopoverTriggerProps {
  items?: Record<string, any>[];
}

const ItemSwitcher = ({ className, items = []} : StoreSwitcherProps ) => {
    const Params = useParams()
    const Router = useRouter()

    const [open, setOpen] = useState(false)

    const {onOpen} = useCreateModal()
    const {
        resetDocuments
    } = useDocuments()

    const formattedItems = items.map((item) => ({
        label: item.name,
        value: item.id
    }))

    const currentStore = formattedItems.find((item) => item.value === Params.userId)

    const onStoreSelect = (store: { value: string, label: string }) => {
        console.log('switcher')
        setOpen(false)
        Router.push(`/server/${store.value}`)
        resetDocuments()

    }

    
    return (  
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant='outline'
                    size='sm'
                    role="combobox"
                    aria-expanded={open}
                    aria-label="Select a store"
                    className={cn('w-[200px] justify-between dark:text-white', className)}
                >
                    <StoreIcon className="mr-2 h-4 w-4 " />
                    {currentStore?.label}
                    <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>        
            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandList>
                        <CommandInput placeholder="Search store..." />
                        <CommandEmpty>No store found.</CommandEmpty>
                        <CommandGroup heading="Stores">
                            {formattedItems.map((store) => (
                                <CommandItem
                                    key={store.value}
                                    onSelect={() => onStoreSelect(store)}
                                    className="text-sm"
                                >
                                    <StoreIcon className="mr-2 h-4 w-4" />
                                    {store.label}
                                    <Check
                                        className={cn(
                                            'ml-auto h-4 w-4',
                                            currentStore?.value === store.value
                                                ? 'opacity-100'
                                                : 'opacity-0'
                                        )}
                                    />
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                    <CommandSeparator/>
                    <CommandList>
                        <CommandGroup
                            onSelect={() => {
                                setOpen(false)
                            }}
                        >
                            <CommandItem
                                onSelect={onOpen}
                            >
                                <PlusCircle className="mr-2 h-5 w-5" />
                                Create Store
                            </CommandItem>
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
 
export default ItemSwitcher;