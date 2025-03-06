import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Button } from '../../../../components/ui/button';

interface ExportReportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (format: string, options: any) => void;
}

export const ExportReportDialog: React.FC<ExportReportDialogProps> = ({
  isOpen,
  onClose,
  onExport
}) => {
  const [format, setFormat] = useState('pdf');
  const [options, setOptions] = useState({
    includeCharts: true,
    includeTables: true,
    dateRange: 'all'
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl shadow-xl w-full max-w-md"
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Export Report</h2>
            <Button type="button" variant="ghost" size="sm" onClick={onClose}>
              <Icons.X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <form onSubmit={(e) => {
          e.preventDefault();
          onExport(format, options);
        }} className="p-6 space-y-4">
          <div>
            <label htmlFor="report-export-format" className="block text-sm font-medium text-gray-700 mb-1">
              Export Format
            </label>
            <select
              id="report-export-format"
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg"
            >
              <option value="pdf">PDF</option>
              <option value="excel">Excel</option>
              <option value="csv">CSV</option>
            </select>
          </div>

          <div>
            <p id="include-options-label" className="block text-sm font-medium text-gray-700 mb-2">
              Include
            </p>
            <div className="space-y-2" role="group" aria-labelledby="include-options-label">
              <label htmlFor="include-charts" className="flex items-center gap-2">
                <input
                  id="include-charts"
                  type="checkbox"
                  checked={options.includeCharts}
                  onChange={(e) => setOptions(prev => ({
                    ...prev,
                    includeCharts: e.target.checked
                  }))}
                  className="rounded border-gray-300"
                />
                <span className="text-sm">Charts and Graphs</span>
              </label>
              <label htmlFor="include-tables" className="flex items-center gap-2">
                <input
                  id="include-tables"
                  type="checkbox"
                  checked={options.includeTables}
                  onChange={(e) => setOptions(prev => ({
                    ...prev,
                    includeTables: e.target.checked
                  }))}
                  className="rounded border-gray-300"
                />
                <span className="text-sm">Data Tables</span>
              </label>
            </div>
          </div>

          <div>
            <label htmlFor="report-date-range" className="block text-sm font-medium text-gray-700 mb-1">
              Date Range
            </label>
            <select
              id="report-date-range"
              value={options.dateRange}
              onChange={(e) => setOptions(prev => ({
                ...prev,
                dateRange: e.target.value
              }))}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg"
            >
              <option value="all">All Time</option>
              <option value="year">Past Year</option>
              <option value="quarter">Past Quarter</option>
              <option value="month">Past Month</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>
        </form>

        <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            <Icons.Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </motion.div>
    </div>
  );
};