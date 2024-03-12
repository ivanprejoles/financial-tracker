import getAnalytics from "@/actions/get-analytics";
import Chart from "./_components/chart";
import DocumentCard from "./_components/document-card";

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

    if (!data) {
        return null
    }
    return (  
        <div className="p-6">
            <DocumentCard documents={documents} document={document} />
            <Chart
                data={data}
            />
        </div>
    );
}
 
export default DocumentPage;