import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Card, Table, Button, Tag as AntTag, Input, Select, Dropdown, Menu, 
  message, Popconfirm, Space, Tooltip, Badge, Modal
} from 'antd';
import {
  PlusOutlined, SearchOutlined, FilterOutlined, TagOutlined, 
  UserOutlined, DeleteOutlined, EditOutlined, MailOutlined,
  PhoneOutlined, ImportOutlined, EllipsisOutlined, TeamOutlined
} from '@ant-design/icons';
import prospectApi, { Prospect, ProspectFilter } from '../../../../lib/api/prospectService';
import tagApi, { Tag } from '../../../../lib/api/tagService';
import campaignApi, { Campaign } from '../../../../lib/api/campaignService';
import { useUsers } from '../../../../hooks/useUsers';
import { useLocation } from '../../../../hooks/useLocation';
import { getInitials } from '../../../../utils/userUtils';
import { formatPhoneNumber } from '../../../../utils/formatUtils';

const { Option } = Select;

interface TableProspect extends Prospect {
  key: string;
}

interface ActionItem {
  id: string;
  name: string;
}

interface ProspectActionModalProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (selectedIds: string[]) => void;
  selectedRows: TableProspect[];
  type: 'campaign' | 'tag' | 'user';
  items: ActionItem[];
  title: string;
}

// Modal for assigning campaigns, tags, or users
const ProspectActionModal: React.FC<ProspectActionModalProps> = ({
  visible,
  onCancel,
  onSubmit,
  selectedRows,
  type,
  items,
  title
}) => {
  const [selectedItemId, setSelectedItemId] = useState<string>('');
  
  return (
    <Modal
      title={title}
      open={visible}
      onCancel={onCancel}
      onOk={() => {
        if (!selectedItemId) {
          message.error(`Please select a ${type} first`);
          return;
        }
        onSubmit([selectedItemId]);
      }}
      okText="Apply"
      cancelText="Cancel"
    >
      <p>You have selected {selectedRows.length} prospect(s):</p>
      <ul className="mb-4">
        {selectedRows.slice(0, 5).map(row => (
          <li key={row.id}>
            {row.first_name} {row.last_name}
          </li>
        ))}
        {selectedRows.length > 5 && (
          <li>...and {selectedRows.length - 5} more</li>
        )}
      </ul>
      
      <Select
        style={{ width: '100%' }}
        placeholder={`Select ${type}`}
        value={selectedItemId || undefined}
        onChange={setSelectedItemId}
      >
        {items.map(item => (
          <Option key={item.id} value={item.id}>
            {item.name}
          </Option>
        ))}
      </Select>
    </Modal>
  );
};

