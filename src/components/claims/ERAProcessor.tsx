import React, { useState, useEffect } from 'react';
import { Card, Table, Badge, Button, Spinner, FileInput, Label } from 'flowbite-react';
import { HiUpload, HiCheck, HiExclamation } from 'react-icons/hi';
import { useClaimsContext } from '../../contexts/ClaimsContext';
import { ERA } from '../../types/claims.types';
import { formatDate } from '../../utils/dateUtils';

/**
 * Component for processing Electronic Remittance Advice (ERA) files
 */
export const ERAProcessor: React.FC = () => {
  const { fetchPendingERAs, processERA } = useClaimsContext();
  const [eras, setERAs] = useState<ERA[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [processing, setProcessing] = useState<string | null>(null);
  const [uploadResult, setUploadResult] = useState<{ success: boolean; message: string } | null>(null);

  // Fetch pending ERAs on component mount
  useEffect(() => {
    const loadERAs = async () => {
      try {
        const data = await fetchPendingERAs();
        setERAs(data);
      } catch (error) {
        console.error('Error fetching ERAs:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadERAs();
  }, [fetchPendingERAs]);
  
  /**
   * Handle ERA file upload
   */
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    setUploading(true);
    setUploadResult(null);
    
    try {
      // In a real implementation, we would upload the ERA file to process
      // const file = e.target.files[0];
      // For demo, we'll just simulate a delay and success
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Add the new ERA to the list
      const mockEra: ERA = {
        id: `era-${Math.random().toString(36).substring(2, 10)}`,
        payerId: 'INS001',
        payerName: 'Delta Dental',
        checkNumber: `DD${Math.floor(Math.random() * 1000000)}`,
        checkDate: new Date().toISOString().split('T')[0],
        receivedDate: new Date().toISOString().split('T')[0],
        totalPayment: Math.floor(Math.random() * 1000) + 500,
        claimCount: Math.floor(Math.random() * 5) + 1
      };
      
      setERAs([mockEra, ...eras]);
      setUploadResult({
        success: true,
        message: 'ERA file uploaded and processed successfully.'
      });
      
      // Reset the file input
      e.target.value = '';
    } catch (error) {
      console.error('Error uploading ERA file:', error);
      setUploadResult({
        success: false,
        message: 'Failed to upload ERA file. Please try again.'
      });
    } finally {
      setUploading(false);
    }
  };
  
  /**
   * Handle ERA processing
   */
  const handleProcessERA = async (eraId: string) => {
    setProcessing(eraId);
    
    try {
      const success = await processERA(eraId);
      
      if (success) {
        // Update the local state by removing the processed ERA
        setERAs(eras.filter(era => era.id !== eraId));
      } else {
        console.error('Failed to process ERA');
        // Show an error notification
      }
    } catch (error) {
      console.error('Error processing ERA:', error);
    } finally {
      setProcessing(null);
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <Spinner size="xl" />
      </div>
    );
  }
  
  return (
    <Card>
      <h3 className="text-xl font-semibold mb-4">Electronic Remittance Advice (ERA)</h3>
      
      {/* File upload section */}
      <div className="p-4 mb-6 bg-gray-50 rounded-lg border border-gray-200">
        <h4 className="text-lg font-medium mb-3">Upload ERA File</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
          <div>
            <Label htmlFor="eraFile" value="Select ERA file to process" />
            <FileInput
              id="eraFile"
              onChange={handleFileUpload}
              disabled={uploading}
              accept=".txt,.835,.pdf,.xml"
              helperText="Accepted formats: .txt, .835, .pdf, .xml"
            />
          </div>
          <div className="flex items-center">
            {uploading ? (
              <div className="flex items-center text-gray-600">
                <Spinner size="sm" className="mr-2" />
                <span>Uploading and processing ERA file...</span>
              </div>
            ) : uploadResult ? (
              <div className={`flex items-center ${uploadResult.success ? 'text-green-600' : 'text-red-600'}`}>
                {uploadResult.success ? (
                  <HiCheck className="w-5 h-5 mr-1" />
                ) : (
                  <HiExclamation className="w-5 h-5 mr-1" />
                )}
                <span>{uploadResult.message}</span>
              </div>
            ) : (
              <div className="text-sm text-gray-500">
                Upload an ERA file to process payments
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* ERA list section */}
      {eras.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No pending ERAs to process</p>
        </div>
      ) : (
        <Table>
          <Table.Head>
            <Table.HeadCell>Payer</Table.HeadCell>
            <Table.HeadCell>Check Number</Table.HeadCell>
            <Table.HeadCell>Check Date</Table.HeadCell>
            <Table.HeadCell>Received Date</Table.HeadCell>
            <Table.HeadCell>Payment Amount</Table.HeadCell>
            <Table.HeadCell>Claims</Table.HeadCell>
            <Table.HeadCell>Status</Table.HeadCell>
            <Table.HeadCell>Actions</Table.HeadCell>
          </Table.Head>
          <Table.Body>
            {eras.map(era => (
              <Table.Row key={era.id}>
                <Table.Cell>{era.payerName}</Table.Cell>
                <Table.Cell>{era.checkNumber || 'N/A'}</Table.Cell>
                <Table.Cell>{formatDate(era.checkDate)}</Table.Cell>
                <Table.Cell>{formatDate(era.receivedDate)}</Table.Cell>
                <Table.Cell>${era.totalPayment.toFixed(2)}</Table.Cell>
                <Table.Cell>{era.claimCount}</Table.Cell>
                <Table.Cell>
                  <Badge color="yellow">Pending</Badge>
                </Table.Cell>
                <Table.Cell>
                  <Button 
                    size="sm" 
                    onClick={() => handleProcessERA(era.id)}
                    disabled={processing === era.id}
                  >
                    {processing === era.id ? (
                      <>
                        <Spinner size="sm" className="mr-2" />
                        Processing
                      </>
                    ) : (
                      <>
                        <HiUpload className="mr-2" />
                        Process
                      </>
                    )}
                  </Button>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      )}
    </Card>
  );
};