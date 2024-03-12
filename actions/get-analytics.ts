import db from "@/lib/prismadb";

const getAnalytics = async (userId: string, documentId: string) => {
    try {
        let document: any = await db.transactions.findUnique({
            where: {
                id: documentId,
                storeId: userId
            }
        })

        document = {
            ...document,
            createdAt: document.createdAt.toISOString(),
            updatedAt: document.updatedAt.toISOString()
        }
        const documents: any[] = await db.transactions.findMany({
            where: {
                storeId: userId,
                idReference: documentId,
                NOT: {
                    isDeleted: true
                }
            },
            orderBy: {
                createdAt: 'asc'
            }
        })

        Object.keys(documents).forEach((key:any) => {
            documents[key] = {
              ...documents[key],
              createdAt: documents[key].createdAt.toISOString(),
              updatedAt: documents[key].updatedAt.toISOString(),
            }
        });

        const formatDate = (dateString: string): string => {
            const date = new Date(dateString);
            return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()},${date.toLocaleTimeString('en-US', { hour12: false }).slice(0, 5)}`;
        }

        let rawData: any[] = [{value: document.initialValue, date: document.createdAt, name: document.title}]

        if (document !== null && documents !== null) {
            const addedArray = documents.map((obj) => ({value:obj.parentValue, date: obj.createdAt, name: obj.title}))
            rawData = [...rawData, ...addedArray]
        }

        let value = 0
        rawData.forEach((item, index: number) => {
            let date = formatDate(rawData[index].date)
            value += item.value
            rawData[index] = {
                ...item,
                date,
                newValue: value
            }
        }) 

        let data: {value:number, date: string, name: string, newValue: number}[] = rawData


        return {
            document,
            documents,
            data
        }

    } catch (error) {
        console.log('[GET_ANALYTICS]', error)
        return {
            document: undefined,
            documents: undefined,
            data: undefined
        }
    }
}
 
export default getAnalytics;