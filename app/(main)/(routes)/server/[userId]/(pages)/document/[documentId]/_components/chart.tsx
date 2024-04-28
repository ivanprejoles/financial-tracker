'use client'

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";
import { 
    XAxis, 
    YAxis, 
    Tooltip, 
    ResponsiveContainer, 
    CartesianGrid,
    AreaChart,
    Area
} from 'recharts';

interface ChartProps {
    data: {
        value: number,
        newValue: number,
        date: string,
        name: string
    }[]
}

const Chart = ({
    data
}: ChartProps) => {
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])
    
    // let condition = true;
    // useEffect(() => {
    //     let value = 0
    //     data?.forEach((item, index: number) => {
    //         let date = formatDate(data[index].date)
    //         value += item.value
    //         data[index] = {
    //             ...item,
    //             date,
    //             newValue: value
    //         }
    //     })
    //     // condition = false
    // }, [])


    // function formatDate(dateString: string): string {
    //     const date = new Date(dateString);
    //     return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()},${date.toLocaleTimeString('en-US', { hour12: false }).slice(0, 5)}`;
    // }
    
    const gradientOffset = () => {
        if (data === undefined) return
        const dataMax = Math.max(...data?.map((i) => i.newValue));
        const dataMin = Math.min(...data?.map((i) => i.newValue));
      
        if (dataMax <= 0) {
          return 0;
        }
        if (dataMin >= 0) {
          return 1;
        }
      
        return dataMax / (dataMax - dataMin);
    };
      

    const off = gradientOffset();
    
    
    if (!isMounted) {
        return (
            <Skeleton className="h-[300px] rounded-xl w-full mt-4"/>
        )
    }

    function CustomTooltip({ payload, label, active }: any) {
        if (active) {
            return (
            <div className="custom-tooltip">
                <p className="label">{label} : ${payload[0].value}</p>
                <p className="desc">Created on : {payload[0].payload.date}</p>
            </div>
            );
        }

        return null;
    }

    return (  
        <Card className="p-2">
            <ResponsiveContainer width="100%" height={350}>
                <AreaChart
                    data={data}
                    margin={{
                        top: 10,
                        right: 30,
                        left: 0,
                        bottom: 0,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis dataKey="newValue" />
                    <Tooltip content={<CustomTooltip />} />
                    <defs>
                        <linearGradient id="splitColor" x1="0" y1="0" x2="0" y2="1">
                            <stop offset={off} stopColor="green" stopOpacity={1} />
                            <stop offset={off} stopColor="red" stopOpacity={1} />
                        </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="newValue" stroke="#000" fill="url(#splitColor)" />
                </AreaChart>
            </ResponsiveContainer>
        </Card>
    );
}
 
export default Chart;