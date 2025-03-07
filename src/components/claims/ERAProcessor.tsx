import React, { useState, useEffect } from 'react';
import { Card, Table, Badge, Button, Spinner, Alert } from 'flowbite-react';
import { useClaimsContext } from '../../contexts/ClaimsContext';
import { ERA } from '../../types/claims.types';

const ERAProcessor: React.FC = () => {
  const { fetchPendingERAs, processERA } = useClaimsContext();
  const [eras, setERAs] = useState<ERA[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  useEffect(() => {
    const loadERAs = async () => {
      try {
        setLoading(true);
        const data = await fetchPendingERAs();
        setERAs(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load ERAs');
      } finally {
        setLoading(false);
      }
    };
    
    loadERAs();
  }, [fetchPendingERAs]);
  
  const handleProcessERA = async (eraId: string, payerName: string) => {
    try {
      setProcessing(eraId);
      setError(null);
      setSuccess(null);
      
      await processERA(eraId);
      
      // Update the local state by removing the processed ERA
      setERAs(eras.filter(era => era.id !== eraId));
      setSuccess(`ERA from ${payerName} processed successfully`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process ERA');
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
      <div className="mb-4">
        <h3 className="text-xl font-semibold mb-2">Electronic Remittance Advice</h3>
        <p className="text-gray-600">Process payment files received from insurance companies</p>
      </div>
      
      {error && (
        <Alert color="failure" className="mb-4">
          <span className="font-medium">Error:</span> {error}
        </Alert>
      )}
      
      {success && (
        <Alert color="success" className="mb-4">
          <span className="font-medium">Success:</span> {success}
        </Alert>
      )}
      
      {eras.length === 0 ? (
        <div className="text-center py-6">
          <p className="text-gray-500">No pending ERAs to process</p>
          <div className="mt-4">
            <Button color="light">
              Upload ERA File
            </Button>
          </div>
        </div>
      ) : (
        <Table>
          <Table.Head>
            <Table.HeadCell>Payer</Table.HeadCell>
            <Table.HeadCell>Received Date</Table.HeadCell>
            <Table.HeadCell>Check Number</Table.HeadCell>
            <Table.HeadCell>Payment Amount</Table.HeadCell>
            <Table.HeadCell>Claims</Table.HeadCell>
            <Table.HeadCell>Status</Table.HeadCell>
            <Table.HeadCell>Actions</Table.HeadCell>
          </Table.Head>
          <Table.Body>
            {eras.map(era => (
              <Table.Row key={era.id}>
                <Table.Cell className="font-medium">{era.payerName}</Table.Cell>
                <Table.Cell>{new Date(era.receivedDate).toLocaleDateString()}</Table.Cell>
                <Table.Cell>{era.checkNumber || 'N/A'}</Table.Cell>
                <Table.Cell>${era.totalPayment.toFixed(2)}</Table.Cell>
                <Table.Cell>{era.claimCount}</Table.Cell>
                <Table.Cell>
                  <Badge color="yellow">Pending</Badge>
                </Table.Cell>
                <Table.Cell>
                  <Button 
                    size="sm" 
                    onClick={() => handleProcessERA(era.id, era.payerName)}
                    disabled={processing === era.id}
                  >
                    {processing === era.id ? (
                      <>
                        <Spinner size="sm" className="mr-2" />
                        Processing...
                      </>
                    ) : 'Process'}
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

export default ERAProcessor;