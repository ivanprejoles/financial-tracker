import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";

interface DataCardProps{
    label?: string,
    value?: string|number,
    shouldFormat?: boolean
}

const DataCard = ({
    label,
    value,
    shouldFormat
}: DataCardProps) => {
    return (  
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                    {label}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className={cn(
                    'overflow-hidden',
                    (typeof value === 'number')  ? 'text-2xl font-bold' : 'text-lg font-medium'
                )}>
                    {(typeof value === 'number' && shouldFormat) ? formatPrice(value) : value}
                </div>
            </CardContent>
        </Card>
    );
}
 
export default DataCard;