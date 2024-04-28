import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";

interface DataCardProps{
    title: string,
    initialValue: number,
    rootedValue: number,
    isArchive: boolean,
    createdAt: string,
    updatedAt: string
}

const ChildrenCard = ({
    title,
    initialValue,
    rootedValue,
    isArchive,
    createdAt,
    updatedAt
}: DataCardProps) => {

    function formatDate(dateString: string): string {
        const date = new Date(dateString);
        return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}, ${date.toLocaleTimeString('en-US', { hour12: false }).slice(0, 5)}`;
    }

    return (  
        <Card>
            <CardHeader className="flex flex-row items-start justify-between space-y-0 p-4">
                <CardTitle className="text-sm font-medium">
                    {title}
                </CardTitle>
                <CardTitle className="text-sm font-medium flex flex-col gap-2">
                    <p>Created on:</p>{formatDate(createdAt)}
                </CardTitle>
                <CardTitle className="text-sm font-medium flex flex-col gap-2">
                    <p>Last Update:</p>{formatDate(updatedAt)}
                </CardTitle>
            </CardHeader>
            <CardContent className="p-2">
                <div className="flex flex-row justify-center gap-4">
                    <div className={cn(
                        'overflow-hidden text-[14px] font-medium flex flex-row gap-2',
                        (initialValue < 0) ? 'text-red-600' : 'text-yellow-500'
                    )}>
                        <p className="text-[15px] text-white">Added:</p>{formatPrice(initialValue)}
                    </div>
                    <div className={cn(
                        'overflow-hidden text-[14px] font-medium flex flex-row gap-2',
                        (rootedValue < 0) ? 'text-red-400' : 'text-green-500'
                    )}>
                        <p className="text-[15px] text-white">Rooted:</p>{formatPrice(rootedValue)}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
 
export default ChildrenCard;