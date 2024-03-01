import DataCard from "./_components/data-card";
import getAnalytics from "@/actions/get-analytics";
import Chart from "./_components/chart";
import { Transactions } from "@prisma/client";


const DocumentPage = async ({
    params
}: {
    params: {userId: string, documentId: string}
}) => {


    const {
        document,
        documents,
        data
    } = await getAnalytics(params.userId, params.documentId)

    return (  
        <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <DataCard
                    label="Title"
                    value={document?.title}
                />
                <DataCard
                    label="Item Financial"
                    value={document?.initialValue}
                    shouldFormat
                    
                />
                <DataCard
                    label="Overall Financial"
                    value={document?.parentValue}
                    shouldFormat
                />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-5 grid-rows-1 md:grid-rows-1 gap-4 mb-4">
                <div className="row-span-full col-start-1 col-end-3 md:row-start-1">
                    <DataCard
                        label="Description"
                        value={(document && document?.description.length > 0) ? document?.description : 'No description yet'}
                    />
                </div>
                <div className="row-span-full md:col-start-3 col-span-full flex flex-col gap-4 row-start-2 md:row-start-1">
                    {(documents && documents.length > 0) 
                        ? (documents?.map((document) => (
                            <DataCard
                                key={document.id}
                                label={document?.title}
                                value={document?.parentValue}
                            />))) 
                        : (
                            <DataCard
                                label="No child document"
                                value='empty document'
                            />)
                    }
                </div>
            </div>
            <Chart
                data={data}
            />
        </div>
    );
}
 
export default DocumentPage;