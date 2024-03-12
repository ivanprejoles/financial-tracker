'use client'

import * as z from 'zod'
import {zodResolver} from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form';
import axios from 'axios'

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from '@/components/ui/dialog'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUpdateModal } from '@/hooks/use-update-document-modal';
import { Textarea } from '../ui/textarea';
import { useDocuments } from '@/hooks/use-documents';
import { HookDocuments } from '@/type';


const formSchema = z.object({
    title: z.string().min(5, {
        message: 'Title is required to be 5 letters and more.'
    }),
    initialValue: z.number().superRefine((val) => {
        // Convert the value to a number if it's a string.
        if (typeof val === 'string') {
          val = Number(val);
        }
    
        // Check if the value is a valid number with two decimal places using a regular expression.
        if (!/^-?\d+(?:\.\d{2})?$/g.test(String(val))) {
    //   throw new z.ZodError('Invalid input: Must be a number with 2 decimal places');
        }
    
        return val;
      }),
    description: z.string().min(0).default('')
})

const UpdateDocumentModal = () => {
    const Router = useRouter()
    
    const { 
        isOpen, 
        onClose, 
        data
    } = useUpdateModal()
    
    const {
        documents,
        updateDocument,
        addBulkDocuments
    } = useDocuments()

    const [previousValue, setPreviousValue] = useState(0)
    
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: '',
            initialValue: 0,
            description: ''
        },
    })
    
    useEffect(() => {
        if (data) {

            form.setValue('title', data.title)
            form.setValue('description', data.description)
            form.setValue('initialValue', data.initialValue)
    
            //initialize state as item value
            // previous value
            setPreviousValue(data.initialValue)
        }
    }, [data, form])
    
    const isLoading = form.formState.isSubmitting;
    
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            values.initialValue = Number(values.initialValue.toFixed(2));
            await axios.patch(`/api/transaction/${data?.id}`, values)
                .catch((error) => {
                    console.log(error)
                })
                .then((response) => {
                    if (data !== undefined) {
    
                        // update document
                        updateDocument(response?.data)
    
                        let depth = response?.data.id
    
                        const changedDocuments = documentsValueUpdate(depth, response?.data.initialValue)
    
                        DocumentsRequestUpdate(changedDocuments, response?.data.storeId)
                    }
                    form.reset()
                    onClose()
                    Router.push(`/server/${response?.data.storeId}`)
                })
        } catch (error) {
            console.log(error)
        }
    }


    const documentsValueUpdate = (depth: string, newValue: number) => {
        // updated documents storage
        const updatedDocuments:{
            [key: string]: {
                rootedValue: number
            }
        } = {}
        // previous 
        let previousDocumentValue = previousValue;
        let newDocumentValue = newValue;

        while (depth) {
            // initialize document
            let HookDocument = documents[depth]

            //update to 2 decimal
            updatedDocuments[HookDocument.id] = {
                rootedValue: Number(( - previousDocumentValue + newDocumentValue + HookDocument.parentValue).toFixed(2))
            }
            // if on the root
            if (depth === 'root') {
                break;
            }
            // change depth down
            depth = HookDocument.idReference
        }
        return updatedDocuments
    }

    const DocumentsRequestUpdate = async (HookDocument: { [key: string]: { rootedValue: number }}, storeId: string) => {
        if (Object.keys(HookDocument).length !== 0) {

            await axios.patch('/api/transactions', {values: HookDocument, storeId})
                .catch((error) => {
                    console.log(error)
                })
                .then((response) => {
                    const objectValues: HookDocuments[] = Object.values(response?.data)

                    for (const value of objectValues) {
                        updateDocument(value)
                    }
                })
        }
    }   
    
    const handleClose = () => {
        form.reset();
        onClose();
    }
    
    return ( 
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className='bg-white text-black p-0 overflow-hidden'>
                <DialogHeader className='pt-8 px-6'>
                    <DialogTitle className='text-2xl text-center font-bold'>
                        Update The Document
                    </DialogTitle>
                    <DialogDescription className='text-center text-zinc-500'>
                        Give your document a life and blah blah blah
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}
                    className='space-y-8'
                    >
                        <div className="space-y-8 px-6">
                            <FormField
                                control={form.control}
                                name="title"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel
                                            className='uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70'
                                        >
                                            Document Title
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={isLoading}
                                                placeholder='Enter your document title'
                                                className='bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0'
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="initialValue"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel
                                            className='uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70'
                                        >
                                            InitialValue
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                step='.01'
                                                type='number'
                                                max={1000000}
                                                min={-1000000}
                                                disabled={isLoading}
                                                placeholder='Enter your initial value'
                                                className='bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0'
                                                { ...form.register('initialValue', { valueAsNumber: true } ) } 
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="description"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel
                                            className='uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70'
                                        >
                                            Description
                                        </FormLabel>
                                        <FormControl>
                                            <Textarea

                                                disabled={isLoading}
                                                placeholder='Enter your description'
                                                className='bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0 resize-none max-h-[500px]'
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <DialogFooter className='bg-gray-100 px-6 py-4'>
                            <Button variant="primary" disabled={isLoading}>
                                Update
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
     );
}
 
export default UpdateDocumentModal;