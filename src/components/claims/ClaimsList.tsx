import React, { useEffect, useState } from 'react';
import { Table, Badge, Button, Spinner } from 'flowbite-react';
import { Link } from 'react-router-dom';
import { useClaimsContext } from '../../contexts/ClaimsContext';
import { Claim, ClaimStatus, ClaimStatusFilter } from '../../types/claims.types';

interface ClaimsListProps {
  statusFilter?: ClaimStatusFilter;
}

const ClaimsList: React.FC<ClaimsListProps> = ({ statusFilter = 'all' }) => {
  const { fetchClaims, loading } = useClaimsContext();
  const [claims, setClaims] = useState<Claim[]>([]);

  useEffect(() => {
    const loadClaims = async () => {
      const data = await fetchClaims(statusFilter);
      setClaims(data);
    };
    
    loadClaims();
  }, [fetchClaims, statusFilter]);

  const getStatusBadge = (status: ClaimStatus) => {
    switch (status) {
      case ClaimStatus.DRAFT:
        return <Badge color="gray">Draft</Badge>;
      case ClaimStatus.PENDING:
        return <Badge color="yellow">Pending</Badge>;
      case ClaimStatus.SUBMITTED:
        return <Badge color="blue">Submitted</Badge>;
      case ClaimStatus.ACCEPTED:
        return <Badge color="info">Accepted</Badge>;
      case ClaimStatus.REJECTED:
        return <Badge color="red">Rejected</Badge>;
      case ClaimStatus.PAID:
        return <Badge color="green">Paid</Badge>;
      default:
        return <Badge color="gray">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <Spinner size="xl" />
      </div>
    );
  }

  if (claims.length === 0) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-500 mb-4">No claims found</p>
        <Link to="/claims/new">
          <Button color="primary">Create New Claim</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table hoverable>
        <Table.Head>
          <Table.HeadCell>Patient</Table.HeadCell>
          <Table.HeadCell>Service Date</Table.HeadCell>
          <Table.HeadCell>Insurance</Table.HeadCell>
          <Table.HeadCell>Amount</Table.HeadCell>
          <Table.HeadCell>Status</Table.HeadCell>
          <Table.HeadCell>Created</Table.HeadCell>
          <Table.HeadCell>Actions</Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
          {claims.map((claim) => (
            <Table.Row key={claim.id} className="bg-white">
              <Table.Cell className="whitespace-nowrap font-medium text-gray-900">
                {claim.patientName}
              </Table.Cell>
              <Table.Cell>
                {new Date(claim.serviceDate).toLocaleDateString()}
              </Table.Cell>
              <Table.Cell>
                {claim.insuranceInfo.payerName || claim.insuranceInfo.payerId}
              </Table.Cell>
              <Table.Cell>
                ${claim.totalFee.toFixed(2)}
              </Table.Cell>
              <Table.Cell>
                {getStatusBadge(claim.status)}
              </Table.Cell>
              <Table.Cell>
                {new Date(claim.createdAt).toLocaleDateString()}
              </Table.Cell>
              <Table.Cell>
                <div className="flex space-x-2">
                  <Link to={`/claims/${claim.id}`}>
                    <Button size="xs">
                      View
                    </Button>
                  </Link>
                  {claim.status === ClaimStatus.DRAFT && (
                    <Link to={`/claims/${claim.id}/edit`}>
                      <Button size="xs" color="light">
                        Edit
                      </Button>
                    </Link>
                  )}
                </div>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </div>
  );
};

export default ClaimsList;