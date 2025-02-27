import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface RevenueChartProps {
  data: Array<{
    month: string;
    revenue: number;
    goal: number;
  }>;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export const RevenueChart: React.FC<RevenueChartProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <defs>
          <linearGradient id="revenueGradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#1B2B5B" stopOpacity={0.8}/>
            <stop offset="50%" stopColor="#4BC5BD" stopOpacity={0.5}/>
            <stop offset="100%" stopColor="#C5A572" stopOpacity={0.3}/>
          </linearGradient>
          <linearGradient id="goalGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6B4C9A" stopOpacity={0.8}/>
            <stop offset="100%" stopColor="#A992CC" stopOpacity={0.2}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(203, 213, 225, 0.3)" vertical={false} />
        <XAxis 
          dataKey="month" 
          axisLine={false}
          tickLine={false}
          tick={{ fill: '#1B2B5B', fontSize: 12, fontWeight: 500 }}
        />
        <YAxis 
          axisLine={false}
          tickLine={false}
          tick={{ fill: '#1B2B5B', fontSize: 12, fontWeight: 500 }}
          tickFormatter={(value) => formatCurrency(value)}
        />
        <Tooltip
          cursor={{ stroke: '#4BC5BD', strokeWidth: 2 }}
          contentStyle={{
            backgroundColor: '#fff',
            border: 'none',
            borderRadius: '0.5rem',
            boxShadow: '0 8px 16px -4px rgba(27, 43, 91, 0.1)',
            padding: '12px'
          }}
          labelStyle={{ color: '#1B2B5B', fontWeight: 600 }}
          formatter={(value: number, name: string) => [
            formatCurrency(value), 
            name === 'revenue' ? 'Revenue' : 'Goal'
          ]}
        />
        <Line
          type="monotone"
          dataKey="revenue"
          stroke="url(#revenueGradient)"
          strokeWidth={2}
          dot={{ fill: '#4BC5BD', strokeWidth: 2, r: 4 }}
          activeDot={{ r: 8, fill: '#1B2B5B', stroke: '#fff', strokeWidth: 3 }}
          animationDuration={1500}
        />
        <Line
          type="monotone"
          dataKey="goal"
          stroke="url(#goalGradient)"
          strokeWidth={2}
          strokeDasharray="5 5"
          dot={{ fill: '#6B4C9A', strokeWidth: 2, r: 4 }}
          activeDot={{ r: 6, fill: '#6B4C9A', stroke: '#fff', strokeWidth: 2 }}
          animationDuration={1500}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};