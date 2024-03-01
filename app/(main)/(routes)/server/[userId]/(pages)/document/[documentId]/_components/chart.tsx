'use client'

import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface ChartProps {
    data: {
        value: number,
        date: string
    }[]|undefined
}

const Chart = ({
    data
}: ChartProps) => {
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])
    
    if (!isMounted) {
        return null
    }
    
    return (  
        <Card>
            <ResponsiveContainer width="100%" height={350}>
                <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <Line type="monotone" dataKey="value" stroke="#8884d8" />
                    <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                    <XAxis dataKey="date" />
                    <YAxis dataKey='value'/>
                    <Tooltip />
                </LineChart>
            </ResponsiveContainer>
    </Card>
    );
}
 
export default Chart;