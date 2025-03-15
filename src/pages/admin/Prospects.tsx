import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Card,
  Divider,
  Table,
  Tag,
  Avatar,
  Select,
  Input,
  Modal,
  Upload,
  Steps,
  Alert,
  Spin,
  Form,
  message,
  Dropdown,
  Menu,
  Tooltip
} from 'antd';
import { 
  UserOutlined, 
  UploadOutlined, 
  SearchOutlined, 
  DownloadOutlined,
  PlusOutlined, 
  FilterOutlined,
  CheckCircleOutlined,
  MessageOutlined,
  PhoneOutlined,
  MoreOutlined,
  InboxOutlined,
  TagOutlined
} from '@ant-design/icons';
import { read, utils } from 'xlsx';
import { useCommunication } from '../../contexts/CommunicationContext';
import prospectApi, { 
  Prospect, 
  ProspectFilter, 
  ImportProspectMapping, 
  ImportOptions 
} from '../../lib/api/prospectService';
import campaignApi, { Campaign } from '../../lib/api/campaignService';
import { useAuth } from '../../contexts/AuthContext';

const { Step } = Steps;
const { Option } = Select;
const { TextArea } = Input;
const { Dragger } = Upload;

const Prospects: React.FC = () => {
  const navigate = useNavigate();
  const { sendBatchSMS, initiateCall } = useCommunication();
  const { user } = useAuth();

  // State for prospects
  const [prospects, setProspects] = useState<Prospect[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedProspects, setSelectedProspects] = useState<string[]>([]);
  const [filters, setFilters] = useState<ProspectFilter>({});
  const [searchText, setSearchText] = useState('');

  // State for campaigns
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [selectedCampaign, setSelectedCampaign] = useState<string>('');

  // State for tags
  const [tags, setTags] = useState<{id: string, name: string}[]>([]);
  const [selectedTag, setSelectedTag] = useState<string>('');

  // State for import modal
  const [importModalVisible, setImportModalVisible] = useState(false);
  const [importStep, setImportStep] = useState(0);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importData, setImportData] = useState<any[]>([]);
  const [importHeaders, setImportHeaders] = useState<string[]>([]);
  const [importMapping, setImportMapping] = useState<ImportProspectMapping>({});
  const [importOptions, setImportOptions] = useState<ImportOptions>({
    updateExisting: true,
    findExistingBy: 'phone',
    updateOption: 'emptyFields',
    campaignOption: 'assign',
    assigneeOption: 'noExisting'
  });
  const [importResult, setImportResult] = useState<{
    total: number;
    added: number;
    updated: number;
    failed: number;
  } | null>(null);

  // State for SMS modal
  const [smsModalVisible, setSmsModalVisible] = useState(false);
  const [smsMessage, setSmsMessage] = useState('');
  const [sendingSms, setSendingSms] = useState(false);

  // Load data on component mount
  useEffect(() => {
    loadProspects();
    loadCampaigns();
    loadTags();
  }, []);

  // Reload prospects when filters change
  useEffect(() => {
    loadProspects();
  }, [filters]);

  // Load prospects from API
  const loadProspects = async () => {
    setLoading(true);
    try {
      // Include search text in filters if present
      const currentFilters = { ...filters };
      if (searchText) {
        currentFilters.search = searchText;
      }
      
      const { data } = await prospectApi.prospects.getProspects(currentFilters);
      if (data) {
        setProspects(data);
      }
    } catch (error) {
      console.error('Error loading prospects:', error);
      message.error('Failed to load prospects');
    } finally {
      setLoading(false);
    }
  };

  // Load campaigns from API
  const loadCampaigns = async () => {
    try {
      const { data } = await campaignApi.getCampaigns();
      if (data) {
        setCampaigns(data);
      }
    } catch (error) {
      console.error('Error loading campaigns:', error);
    }
  };

  // Load tags from API
  const loadTags = async () => {
    try {
      const { data } = await prospectApi.tags.getTags();
      if (data) {
        setTags(data);
      }
    } catch (error) {
      console.error('Error loading tags:', error);
    }
  };

  // Handle prospect selection
  const handleSelectProspect = (prospectId: string, selected: boolean) => {
    if (selected) {
      setSelectedProspects(prev => [...prev, prospectId]);
    } else {
      setSelectedProspects(prev => prev.filter(id => id !== prospectId));
    }
  };

  // Handle select all prospects
  const handleSelectAllProspects = (selected: boolean) => {
    if (selected) {
      setSelectedProspects(prospects.map(p => p.id));
    } else {
      setSelectedProspects([]);
    }
  };

  // Handle filter change
  const handleFilterChange = (filterName: keyof ProspectFilter, value: string | null) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value || undefined
    }));
  };

  // Handle search
  const handleSearch = () => {
    loadProspects();
  };

  // Handle row click to view prospect detail
  const handleRowClick = (prospectId: string) => {
    navigate(`/admin-dashboard/prospects/${prospectId}`);
  };

  // IMPORT FUNCTIONS
  
  // Reset import state
  const resetImport = () => {
    setImportStep(0);
    setImportFile(null);
    setImportData([]);
    setImportHeaders([]);
    setImportMapping({});
    setImportResult(null);
  };

  // Handle file upload for import
  const handleImportFileChange = async (file: File) => {
    setImportFile(file);
    
    try {
      // Read the file
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          const binaryStr = e.target.result as ArrayBuffer;
          const wb = read(binaryStr, { type: 'array' });
          
          // Get the first worksheet
          const wsname = wb.SheetNames[0];
          const ws = wb.Sheets[wsname];
          
          // Convert array of arrays
          const data = utils.sheet_to_json<any>(ws, { header: 1 });
          
          if (data.length > 0) {
            // Extract headers
            const headers = data[0] as string[];
            
            // Extract data rows (skip header)
            const dataRows = data.slice(1);
            
            // Create array of objects with row data
            const jsonData = dataRows.map(row => {
              const obj: Record<string, any> = {};
              headers.forEach((header, index) => {
                obj[header] = row[index];
              });
              return obj;
            });
            
            setImportHeaders(headers);
            setImportData(jsonData);
            
            // Initialize mapping
            const initialMapping: ImportProspectMapping = {};
            headers.forEach(header => {
              initialMapping[header] = 'Don\'t import column';
            });
            setImportMapping(initialMapping);
            
            // Move to next step
            setImportStep(1);
          } else {
            message.error('File is empty');
          }
        }
      };
      reader.readAsArrayBuffer(file);
      
      return false; // Prevent default upload behavior
    } catch (error) {
      console.error('Error processing file:', error);
      message.error('Failed to process file');
      return false;
    }
  };

  // Handle mapping change
  const handleMappingChange = (header: string, value: string) => {
    setImportMapping(prev => ({
      ...prev,
      [header]: value
    }));
  };

  // Handle import options change
  const handleImportOptionChange = (option: keyof ImportOptions, value: any) => {
    setImportOptions(prev => ({
      ...prev,
      [option]: value
    }));
  };

  // Execute import
  const handleExecuteImport = async () => {
    try {
      setLoading(true);
      
      // Validate mapping - ensure first name and last name are mapped
      const hasFirstName = Object.values(importMapping).includes('First Name');
      const hasLastName = Object.values(importMapping).includes('Last Name');
      
      if (!hasFirstName && !hasLastName) {
        message.error('You must map at least first name or last name column');
        return;
      }
      
      // Execute import
      const { data, error } = await prospectApi.prospects.importProspects(
        importData,
        importMapping,
        importOptions
      );
      
      if (error) {
        throw error;
      }
      
      setImportResult(data || null);
      setImportStep(3);
      
      // Reload prospects after import
      loadProspects();
    } catch (error) {
      console.error('Error importing prospects:', error);
      message.error('Failed to import prospects');
    } finally {
      setLoading(false);
    }
  };

  // CAMPAIGN FUNCTIONS
  
  // Assign selected prospects to campaign
  const handleAssignCampaign = async () => {
    if (!selectedCampaign || selectedProspects.length === 0) {
      message.error('Please select a campaign and at least one prospect');
      return;
    }
    
    try {
      setLoading(true);
      
      const { error } = await prospectApi.prospects.assignCampaign(
        selectedProspects,
        selectedCampaign
      );
      
      if (error) {
        throw error;
      }
      
      message.success(`${selectedProspects.length} prospects assigned to campaign`);
      
      // Reset selection
      setSelectedProspects([]);
      setSelectedCampaign('');
      
      // Reload prospects
      loadProspects();
    } catch (error) {
      console.error('Error assigning campaign:', error);
      message.error('Failed to assign prospects to campaign');
    } finally {
      setLoading(false);
    }
  };

  // COMMUNICATION FUNCTIONS
  
  // Open SMS modal
  const handleOpenSmsModal = () => {
    if (selectedProspects.length === 0) {
      message.error('Please select at least one prospect');
      return;
    }
    
    setSmsModalVisible(true);
  };

  // Send SMS to selected prospects
  const handleSendSms = async () => {
    if (selectedProspects.length === 0 || !smsMessage) {
      message.error('Please select prospects and enter a message');
      return;
    }
    
    try {
      setSendingSms(true);
      
      // Get phone numbers of selected prospects
      const selectedPhoneNumbers = prospects
        .filter(p => selectedProspects.includes(p.id) && p.phone)
        .map(p => p.phone as string);
      
      if (selectedPhoneNumbers.length === 0) {
        message.error('None of the selected prospects have valid phone numbers');
        return;
      }
      
      // Send batch SMS
      await sendBatchSMS(selectedPhoneNumbers, smsMessage);
      
      message.success(`SMS sent to ${selectedPhoneNumbers.length} prospects`);
      
      // Close modal and reset state
      setSmsModalVisible(false);
      setSmsMessage('');
      setSelectedProspects([]);
    } catch (error) {
      console.error('Error sending SMS:', error);
      message.error('Failed to send SMS');
    } finally {
      setSendingSms(false);
    }
  };

  // Initiate call to prospect
  const handleCall = async (phoneNumber: string) => {
    if (!phoneNumber) {
      message.error('Invalid phone number');
      return;
    }
    
    try {
      await initiateCall({ to: phoneNumber });
      message.success('Call initiated');
    } catch (error) {
      console.error('Error initiating call:', error);
      message.error('Failed to initiate call');
    }
  };

  // TABLE COLUMNS
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      render: (_: any, record: Prospect) => (
        <div className="flex items-center">
          <Avatar icon={<UserOutlined />} className="mr-2" />
          <div>
            <div className="font-medium">{record.first_name} {record.last_name}</div>
            {record.email && <div className="text-sm text-gray-500">{record.email}</div>}
          </div>
        </div>
      ),
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      render: (phone: string, record: Prospect) => (
        <div className="flex items-center">
          {phone || 'No phone'}
          {phone && (
            <div className="ml-2 flex space-x-1">
              <Tooltip title="Send SMS">
                <Button 
                  icon={<MessageOutlined />} 
                  size="small" 
                  type="text"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedProspects([record.id]);
                    setSmsModalVisible(true);
                  }}
                />
              </Tooltip>
              <Tooltip title="Call">
                <Button 
                  icon={<PhoneOutlined />} 
                  size="small" 
                  type="text"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCall(phone);
                  }}
                />
              </Tooltip>
            </div>
          )}
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (status: string) => (
        <Tag color={
          status === 'new' ? 'blue' : 
          status === 'contacted' ? 'orange' :
          status === 'qualified' ? 'green' :
          status === 'converted' ? 'purple' :
          'default'
        }>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Tag>
      ),
    },
    {
      title: 'Campaigns',
      dataIndex: 'campaigns',
      render: (campaigns: Campaign[]) => (
        <div>
          {campaigns && campaigns.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {campaigns.slice(0, 2).map(campaign => (
                <Tag key={campaign.id} color="blue">{campaign.name}</Tag>
              ))}
              {campaigns.length > 2 && (
                <Tag>+{campaigns.length - 2} more</Tag>
              )}
            </div>
          ) : (
            <span className="text-gray-400">None</span>
          )}
        </div>
      ),
    },
    {
      title: 'Tags',
      dataIndex: 'tags',
      render: (tags: {id: string, name: string}[]) => (
        <div>
          {tags && tags.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {tags.slice(0, 3).map(tag => (
                <Tag key={tag.id} color="green">{tag.name}</Tag>
              ))}
              {tags.length > 3 && (
                <Tag>+{tags.length - 3} more</Tag>
              )}
            </div>
          ) : (
            <span className="text-gray-400">None</span>
          )}
        </div>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Prospect) => (
        <Dropdown 
          overlay={
            <Menu>
              <Menu.Item 
                key="view" 
                onClick={(e) => {
                  e.domEvent.stopPropagation();
                  handleRowClick(record.id);
                }}
              >
                View Details
              </Menu.Item>
              <Menu.Item 
                key="edit" 
                onClick={(e) => {
                  e.domEvent.stopPropagation();
                  navigate(`/admin-dashboard/prospects/${record.id}/edit`);
                }}
              >
                Edit
              </Menu.Item>
              <Menu.Divider />
              <Menu.Item 
                key="add_tag" 
                icon={<TagOutlined />}
                onClick={(e) => e.domEvent.stopPropagation()}
              >
                Add Tag
              </Menu.Item>
              <Menu.Item 
                key="message" 
                icon={<MessageOutlined />}
                onClick={(e) => {
                  e.domEvent.stopPropagation();
                  setSelectedProspects([record.id]);
                  setSmsModalVisible(true);
                }}
              >
                Send Message
              </Menu.Item>
              <Menu.Item 
                key="call" 
                icon={<PhoneOutlined />}
                onClick={(e) => {
                  e.domEvent.stopPropagation();
                  if (record.phone) {
                    handleCall(record.phone);
                  } else {
                    message.error('No phone number available');
                  }
                }}
                disabled={!record.phone}
              >
                Call
              </Menu.Item>
            </Menu>
          } 
          trigger={['click']}
          onClick={(e) => e.stopPropagation()}
        >
          <Button 
            icon={<MoreOutlined />} 
            type="text"
            onClick={(e) => e.stopPropagation()}
          />
        </Dropdown>
      ),
    },
  ];

  // RENDER FUNCTIONS
  
  // Render import steps
  const renderImportStep = () => {
    switch (importStep) {
      case 0: // Upload file
        return (
          <div className="p-6">
            <Dragger
              name="file"
              multiple={false}
              beforeUpload={(file) => handleImportFileChange(file)}
              showUploadList={false}
              accept=".xlsx,.xls,.csv"
            >
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">Click or drag file to this area to upload</p>
              <p className="ant-upload-hint">
                Support for .xlsx, .xls, or .csv files. Make sure your file has headers.
              </p>
            </Dragger>
            {importFile && (
              <div className="mt-4">
                <Alert 
                  message="File selected" 
                  description={importFile.name}
                  type="success" 
                  showIcon 
                />
              </div>
            )}
          </div>
        );
      
      case 1: // Map fields
        return (
          <div className="p-6">
            <div className="mb-4">
              <h3 className="text-lg font-medium">Map your file columns to prospect fields</h3>
              <p className="text-gray-500">
                Select which columns from your file correspond to each prospect field.
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {importHeaders.map(header => (
                <div key={header} className="mb-4">
                  <div className="font-medium mb-1">{header}</div>
                  <Select
                    style={{ width: '100%' }}
                    value={importMapping[header]}
                    onChange={(value) => handleMappingChange(header, value)}
                  >
                    <Option value="Don't import column">Don't import column</Option>
                    <Option value="First Name">First Name</Option>
                    <Option value="Last Name">Last Name</Option>
                    <Option value="Email">Email</Option>
                    <Option value="Phone">Phone</Option>
                    <Option value="Address">Address</Option>
                    <Option value="City">City</Option>
                    <Option value="State">State</Option>
                    <Option value="Zip">Zip</Option>
                    <Option value="Notes">Notes</Option>
                  </Select>
                </div>
              ))}
            </div>
            
            {importData.length > 0 && (
              <div className="mt-6">
                <h4 className="text-md font-medium mb-2">Preview (First 3 rows)</h4>
                <div className="overflow-x-auto">
                  <Table
                    dataSource={importData.slice(0, 3)}
                    columns={importHeaders.map(header => ({
                      title: header,
                      dataIndex: header,
                      key: header,
                    }))}
                    pagination={false}
                    size="small"
                    bordered
                  />
                </div>
              </div>
            )}
          </div>
        );
      
      case 2: // Configure import options
        return (
          <div className="p-6">
            <div className="mb-4">
              <h3 className="text-lg font-medium">Configure import options</h3>
              <p className="text-gray-500">
                Set up how the import should handle existing records and assignments.
              </p>
            </div>
            
            <Form layout="vertical">
              <Form.Item
                label="Handling existing records"
                tooltip="How to handle if a prospect with the same phone/email already exists"
              >
                <Select
                  value={importOptions.updateExisting ? 'update' : 'always_create'}
                  onChange={(value) => handleImportOptionChange('updateExisting', value === 'update')}
                  style={{ width: '100%' }}
                >
                  <Option value="update">Update existing records</Option>
                  <Option value="always_create">Always create new records</Option>
                </Select>
              </Form.Item>
              
              {importOptions.updateExisting && (
                <>
                  <Form.Item
                    label="Find existing records by"
                  >
                    <Select
                      value={importOptions.findExistingBy}
                      onChange={(value) => handleImportOptionChange('findExistingBy', value)}
                      style={{ width: '100%' }}
                    >
                      <Option value="phone">Phone number</Option>
                      <Option value="email">Email address</Option>
                    </Select>
                  </Form.Item>
                  
                  <Form.Item
                    label="When updating existing records"
                  >
                    <Select
                      value={importOptions.updateOption}
                      onChange={(value) => handleImportOptionChange('updateOption', value)}
                      style={{ width: '100%' }}
                    >
                      <Option value="emptyFields">Only update empty fields</Option>
                      <Option value="allFields">Update all fields</Option>
                    </Select>
                  </Form.Item>
                </>
              )}
              
              <Divider />
              
              <Form.Item
                label="Assign to campaign"
              >
                <Select
                  value={importOptions.campaignId}
                  onChange={(value) => handleImportOptionChange('campaignId', value)}
                  style={{ width: '100%' }}
                  placeholder="Select a campaign"
                  allowClear
                >
                  {campaigns.map(campaign => (
                    <Option key={campaign.id} value={campaign.id}>{campaign.name}</Option>
                  ))}
                </Select>
              </Form.Item>
              
              {importOptions.campaignId && (
                <Form.Item
                  label="Campaign assignment option"
                >
                  <Select
                    value={importOptions.campaignOption}
                    onChange={(value) => handleImportOptionChange('campaignOption', value)}
                    style={{ width: '100%' }}
                  >
                    <Option value="assign">Assign all prospects to this campaign</Option>
                    <Option value="noExisting">Only assign new prospects</Option>
                    <Option value="updateOnly">Only assign existing prospects</Option>
                  </Select>
                </Form.Item>
              )}
              
              <Divider />
              
              <Form.Item
                label="Assign to user"
              >
                <Select
                  value={importOptions.assigneeId}
                  onChange={(value) => handleImportOptionChange('assigneeId', value)}
                  style={{ width: '100%' }}
                  placeholder="Select a user"
                  allowClear
                >
                  <Option value={user?.id}>Myself</Option>
                  {/* Add other users here */}
                </Select>
              </Form.Item>
              
              {importOptions.assigneeId && (
                <Form.Item
                  label="User assignment option"
                >
                  <Select
                    value={importOptions.assigneeOption}
                    onChange={(value) => handleImportOptionChange('assigneeOption', value)}
                    style={{ width: '100%' }}
                  >
                    <Option value="toUsers">Assign all prospects to this user</Option>
                    <Option value="noExisting">Only assign new prospects</Option>
                    <Option value="updateOnly">Only assign existing prospects</Option>
                  </Select>
                </Form.Item>
              )}
              
              <Divider />
              
              <Form.Item
                label="Add tags"
              >
                <Select
                  mode="multiple"
                  value={importOptions.tags}
                  onChange={(value) => handleImportOptionChange('tags', value)}
                  style={{ width: '100%' }}
                  placeholder="Select tags"
                  allowClear
                >
                  {tags.map(tag => (
                    <Option key={tag.id} value={tag.id}>{tag.name}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Form>
          </div>
        );
      
      case 3: // Import results
        return (
          <div className="p-6">
            <div className="mb-4">
              <h3 className="text-lg font-medium">Import Results</h3>
            </div>
            
            {importResult && (
              <div className="mb-6">
                <Alert
                  message="Import completed"
                  description={
                    <div>
                      <p>Total records: {importResult.total}</p>
                      <p>Added: {importResult.added}</p>
                      <p>Updated: {importResult.updated}</p>
                      <p>Failed: {importResult.failed}</p>
                    </div>
                  }
                  type="success"
                  showIcon
                />
              </div>
            )}
            
            <div className="flex justify-center">
              <Button 
                type="primary" 
                onClick={() => {
                  setImportModalVisible(false);
                  resetImport();
                }}
              >
                Done
              </Button>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="prospects-page">
      <Card
        title={
          <div className="flex items-center justify-between">
            <span>Prospects</span>
            <div className="flex space-x-2">
              <Button 
                icon={<PlusOutlined />} 
                type="primary"
                onClick={() => navigate('/admin-dashboard/prospects/new')}
              >
                Add Prospect
              </Button>
              <Button 
                icon={<UploadOutlined />}
                onClick={() => setImportModalVisible(true)}
              >
                Import
              </Button>
            </div>
          </div>
        }
      >
        {/* Filters */}
        <div className="mb-4 flex flex-wrap items-center space-x-2">
          <Input 
            placeholder="Search by name, email, or phone" 
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onPressEnter={handleSearch}
            style={{ width: 250 }}
            prefix={<SearchOutlined />}
          />
          
          <Select
            placeholder="Status"
            style={{ width: 150 }}
            allowClear
            onChange={(value) => handleFilterChange('status', value)}
            value={filters.status}
          >
            <Option value="new">New</Option>
            <Option value="contacted">Contacted</Option>
            <Option value="qualified">Qualified</Option>
            <Option value="converted">Converted</Option>
            <Option value="closed">Closed</Option>
          </Select>
          
          <Select
            placeholder="Campaign"
            style={{ width: 180 }}
            allowClear
            onChange={(value) => handleFilterChange('campaign_id', value)}
            value={filters.campaign_id}
          >
            {campaigns.map(campaign => (
              <Option key={campaign.id} value={campaign.id}>{campaign.name}</Option>
            ))}
          </Select>
          
          <Select
            placeholder="Tag"
            style={{ width: 150 }}
            allowClear
            onChange={(value) => handleFilterChange('tag_id', value)}
            value={filters.tag_id}
          >
            {tags.map(tag => (
              <Option key={tag.id} value={tag.id}>{tag.name}</Option>
            ))}
          </Select>
          
          <Button
            icon={<FilterOutlined />}
            onClick={handleSearch}
          >
            Filter
          </Button>
        </div>
        
        {/* Bulk Actions */}
        {selectedProspects.length > 0 && (
          <div className="mb-4 p-2 bg-gray-50 flex items-center space-x-4 rounded">
            <span className="text-gray-700">
              {selectedProspects.length} prospects selected
            </span>
            <div className="flex items-center space-x-2">
              <Select
                placeholder="Assign to Campaign"
                style={{ width: 200 }}
                onChange={setSelectedCampaign}
                value={selectedCampaign}
              >
                {campaigns.map(campaign => (
                  <Option key={campaign.id} value={campaign.id}>{campaign.name}</Option>
                ))}
              </Select>
              <Button
                onClick={handleAssignCampaign}
                disabled={!selectedCampaign}
                type="primary"
              >
                Assign
              </Button>
            </div>
            <Button
              icon={<MessageOutlined />}
              onClick={handleOpenSmsModal}
            >
              Send SMS
            </Button>
            <Button
              onClick={() => setSelectedProspects([])}
            >
              Clear Selection
            </Button>
          </div>
        )}
        
        {/* Prospects Table */}
        <Table
          dataSource={prospects}
          columns={columns}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50', '100'],
          }}
          rowSelection={{
            selectedRowKeys: selectedProspects,
            onChange: (selectedRowKeys) => setSelectedProspects(selectedRowKeys as string[]),
          }}
          onRow={(record) => ({
            onClick: () => handleRowClick(record.id),
          })}
        />
      </Card>
      
      {/* Import Modal */}
      <Modal
        title="Import Prospects"
        open={importModalVisible}
        onCancel={() => {
          if (importStep === 3) {
            // If on results screen, just close and reset
            setImportModalVisible(false);
            resetImport();
          } else {
            // Otherwise confirm
            Modal.confirm({
              title: 'Cancel Import',
              content: 'Are you sure you want to cancel this import? All progress will be lost.',
              onOk: () => {
                setImportModalVisible(false);
                resetImport();
              },
            });
          }
        }}
        footer={importStep === 3 ? null : [
          <Button key="back" onClick={() => {
            if (importStep > 0) {
              setImportStep(importStep - 1);
            } else {
              setImportModalVisible(false);
              resetImport();
            }
          }}>
            {importStep === 0 ? 'Cancel' : 'Back'}
          </Button>,
          <Button
            key="next"
            type="primary"
            disabled={
              (importStep === 0 && !importFile) ||
              (importStep === 1 && !Object.values(importMapping).some(v => v !== "Don't import column")) ||
              loading
            }
            onClick={() => {
              if (importStep === 2) {
                handleExecuteImport();
              } else {
                setImportStep(importStep + 1);
              }
            }}
            loading={loading && importStep === 2}
          >
            {importStep === 2 ? 'Import' : 'Next'}
          </Button>,
        ]}
        width={800}
      >
        <div>
          <Steps current={importStep} className="mb-8">
            <Step title="Upload File" />
            <Step title="Map Fields" />
            <Step title="Configure" />
            <Step title="Results" />
          </Steps>
          
          {loading && importStep === 2 ? (
            <div className="flex justify-center items-center py-12">
              <Spin size="large" />
              <div className="ml-3">Processing your import...</div>
            </div>
          ) : (
            renderImportStep()
          )}
        </div>
      </Modal>
      
      {/* SMS Modal */}
      <Modal
        title="Send SMS"
        open={smsModalVisible}
        onCancel={() => setSmsModalVisible(false)}
        onOk={handleSendSms}
        okText="Send"
        confirmLoading={sendingSms}
      >
        <div className="mb-4">
          <div className="font-medium mb-2">Recipients</div>
          <div className="p-2 border rounded bg-gray-50">
            {selectedProspects.length} prospects selected
          </div>
        </div>
        
        <div className="mb-4">
          <div className="font-medium mb-2">Message</div>
          <TextArea
            rows={6}
            value={smsMessage}
            onChange={(e) => setSmsMessage(e.target.value)}
            placeholder="Type your message here..."
            maxLength={160}
            showCount
          />
        </div>
      </Modal>
    </div>
  );
};

export default Prospects;