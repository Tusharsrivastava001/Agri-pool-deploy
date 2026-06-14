import React from 'react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

const data = [
    { name: 'Jan', price: 4000 },
    { name: 'Feb', price: 3000 },
    { name: 'Mar', price: 2000 },
    { name: 'Apr', price: 2780 },
    { name: 'May', price: 1890 },
    { name: 'Jun', price: 2390 },
    { name: 'Jul', price: 3490 },
];

const MarketTrendsChart = () => {
    return (
        <div className="h-72 w-full p-6 rounded-2xl shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] border border-white/20 bg-white/10 dark:bg-black/20 backdrop-blur-md">
            <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">Market Price Trends (Wheat)</h3>
            <ResponsiveContainer width="100%" height="80%">
                <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                        <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="name" stroke="#8884d8" />
                    <YAxis stroke="#8884d8" />
                    <Tooltip contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', borderRadius: '8px', color: '#333' }} />
                    <Area type="monotone" dataKey="price" stroke="#10b981" fillOpacity={1} fill="url(#colorPrice)" />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};

export default MarketTrendsChart;
