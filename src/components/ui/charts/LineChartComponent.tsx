import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { BaseChart } from './BaseChart';
import { chartColors, chartConfig } from '../../../lib/chartStyles';

interface LineChartProps {
  data: any[];
  lines: Array<{
    key: string;
    color?: string;
    name?: string;
  }>;
  xAxisKey: string;
  title?: string;
  height?: number;
  className?: string;
}

export const LineChartComponent: React.FC<LineChartProps> = ({
  data,
  lines,
  xAxisKey,
  title,
  height,
  className
}) => {
  return (
    <BaseChart title={title} height={height} className={className}>
      <LineChart data={data}>
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
        {lines.map((line, index) => {
          // Use Navy as the default color with fallback to the color sequence
          const color = line.color || (index === 0 ? chartColors.navy.DEFAULT : chartColors.navy.opacity);
          
          return (
            <Line
              key={index}
              type="monotone"
              dataKey={line.key}
              name={line.name || line.key}
              stroke={color}
              strokeWidth={chartConfig.lineChart.strokeWidth}
              dot={{ 
                fill: color, 
                strokeWidth: chartConfig.lineChart.strokeWidth, 
                r: chartConfig.lineChart.dotRadius 
              }}
              activeDot={{ 
                r: chartConfig.lineChart.activeDotRadius, 
                strokeWidth: chartConfig.lineChart.strokeWidth 
              }}
            />
          );
        })}
      </LineChart>
    </BaseChart>
  );
};