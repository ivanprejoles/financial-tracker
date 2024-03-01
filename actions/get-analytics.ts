import db from "@/lib/prismadb";

const getAnalytics = async (userId: string, documentId: string) => {
    try {
        const document = await db.transactions.findUnique({
            where: {
                id: documentId,
                storeId: userId
            }
        })

        const documents = await db.transactions.findMany({
            where: {
                storeId: userId,
                idReference: documentId
            },
            orderBy: {
                createdAt: 'asc'
            }
        })

        let data;
        if (document !== null && documents !== null) {
            const addedArray = [document, ...documents]
            data = addedArray.map((obj) => ({value:obj.initialValue, date: obj.createdAt.toISOString()}))
        }

        return {
            document,
            documents,
            data
        }

    } catch (error) {
        console.log('[GET_ANALYTICS]', error)
        return {
            document: undefined,
            documents: undefined
        }
    }
}
 
export default getAnalytics;