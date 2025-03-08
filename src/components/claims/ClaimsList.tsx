import React, { useState, useEffect } from 'react';
import { Table, Badge, Button, TextInput, Spinner, Pagination } from 'flowbite-react';
import { Link } from 'react-router-dom';
import { HiSearch, HiOutlineExternalLink, HiDocument, HiPencil } from 'react-icons/hi';
import { Claim, ClaimStatus, ClaimStatusFilter } from '../../types/claims.types';
import { useClaimsContext } from '../../contexts/ClaimsContext';
import { formatDateOnly, daysBetween } from '../../utils/dateUtils';

interface ClaimsListProps {
  statusFilter: ClaimStatusFilter;
}

/**
 * Component for displaying a list of claims with filtering and pagination
 */
export const ClaimsList: React.FC<ClaimsListProps> = ({ statusFilter }) => {
  const { fetchClaims } = useClaimsContext();
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortField, setSortField] = useState<string>('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  
  const itemsPerPage = 10;
  
  // Load claims based on status filter
  useEffect(() => {
    const loadClaims = async () => {
      setLoading(true);
      setError(null);
      try {
        const fetchedClaims = await fetchClaims(statusFilter);
        setClaims(fetchedClaims);
        setTotalPages(Math.ceil(fetchedClaims.length / itemsPerPage));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load claims');
        console.error('Error loading claims:', err);
      } finally {
        setLoading(false);
      }
    };
    
    loadClaims();
  }, [fetchClaims, statusFilter]);
  
  // Handle search term change
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when search changes
  };
  
  // Handle sort header click
  const handleSort = (field: string) => {
    if (field === sortField) {
      // Toggle direction if clicking the same field
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Default to descending for a new sort field
      setSortField(field);
      setSortDirection('desc');
    }
  };
  
  /**
   * Get sort value from claim based on field name
   */
  const getSortValue = (claim: Claim, field: string): string | number => {
    switch (field) {
      case 'patientName':
        return claim.patientName || '';
      case 'serviceDate':
        return claim.serviceDate || '';
      case 'insuranceInfo.payerName':
        return claim.insuranceInfo?.payerName || '';
      case 'totalFee':
        return claim.totalFee || 0;
      case 'paymentAmount':
        return claim.paymentAmount || 0;
      case 'status':
        return claim.status || '';
      case 'createdAt':
        return claim.createdAt || '';
      case 'updatedAt':
        return claim.updatedAt || '';
      default:
        return '';
    }
  };
  
  // Filter and sort claims
  const filteredAndSortedClaims = claims
    .filter(claim => {
      if (!searchTerm) return true;
      
      const searchLower = searchTerm.toLowerCase();
      return (
        (claim.patientName?.toLowerCase().includes(searchLower) ?? false) ||
        (claim.insuranceInfo.payerName?.toLowerCase().includes(searchLower) ?? false) ||
        `${claim.totalFee}`.includes(searchLower)
      );
    })
    .sort((a, b) => {
      let comparison = 0;
      
      // Get values based on sort field
      const aValue = getSortValue(a, sortField);
      const bValue = getSortValue(b, sortField);
      
      // Compare based on value type
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        // Numeric comparison
        comparison = aValue - bValue;
      } else if (sortField === 'createdAt' || sortField === 'serviceDate' || sortField === 'updatedAt') {
        // Date comparison
        const aDate = new Date(String(aValue)).getTime();
        const bDate = new Date(String(bValue)).getTime();
        comparison = aDate - bDate;
      } else {
        // String comparison
        const aString = String(aValue).toLowerCase();
        const bString = String(bValue).toLowerCase();
        comparison = aString.localeCompare(bString);
      }
      
      // Apply sort direction
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  
  // Paginate claims
  const paginatedClaims = filteredAndSortedClaims.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  /**
   * Get appropriate badge color for claim status
   */
  const getStatusColor = (status: ClaimStatus) => {
    switch (status) {
      case ClaimStatus.DRAFT: return 'gray';
      case ClaimStatus.PENDING: return 'yellow';
      case ClaimStatus.SUBMITTED: return 'blue';
      case ClaimStatus.ACCEPTED: return 'indigo';
      case ClaimStatus.REJECTED: return 'red';
      case ClaimStatus.PAID: return 'green';
      default: return 'gray';
    }
  };
  
  /**
   * Format claim age (days since creation)
   */
  const formatClaimAge = (createdAt: string) => {
    const days = daysBetween(createdAt);
    if (days === 0) return 'Today';
    if (days === 1) return '1 day';
    return `${days} days`;
  };
  
  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-2">
        <div className="w-full md:max-w-md relative">
          <TextInput
            id="claims-search"
            placeholder="Search claims..."
            value={searchTerm}
            onChange={handleSearch}
            icon={HiSearch}
          />
        </div>
        
        <div className="text-sm text-gray-500">
          Showing {filteredAndSortedClaims.length} claims
          {statusFilter !== 'all' && ` with status "${statusFilter}"`}
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center p-8">
          <Spinner size="xl" />
        </div>
      ) : error ? (
        <div className="p-4 text-sm text-red-700 bg-red-100 rounded-lg">
          <div className="font-medium">Error loading claims</div>
          <p>{error}</p>
        </div>
      ) : filteredAndSortedClaims.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
          <HiDocument className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No claims found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm
              ? 'No claims match your search criteria'
              : statusFilter !== 'all'
                ? `No claims with status "${statusFilter}"`
                : 'Get started by creating a new claim'}
          </p>
          {!searchTerm && statusFilter === 'all' && (
            <div className="mt-6">
              <Link to="/claims/new">
                <Button color="primary" className="flex items-center mx-auto">
                  <HiPencil className="mr-2" /> New Claim
                </Button>
              </Link>
            </div>
          )}
        </div>
      ) : (
        <>
          <div className="overflow-x-auto relative rounded-lg border border-gray-200">
            <Table striped>
              <Table.Head>
                <Table.HeadCell 
                  className="cursor-pointer"
                  onClick={() => handleSort('patientName')}
                >
                  Patient
                  {sortField === 'patientName' && (
                    <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                  )}
                </Table.HeadCell>
                <Table.HeadCell 
                  className="cursor-pointer"
                  onClick={() => handleSort('serviceDate')}
                >
                  Service Date
                  {sortField === 'serviceDate' && (
                    <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                  )}
                </Table.HeadCell>
                <Table.HeadCell 
                  className="cursor-pointer"
                  onClick={() => handleSort('insuranceInfo.payerName')}
                >
                  Insurance
                  {sortField === 'insuranceInfo.payerName' && (
                    <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                  )}
                </Table.HeadCell>
                <Table.HeadCell 
                  className="cursor-pointer"
                  onClick={() => handleSort('totalFee')}
                >
                  Amount
                  {sortField === 'totalFee' && (
                    <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                  )}
                </Table.HeadCell>
                <Table.HeadCell 
                  className="cursor-pointer"
                  onClick={() => handleSort('status')}
                >
                  Status
                  {sortField === 'status' && (
                    <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                  )}
                </Table.HeadCell>
                <Table.HeadCell 
                  className="cursor-pointer"
                  onClick={() => handleSort('createdAt')}
                >
                  Age
                  {sortField === 'createdAt' && (
                    <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                  )}
                </Table.HeadCell>
                <Table.HeadCell>
                  Actions
                </Table.HeadCell>
              </Table.Head>
              <Table.Body>
                {paginatedClaims.map(claim => (
                  <Table.Row key={claim.id}>
                    <Table.Cell>
                      <div className="font-medium">{claim.patientName}</div>
                      <div className="text-xs text-gray-500">ID: {claim.patientId}</div>
                    </Table.Cell>
                    <Table.Cell>
                      {formatDateOnly(claim.serviceDate)}
                    </Table.Cell>
                    <Table.Cell>
                      {claim.insuranceInfo.payerName || claim.insuranceInfo.payerId}
                    </Table.Cell>
                    <Table.Cell>
                      <div>${claim.totalFee.toFixed(2)}</div>
                      {claim.paymentAmount !== undefined && (
                        <div className={`text-xs ${claim.paymentAmount > 0 ? 'text-green-500' : 'text-gray-500'}`}>
                          Paid: ${claim.paymentAmount.toFixed(2)}
                        </div>
                      )}
                    </Table.Cell>
                    <Table.Cell>
                      <Badge color={getStatusColor(claim.status)}>
                        {claim.status}
                      </Badge>
                    </Table.Cell>
                    <Table.Cell>
                      {formatClaimAge(claim.createdAt)}
                    </Table.Cell>
                    <Table.Cell>
                      <Link to={`/claims/${claim.id}`}>
                        <Button size="xs" color="light" className="flex items-center">
                          <HiOutlineExternalLink className="mr-1" /> View
                        </Button>
                      </Link>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </div>
          
          {totalPages > 1 && (
            <div className="flex justify-center mt-4">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                showIcons
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};