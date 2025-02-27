import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { BaseChart } from './BaseChart';
import { chartColors, chartConfig, chartColorSequence } from '../../../lib/chartStyles';

interface PieChartProps {
  data: Array<{
    name: string;
    value: number;
    color?: string;
  }>;
  title?: string;
  height?: number;
  innerRadius?: number;
  outerRadius?: number;
  paddingAngle?: number;
  className?: string;
}

export const PieChartComponent: React.FC<PieChartProps> = ({
  data,
  title,
  height,
  innerRadius = chartConfig.pieChart.innerRadius,
  outerRadius = chartConfig.pieChart.outerRadius,
  paddingAngle = chartConfig.pieChart.paddingAngle,
  className
}) => {
  // Add colors from the sequence to any data items that don't have a color specified
  const coloredData = data.map((item, index) => ({
    ...item,
    color: item.color || chartColorSequence[index % chartColorSequence.length]
  }));

  return (
    <BaseChart title={title} height={height} className={className}>
      <PieChart>
        <Pie
          data={coloredData}
          cx="50%"
          cy="50%"
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          paddingAngle={paddingAngle}
          dataKey="value"
          label={chartConfig.pieChart.labelLine ? {
            fill: chartColors.navy.DEFAULT,
            fontSize: 12
          } : false}
          labelLine={chartConfig.pieChart.labelLine}
        >
          {coloredData.map((entry, index) => (
            <Cell key={index} fill={entry.color} stroke={chartColors.navy.ultraLight} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={chartConfig.tooltip.contentStyle}
        />
        <Legend formatter={(value, entry, index) => (
          <span style={{ color: chartColors.navy.DEFAULT }}>{value}</span>
        )} />
      </PieChart>
    </BaseChart>
  );
};