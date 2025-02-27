import React, { useState, useRef, ChangeEvent } from 'react';
import * as Icons from 'lucide-react';
import { Button } from '../../components/ui/button';
import VoiceCallDialog from '../../components/communication/VoiceCallDialog';
import SMSDialog from '../../components/communication/SMSDialog';
import { useCommunication } from '../../contexts/CommunicationContext';
import DentalIcons, { Tooth, DentistChair, DentalCalendar } from '../../lib/dental-icons';

// Define Patient type
interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  nextAppointment: string;
  status: string;
  balance: number;
  lastVisit: string;
}

// Add Patient Dialog Component
const AddPatientDialog = ({ isOpen, onClose, onAddPatient }: {
  isOpen: boolean;
  onClose: () => void;
  onAddPatient: (patient: Omit<Patient, 'id'>) => void;
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    nextAppointment: '',
    status: 'active',
    balance: 0,
    lastVisit: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'balance' ? parseFloat(value) || 0 : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddPatient(formData);
    setFormData({
      name: '',
      email: '',
      phone: '',
      nextAppointment: '',
      status: 'active',
      balance: 0,
      lastVisit: ''
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Add New Patient</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <Icons.X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-200 rounded-lg"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-200 rounded-lg"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              placeholder="(555) 123-4567"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Next Appointment</label>
            <input
              type="date"
              name="nextAppointment"
              value={formData.nextAppointment}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="pending">Pending</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Balance ($)</label>
            <input
              type="number"
              name="balance"
              value={formData.balance}
              onChange={handleChange}
              step="0.01"
              min="0"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Last Visit</label>
            <input
              type="date"
              name="lastVisit"
              value={formData.lastVisit}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg"
            />
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              Add Patient
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Patients = () => {
  // Initialize communication context
  useCommunication();
  
  // File input reference for importing patients
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Dialog state
  const [isCallDialogOpen, setIsCallDialogOpen] = useState(false);
  const [isSMSDialogOpen, setIsSMSDialogOpen] = useState(false);
  const [isAddPatientDialogOpen, setIsAddPatientDialogOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  
  // Patient state
  const [patients, setPatients] = useState<Patient[]>([
    {
      id: '1',
      name: 'Sarah Johnson',
      email: 'sarah.j@example.com',
      phone: '(555) 123-4567',
      nextAppointment: '2024-03-15',
      status: 'active',
      balance: 150.00,
      lastVisit: '2024-02-01'
    }
  ]);

  // Format phone number for Twilio (E.164 format)
  const formatPhoneForTwilio = (phoneNumber: string | undefined): string => {
    if (!phoneNumber) return '';
    
    // Remove all non-numeric characters
    const digitsOnly = phoneNumber.replace(/\D/g, '');
    
    // Ensure it has country code (assume US if not present)
    if (digitsOnly.length === 10) {
      return `+1${digitsOnly}`;
    } else if (digitsOnly.length > 10 && !digitsOnly.startsWith('1')) {
      return `+${digitsOnly}`;
    } else if (digitsOnly.length > 10 && digitsOnly.startsWith('1')) {
      return `+${digitsOnly}`;
    }
    
    // Default fallback
    return `+1${digitsOnly}`;
  };
  
  // Handle adding a new patient
  const handleAddPatient = (patientData: Omit<Patient, 'id'>) => {
    const newPatient: Patient = {
      ...patientData,
      id: `${patients.length + 1}` // Simple ID generation for demo
    };
    
    setPatients(prev => [...prev, newPatient]);
  };
  
  // Handle importing patients from CSV
  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const csvText = event.target?.result as string;
      if (csvText) {
        // Simple CSV parsing (for demo purposes)
        const lines = csvText.split('\n');
        const headers = lines[0].split(',');
        
        const newPatients: Patient[] = [];
        
        // Start from 1 to skip header
        for (let i = 1; i < lines.length; i++) {
          if (!lines[i].trim()) continue;
          
          const values = lines[i].split(',');
          const patient: Partial<Patient> = { id: `import-${i}` };
          
          headers.forEach((header, index) => {
            const key = header.trim().toLowerCase();
            const value = values[index]?.trim();
            
            if (key === 'name') patient.name = value;
            if (key === 'email') patient.email = value;
            if (key === 'phone') patient.phone = value;
            if (key === 'nextappointment') patient.nextAppointment = value;
            if (key === 'status') patient.status = value || 'active';
            if (key === 'balance') patient.balance = parseFloat(value) || 0;
            if (key === 'lastvisit') patient.lastVisit = value;
          });
          
          newPatients.push(patient as Patient);
        }
        
        setPatients(prev => [...prev, ...newPatients]);
      }
    };
    
    reader.readAsText(file);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Patient Management</h1>
          <p className="text-gray-500">View and manage patient records</p>
        </div>
        <div className="flex gap-3">
          {/* Hidden file input for importing */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".csv"
            className="hidden"
          />
          <Button variant="outline" onClick={handleImportClick}>
            <Icons.Upload className="w-4 h-4 mr-2" />
            Import
          </Button>
          <Button
            className="bg-primary hover:bg-primary/90"
            onClick={() => setIsAddPatientDialogOpen(true)}
          >
            <Tooth className="w-5 h-5 mr-2" color="#fff" />
            Add Patient
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search patients..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
            </div>
            <Button variant="outline">
              <Icons.Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center">
                    <Tooth className="w-4 h-4 mr-1 text-navy" />
                    Patient
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center">
                    <DentalCalendar className="w-4 h-4 mr-1 text-navy" />
                    Next Appointment
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Balance
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {patients.map((patient) => (
                <tr key={patient.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Icons.User className="w-5 h-5 text-primary" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{patient.name}</div>
                        <div className="text-sm text-gray-500">Last visit: {patient.lastVisit}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{patient.email}</div>
                    <div className="text-sm text-gray-500">{patient.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{patient.nextAppointment}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      {patient.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${patient.balance.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedPatient(patient);
                          setIsCallDialogOpen(true);
                        }}
                        title="Call patient"
                      >
                        <Icons.Phone className="w-4 h-4 text-green-600" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedPatient(patient);
                          setIsSMSDialogOpen(true);
                        }}
                        title="Text patient"
                      >
                        <Icons.MessageSquare className="w-4 h-4 text-blue-600" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Icons.MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Communication Dialogs */}
      <VoiceCallDialog
        isOpen={isCallDialogOpen}
        onClose={() => setIsCallDialogOpen(false)}
        patientPhone={formatPhoneForTwilio(selectedPatient?.phone)}
        patientName={selectedPatient?.name}
      />
      
      <SMSDialog
        isOpen={isSMSDialogOpen}
        onClose={() => setIsSMSDialogOpen(false)}
        patientPhone={formatPhoneForTwilio(selectedPatient?.phone)}
        patientName={selectedPatient?.name}
      />
      
      {/* Add Patient Dialog */}
      <AddPatientDialog
        isOpen={isAddPatientDialogOpen}
        onClose={() => setIsAddPatientDialogOpen(false)}
        onAddPatient={handleAddPatient}
      />
    </div>
  );
};

export default Patients;