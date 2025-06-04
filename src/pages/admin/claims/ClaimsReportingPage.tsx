import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Select, TextInput, Table } from 'flowbite-react';

const ClaimsReportingPage: React.FC = () => {
  const navigate = useNavigate();
  const [reportType, setReportType] = useState('all');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  
  // Mock data for the report
  const reportData = [
    { id: 'CL-001', patient: 'John Smith', provider: 'Dr. Johnson', date: '2025-02-15', amount: 450.00, status: 'Paid' },
    { id: 'CL-002', patient: 'Sarah Johnson', provider: 'Dr. Wilson', date: '2025-02-16', amount: 320.00, status: 'Pending' },
    { id: 'CL-003', patient: 'Robert Brown', provider: 'Dr. Johnson', date: '2025-02-18', amount: 550.00, status: 'Denied' },
    { id: 'CL-004', patient: 'Emily Davis', provider: 'Dr. Wilson', date: '2025-02-20', amount: 275.00, status: 'Paid' },
    { id: 'CL-005', patient: 'Michael Wilson', provider: 'Dr. Johnson', date: '2025-02-22', amount: 780.00, status: 'Pending' },
  ];
  
  const handleGenerateReport = () => {
    // In a real implementation, this would fetch report data based on selection
    console.log('Generating report with parameters:', { reportType, dateRange });
  };

  const handleExportCSV = () => {
    // In a real implementation, this would export the data as CSV
    console.log('Exporting report as CSV');
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Claims Reporting</h1>
        <Button color="light" onClick={() => navigate('/admin-dashboard/claims')}>
          Back to Claims
        </Button>
      </div>
      
      <Card className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Report Parameters</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900">Report Type</label>
            <Select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
            >
              <option value="all">All Claims</option>
              <option value="paid">Paid Claims</option>
              <option value="pending">Pending Claims</option>
              <option value="denied">Denied Claims</option>
              <option value="provider">By Provider</option>
              <option value="payer">By Insurance</option>
            </Select>
          </div>
          
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900">Start Date</label>
            <TextInput
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
            />
          </div>
          
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900">End Date</label>
            <TextInput
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
            />
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button color="primary" onClick={handleGenerateReport}>
            Generate Report
          </Button>
        </div>
      </Card>
      
      <Card>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Report Results</h2>
          <Button color="light" onClick={handleExportCSV}>
            Export CSV
          </Button>
        </div>
        
        <div className="overflow-x-auto">
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell>Claim ID</Table.HeadCell>
              <Table.HeadCell>Patient</Table.HeadCell>
              <Table.HeadCell>Provider</Table.HeadCell>
              <Table.HeadCell>Date</Table.HeadCell>
              <Table.HeadCell>Amount</Table.HeadCell>
              <Table.HeadCell>Status</Table.HeadCell>
              <Table.HeadCell>Actions</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {reportData.map((row) => (
                <Table.Row key={row.id} className="bg-white">
                  <Table.Cell>{row.id}</Table.Cell>
                  <Table.Cell>{row.patient}</Table.Cell>
                  <Table.Cell>{row.provider}</Table.Cell>
                  <Table.Cell>{row.date}</Table.Cell>
                  <Table.Cell>${row.amount.toFixed(2)}</Table.Cell>
                  <Table.Cell>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      row.status === 'Paid' ? 'bg-green-100 text-green-800' :
                      row.status === 'Denied' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {row.status}
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    <Button size="xs" onClick={() => navigate(`/admin-dashboard/claims/${row.id}`)}>
                      View
                    </Button>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>
        
        <div className="mt-4">
          <p className="text-sm text-gray-500">
            Showing {reportData.length} results
          </p>
        </div>
      </Card>
    </div>
  );
};

export default ClaimsReportingPage;