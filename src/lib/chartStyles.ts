/**
 * DentalHub Chart Styling Configuration
 * Standardized styling for Recharts components based on the DentalHub design system
 */

// Primary colors for charts from the tailwind config
export const chartColors = {
  // Primary palette
  navy: {
    DEFAULT: '#1B2B5B',
    light: '#2A407F',
    lighter: '#3855A3',
    opacity: 'rgba(27, 43, 91, 0.8)', // Navy with opacity for line charts
    ultraLight: 'rgba(27, 43, 91, 0.2)'
  },
  gold: {
    DEFAULT: '#C5A572',
    light: '#D4BC94',
    lighter: '#E3D3B6',
    opacity: 'rgba(197, 165, 114, 0.8)',
  },
  blue: {
    DEFAULT: '#7D9BB9',
    soft: '#9BB4CA',
    lighter: '#B9CDDB',
    opacity: 'rgba(125, 155, 185, 0.8)',
  },
  turquoise: {
    DEFAULT: '#4BC5BD',
    light: '#76D4CE',
    lighter: '#A1E3DF',
    opacity: 'rgba(75, 197, 189, 0.8)',
  },
  purple: {
    DEFAULT: '#6B4C9A',
    light: '#8A6FB3',
    lighter: '#A992CC',
    opacity: 'rgba(107, 76, 154, 0.8)',
  },
  green: {
    DEFAULT: '#41B38A',
    light: '#6BC4A4',
    lighter: '#95D5BE',
    opacity: 'rgba(65, 179, 138, 0.8)',
  },
  gray: {
    DEFAULT: '#CED4DA',
    light: '#DEE2E6',
    lighter: '#E9ECEF',
    opacity: 'rgba(206, 212, 218, 0.8)',
  }
};

// Standard chart color sequences for consistent use across components
export const chartColorSequence = [
  chartColors.navy.DEFAULT,
  chartColors.gold.DEFAULT,
  chartColors.turquoise.DEFAULT,
  chartColors.purple.DEFAULT,
  chartColors.green.DEFAULT,
  chartColors.blue.DEFAULT,
];

// Chart configuration constants
export const chartConfig = {
  lineChart: {
    strokeWidth: 2,
    dotRadius: 4,
    activeDotRadius: 6,
    gridStrokeDasharray: '3 3',
    gridStrokeOpacity: 0.3,
  },
  barChart: {
    cornerRadius: [4, 4, 0, 0],
    barSize: 40,
    barGap: 4,
  },
  pieChart: {
    innerRadius: 60,
    outerRadius: 100,
    paddingAngle: 2,
    labelLine: true,
  },
  tooltip: {
    contentStyle: {
      backgroundColor: '#fff',
      border: 'none',
      borderRadius: '0.5rem',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      padding: '8px 12px',
    }
  }
};

// Sample chart data for demonstration/testing
export const sampleChartData = {
  lineData: [
    { month: 'Jan', revenue: 3500, patients: 120 },
    { month: 'Feb', revenue: 4200, patients: 145 },
    { month: 'Mar', revenue: 3800, patients: 132 },
    { month: 'Apr', revenue: 5100, patients: 168 },
    { month: 'May', revenue: 5400, patients: 175 },
    { month: 'Jun', revenue: 6200, patients: 195 },
  ],
  barData: [
    { category: 'Cleaning', completed: 84, scheduled: 12 },
    { category: 'Filling', completed: 65, scheduled: 18 },
    { category: 'Crown', completed: 42, scheduled: 9 },
    { category: 'Root Canal', completed: 25, scheduled: 15 },
    { category: 'Extraction', completed: 18, scheduled: 7 },
  ],
  pieData: [
    { name: 'Cleaning', value: 35, color: chartColors.navy.DEFAULT },
    { name: 'Filling', value: 25, color: chartColors.gold.DEFAULT },
    { name: 'Crown', value: 20, color: chartColors.turquoise.DEFAULT },
    { name: 'Root Canal', value: 15, color: chartColors.purple.DEFAULT },
    { name: 'Extraction', value: 5, color: chartColors.green.DEFAULT },
  ],
};
