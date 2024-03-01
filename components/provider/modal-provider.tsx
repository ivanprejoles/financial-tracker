'use client'

import { useEffect, useState } from "react";
import CreateStoreModal from "../modals/create-store-modal";
import UpdateDocumentModal from "../modals/edit-document-modal";

const ModalProvider = () => {
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    if (!isMounted) {
        return null
    }

    return (  
        <>
            <CreateStoreModal />
            <UpdateDocumentModal />
        </>
    );
}
 
export default ModalProvider;