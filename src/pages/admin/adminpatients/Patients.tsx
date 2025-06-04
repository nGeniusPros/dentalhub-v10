import React, { useState, useEffect, useRef, ChangeEvent, useCallback } from 'react';
import * as Icons from 'lucide-react';
import {
  Button,
  Input,
  // Select components are used in AddPatientDialog, ensure they are exported from ui if needed here too
} from '../../../components/ui'; // Adjusted path for components
import { Table } from 'antd';
import type { TableProps } from 'antd';
import { Pagination } from '@mui/material';
import VoiceCallDialog from '../../../components/communication/VoiceCallDialog'; // Adjusted path
import SMSDialog from '../../../components/communication/SMSDialog'; // Adjusted path
import { useCommunication } from '../../../contexts/CommunicationContext'; // Adjusted path
import { practiceDataService } from '../../../services/practiceDataService'; // Adjusted path
import {
  PatientDetailsData,
  PatientListDisplayItem,
  GetPatientsQueryParams,
  NexHealthCreatePatientPayload,
} from '../../../types/nexhealth'; // Adjusted path
import AddPatientDialog from '../../../components/patients/AddPatientDialog'; // Adjusted path

const Patients = () => {
  type PatientColumnType = PatientListDisplayItem;

  const columns: TableProps<PatientColumnType>['columns'] = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: (email) => email || 'N/A',
    },
    {
      title: 'Phone',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
      render: (phoneNumber) => phoneNumber || 'N/A',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: PatientColumnType['status']) => (
        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
          status === 'active' ? 'bg-green-100 text-green-700' : 
          status === 'inactive' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
        }`}>
          {status}
        </span>
      ),
    },
    {
      title: 'DOB',
      dataIndex: 'dateOfBirth',
      key: 'dateOfBirth',
      render: (dateOfBirth) => dateOfBirth ? new Date(dateOfBirth).toLocaleDateString() : 'N/A',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record: PatientColumnType) => (
        <>
          <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); setSelectedPatientId(record.id); setIsCallDialogOpen(true); }}>
            <Icons.Phone className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); setSelectedPatientId(record.id); setIsSMSDialogOpen(true); }}>
            <Icons.MessageSquare className="w-4 h-4" />
          </Button>
        </>
      ),
    },
  ];

  useCommunication();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isCallDialogOpen, setIsCallDialogOpen] = useState(false);
  const [isSMSDialogOpen, setIsSMSDialogOpen] = useState(false);
  const [isAddPatientDialogOpen, setIsAddPatientDialogOpen] = useState(false);
  
  const [patients, setPatients] = useState<PatientListDisplayItem[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<PatientDetailsData | null>(null);
  const [selectedPatientId, setSelectedPatientId] = useState<number | null>(null);

  const [isLoadingList, setIsLoadingList] = useState(false);
  const [listError, setListError] = useState<string | null>(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [detailsError, setDetailsError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPatients, setTotalPatients] = useState(0);

  const [searchTerm, setSearchTerm] = useState('');

  const fetchPatientsList = useCallback(async (page: number, search: string) => {
    setIsLoadingList(true);
    setListError(null);
    const queryParams: GetPatientsQueryParams = {
      page,
      per_page: itemsPerPage,
      sort: 'name',
    };
    if (search) {
      queryParams.name = search;
    }
    try {
      const result = await practiceDataService.getPatientsList(queryParams);
      if (result) {
        setPatients(result.patients);
        setTotalPatients(result.totalCount);
      } else {
        setPatients([]);
        setTotalPatients(0);
        setListError('Failed to fetch patients or no patients found.');
      }
    } catch (error) {
      console.error("Error fetching patients list:", error);
      setListError(error instanceof Error ? error.message : 'An unknown error occurred.');
      setPatients([]);
      setTotalPatients(0);
    } finally {
      setIsLoadingList(false);
    }
  }, [itemsPerPage]);

  useEffect(() => {
    fetchPatientsList(currentPage, searchTerm);
  }, [currentPage, searchTerm, fetchPatientsList]);

  useEffect(() => {
    const fetchDetails = async () => {
      if (selectedPatientId === null) {
        setSelectedPatient(null);
        return;
      }
      setIsLoadingDetails(true);
      setDetailsError(null);
      setSelectedPatient(null);
      try {
        const details = await practiceDataService.getPatientDetails(selectedPatientId.toString());
        if (details) {
          setSelectedPatient(details);
        } else {
          setDetailsError(`Patient details not found for ID: ${selectedPatientId}`);
        }
      } catch (error) {
        console.error("Error fetching patient details:", error);
        setDetailsError(error instanceof Error ? error.message : 'An unknown error occurred fetching details.');
      } finally {
        setIsLoadingDetails(false);
      }
    };
    fetchDetails();
  }, [selectedPatientId]);

  const handlePageChange = (event: React.ChangeEvent<unknown>, newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };
  
  const handleRowClick = (patientId: number) => {
    setSelectedPatientId(patientId);
  };

  const handleAddPatientSubmit = async (payload: NexHealthCreatePatientPayload) => {
    try {
      const newPatient = await practiceDataService.createPatient(payload);
      if (newPatient) {
        setIsAddPatientDialogOpen(false);
        fetchPatientsList(1, searchTerm); 
      } else {
        throw new Error('Failed to create patient: No patient data returned.');
      }
    } catch (error) {
      console.error("Error creating patient from Patients.tsx:", error);
      throw error; 
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Patient Management</h1>
      </header>

      <div className="mb-6 flex justify-between items-center">
        <Input 
          placeholder="Search patients by name..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="max-w-sm"
        />
        <Button onClick={() => setIsAddPatientDialogOpen(true)}>
          <Icons.PlusCircle className="mr-2 h-5 w-5" /> Add New Patient
        </Button>
      </div>

      <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-8">
        {isLoadingList && <p className="p-4">Loading patients...</p>}
        {listError && <p className="p-4 text-red-600">Error: {listError}</p>}
        {!isLoadingList && !listError && patients.length === 0 && <p className="p-4">No patients found.</p>}
        {!isLoadingList && !listError && patients.length > 0 && (
          <Table 
            columns={columns}
            dataSource={patients}
            rowKey="id"
            loading={isLoadingList}
            onRow={(record: PatientColumnType) => ({
              onClick: () => handleRowClick(record.id),
              className: `cursor-pointer hover:bg-gray-100 ${selectedPatientId === record.id ? 'bg-blue-100' : ''}`
            })}
            pagination={false} // Using custom MUI pagination below
          />
        )}
      </div>

      {totalPatients > 0 && !isLoadingList && (
        <div className="flex justify-center mb-8">
          <Pagination
            count={Math.ceil(totalPatients / itemsPerPage)}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
          />
        </div>
      )}

      {selectedPatientId !== null && (
        <div className="bg-white shadow-lg rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-gray-800">
              Patient Details {selectedPatient ? `- ${selectedPatient.fullName}` : ''}
            </h2>
            <Button variant="outline" size="sm" onClick={() => setSelectedPatientId(null)}>
              <Icons.X className="mr-2 h-4 w-4" /> Clear Selection
            </Button>
          </div>
          {isLoadingDetails && <p>Loading details...</p>}
          {detailsError && <p className="text-red-600">Error: {detailsError}</p>}
          {!isLoadingDetails && !detailsError && selectedPatient && (
            <div>
              <p><strong>ID:</strong> {selectedPatient.id}</p>
              <p><strong>Full Name:</strong> {selectedPatient.fullName}</p>
              <p><strong>Email:</strong> {selectedPatient.email || 'N/A'}</p>
              <p><strong>Phone:</strong> {selectedPatient.phoneNumber || 'N/A'}</p>
              <p><strong>Date of Birth:</strong> {selectedPatient.dateOfBirth || 'N/A'}</p>
              <p><strong>Gender:</strong> {selectedPatient.gender || 'N/A'}</p>
              <p><strong>Status:</strong> {selectedPatient.isInactive ? 'Inactive' : 'Active'}</p>
              {selectedPatient.address && (
                <p>
                  <strong>Address:</strong> 
                  {`${selectedPatient.address.streetAddress || ''}${selectedPatient.address.city ? ', ' + selectedPatient.address.city : ''}${selectedPatient.address.state ? ', ' + selectedPatient.address.state : ''} ${selectedPatient.address.zipCode || ''}`.replace(/^, |, $/g, '') || 'N/A'}
                </p>
              )}
              <p><strong>Created At:</strong> {selectedPatient.createdAt ? new Date(selectedPatient.createdAt).toLocaleDateString() : 'N/A'}</p>
              <p><strong>Last Updated:</strong> {selectedPatient.updatedAt ? new Date(selectedPatient.updatedAt).toLocaleDateString() : 'N/A'}</p>
            </div>
          )}
          {!isLoadingDetails && !detailsError && !selectedPatient && selectedPatientId !== null && (
            <p>No details found for the selected patient.</p>
          )}
        </div>
      )}

      <AddPatientDialog 
        isOpen={isAddPatientDialogOpen} 
        onClose={() => setIsAddPatientDialogOpen(false)} 
        onAddPatient={handleAddPatientSubmit}
      />
      <VoiceCallDialog 
        isOpen={isCallDialogOpen} 
        onClose={() => setIsCallDialogOpen(false)} 
        recipient={selectedPatient?.phoneNumber || ''} 
        patientName={selectedPatient?.fullName}
      />
      <SMSDialog 
        isOpen={isSMSDialogOpen} 
        onClose={() => setIsSMSDialogOpen(false)} 
        recipient={selectedPatient?.phoneNumber || ''}
        patientName={selectedPatient?.fullName}
      />
    </div>
  );
};

export default Patients;

