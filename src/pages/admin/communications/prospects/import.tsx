import React, { useState, useRef } from 'react';
import { Card, Button, Upload, message, Steps, Form, Select, Divider, Alert, Table, Tag, Radio, Space } from 'antd';
import { useNavigate } from 'react-router-dom';
import { InboxOutlined, FileExcelOutlined, FileTextOutlined, TagOutlined, TeamOutlined, UserOutlined } from '@ant-design/icons';
import { read, utils } from 'xlsx';
import prospectApi, { ImportOptions, Prospect } from '../../../../lib/api/prospectService';
import tagApi from '../../../../lib/api/tagService';
import campaignApi from '../../../../lib/api/campaignService';
import { useUsers } from '../../../../hooks/useUsers';
import { useLocation } from '../../../../hooks/useLocation';
import Papa from 'papaparse';

const { Dragger } = Upload;
const { Step } = Steps;
const { Option } = Select;

interface ImportProspect extends Partial<Prospect> {
  key: string;
}

interface MappingField {
  key: string;
  title: string;
  required?: boolean;
  description?: string;
}

const ImportPage: React.FC = () => {
  const navigate = useNavigate();
  const { users } = useUsers();
  const { currentLocation } = useLocation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // State
  const [currentStep, setCurrentStep] = useState(0);
  const [fileData, setFileData] = useState<any[]>([]);
  const [fileHeaders, setFileHeaders] = useState<string[]>([]);
  const [headerMapping, setHeaderMapping] = useState<Record<string, string>>({});
  const [prospects, setProspects] = useState<ImportProspect[]>([]);
  const [tags, setTags] = useState<any[]>([]);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [options, setOptions] = useState<ImportOptions>({
    duplicateHandling: 'skip',
    assignCampaign: null,
    assignTags: null,
    assignUser: null,
    locationId: currentLocation?.id,
  });
  const [loading, setLoading] = useState(false);
  const [importResult, setImportResult] = useState<any>(null);
  
  // Load campaigns and tags
  React.useEffect(() => {
    const loadData = async () => {
      try {
        const [tagsResponse, campaignsResponse] = await Promise.all([
          tagApi.getTags(),
          campaignApi.getCampaigns()
        ]);
        
        if (tagsResponse.data) {
          setTags(tagsResponse.data);
        }
        
        if (campaignsResponse.data) {
          setCampaigns(campaignsResponse.data);
        }
      } catch (error) {
        console.error('Error loading data:', error);
        message.error('Failed to load tags and campaigns');
      }
    };
    
    loadData();
  }, []);
  
  // Available mapping fields
  const mappingFields: MappingField[] = [
    { key: 'first_name', title: 'First Name', required: true, description: 'First name of the prospect' },
    { key: 'last_name', title: 'Last Name', required: true, description: 'Last name of the prospect' },
    { key: 'email', title: 'Email', description: 'Email address for contact' },
    { key: 'phone', title: 'Phone', description: 'Phone number for contact' },
    { key: 'address', title: 'Address', description: 'Street address' },
    { key: 'city', title: 'City', description: 'City of residence' },
    { key: 'state', title: 'State', description: 'State or province' },
    { key: 'postal_code', title: 'Postal Code', description: 'ZIP or postal code' },
    { key: 'status', title: 'Status', description: 'Current status (new, contacted, qualified, etc.)' },
    { key: 'lead_source', title: 'Lead Source', description: 'How the prospect was acquired' },
    { key: 'interest_level', title: 'Interest Level', description: 'Level of interest (high, medium, low)' },
    { key: 'notes', title: 'Notes', description: 'Additional notes about the prospect' },
  ];
  
  // File upload handler
  const handleFileUpload = async (file: File) => {
    try {
      // Check file type
      const fileType = file.name.split('.').pop()?.toLowerCase();
      
      if (fileType === 'csv') {
        // Parse CSV
        Papa.parse(file, {
          header: true,
          complete: (results) => {
            if (results.data && results.data.length > 0) {
              setFileData(results.data);
              setFileHeaders(results.meta.fields || []);
              setCurrentStep(1);
            } else {
              message.error('The CSV file is empty or invalid');
            }
          },
          error: (error) => {
            console.error('Error parsing CSV:', error);
            message.error('Failed to parse the CSV file');
          }
        });
      } else if (fileType === 'xlsx' || fileType === 'xls') {
        // Parse Excel
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const data = e.target?.result;
            const workbook = read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = utils.sheet_to_json(worksheet);
            
            if (jsonData.length > 0) {
              setFileData(jsonData);
              setFileHeaders(Object.keys(jsonData[0]));
              setCurrentStep(1);
            } else {
              message.error('The Excel file is empty or invalid');
            }
          } catch (error) {
            console.error('Error reading Excel:', error);
            message.error('Failed to read the Excel file');
          }
        };
        reader.readAsArrayBuffer(file);
      } else {
        message.error('Please upload a CSV or Excel file');
        return;
      }
      
      // Don't actually upload the file
      return false;
    } catch (error) {
      console.error('Error processing file:', error);
      message.error('Failed to process the file');
      return false;
    }
  };
  
  // Header mapping handler
  const handleMappingChange = (fieldKey: string, headerValue: string) => {
    setHeaderMapping(prev => ({
      ...prev,
      [fieldKey]: headerValue
    }));
  };
  
  // Validate mapping and proceed to next step
  const validateMapping = () => {
    // Check required fields
    const requiredFields = mappingFields.filter(field => field.required).map(field => field.key);
    const isMappingComplete = requiredFields.every(field => headerMapping[field]);
    
    if (!isMappingComplete) {
      message.error('Please map all required fields before proceeding');
      return;
    }
    
    // Transform data to prospects
    const mappedProspects = fileData.map((row, index) => {
      const prospect: any = { key: `import-${index}` };
      
      // Map each field
      Object.entries(headerMapping).forEach(([fieldKey, headerValue]) => {
        if (headerValue) {
          prospect[fieldKey] = row[headerValue];
        }
      });
      
      // Set default status if not mapped
      if (!prospect.status) {
        prospect.status = 'new';
      }
      
      return prospect as ImportProspect;
    });
    
    setProspects(mappedProspects);
    setCurrentStep(2);
  };
  
  // Handle options change
  const handleOptionChange = (key: keyof ImportOptions, value: any) => {
    setOptions(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  // Import prospects
  const handleImport = async () => {
    try {
      setLoading(true);
      
      // Validate we have prospects to import
      if (prospects.length === 0) {
        message.error('No prospects to import');
        return;
      }
      
      // Send import request
      const response = await prospectApi.importProspects({
        prospects,
        options
      });
      
      if (response.error) {
        throw response.error;
      }
      
      setImportResult(response.data);
      setCurrentStep(3);
      message.success('Import completed successfully');
    } catch (error) {
      console.error('Error importing prospects:', error);
      message.error('Failed to import prospects');
    } finally {
      setLoading(false);
    }
  };
  
  // Go back to prospects list
  const handleFinish = () => {
    navigate('/admin-dashboard/prospects');
  };
  
  // Upload props
  const uploadProps = {
    name: 'file',
    multiple: false,
    accept: '.csv,.xlsx,.xls',
    showUploadList: false,
    beforeUpload: (file: File) => handleFileUpload(file),
    customRequest: ({ onSuccess }: any) => {
      if (onSuccess) onSuccess('ok');
    }
  };
  
  // Steps content
  const stepsContent = [
    // Step 1: Upload File
    <div key="step-1">
      <Alert
        message="Import Instructions"
        description={
          <ul>
            <li>Prepare your CSV or Excel file with prospect data</li>
            <li>Make sure to include at least the first and last names of prospects</li>
            <li>You will be able to map columns to fields in the next step</li>
            <li>The system will check for duplicates based on email or phone number</li>
          </ul>
        }
        type="info"
        showIcon
        className="mb-6"
      />
      
      <Dragger {...uploadProps}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">Click or drag a file to upload</p>
        <p className="ant-upload-hint">
          Support for CSV, Excel (.xlsx, .xls) files
        </p>
      </Dragger>
      
      <div className="mt-4 flex gap-2 items-center">
        <Button 
          icon={<FileExcelOutlined />} 
          onClick={() => window.open('/templates/prospect-import-template.xlsx')}
        >
          Download Excel Template
        </Button>
        <Button 
          icon={<FileTextOutlined />} 
          onClick={() => window.open('/templates/prospect-import-template.csv')}
        >
          Download CSV Template
        </Button>
      </div>
    </div>,
    
    // Step 2: Map Fields
    <div key="step-2">
      <Alert
        message="Column Mapping"
        description={
          <p>
            Map the columns from your file to the corresponding prospect fields. 
            Fields marked with * are required.
          </p>
        }
        type="info"
        showIcon
        className="mb-6"
      />
      
      <Form layout="vertical">
        {mappingFields.map((field) => (
          <Form.Item 
            key={field.key} 
            label={`${field.title}${field.required ? ' *' : ''}`}
            tooltip={field.description}
            rules={field.required ? [{ required: true, message: `Please map ${field.title}` }] : undefined}
          >
            <Select
              placeholder="Select a column"
              value={headerMapping[field.key]}
              onChange={(value) => handleMappingChange(field.key, value)}
              allowClear
            >
              {fileHeaders.map((header) => (
                <Option key={header} value={header}>{header}</Option>
              ))}
            </Select>
          </Form.Item>
        ))}
      </Form>
      
      <div className="mt-4 flex justify-between">
        <Button onClick={() => setCurrentStep(0)}>Back</Button>
        <Button type="primary" onClick={validateMapping}>Continue</Button>
      </div>
    </div>,
    
    // Step 3: Review and Options
    <div key="step-3">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-medium mb-4">Import Options</h3>
          
          <Form layout="vertical">
            <Form.Item 
              label="Duplicate Handling" 
              tooltip="How to handle prospects that already exist in the system"
            >
              <Radio.Group
                value={options.duplicateHandling}
                onChange={(e) => handleOptionChange('duplicateHandling', e.target.value)}
              >
                <Radio value="skip">Skip duplicates</Radio>
                <Radio value="update">Update duplicates</Radio>
                <Radio value="create_new">Create as new</Radio>
              </Radio.Group>
            </Form.Item>
            
            <Form.Item 
              label="Assign to Campaign" 
              tooltip="Optionally assign all imported prospects to a campaign"
            >
              <Select
                placeholder="Select a campaign"
                value={options.assignCampaign}
                onChange={(value) => handleOptionChange('assignCampaign', value)}
                allowClear
              >
                {campaigns.map((campaign) => (
                  <Option key={campaign.id} value={campaign.id}>{campaign.name}</Option>
                ))}
              </Select>
            </Form.Item>
            
            <Form.Item 
              label="Assign Tags" 
              tooltip="Optionally add tags to all imported prospects"
            >
              <Select
                placeholder="Select tags"
                mode="multiple"
                value={options.assignTags}
                onChange={(value) => handleOptionChange('assignTags', value)}
                allowClear
              >
                {tags.map((tag) => (
                  <Option key={tag.id} value={tag.id}>{tag.name}</Option>
                ))}
              </Select>
            </Form.Item>
            
            <Form.Item 
              label="Assign To User" 
              tooltip="Optionally assign all imported prospects to a team member"
            >
              <Select
                placeholder="Select a user"
                value={options.assignUser}
                onChange={(value) => handleOptionChange('assignUser', value)}
                allowClear
              >
                {users.map((user) => (
                  <Option key={user.id} value={user.id}>{user.name || user.email}</Option>
                ))}
              </Select>
            </Form.Item>
          </Form>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-4">Preview ({prospects.length} prospects)</h3>
          
          <Table
            dataSource={prospects.slice(0, 5)}
            columns={[
              {
                title: 'Name',
                key: 'name',
                render: (_, record) => `${record.first_name} ${record.last_name}`
              },
              {
                title: 'Contact',
                key: 'contact',
                render: (_, record) => (
                  <Space direction="vertical" size="small">
                    {record.email && <div>{record.email}</div>}
                    {record.phone && <div>{record.phone}</div>}
                  </Space>
                )
              },
              {
                title: 'Status',
                dataIndex: 'status',
                key: 'status',
                render: (status) => <Tag color={status === 'new' ? 'blue' : 'default'}>{status || 'new'}</Tag>
              }
            ]}
            pagination={false}
            size="small"
            className="mb-4"
          />
          
          {prospects.length > 5 && (
            <div className="text-gray-500 text-sm mb-4">
              ...and {prospects.length - 5} more prospects
            </div>
          )}
          
          <Alert
            message="Ready to Import"
            description={
              <p>
                You are about to import {prospects.length} prospects. 
                The process might take a few moments to complete.
              </p>
            }
            type="info"
            showIcon
          />
        </div>
      </div>
      
      <div className="mt-6 flex justify-between">
        <Button onClick={() => setCurrentStep(1)}>Back</Button>
        <Button 
          type="primary" 
          onClick={handleImport}
          loading={loading}
        >
          Import Prospects
        </Button>
      </div>
    </div>,
    
    // Step 4: Import Results
    <div key="step-4">
      <Result 
        importResult={importResult} 
        onFinish={handleFinish} 
      />
    </div>
  ];
  
  return (
    <Card
      title="Import Prospects"
      bordered={false}
      className="shadow-sm"
    >
      <Steps current={currentStep} className="mb-8">
        <Step title="Upload File" description="CSV or Excel" />
        <Step title="Map Fields" description="Match columns" />
        <Step title="Options" description="Configure import" />
        <Step title="Complete" description="View results" />
      </Steps>
      
      {stepsContent[currentStep]}
    </Card>
  );
};

// Result component for final step
const Result: React.FC<{ importResult: any; onFinish: () => void }> = ({ importResult, onFinish }) => {
  if (!importResult) {
    return <div>No import results available</div>;
  }
  
  const { imported, updated, skipped, errors } = importResult;
  const hasErrors = errors && errors.length > 0;
  
  return (
    <div className="text-center">
      <div className="text-green-500 mb-4">
        <TeamOutlined style={{ fontSize: 48 }} />
      </div>
      
      <h2 className="text-2xl font-bold mb-2">Import Complete</h2>
      <p className="mb-6 text-gray-500">
        The prospect import has been completed with the following results:
      </p>
      
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded">
          <div className="text-2xl font-bold text-blue-500">{imported}</div>
          <div className="text-gray-500">New Prospects</div>
        </div>
        <div className="bg-purple-50 p-4 rounded">
          <div className="text-2xl font-bold text-purple-500">{updated}</div>
          <div className="text-gray-500">Updated Prospects</div>
        </div>
        <div className="bg-gray-50 p-4 rounded">
          <div className="text-2xl font-bold text-gray-500">{skipped}</div>
          <div className="text-gray-500">Skipped Prospects</div>
        </div>
      </div>
      
      {hasErrors && (
        <Alert
          message={`${errors.length} Error${errors.length > 1 ? 's' : ''} Encountered`}
          description={
            <ul className="text-left">
              {errors.slice(0, 5).map((error: string, index: number) => (
                <li key={index}>{error}</li>
              ))}
              {errors.length > 5 && <li>...and {errors.length - 5} more errors</li>}
            </ul>
          }
          type="error"
          showIcon
          className="mb-6"
        />
      )}
      
      <div className="flex justify-center">
        <Button type="primary" onClick={onFinish}>
          Return to Prospects
        </Button>
      </div>
    </div>
  );
};

export default ImportPage;