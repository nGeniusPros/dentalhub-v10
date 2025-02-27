import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { BaseChart } from './BaseChart';
import { chartColors, chartConfig, chartColorSequence } from '../../../lib/chartStyles';

interface BarChartProps {
  data: any[];
  bars: Array<{
    key: string;
    color?: string;
    name?: string;
  }>;
  xAxisKey: string;
  title?: string;
  height?: number;
  stacked?: boolean;
  className?: string;
  barSize?: number;
}

export const BarChartComponent: React.FC<BarChartProps> = ({
  data,
  bars,
  xAxisKey,
  title,
  height,
  stacked = false,
  className,
  barSize
}) => {
  return (
    <BaseChart title={title} height={height} className={className}>
      <BarChart data={data}>
        <CartesianGrid 
          strokeDasharray={chartConfig.lineChart.gridStrokeDasharray} 
          stroke={`rgba(203, 213, 225, ${chartConfig.lineChart.gridStrokeOpacity})`} 
        />
        <XAxis
          dataKey={xAxisKey}
          axisLine={false}
          tickLine={false}
          tick={{ fill: chartColors.navy.DEFAULT, fontSize: 12 }}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fill: chartColors.navy.DEFAULT, fontSize: 12 }}
        />
        <Tooltip
          contentStyle={chartConfig.tooltip.contentStyle}
        />
        <Legend />
        {bars.map((bar, index) => {
          // Use brand colors from the sequence if no color is specified
          const color = bar.color || chartColorSequence[index % chartColorSequence.length];
          
          return (
            <Bar
              key={index}
              dataKey={bar.key}
              name={bar.name || bar.key}
              fill={color}
              stackId={stacked ? 'stack' : undefined}
              radius={chartConfig.barChart.cornerRadius}
              barSize={barSize || chartConfig.barChart.barSize}
            />
          );
        })}
      </BarChart>
    </BaseChart>
  );
};