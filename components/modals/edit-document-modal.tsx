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
    
    const { isOpen, onClose, data, itemUpdate, onValueAdd } = useUpdateModal()

    const [documentValue, setDocumentValue] = useState(0)
    
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
            setDocumentValue(data.initialValue)
        }
    }, [data, form])
    
    const isLoading = form.formState.isSubmitting;
    
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
            await axios.patch(`/api/transaction/${data?.id}`, values)
                .catch((error) => {
                    console.log(error)
                })
                .then((result) => {

                    // change the hooks data updatedId and data
                    
                    if (data !== undefined) {
                        itemUpdate(result?.data)
                        onValueAdd(data?.id, documentValue, values.initialValue, 100)

                    }
                    form.reset()
                    onClose()
                })
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