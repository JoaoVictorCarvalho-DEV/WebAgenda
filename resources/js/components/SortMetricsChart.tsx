import React from "react";
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
} from "recharts";

interface SortMetrics {
    time: number;
    comparisons: number;
    swaps: number;
    steps: number;
}

export default function SortMetricsChart({ metrics }: { metrics: SortMetrics }) {
    const data = [
        {
            name: "Tempo (ms)",
            value: Number(metrics.time.toFixed(2)),
        },
        {
            name: "Comparações",
            value: metrics.comparisons,
        },
        {
            name: "Trocas",
            value: metrics.swaps,
        },
        {
            name: "Passos",
            value: metrics.steps,
        },
    ];

    return (
        <div className="w-full h-[300px] p-4">
            <h3 className="text-lg font-semibold mb-2">Métricas do QuickSort</h3>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="value" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