const ProspectsPage: React.FC = () => {
  const navigate = useNavigate();
  const { users } = useUsers();
  const { currentLocation } = useLocation();
  
  // State management
  const [loading, setLoading] = useState(false);
  const [prospects, setProspects] = useState<TableProspect[]>([]);
  const [totalProspects, setTotalProspects] = useState(0);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const [filters, setFilters] = useState<ProspectFilter>({
    locationId: currentLocation?.id,
    page: 1,
    pageSize: 10
  });
  const [searchText, setSearchText] = useState('');
  const [tags, setTags] = useState<Tag[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [selectedRows, setSelectedRows] = useState<TableProspect[]>([]);
  
  // Modal states
  const [campaignModalVisible, setCampaignModalVisible] = useState(false);
  const [tagModalVisible, setTagModalVisible] = useState(false);
  const [userModalVisible, setUserModalVisible] = useState(false);
  
  // Load data on initial render and when filters/pagination changes
  useEffect(() => {
    loadProspects();
    loadTags();
    loadCampaigns();
  }, [filters, currentLocation?.id]);
  
  // Update filters when location changes
  useEffect(() => {
    if (currentLocation) {
      setFilters(prev => ({
        ...prev,
        locationId: currentLocation.id
      }));
    }
  }, [currentLocation]);
  
  // Data loading functions
  const loadProspects = async () => {
    setLoading(true);
    try {
      const response = await prospectApi.getProspects(filters);
      if (response.data) {
        // Cast to ensure non-null values since we're filtering response data
        const prospects = response.data.prospects.filter(Boolean) as Prospect[];
        const tableData = prospects.map(prospect => ({
          ...prospect,
          key: prospect.id
        }));
        setProspects(tableData);
        setTotalProspects(response.data.total);
      }
    } catch (error) {
      console.error('Error loading prospects:', error);
      message.error('Failed to load prospects');
    } finally {
      setLoading(false);
    }
  };
  
  const loadTags = async () => {
    try {
      const response = await tagApi.getTags();
      if (response.data) {
        setTags(response.data);
      }
    } catch (error) {
      console.error('Error loading tags:', error);
    }
  };
  
  const loadCampaigns = async () => {
    try {
      const response = await campaignApi.getCampaigns();
      if (response.data) {
        setCampaigns(response.data);
      }
    } catch (error) {
      console.error('Error loading campaigns:', error);
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
  
  // Filter handlers
  const handleStatusFilter = (status: string | null) => {
    setFilters({
      ...filters,
      status: status || undefined,
      page: 1 // Reset to first page on filter change
    });
  };
  
  const handleCampaignFilter = (campaignId: string | null) => {
    setFilters({
      ...filters,
      campaign: campaignId || undefined,
      page: 1 // Reset to first page on filter change
    });
  };
  
  const handleTagFilter = (tagId: string | null) => {
    setFilters({
      ...filters,
      tag: tagId || undefined,
      page: 1 // Reset to first page on filter change
    });
  };
  
  const handleAssigneeFilter = (userId: string | null) => {
    setFilters({
      ...filters,
      assignee: userId || undefined,
      page: 1 // Reset to first page on filter change
    });
  };
  
  // Clear all filters
  const clearFilters = () => {
    setFilters({
      locationId: currentLocation?.id,
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
  
  // Batch action handlers
  const showCampaignModal = () => {
    if (selectedRows.length === 0) {
      message.warning('Please select at least one prospect');
      return;
    }
    setCampaignModalVisible(true);
  };
  
  const showTagModal = () => {
    if (selectedRows.length === 0) {
      message.warning('Please select at least one prospect');
      return;
    }
    setTagModalVisible(true);
  };
  
  const showUserModal = () => {
    if (selectedRows.length === 0) {
      message.warning('Please select at least one prospect');
      return;
    }
    setUserModalVisible(true);
  };
  
  const handleAssignCampaign = async (campaignIds: string[]) => {
    try {
      const [campaignId] = campaignIds;
      await prospectApi.assignCampaign({
        prospectIds: selectedRows.map(row => row.id),
        campaignId
      });
      message.success('Campaign assigned successfully');
      loadProspects();
      setCampaignModalVisible(false);
    } catch (error) {
      console.error('Error assigning campaign:', error);
      message.error('Failed to assign campaign');
    }
  };
  
  const handleAssignTags = async (tagIds: string[]) => {
    try {
      await prospectApi.assignTags({
        prospectIds: selectedRows.map(row => row.id),
        tagIds
      });
      message.success('Tags assigned successfully');
      loadProspects();
      setTagModalVisible(false);
    } catch (error) {
      console.error('Error assigning tags:', error);
      message.error('Failed to assign tags');
    }
  };
  
  const handleAssignUser = async (userIds: string[]) => {
    try {
      const [userId] = userIds;
      await prospectApi.assignToUser({
        prospectIds: selectedRows.map(row => row.id),
        userId
      });
      message.success('User assigned successfully');
      loadProspects();
      setUserModalVisible(false);
    } catch (error) {
      console.error('Error assigning user:', error);
      message.error('Failed to assign user');
    }
  };
  
  // Delete prospect handler
  const handleDeleteProspect = async (id: string) => {
    try {
      await prospectApi.deleteProspect(id);
      message.success('Prospect deleted successfully');
      loadProspects();
    } catch (error) {
      console.error('Error deleting prospect:', error);
      message.error('Failed to delete prospect');
    }
  };
  
  // Row selection configuration
  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedKeys: React.Key[], selectedRows: TableProspect[]) => {
      setSelectedRowKeys(selectedKeys as string[]);
      setSelectedRows(selectedRows);
    }
  };
  
  // Table columns
  const columns = [
    {
      title: 'Name',
      key: 'name',
      render: (_: unknown, record: TableProspect) => (
        <Link to={`/admin-dashboard/prospects/${record.id}`} className="text-blue-600 hover:text-blue-800">
          {record.first_name} {record.last_name}
        </Link>
      ),
      sorter: (a: TableProspect, b: TableProspect) => `${a.first_name} ${a.last_name}`.localeCompare(`${b.first_name} ${b.last_name}`)
    },
    {
      title: 'Contact',
      key: 'contact',
      render: (_: unknown, record: TableProspect) => (
        <Space direction="vertical" size="small">
          {record.email && (
            <a href={`mailto:${record.email}`} className="text-gray-600 hover:text-blue-600">
              <MailOutlined className="mr-1" /> {record.email}
            </a>
          )}
          {record.phone && (
            <a href={`tel:${record.phone}`} className="text-gray-600 hover:text-blue-600">
              <PhoneOutlined className="mr-1" /> {formatPhoneNumber(record.phone)}
            </a>
          )}
        </Space>
      )
    },
    {
      title: 'Location',
      key: 'location',
      render: (_: unknown, record: TableProspect) => (
        <Space>
          {record.city && record.state ? `${record.city}, ${record.state}` : (record.city || record.state || '-')}
        </Space>
      )
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        let color = 'default';
        switch (status) {
          case 'new':
            color = 'blue';
            break;
          case 'contacted':
            color = 'purple';
            break;
          case 'qualified':
            color = 'green';
            break;
          case 'converted':
            color = 'success';
            break;
          case 'lost':
            color = 'error';
            break;
          default:
            color = 'default';
        }
        return <AntTag color={color}>{status.toUpperCase()}</AntTag>;
      }
    },
    {
      title: 'Tags',
      key: 'tags',
      render: (_: unknown, record: TableProspect) => (
        <>
          {record.tags && record.tags.length > 0 ? (
            <Space size="small" wrap>
              {record.tags.slice(0, 2).map(tag => (
                <AntTag key={tag.id} className="m-0">
                  {tag.name}
                </AntTag>
              ))}
              {record.tags.length > 2 && (
                <Tooltip title={record.tags.slice(2).map(tag => tag.name).join(', ')}>
                  <AntTag>+{record.tags.length - 2}</AntTag>
                </Tooltip>
              )}
            </Space>
          ) : (
            <span className="text-gray-400">No tags</span>
          )}
        </>
      )
    },
    {
      title: 'Campaigns',
      key: 'campaigns',
      render: (_: unknown, record: TableProspect) => (
        <>
          {record.campaign_assignments && record.campaign_assignments.length > 0 ? (
            <Space size="small" wrap>
              {record.campaign_assignments.slice(0, 2).map(campaign => (
                <AntTag key={campaign.campaign_id} color="blue">
                  {campaign.campaign_name}
                </AntTag>
              ))}
              {record.campaign_assignments.length > 2 && (
                <Tooltip title={record.campaign_assignments.slice(2).map(c => c.campaign_name).join(', ')}>
                  <AntTag color="blue">+{record.campaign_assignments.length - 2}</AntTag>
                </Tooltip>
              )}
            </Space>
          ) : (
            <span className="text-gray-400">No campaigns</span>
          )}
        </>
      )
    },
    {
      title: 'Assigned To',
      key: 'assignee',
      render: (_: unknown, record: TableProspect) => {
        const assignee = users.find(user => user.id === record.assignee_id);
        return assignee ? (
          <Tooltip title={assignee.name || assignee.email}>
            <Badge count={getInitials(assignee.name || assignee.email || '')} style={{ backgroundColor: '#1890ff' }} />
          </Tooltip>
        ) : (
          <span className="text-gray-400">Unassigned</span>
        );
      }
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: unknown, record: TableProspect) => (
        <Dropdown
          overlay={
            <Menu>
              <Menu.Item key="edit" icon={<EditOutlined />}>
                <Link to={`/admin-dashboard/prospects/${record.id}`}>Edit</Link>
              </Menu.Item>
              <Menu.Divider />
              <Menu.Item key="delete" icon={<DeleteOutlined />} danger>
                <Popconfirm
                  title="Are you sure you want to delete this prospect?"
                  onConfirm={() => handleDeleteProspect(record.id)}
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
          <Button icon={<EllipsisOutlined />} size="small" />
        </Dropdown>
      )
    }
  ];
  
  // Transform users to ActionItem format
  const userActionItems: ActionItem[] = users.map(user => ({
    id: user.id,
    name: user.name || user.email || 'Unknown User'
  }));
  
  // Transform tags to ActionItem format
  const tagActionItems: ActionItem[] = tags.map(tag => ({
    id: tag.id,
    name: tag.name
  }));
  
  // Transform campaigns to ActionItem format
  const campaignActionItems: ActionItem[] = campaigns.map(campaign => ({
    id: campaign.id,
    name: campaign.name
  }));
  
  // Render
  return (
    <div className="prospects-page">
      <Card
        title="Prospects"
        bordered={false}
        className="shadow-sm"
        extra={
          <Space>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => navigate('/admin-dashboard/prospects/new')}
            >
              New Prospect
            </Button>
            <Button
              icon={<ImportOutlined />}
              onClick={() => navigate('/admin-dashboard/prospects/import')}
            >
              Import
            </Button>
          </Space>
        }
      >
        {/* Search and filters */}
        <div className="mb-4 flex flex-wrap gap-2 items-center">
          <Input
            placeholder="Search prospects"
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
            <Option value="new">New</Option>
            <Option value="contacted">Contacted</Option>
            <Option value="qualified">Qualified</Option>
            <Option value="converted">Converted</Option>
            <Option value="lost">Lost</Option>
          </Select>
          
          <Select
            placeholder="Campaign"
            style={{ width: 150 }}
            allowClear
            value={filters.campaign}
            onChange={handleCampaignFilter}
          >
            {campaigns.map(campaign => (
              <Option key={campaign.id} value={campaign.id}>
                {campaign.name}
              </Option>
            ))}
          </Select>
          
          <Select
            placeholder="Tag"
            style={{ width: 150 }}
            allowClear
            value={filters.tag}
            onChange={handleTagFilter}
          >
            {tags.map(tag => (
              <Option key={tag.id} value={tag.id}>
                {tag.name}
              </Option>
            ))}
          </Select>
          
          <Select
            placeholder="Assigned To"
            style={{ width: 150 }}
            allowClear
            value={filters.assignee}
            onChange={handleAssigneeFilter}
          >
            {users.map(user => (
              <Option key={user.id} value={user.id}>
                {user.name || user.email}
              </Option>
            ))}
          </Select>
          
          {(filters.search || filters.status || filters.campaign || filters.tag || filters.assignee) && (
            <Button
              icon={<FilterOutlined />}
              onClick={clearFilters}
            >
              Clear Filters
            </Button>
          )}
        </div>
        
        {/* Batch actions */}
        {selectedRowKeys.length > 0 && (
          <div className="mb-4 p-2 bg-blue-50 rounded flex items-center gap-2">
            <span className="mr-2">
              {selectedRowKeys.length} {selectedRowKeys.length === 1 ? 'prospect' : 'prospects'} selected
            </span>
            <Button
              icon={<TagOutlined />}
              onClick={showTagModal}
            >
              Add Tags
            </Button>
            <Button
              icon={<TeamOutlined />}
              onClick={showCampaignModal}
            >
              Add to Campaign
            </Button>
            <Button
              icon={<UserOutlined />}
              onClick={showUserModal}
            >
              Assign User
            </Button>
          </div>
        )}
        
        {/* Prospects table */}
        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={prospects}
          loading={loading}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: totalProspects,
            showSizeChanger: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} prospects`
          }}
          onChange={(pagination) => handleTableChange(pagination as TablePaginationConfig)}
        />
        
        {/* Action modals */}
        <ProspectActionModal
          visible={campaignModalVisible}
          onCancel={() => setCampaignModalVisible(false)}
          onSubmit={handleAssignCampaign}
          selectedRows={selectedRows}
          type="campaign"
          items={campaignActionItems}
          title="Add to Campaign"
        />
        
        <ProspectActionModal
          visible={tagModalVisible}
          onCancel={() => setTagModalVisible(false)}
          onSubmit={handleAssignTags}
          selectedRows={selectedRows}
          type="tag"
          items={tagActionItems}
          title="Add Tags"
        />
        
        <ProspectActionModal
          visible={userModalVisible}
          onCancel={() => setUserModalVisible(false)}
          onSubmit={handleAssignUser}
          selectedRows={selectedRows}
          type="user"
          items={userActionItems}
          title="Assign User"
        />
      </Card>
    </div>
  );
};

export default ProspectsPage;