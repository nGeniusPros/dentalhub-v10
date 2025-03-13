import React, { useState, useRef } from 'react';
import ProspectsDeleted from './ProspectsDeleted';
import ProspectsDuplicate from './ProspectsDuplicate';
import * as Icons from 'lucide-react';
import { Button } from '../../components/ui/button';
import VoiceCallDialog from '../../components/communication/VoiceCallDialog';
import SMSDialog from '../../components/communication/SMSDialog';
import { useCommunication } from '../../contexts/CommunicationContext';

// Define Prospect type
interface Prospect {
  id: string;
  name: string;
  email: string;
  phone: string;
  nextAppointment: string;
  status: string;
  leadSource: string;
  interestLevel: string;
  lastContact: string;
  notes?: string; // Optional notes field for additional information
  campaign?: string;
  assignee?: string;
  tags?: string[];
}

// Add Prospect Dialog Component
const AddProspectDialog = ({ isOpen, onClose, onAddProspect }: {
  isOpen: boolean;
  onClose: () => void;
  onAddProspect: (prospect: Omit<Prospect, 'id'>) => void;
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    nextAppointment: '',
    status: 'new',
    leadSource: 'website',
    interestLevel: 'medium',
    lastContact: '',
    notes: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddProspect(formData);
    setFormData({
      name: '',
      email: '',
      phone: '',
      nextAppointment: '',
      status: 'new',
      leadSource: 'website',
      interestLevel: 'medium',
      lastContact: '',
      notes: ''
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Add New Marketing Prospect</h2>
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
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="qualified">Qualified</option>
              <option value="nurturing">Nurturing</option>
              <option value="converted">Converted</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Lead Source</label>
            <select
              name="leadSource"
              value={formData.leadSource}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg"
            >
              <option value="website">Website</option>
              <option value="referral">Referral</option>
              <option value="social">Social Media</option>
              <option value="google">Google</option>
              <option value="event">Event</option>
              <option value="lead-list">Lead List</option>
              <option value="other">Other</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Interest Level</label>
            <select
              name="interestLevel"
              value={formData.interestLevel}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="very-high">Very High</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Last Contact Date</label>
            <input
              type="date"
              name="lastContact"
              value={formData.lastContact}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg"
              placeholder="Add any additional notes about this prospect"
            />
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              Add Prospect
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Multi-step Import Dialog Component
const ImportProspectsDialog = ({ isOpen, onClose, onImportComplete }: {
  isOpen: boolean;
  onClose: () => void;
  onImportComplete: (prospects: Prospect[]) => void;
}) => {
  const [step, setStep] = useState(1);
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState('');
  const [importProgress, setImportProgress] = useState(0);
  const [mappedFields, setMappedFields] = useState<Record<string, string>>({});
  const [importOptions, setImportOptions] = useState({
    updateExisting: true,
    findExistingBy: 'phone',
    updateOption: 'emptyFields'
  });
  const [selectedCampaign, setSelectedCampaign] = useState('');
  const [campaignOption, setCampaignOption] = useState('assign');
  const [selectedAssignee, setSelectedAssignee] = useState('');
  const [assigneeOption, setAssigneeOption] = useState('noExisting');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showTagsDropdown, setShowTagsDropdown] = useState(false);
  const [newTagName, setNewTagName] = useState('');
  const [showNewTagInput, setShowNewTagInput] = useState(false);
  const [previewData, setPreviewData] = useState<{ headers: string[], sample: string[][] }>({
    headers: [],
    sample: []
  });
  const [contactsFound, setContactsFound] = useState(0);
  const [importStatus, setImportStatus] = useState({
    inProgress: false,
    fileName: '',
    total: 0,
    success: 0,
    errors: 0
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Mock data for the import wizard
  const availableCampaigns = [
    { id: '1', name: 'Outbound Dental Grant | Cold List No Response' },
    { id: '2', name: 'Outbound Dental Grant | Cold List Offer' },
    { id: '3', name: 'Outbound Dental Grant | Cold List No Show' },
    { id: '4', name: 'Outbound Dental Grant | Cold List Re-Engagement' },
    { id: '5', name: 'Outbound Dental Grant | Cold List Holding' },
    { id: '6', name: 'Outbound Dental Grant | Cold List Wrong Contact' },
  ];
  
  const availableAssignees = [
    { id: '1', name: 'Michael Bady' },
    { id: '2', name: 'Natasha Blake' },
    { id: '3', name: 'Round Robin' },
  ];
  
  const availableTags = [
    { id: '1', name: 'Cold Lead' },
    { id: '2', name: 'Interested' },
    { id: '3', name: 'High Value' },
    { id: '4', name: 'Needs Follow-up' },
  ];
  
  const resetImportState = () => {
    setStep(1);
    setFile(null);
    setFileName('');
    setImportProgress(0);
    setMappedFields({});
    setPreviewData({ headers: [], sample: [] });
    setContactsFound(0);
    setImportStatus({
      inProgress: false,
      fileName: '',
      total: 0,
      success: 0,
      errors: 0
    });
  };
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    
    setFile(selectedFile);
    setFileName(selectedFile.name);
    
    // Mock reading CSV file
    const reader = new FileReader();
    reader.onload = (event) => {
      const csvText = event.target?.result as string;
      if (csvText) {
        // Simple CSV parsing for preview
        const lines = csvText.split('\n').filter(line => line.trim().length > 0);
        const headers = lines[0].split(',').map(h => h.trim());
        
        // Get sample data
        const sampleData: string[][] = [];
        for (let i = 1; i < Math.min(lines.length, 4); i++) {
          sampleData.push(lines[i].split(',').map(cell => cell.trim()));
        }
        
        setPreviewData({
          headers,
          sample: sampleData
        });
        
        // Auto-map common fields
        const defaultMapping: Record<string, string> = {};
        headers.forEach(header => {
          const normalizedHeader = header.toLowerCase().replace(/[^a-z0-9]/g, '');
          
          if (normalizedHeader === 'firstname') {
            defaultMapping[header] = 'First Name';
          } else if (normalizedHeader === 'lastname') {
            defaultMapping[header] = 'Last Name';
          } else if (normalizedHeader === 'address') {
            defaultMapping[header] = 'Address';
          } else if (normalizedHeader === 'state') {
            defaultMapping[header] = 'State';
          } else if (normalizedHeader === 'phone') {
            defaultMapping[header] = 'Phone';
          } else if (normalizedHeader === 'email') {
            defaultMapping[header] = 'Email';
          }
        });
        
        setMappedFields(defaultMapping);
        setContactsFound(lines.length - 1);
        
        // Move to field mapping step
        setStep(2);
      }
    };
    
    reader.readAsText(selectedFile);
  };
  
  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleFieldMapping = (csvField: string, appField: string) => {
    setMappedFields(prev => ({
      ...prev,
      [csvField]: appField
    }));
  };
  
  const handleImportOptionsChange = (field: string, value: string) => {
    setImportOptions(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handleStartImport = () => {
    // Mock the import process
    setImportStatus({
      inProgress: true,
      fileName: fileName,
      total: contactsFound,
      success: 0,
      errors: 0
    });
    
    // Simulate import progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      setImportProgress(progress);
      
      if (progress >= 100) {
        clearInterval(interval);
        progress = 100;
        setImportProgress(100);
        // Find field indices for correctly mapping data
        const findMappedFieldIndex = (fieldType: string): number => {
          const fieldMapping = Object.entries(mappedFields);
          const mapping = fieldMapping.find(([, value]) => value === fieldType);
          if (mapping) {
            return previewData.headers.indexOf(mapping[0]);
          }
          return -1;
        };
      const firstNameIdx = findMappedFieldIndex('First Name');
      const lastNameIdx = findMappedFieldIndex('Last Name');
      const emailIdx = findMappedFieldIndex('Email');
      const phoneIdx = findMappedFieldIndex('Phone');
        const tagsIdx = findMappedFieldIndex('Tags');
      
        // Generate proper names and ensure correct field mapping
        const importedProspects: Prospect[] = Array.from({ length: contactsFound }).map((unused, i) => {
          const sampleRow = previewData.sample[i % previewData.sample.length] || [];
          
          // Get full name (may be from separate first/last name fields or a single name field)
          let fullName = '';
          if (firstNameIdx >= 0 && lastNameIdx >= 0) {
            fullName = `${sampleRow[firstNameIdx] || ''} ${sampleRow[lastNameIdx] || ''}`.trim();
          } else if (firstNameIdx >= 0) {
            fullName = sampleRow[firstNameIdx] || `Prospect ${i + 1}`;
          } else {
            fullName = `Prospect ${i + 1}`;
          }
          
          // Get proper email
          const email = emailIdx >= 0 ? sampleRow[emailIdx] : `contact${i}@example.com`;
          
          // Get proper phone
          const phone = phoneIdx >= 0 ? sampleRow[phoneIdx] : `(555) ${i.toString().padStart(3, '0')}-${(i * 7).toString().padStart(4, '0')}`;
      
          // Create tag array including the new NetCap tag if specified
          const tags = [...(selectedTags || [])];
          if (newTagName === 'NetCap SoCal List' || tags.some(tagId => availableTags.find(at => at.name === 'NetCap SoCal List')?.id === tagId)) {
            if (!tags.some(tagId => availableTags.find(at => at.name === 'NetCap SoCal List')?.id === tagId)) {
              const netCapTag = availableTags.find(at => at.name === 'NetCap SoCal List');
              if (netCapTag) {
                tags.push(netCapTag.id);
              }
            }
          }
          
          return {
            id: `import-${Date.now()}-${i}`,
            name: fullName,
            email: email,
            phone: phone,
            nextAppointment: '',
            status: 'new',
            leadSource: 'lead-list',
            interestLevel: 'medium',
            lastContact: new Date().toISOString().split('T')[0],
            campaign: '', // Empty as no number pool is created yet
            assignee: '', // Empty as user UI is not made yet
            tags: tags
          };
        });
        
        setImportStatus({
          inProgress: false,
          fileName: fileName,
          total: contactsFound,
          success: contactsFound - Math.floor(Math.random() * 5), // Random success count
          errors: Math.floor(Math.random() * 5) // Random error count
        });
        
        onImportComplete(importedProspects);
        setTimeout(() => {
          onClose();
          resetImportState();
        }, 3000);
      }
    }, 200);
  };
  
  const renderStepIndicator = () => {
    return (
      <div className="flex justify-center items-center mb-8">
        {[1, 2, 3, 4, 5, 6].map((s) => (
          <React.Fragment key={s}>
            {s > 1 && (
              <div className="w-6 h-0.5 bg-gray-200">
                {/* Connector line */}
              </div>
            )}
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium 
                ${s === step 
                  ? 'bg-blue-500 text-white' 
                  : s < step 
                    ? 'bg-gray-200 text-gray-700' 
                    : 'bg-gray-200 text-gray-400'}`}
            >
              {s}
            </div>
          </React.Fragment>
        ))}
      </div>
    );
  };
  
  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <>
            <h3 className="text-center mb-2">Step 1: Upload Import File</h3>
            <div className="border-2 border-dashed border-gray-300 rounded-md p-10 text-center mb-6">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept=".csv,.xlsx,.xls"
                className="hidden"
              />
              {!file ? (
                <>
                  <div className="mb-4 flex justify-center">
                    <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center">
                      <Icons.Upload className="h-8 w-8 text-blue-500" />
                    </div>
                  </div>
                  <p className="text-gray-500 mb-2">Drag file here</p>
                  <p className="text-gray-500 mb-4">or</p>
                  <Button onClick={handleBrowseClick}>BROWSE COMPUTER</Button>
                  <p className="text-gray-500 text-sm mt-4">File can be CSV, XLS, or XLSX</p>
                </>
              ) : (
                <>
                  <div className="mb-4 flex justify-center">
                    <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center">
                      <Icons.FileSpreadsheet className="h-8 w-8 text-green-500" />
                    </div>
                  </div>
                  <p className="font-medium">{fileName}</p>
                  <p className="text-blue-500 text-sm cursor-pointer mt-2" onClick={() => setStep(2)}>Press next to continue</p>
                </>
              )}
            </div>
            
            <div className="mb-6">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="contains-header"
                  checked={true}
                  className="mr-2"
                  readOnly
                />
                <label htmlFor="contains-header" className="text-sm">Import file contains header</label>
              </div>
            </div>
            
            <h3 className="font-medium mb-2">Import History <span className="text-xs text-gray-500">(only kept for 60 days)</span></h3>
            <div className="border border-gray-200 rounded-md mb-4">
              <div className="grid grid-cols-6 bg-gray-100 p-2 text-xs font-medium text-gray-500 uppercase">
                <div>IMPORT DATE TIME</div>
                <div>FILE NAME</div>
                <div>NEWLY ADDED</div>
                <div>UPDATED</div>
                <div>TOTAL</div>
                <div>IMPORTED BY</div>
              </div>
              <div className="p-10 text-center text-gray-500">
                Import History Empty
              </div>
            </div>
          </>
        );
      
      case 2:
        return (
          <>
            <h3 className="text-center mb-4">Step 2: Map Fields</h3>
            <p className="text-sm text-gray-600 mb-4">
              Each column header below should be mapped to a contact property in DentalHub. Anything that hasn't been mapped needs to be manually mapped to a contact property with the dropdown menu in order to proceed to the next step. You can always choose "Don't import column" if you wish to not import a column of data or check off the "Don't import data in unmatched columns" checkbox at the bottom.
            </p>
            
            <div className="mb-4 flex items-center">
              <Icons.FileSpreadsheet className="w-5 h-5 text-green-600 mr-2" />
              <span className="text-sm">{fileName} file</span>
              <span className="ml-auto text-sm text-gray-600">{contactsFound} contacts found</span>
            </div>
            
            <div className="border border-gray-200 rounded-md mb-6">
              <div className="grid grid-cols-4 bg-gray-100 p-3 text-xs font-medium text-gray-600 uppercase">
                <div>MATCHED</div>
                <div>COLUMN HEADER FROM FILE</div>
                <div>PREVIEW INFORMATION</div>
                <div>DENTALHUB FIELD</div>
              </div>
              
              {previewData.headers.map((header, idx) => (
                <div key={idx} className="grid grid-cols-4 p-3 border-t border-gray-200 items-center">
                  <div>
                    {mappedFields[header] ? (
                      <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                        <Icons.Check className="w-3 h-3 text-green-600" />
                      </div>
                    ) : (
                      <div className="w-5 h-5 rounded-full bg-gray-100"></div>
                    )}
                  </div>
                  <div>{header}</div>
                  <div className="text-sm text-gray-600">
                    {previewData.sample.map((row, i) => (
                      <div key={i}>{row[idx] || '-'}</div>
                    ))}
                  </div>
                  <div>
                    <select 
                      value={mappedFields[header] || ''}
                      onChange={(e) => handleFieldMapping(header, e.target.value)}
                      className="w-full p-2 border border-gray-200 rounded"
                    >
                      <option value="">Choose Field</option>
                      <option value="First Name">First Name</option>
                      <option value="Last Name">Last Name</option>
                      <option value="Email">Email</option>
                      <option value="Phone">Phone</option>
                      <option value="Address">Address</option>
                      <option value="State">State</option>
                      <option value="City">City</option>
                      <option value="Zip">Zip</option>
                      <option value="Don't import column">Don't import column</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex justify-end">
              <div className="flex items-center">
                <input type="checkbox" id="dont-import" className="mr-2" />
                <label htmlFor="dont-import" className="text-sm">Don't import data in unmatched columns</label>
              </div>
            </div>
          </>
        );
      
      case 3:
        return (
          <>
            <h3 className="text-center mb-4">Step 3: Import Options</h3>
            <p className="text-sm text-gray-600 mb-6">
              Manage how DentalHub will import the contacts from your import file and how to deal with duplicates
            </p>
            
            <h4 className="text-sm font-medium mb-3">How do you want to import the contacts from your import file?</h4>
            
            <div className="space-y-3 mb-6">
              <div className="flex items-center">
                <input 
                  type="radio" 
                  id="add-update" 
                  name="import-mode"
                  checked={true}
                  className="mr-3"
                  readOnly
                />
                <label htmlFor="add-update" className="text-sm">Add as new and update existing contact records</label>
              </div>
              
              <div className="ml-6 border border-gray-200 rounded-md p-4">
                <div className="mb-3">
                  <label className="block text-xs text-gray-500 mb-1">Find existing contacts based on:</label>
                  <select 
                    value={importOptions.findExistingBy}
                    onChange={(e) => handleImportOptionsChange('findExistingBy', e.target.value)}
                    className="w-full p-2 border border-gray-200 rounded"
                  >
                    <option value="phone">Phone</option>
                    <option value="email">Email</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Update option:</label>
                  <select 
                    value={importOptions.updateOption}
                    onChange={(e) => handleImportOptionsChange('updateOption', e.target.value)}
                    className="w-full p-2 border border-gray-200 rounded"
                  >
                    <option value="emptyFields">Update fields that are empty</option>
                    <option value="allFields">Update all fields</option>
                  </select>
                </div>
              </div>
              
              <div className="flex items-center">
                <input 
                  type="radio" 
                  id="add-only" 
                  name="import-mode"
                  className="mr-3"
                />
                <label htmlFor="add-only" className="text-sm">Only add new contact records</label>
              </div>
              
              <div className="flex items-center">
                <input 
                  type="radio" 
                  id="update-only" 
                  name="import-mode"
                  className="mr-3"
                />
                <label htmlFor="update-only" className="text-sm">Only update existing contact records</label>
              </div>
            </div>
          </>
        );
      
      case 4:
        return (
          <>
            <h3 className="text-center mb-4">Step 4: Assign User</h3>
            <p className="text-sm text-gray-600 mb-6">
              Select who you want to assign these contacts to. If more than one assignee is selected, contacts will be assigned Round Robin.
            </p>
            
            <h4 className="font-medium mb-2">Assignees</h4>
            <div className="mb-4">
              <select 
                value={selectedAssignee}
                onChange={(e) => setSelectedAssignee(e.target.value)}
                className="w-full p-2 border border-gray-200 rounded"
              >
                <option value="">Select Assignee</option>
                {availableAssignees.map(assignee => (
                  <option key={assignee.id} value={assignee.id}>{assignee.name}</option>
                ))}
              </select>
            </div>
            
            <h4 className="font-medium mb-2">Assign option</h4>
            <div className="border border-gray-200 rounded-md">
              <div 
                className="p-3 flex items-center justify-between cursor-pointer"
                onClick={() => setAssigneeOption('noExisting')}
              >
                <span>Assign contacts with no existing assignee</span>
                <div className={`w-4 h-4 rounded-full border ${assigneeOption === 'noExisting' ? 'bg-blue-500 border-blue-500' : 'border-gray-300'}`}>
                  {assigneeOption === 'noExisting' && <Icons.Check className="w-3 h-3 text-white" />}
                </div>
              </div>
              <div 
                className="p-3 border-t border-gray-200 flex items-center justify-between cursor-pointer"
                onClick={() => setAssigneeOption('toUsers')}
              >
                <span>Assign contacts to users</span>
                <div className={`w-4 h-4 rounded-full border ${assigneeOption === 'toUsers' ? 'bg-blue-500 border-blue-500' : 'border-gray-300'}`}>
                  {assigneeOption === 'toUsers' && <Icons.Check className="w-3 h-3 text-white" />}
                </div>
              </div>
              <div 
                className="p-3 border-t border-gray-200 flex items-center justify-between cursor-pointer"
                onClick={() => setAssigneeOption('updateOnly')}
              >
                <span>Only update assignees who have previously been assigned to a user</span>
                <div className={`w-4 h-4 rounded-full border ${assigneeOption === 'updateOnly' ? 'bg-blue-500 border-blue-500' : 'border-gray-300'}`}>
                  {assigneeOption === 'updateOnly' && <Icons.Check className="w-3 h-3 text-white" />}
                </div>
              </div>
            </div>
          </>
        );
      
      case 5:
        return (
          <>
            <h3 className="text-center mb-4">Step 5: Assign Campaign</h3>
            <p className="text-sm text-gray-600 mb-6">
              Choose which campaign you would like to assign these contacts to.
            </p>
            
            <h4 className="font-medium mb-2">Campaign</h4>
            <div className="mb-4">
              <select 
                value={selectedCampaign}
                onChange={(e) => setSelectedCampaign(e.target.value)}
                className="w-full p-2 border border-gray-200 rounded"
              >
                <option value="">Select Campaign</option>
                <option value="none">No Campaign (Assign to no campaign)</option>
                {availableCampaigns.map(campaign => (
                  <option key={campaign.id} value={campaign.id}>
                    {campaign.id} - {campaign.name}
                  </option>
                ))}
              </select>
            </div>
            
            <h4 className="font-medium mb-2">Assign option</h4>
            <div className="border border-gray-200 rounded-md">
              <div 
                className="p-3 flex items-center justify-between cursor-pointer"
                onClick={() => setCampaignOption('noExisting')}
              >
                <span>Assign contacts with no existing campaign</span>
                <div className={`w-4 h-4 rounded-full border ${campaignOption === 'noExisting' ? 'bg-blue-500 border-blue-500' : 'border-gray-300'}`}>
                  {campaignOption === 'noExisting' && <Icons.Check className="w-3 h-3 text-white" />}
                </div>
              </div>
              <div 
                className="p-3 border-t border-gray-200 flex items-center justify-between cursor-pointer"
                onClick={() => setCampaignOption('assign')}
              >
                <span>Assign contacts to campaign</span>
                <div className={`w-4 h-4 rounded-full border ${campaignOption === 'assign' ? 'bg-blue-500 border-blue-500' : 'border-gray-300'}`}>
                  {campaignOption === 'assign' && <Icons.Check className="w-3 h-3 text-white" />}
                </div>
              </div>
              <div 
                className="p-3 border-t border-gray-200 flex items-center justify-between cursor-pointer"
                onClick={() => setCampaignOption('updateOnly')}
              >
                <span>Only update campaigns for those who have previously been assigned to a campaign</span>
                <div className={`w-4 h-4 rounded-full border ${campaignOption === 'updateOnly' ? 'bg-blue-500 border-blue-500' : 'border-gray-300'}`}>
                  {campaignOption === 'updateOnly' && <Icons.Check className="w-3 h-3 text-white" />}
                </div>
              </div>
            </div>
          </>
        );
      
      case 6:
        return (
          <>
            <h3 className="text-center mb-4">Step 6: Add Tags</h3>
            <p className="text-sm text-gray-600 mb-6">
              Add tags to this batch of contacts being imported
            </p>
            
            <div className="border border-gray-200 rounded-md p-6 mb-6">
              {selectedTags.length > 0 ? (
                <div className="mb-4">
                  <p className="text-sm font-medium mb-2">Selected Tags:</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedTags.map((tagId) => {
                      const tag = availableTags.find(t => t.id === tagId);
                      return (
                        <div key={tagId} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full flex items-center">
                          <span>{tag?.name}</span>
                          <button
                            onClick={() => setSelectedTags(tags => tags.filter(t => t !== tagId))}
                            className="ml-2 text-blue-500 hover:text-blue-700 focus:outline-none"
                          >
                            <Icons.X className="w-3 h-3" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 mb-4 text-center">No Tags Selected</p>
              )}
              
              <div className="flex justify-center gap-4">
                <div className="relative">
                  <Button
                    variant="outline"
                    className="text-blue-500"
                    onClick={() => setShowTagsDropdown(!showTagsDropdown)}
                  >
                    + Add Tags
                  </Button>
                  
                  {/* Tags Dropdown */}
                  {showTagsDropdown && (
                    <div className="absolute z-10 mt-1 w-56 bg-white border border-gray-200 rounded-md shadow-lg">
                      <div className="p-2">
                        <input
                          type="text"
                          placeholder="Search tags..."
                          className="w-full p-2 border border-gray-200 rounded text-sm"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                      <ul className="max-h-48 overflow-y-auto py-1">
                        {availableTags.filter(tag => !selectedTags.includes(tag.id)).map(tag => (
                          <li
                            key={tag.id}
                            className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer flex items-center"
                            onClick={() => {
                              setSelectedTags(prev => [...prev, tag.id]);
                              setShowTagsDropdown(false);
                            }}
                          >
                            <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                            {tag.name}
                          </li>
                        ))}
                        {availableTags.filter(tag => !selectedTags.includes(tag.id)).length === 0 && (
                          <li className="px-4 py-2 text-sm text-gray-500">No tags available</li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>
                
                {/* Create New Tag */}
                {!showNewTagInput ? (
                  <Button
                    variant="outline"
                    className="text-blue-500"
                    onClick={() => setShowNewTagInput(true)}
                  >
                    Create New Tag
                  </Button>
                ) : (
                  <div className="flex">
                    <input
                      type="text"
                      value={newTagName}
                      onChange={(e) => setNewTagName(e.target.value)}
                      placeholder="Enter tag name"
                      className="p-2 border border-gray-200 rounded-l text-sm"
                      autoFocus
                    />
                    <Button
                      variant="primary"
                      className="rounded-l-none"
                      onClick={() => {
                        if (newTagName.trim()) {
                          // Create new tag with a dummy ID
                          const newId = `new-${Date.now()}`;
                          // Add to available tags
                          availableTags.push({ id: newId, name: newTagName.trim() });
                          // Select the new tag
                          setSelectedTags(prev => [...prev, newId]);
                          // Reset
                          setNewTagName('');
                          setShowNewTagInput(false);
                        }
                      }}
                    >
                      Add
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setNewTagName('');
                        setShowNewTagInput(false);
                      }}
                    >
                      <Icons.X className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </>
        );
      
      default:
        return null;
    }
  };
  
  const handleNextStep = () => {
    if (step < 6) {
      setStep(step + 1);
    } else {
      handleStartImport();
    }
  };
  
  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };
  
  if (!isOpen) return null;
  
  // Show importing notification
  if (importStatus.inProgress) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" style={{zIndex: 10000}}>
        <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
          <h3 className="text-lg font-medium mb-4">Importing Contacts</h3>
          <p className="text-sm text-gray-600 mb-4">
            The import is processing. It will notify and email to you when it is finished.
          </p>
          <div className="mb-4">
            <div className="h-2 w-full bg-gray-200 rounded-full">
              <div 
                className="h-full bg-blue-500 rounded-full" 
                style={{ width: `${importProgress}%` }}
              ></div>
            </div>
            <div className="text-right text-xs text-gray-500 mt-1">
              {importProgress}%
            </div>
          </div>
          <Button onClick={onClose} variant="outline" className="w-full">
            Close
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Import Marketing Prospects</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <Icons.X className="w-5 h-5" />
            </Button>
          </div>
        </div>
        
        <div className="p-6">
          {renderStepIndicator()}
          {renderStepContent()}
        </div>
        
        <div className="p-4 border-t border-gray-200 flex justify-between">
          <Button 
            variant="ghost" 
            onClick={step === 1 ? onClose : handlePrevStep}
          >
            {step === 1 ? 'Cancel' : '← BACK'}
          </Button>
          <Button 
            onClick={handleNextStep}
            disabled={step === 1 && !file}
            className={step === 6 ? 'bg-blue-500 text-white' : ''}
          >
            {step === 6 ? 'IMPORT' : 'NEXT →'}
          </Button>
        </div>
      </div>
    </div>
  );
};

const Prospects = () => {
  // Initialize communication context
  useCommunication();
  
  // Dialog state
  const [isCallDialogOpen, setIsCallDialogOpen] = useState(false);
  const [isSMSDialogOpen, setIsSMSDialogOpen] = useState(false);
  const [isAddProspectDialogOpen, setIsAddProspectDialogOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'deleted' | 'duplicates'>('all');
  // State for selected prospects is prepared for future functionality
  
  // Prospect state
  const [prospects, setProspects] = useState<Prospect[]>([
    {
      id: '1',
      name: 'John Smith',
      email: 'john.smith@example.com',
      phone: '(555) 987-6543',
      nextAppointment: '2024-03-20',
      status: 'qualified',
      leadSource: 'website',
      interestLevel: 'high',
      lastContact: '2024-03-01',
      notes: 'Referred by Dr. Williams, interested in implants'
    },
    {
      id: '2',
      name: 'Emily Brown',
      email: 'emily.b@example.com',
      phone: '(555) 234-5678',
      nextAppointment: '',
      status: 'new',
      leadSource: 'social',
      interestLevel: 'medium',
      lastContact: '2024-03-05',
      notes: 'Found us on Instagram, interested in teeth whitening services'
    },
    {
      id: '3',
      name: 'Michael Johnson',
      email: 'michael.j@example.com',
      phone: '(555) 876-1234',
      nextAppointment: '',
      status: 'new',
      leadSource: 'lead-list',
      interestLevel: 'medium',
      lastContact: '',
      notes: 'Part of purchased lead list from marketing campaign'
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
  
  // Handle adding a new prospect
  const handleAddProspect = (prospectData: Omit<Prospect, 'id'>) => {
    const newProspect: Prospect = {
      ...prospectData,
      id: `${prospects.length + 1}` // Simple ID generation for demo
    };
    
    setProspects(prev => [...prev, newProspect]);
  };
  
  // Handle importing prospects
  const handleImportProspects = (importedProspects: Prospect[]) => {
    setProspects(prev => [...prev, ...importedProspects]);
  };

  // Get status badge color
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-800';
      case 'contacted':
        return 'bg-purple-100 text-purple-800';
      case 'qualified':
        return 'bg-orange-100 text-orange-800';
      case 'nurturing':
        return 'bg-indigo-100 text-indigo-800';
      case 'converted':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Interest level indicators for future UI enhancements

  return (
    <div className="space-y-6 relative">
      {/* Page title */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Marketing Prospects</h1>
        <p className="text-sm text-gray-600 mt-1">Manage all contacts in the prospect or marketing phase that are not yet patients</p>
      </div>
      
      {/* Tabs section */}
      <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
        <div className="flex border-b border-gray-200">
          <button 
            className={`px-6 py-3 font-medium text-sm ${activeTab === 'all' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
            onClick={() => setActiveTab('all')}
          >
            ALL PROSPECTS
          </button>
          <button 
            className={`px-6 py-3 font-medium text-sm ${activeTab === 'deleted' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
            onClick={() => setActiveTab('deleted')}
          >
            DELETED PROSPECTS
          </button>
          <button 
            className={`px-6 py-3 font-medium text-sm ${activeTab === 'duplicates' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
            onClick={() => setActiveTab('duplicates')}
          >
            DUPLICATE CONTACTS
          </button>
        </div>
        
        {activeTab === 'all' && (
          <>
            {/* Filter and action buttons */}
            <div className="p-4 border-b border-gray-200 flex flex-wrap gap-2">
              <div className="flex gap-2">
                <Button variant="outline" className="flex items-center" size="sm">
                  <Icons.Inbox className="w-4 h-4 mr-1" />
                  <span>Status</span>
                  <Icons.ChevronDown className="w-4 h-4 ml-2" />
                </Button>
                
                <Button variant="outline" className="flex items-center" size="sm">
                  <Icons.Users className="w-4 h-4 mr-1" />
                  <span>Assignee</span>
                  <Icons.ChevronDown className="w-4 h-4 ml-2" />
                </Button>
                
                <Button variant="outline" className="flex items-center" size="sm">
                  <Icons.GitBranch className="w-4 h-4 mr-1" />
                  <span>Pipeline & Stages</span>
                  <Icons.ChevronDown className="w-4 h-4 ml-2" />
                </Button>
                
                <Button variant="outline" className="flex items-center" size="sm">
                  <Icons.Tag className="w-4 h-4 mr-1" />
                  <span>Tag</span>
                  <Icons.ChevronDown className="w-4 h-4 ml-2" />
                </Button>
              </div>
              
              <div className="flex ml-auto gap-2">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search prospects..."
                    className="p-2 pr-8 border border-gray-200 rounded text-sm"
                  />
                  <Icons.Search className="absolute top-1/2 right-2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
                
                <Button
                  variant="outline"
                  className="flex items-center"
                  size="sm"
                  onClick={() => setIsImportDialogOpen(true)}
                >
                  <Icons.Upload className="w-4 h-4 mr-1" />
                  <span>Import & Export</span>
                  <Icons.ChevronDown className="w-4 h-4 ml-2" />
                </Button>
                
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setIsAddProspectDialogOpen(true)}
                  className="ml-1 bg-blue-600 hover:bg-blue-700"
                >
                  <Icons.Plus className="w-4 h-4 mr-1" />
                  <span className="text-white">Add Prospect</span>
                </Button>
              </div>
            </div>
            
            {/* Table section */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 text-xs uppercase">
                  <tr>
                    <th className="px-3 py-2 w-8">
                      <input type="checkbox" className="h-4 w-4 rounded border-gray-300" />
                    </th>
                    <th className="px-3 py-2 text-left font-medium text-gray-500">PROSPECT NAME</th>
                    <th className="px-3 py-2 text-left font-medium text-gray-500">EMAIL</th>
                    <th className="px-3 py-2 text-left font-medium text-gray-500">PHONE NUMBER</th>
                    <th className="px-3 py-2 text-left font-medium text-gray-500">NUMBER POOL</th>
                    <th className="px-3 py-2 text-left font-medium text-gray-500">TIMEZONE</th>
                    <th className="px-3 py-2 text-left font-medium text-gray-500">STATUS</th>
                    <th className="px-3 py-2 text-left font-medium text-gray-500">PIPELINE</th>
                    <th className="px-3 py-2 text-left font-medium text-gray-500">STAGE</th>
                    <th className="px-3 py-2 text-left font-medium text-gray-500">CAMPAIGN NAME</th>
                    <th className="px-3 py-2 text-left font-medium text-gray-500">CAMPAIGN ASSIGNED DATE</th>
                    <th className="px-3 py-2 text-left font-medium text-gray-500">CAMPAIGN START DATE</th>
                    <th className="px-3 py-2 text-left font-medium text-gray-500">ASSIGNEE</th>
                    <th className="px-3 py-2 text-left font-medium text-gray-500">DATE CREATED</th>
                    <th className="px-3 py-2 text-left font-medium text-gray-500">TAGS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {prospects.map((prospect) => (
                    <tr key={prospect.id} className="hover:bg-gray-50">
                      <td className="px-3 py-2">
                        <input type="checkbox" className="h-4 w-4 rounded border-gray-300" />
                      </td>
                      <td className="px-3 py-2">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                            <span className="text-blue-600 text-xs font-medium">
                              {prospect.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{prospect.name}</div>
                            <div className="flex items-center">
                              <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">New</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-2">
                        <div className="flex items-center">
                          <Icons.Mail className="w-4 h-4 text-gray-400 mr-1" />
                          <span className="text-sm text-gray-900">{prospect.email}</span>
                        </div>
                      </td>
                      <td className="px-3 py-2">
                        <div className="flex items-center">
                          <div className="relative">
                            <Icons.Phone className="w-4 h-4 text-gray-400 mr-1" />
                          </div>
                          <span className="text-sm text-gray-900">{prospect.phone}</span>
                          {Math.random() > 0.5 && (
                            <span className="ml-1 px-1 py-0.5 text-xs bg-gray-100 rounded">SMS</span>
                          )}
                        </div>
                      </td>
                      <td className="px-3 py-2 text-sm text-gray-500">
                        {Math.random() > 0.7 ? '(UTC-08:00) Pacific Time' : '-'}
                      </td>
                      <td className="px-3 py-2 text-sm text-gray-500">
                        {Math.random() > 0.7 ? '(UTC-08:00) Pacific Time' : '-'}
                      </td>
                      <td className="px-3 py-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadgeColor(prospect.status)}`}>
                          {prospect.status}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-sm text-gray-500">
                        {Math.random() > 0.4 ? 'Default' : '-'}
                      </td>
                      <td className="px-3 py-2 text-sm text-gray-500">
                        {Math.random() > 0.4 ? (
                          Math.random() > 0.5 ? 'Qualified' : 'New Lead'
                        ) : '-'}
                      </td>
                      <td className="px-3 py-2 text-sm text-gray-500">
                        {prospect.campaign || '-'}
                      </td>
                      <td className="px-3 py-2 text-sm text-gray-500">-</td>
                      <td className="px-3 py-2 text-sm text-gray-500">-</td>
                      <td className="px-3 py-2 text-sm text-gray-500">
                        {prospect.assignee || 'Michael Bady'}
                      </td>
                      <td className="px-3 py-2 text-sm text-gray-500">
                        {new Date().toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: 'numeric',
                          minute: 'numeric'
                        })}
                      </td>
                      <td className="px-3 py-2">
                        {prospect.tags && prospect.tags.length > 0 ? (
                          <div className="flex gap-1">
                            {prospect.tags.map((tag, idx) => (
                              <span key={idx} className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">{tag}</span>
                            ))}
                          </div>
                        ) : (
                          <button className="text-xs text-blue-600">+ Add</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            <div className="flex justify-between items-center px-4 py-3 border-t border-gray-200">
              <div className="flex items-center text-sm text-gray-500">
                <span>Showing 1 to {prospects.length} of {prospects.length} entries</span>
              </div>
              <div className="flex items-center space-x-1">
                <button className="p-1 rounded border border-gray-200 text-gray-400">
                  <Icons.ChevronLeft className="w-4 h-4" />
                </button>
                <button className="w-8 h-8 flex items-center justify-center rounded bg-blue-600 text-white text-sm">
                  1
                </button>
                <button className="p-1 rounded border border-gray-200 text-gray-400">
                  <Icons.ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </>
        )}
        
        {activeTab === 'deleted' && <ProspectsDeleted />}
        {activeTab === 'duplicates' && <ProspectsDuplicate />}
      </div>
      
      {/* Communication Dialogs */}
      <VoiceCallDialog
        isOpen={isCallDialogOpen}
        onClose={() => setIsCallDialogOpen(false)}
        patientPhone={formatPhoneForTwilio(prospects[0]?.phone)}
        patientName={prospects[0]?.name}
      />
      
      <SMSDialog
        isOpen={isSMSDialogOpen}
        onClose={() => setIsSMSDialogOpen(false)}
        patientPhone={formatPhoneForTwilio(prospects[0]?.phone)}
        patientName={prospects[0]?.name}
      />
      
      {/* Add Prospect Dialog */}
      <AddProspectDialog
        isOpen={isAddProspectDialogOpen}
        onClose={() => setIsAddProspectDialogOpen(false)}
        onAddProspect={handleAddProspect}
      />
      
      {/* Import Prospects Dialog */}
      <ImportProspectsDialog
        isOpen={isImportDialogOpen}
        onClose={() => setIsImportDialogOpen(false)}
        onImportComplete={handleImportProspects}
      />
    </div>
  );
};

export default Prospects;