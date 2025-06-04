import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Alert, Table, FileInput, Progress } from 'flowbite-react';

const BatchProcessingPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<{ success: number; error: number; total: number } | null>(null);
  const [claimsBatch, setClaimsBatch] = useState<Array<{
    id: string;
    patientName: string;
    serviceDate: string;
    amount: number;
    status: string;
    message?: string;
  }>>([]);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
      setResults(null);
      // In a real app, you would parse the file here and extract the claims data
    }
  };
  
  const handleStartProcessing = () => {
    if (!selectedFile) return;
    
    setIsProcessing(true);
    setProgress(0);
    setResults(null);
    
    // Simulate processing batch file
    const mockBatch = [
      { id: 'B001', patientName: 'John Smith', serviceDate: '2025-02-15', amount: 450.00, status: 'Pending' },
      { id: 'B002', patientName: 'Sarah Johnson', serviceDate: '2025-02-16', amount: 320.00, status: 'Pending' },
      { id: 'B003', patientName: 'Robert Brown', serviceDate: '2025-02-18', amount: 550.00, status: 'Pending' },
      { id: 'B004', patientName: 'Emily Davis', serviceDate: '2025-02-20', amount: 275.00, status: 'Pending' },
      { id: 'B005', patientName: 'Michael Wilson', serviceDate: '2025-02-22', amount: 780.00, status: 'Pending' },
    ];
    
    setClaimsBatch(mockBatch);
    
    // Simulate processing progress
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setIsProcessing(false);
          
          // Update statuses with mock results
          const updatedBatch = mockBatch.map((claim, index) => {
            if (index % 4 === 0) {
              return { ...claim, status: 'Error', message: 'Invalid procedure code' };
            } else {
              return { ...claim, status: 'Success' };
            }
          });
          
          setClaimsBatch(updatedBatch);
          
          // Set final results
          setResults({
            success: 4,
            error: 1,
            total: 5
          });
          
          return 100;
        }
        return prev + 10;
      });
    }, 500);
  };
  
  const handleCancelProcessing = () => {
    setIsProcessing(false);
    setProgress(0);
  };
  
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Batch Claims Processing</h1>
        <Button color="light" onClick={() => navigate('/admin-dashboard/claims')}>
          Back to Claims
        </Button>
      </div>
      
      <Card className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Upload Batch File</h2>
        <p className="text-gray-600 mb-4">
          Upload a batch file containing multiple claims for processing. 
          Supported formats: X12 837, CSV, Excel.
        </p>
        
        <div className="mb-4">
          <FileInput 
            id="batchFile" 
            onChange={handleFileChange}
            disabled={isProcessing}
          />
        </div>
        
        {selectedFile && (
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Selected file: {selectedFile.name}</p>
              <p className="text-xs text-gray-500">Size: {(selectedFile.size / 1024).toFixed(2)} KB</p>
            </div>
            <div className="flex gap-2">
              <Button 
                color="light" 
                onClick={() => setSelectedFile(null)} 
                disabled={isProcessing}
              >
                Remove
              </Button>
              <Button 
                color="primary" 
                onClick={handleStartProcessing} 
                disabled={isProcessing}
              >
                Start Processing
              </Button>
              {isProcessing && (
                <Button 
                  color="failure" 
                  onClick={handleCancelProcessing}
                >
                  Cancel
                </Button>
              )}
            </div>
          </div>
        )}
        
        {isProcessing && (
          <div className="mt-4">
            <p className="text-sm font-medium mb-2">Processing batch file: {progress}% complete</p>
            <Progress progress={progress} color="blue" />
          </div>
        )}
        
        {results && (
          <Alert color={results.error === 0 ? "success" : results.success === 0 ? "failure" : "warning"} className="mt-4">
            <div className="font-medium">Batch processing complete!</div>
            <ul className="mt-1.5 ml-4 list-disc list-inside">
              <li>Successfully processed: {results.success} claims</li>
              <li>Failed to process: {results.error} claims</li>
              <li>Total claims in batch: {results.total}</li>
            </ul>
          </Alert>
        )}
      </Card>
      
      {claimsBatch.length > 0 && (
        <Card>
          <h2 className="text-xl font-semibold mb-4">Batch Claims</h2>
          
          <div className="overflow-x-auto">
            <Table hoverable>
              <Table.Head>
                <Table.HeadCell>Claim ID</Table.HeadCell>
                <Table.HeadCell>Patient</Table.HeadCell>
                <Table.HeadCell>Service Date</Table.HeadCell>
                <Table.HeadCell>Amount</Table.HeadCell>
                <Table.HeadCell>Status</Table.HeadCell>
                <Table.HeadCell>Actions</Table.HeadCell>
              </Table.Head>
              <Table.Body className="divide-y">
                {claimsBatch.map((claim) => (
                  <Table.Row key={claim.id} className="bg-white">
                    <Table.Cell>{claim.id}</Table.Cell>
                    <Table.Cell>{claim.patientName}</Table.Cell>
                    <Table.Cell>{claim.serviceDate}</Table.Cell>
                    <Table.Cell>${claim.amount.toFixed(2)}</Table.Cell>
                    <Table.Cell>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        claim.status === 'Success' ? 'bg-green-100 text-green-800' :
                        claim.status === 'Error' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {claim.status}
                      </span>
                    </Table.Cell>
                    <Table.Cell>
                      {claim.status === 'Success' ? (
                        <Button size="xs" onClick={() => navigate(`/admin-dashboard/claims/${claim.id}`)}>
                          View
                        </Button>
                      ) : claim.status === 'Error' ? (
                        <div>
                          <p className="text-xs text-red-600">{claim.message}</p>
                          <Button size="xs" color="warning" className="mt-1">
                            Fix
                          </Button>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-500">Processing...</span>
                      )}
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </div>
        </Card>
      )}
    </div>
  );
};

export default BatchProcessingPage;