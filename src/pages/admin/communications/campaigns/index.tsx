import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Card, Table, Button, Tag, Input, Select, Dropdown, Menu, 
  message, Popconfirm, Space, Tooltip, Badge, Progress, Modal, Form
} from 'antd';
import {
  PlusOutlined, SearchOutlined, FilterOutlined,
  DeleteOutlined, EditOutlined, MoreOutlined, PauseOutlined,
  PlayCircleOutlined, StopOutlined, FileTextOutlined
} from '@ant-design/icons';
import campaignApi, { Campaign, CampaignFilter } from '../../../../lib/api/campaignService';
import { useLocation } from '../../../../hooks/useLocation';
import { formatDate } from '../../../../utils/formatUtils';

const { Option } = Select;

interface TableCampaign extends Campaign {
  key: string;
  prospect_count?: number;
  sent_count?: number;
  open_count?: number;
  click_count?: number;
}

const CampaignsPage: React.FC = () => {
  // const navigate = useNavigate();
  const { currentLocation } = useLocation();
  
  // State management
  const [loading, setLoading] = useState(false);
  const [campaigns, setCampaigns] = useState<TableCampaign[]>([]);
  const [totalCampaigns, setTotalCampaigns] = useState(0);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const [filters, setFilters] = useState<CampaignFilter>({
    page: 1,
    pageSize: 10
  });
  const [searchText, setSearchText] = useState('');
  
  // Modal state
  const [newCampaignVisible, setNewCampaignVisible] = useState(false);
  const [form] = Form.useForm();
  
  // Load data on initial render and when filters/pagination changes
  useEffect(() => {
    loadCampaigns();
  }, [filters]);
  
  // Data loading function
  const loadCampaigns = async () => {
    setLoading(true);
    try {
      const response = await campaignApi.getCampaigns(filters);
      if (response.data) {
        // Transform data for table
        const tableData = response.data.map(campaign => ({
          ...campaign,
          key: campaign.id,
          // Mock counts - in a real app, these would come from the API
          prospect_count: Math.floor(Math.random() * 200),
          sent_count: Math.floor(Math.random() * 150),
          open_count: Math.floor(Math.random() * 100),
          click_count: Math.floor(Math.random() * 50)
        }));
        setCampaigns(tableData);
        setTotalCampaigns(response.total || tableData.length);
      }
    } catch (error) {
      console.error('Error loading campaigns:', error);
      message.error('Failed to load campaigns');
    } finally {
      setLoading(false);
    }
  };
  
  // Search handler
  const handleSearch = () => {
    setFilters({
      ...filters,
      search: searchText,
      page: 1 // Reset to first page on search
    });
  };
  
  // Status filter handler
  const handleStatusFilter = (status: string | null) => {
    setFilters({
      ...filters,
      status: status || undefined,
      page: 1
    });
  };
  
  // Clear filters
  const clearFilters = () => {
    setFilters({
      page: 1,
      pageSize: pagination.pageSize
    });
    setSearchText('');
  };
  
  // Pagination handler
  interface TablePaginationConfig {
    current: number;
    pageSize: number;
  }
  
  const handleTableChange = (page: TablePaginationConfig) => {
    setPagination({
      current: page.current,
      pageSize: page.pageSize
    });
    
    setFilters({
      ...filters,
      page: page.current,
      pageSize: page.pageSize
    });
  };
  
  // Form values interface
  interface CampaignFormValues {
    name: string;
    description?: string;
  }
  
  // Campaign creation
  const handleCreateCampaign = async (values: CampaignFormValues) => {
    try {
      await campaignApi.createCampaign({
        name: values.name,
        description: values.description,
        status: 'draft',
        location_id: currentLocation?.id
      });
      
      message.success('Campaign created successfully');
      setNewCampaignVisible(false);
      form.resetFields();
      loadCampaigns();
    } catch (error) {
      console.error('Error creating campaign:', error);
      message.error('Failed to create campaign');
    }
  };
  
  // Delete campaign handler
  const handleDeleteCampaign = async (id: string) => {
    try {
      await campaignApi.deleteCampaign(id);
      message.success('Campaign deleted successfully');
      loadCampaigns();
    } catch (error) {
      console.error('Error deleting campaign:', error);
      message.error('Failed to delete campaign');
    }
  };
  
  // Campaign action handler (start, pause, stop)
  const handleCampaignAction = async (id: string, action: 'start' | 'pause' | 'stop') => {
    try {
      let status = '';
      switch (action) {
        case 'start':
          status = 'active';
          break;
        case 'pause':
          status = 'paused';
          break;
        case 'stop':
          status = 'completed';
          break;
      }
      
      await campaignApi.updateCampaign(id, { status });
      message.success(`Campaign ${action}ed successfully`);
      loadCampaigns();
    } catch (error) {
      console.error(`Error ${action}ing campaign:`, error);
      message.error(`Failed to ${action} campaign`);
    }
  };
  
  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'default';
      case 'active':
        return 'green';
      case 'paused':
        return 'orange';
      case 'completed':
        return 'blue';
      case 'stopped':
        return 'red';
      default:
        return 'default';
    }
  };
  
  // Columns for the table
  const columns = [
    {
      title: 'Name',
      key: 'name',
      render: (_: unknown, record: TableCampaign) => (
        <Link to={`/admin-dashboard/campaigns/${record.id}`} className="text-blue-600 hover:text-blue-800">
          {record.name}
        </Link>
      ),
      sorter: (a: TableCampaign, b: TableCampaign) => a.name.localeCompare(b.name)
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      render: (description: string) => (
        <span className="text-gray-600">
          {description && description.length > 50 ? description.substring(0, 50) + '...' : description}
        </span>
      )
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>
          {status ? status.toUpperCase() : 'DRAFT'}
        </Tag>
      )
    },
    {
      title: 'Prospects',
      key: 'prospects',
      dataIndex: 'prospect_count',
      render: (count: number) => (
        <Badge count={count} style={{ backgroundColor: '#1890ff' }} />
      )
    },
    {
      title: 'Progress',
      key: 'progress',
      render: (_: unknown, record: TableCampaign) => {
        const percent = record.prospect_count ? Math.floor((record.sent_count || 0) / record.prospect_count * 100) : 0;
        return (
          <Tooltip title={`${record.sent_count || 0} of ${record.prospect_count || 0} sent`}>
            <Progress percent={percent} size="small" />
          </Tooltip>
        );
      }
    },
    {
      title: 'Performance',
      key: 'performance',
      render: (_: unknown, record: TableCampaign) => {
        const openRate = record.sent_count ? Math.floor((record.open_count || 0) / record.sent_count * 100) : 0;
        const clickRate = record.open_count ? Math.floor((record.click_count || 0) / record.open_count * 100) : 0;
        
        return (
          <Space direction="vertical" size="small">
            <div>
              <span className="text-gray-500">Opens: </span>
              <span className="font-medium">{openRate}%</span>
            </div>
            <div>
              <span className="text-gray-500">Clicks: </span>
              <span className="font-medium">{clickRate}%</span>
            </div>
          </Space>
        );
      }
    },
    {
      title: 'Created',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date: string) => formatDate(date)
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: unknown, record: TableCampaign) => {
        // Define actions based on campaign status
        const statusActions = [];
        switch (record.status) {
          case 'draft':
            statusActions.push(
              <Menu.Item 
                key="start" 
                icon={<PlayCircleOutlined />}
                onClick={() => handleCampaignAction(record.id, 'start')}
              >
                Start Campaign
              </Menu.Item>
            );
            break;
          case 'active':
            statusActions.push(
              <Menu.Item 
                key="pause" 
                icon={<PauseOutlined />}
                onClick={() => handleCampaignAction(record.id, 'pause')}
              >
                Pause Campaign
              </Menu.Item>,
              <Menu.Item 
                key="stop" 
                icon={<StopOutlined />}
                onClick={() => handleCampaignAction(record.id, 'stop')}
              >
                Stop Campaign
              </Menu.Item>
            );
            break;
          case 'paused':
            statusActions.push(
              <Menu.Item 
                key="resume" 
                icon={<PlayCircleOutlined />}
                onClick={() => handleCampaignAction(record.id, 'start')}
              >
                Resume Campaign
              </Menu.Item>,
              <Menu.Item 
                key="stop" 
                icon={<StopOutlined />}
                onClick={() => handleCampaignAction(record.id, 'stop')}
              >
                Stop Campaign
              </Menu.Item>
            );
            break;
        }
        
        return (
          <Dropdown
            overlay={
              <Menu>
                <Menu.Item key="edit" icon={<EditOutlined />}>
                  <Link to={`/admin-dashboard/campaigns/${record.id}`}>Edit</Link>
                </Menu.Item>
                <Menu.Item key="prospects" icon={<FileTextOutlined />}>
                  <Link to={`/admin-dashboard/campaigns/${record.id}/prospects`}>View Prospects</Link>
                </Menu.Item>
                
                {statusActions.length > 0 && <Menu.Divider />}
                {statusActions}
                
                <Menu.Divider />
                <Menu.Item key="delete" icon={<DeleteOutlined />} danger>
                  <Popconfirm
                    title="Are you sure you want to delete this campaign?"
                    onConfirm={() => handleDeleteCampaign(record.id)}
                    okText="Yes"
                    cancelText="No"
                  >
                    Delete
                  </Popconfirm>
                </Menu.Item>
              </Menu>
            }
            trigger={['click']}
          >
            <Button icon={<MoreOutlined />} size="small" />
          </Dropdown>
        );
      }
    }
  ];
  
  return (
    <div className="campaigns-page">
      <Card
        title="Campaigns"
        bordered={false}
        className="shadow-sm"
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setNewCampaignVisible(true)}
          >
            New Campaign
          </Button>
        }
      >
        {/* Search and filters */}
        <div className="mb-4 flex flex-wrap gap-2 items-center">
          <Input
            placeholder="Search campaigns"
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            onPressEnter={handleSearch}
            style={{ width: 250 }}
            prefix={<SearchOutlined />}
            suffix={
              searchText ? (
                <Button
                  type="text"
                  size="small"
                  onClick={() => {
                    setSearchText('');
                    if (filters.search) {
                      setFilters({ ...filters, search: undefined, page: 1 });
                    }
                  }}
                >
                  Clear
                </Button>
              ) : null
            }
          />
          
          <Button
            onClick={handleSearch}
            type="primary"
            icon={<SearchOutlined />}
          >
            Search
          </Button>
          
          <Select
            placeholder="Status"
            style={{ width: 120 }}
            allowClear
            value={filters.status}
            onChange={handleStatusFilter}
          >
            <Option value="draft">Draft</Option>
            <Option value="active">Active</Option>
            <Option value="paused">Paused</Option>
            <Option value="completed">Completed</Option>
            <Option value="stopped">Stopped</Option>
          </Select>
          
          {(filters.search || filters.status) && (
            <Button
              icon={<FilterOutlined />}
              onClick={clearFilters}
            >
              Clear Filters
            </Button>
          )}
        </div>
        
        {/* Campaigns table */}
        <Table
          columns={columns}
          dataSource={campaigns}
          loading={loading}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: totalCampaigns,
            showSizeChanger: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} campaigns`
          }}
          onChange={(pagination) => handleTableChange(pagination as TablePaginationConfig)}
        />
      </Card>
      
      {/* New Campaign Modal */}
      <Modal
        title="Create New Campaign"
        open={newCampaignVisible}
        onCancel={() => {
          setNewCampaignVisible(false);
          form.resetFields();
        }}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCreateCampaign}
        >
          <Form.Item
            name="name"
            label="Campaign Name"
            rules={[{ required: true, message: 'Please enter a campaign name' }]}
          >
            <Input placeholder="Enter campaign name" />
          </Form.Item>
          
          <Form.Item
            name="description"
            label="Description"
          >
            <Input.TextArea 
              placeholder="Enter campaign description" 
              rows={4}
            />
          </Form.Item>
          
          <Form.Item className="mb-0 flex justify-end">
            <Space>
              <Button onClick={() => {
                setNewCampaignVisible(false);
                form.resetFields();
              }}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit" icon={<PlusOutlined />}>
                Create Campaign
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CampaignsPage;