import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import CampaignSequence from './CampaignSequence';

// Types for campaign and contacts
interface Contact {
  id: string;
  name: string;
  phone: string;
  email: string;
  status: 'active' | 'completed' | 'pending' | 'failed';
  lastContact: string;
}

interface Campaign {
  id: string;
  name: string;
  numberPool: string;
  timezone: string;
  totalContacts: number;
  dateCreated: string;
  status: 'active' | 'inactive';
  description?: string;
}

// Mock data for the campaign details
const mockCampaign: Campaign = {
  id: '1',
  name: '1 - Outbound Dental Grant | Cold List Validation',
  numberPool: 'OC Smile Experts',
  timezone: '(UTC-08:00) Pacific Time (Los Angeles)',
  totalContacts: 75,
  dateCreated: '2023-11-05T08:32:22',
  status: 'active',
  description: 'Campaign for validating cold prospects for the dental grant program.'
};

// Mock data for campaign contacts
const mockContacts: Contact[] = [
  {
    id: '1',
    name: 'Michael Brown',
    phone: '(555) 987-6543',
    email: 'michael.b@example.com',
    status: 'active',
    lastContact: '2023-11-06T14:30:00'
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    phone: '(555) 123-4567',
    email: 'sarah.j@example.com',
    status: 'completed',
    lastContact: '2023-11-05T10:15:00'
  },
  {
    id: '3',
    name: 'David Wilson',
    phone: '(555) 234-5678',
    email: 'david.w@example.com',
    status: 'pending',
    lastContact: '2023-11-04T16:45:00'
  },
  {
    id: '4',
    name: 'Jennifer Lee',
    phone: '(555) 345-6789',
    email: 'jennifer.l@example.com',
    status: 'failed',
    lastContact: '2023-11-03T09:20:00'
  },
  {
    id: '5',
    name: 'Robert Garcia',
    phone: '(555) 456-7890',
    email: 'robert.g@example.com',
    status: 'active',
    lastContact: '2023-11-02T13:10:00'
  }
];

// Status badge component
const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'inactive':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Badge className={`${getStatusColor()} font-medium`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
};

const CampaignDetails: React.FC = () => {
  const { campaignId } = useParams<{ campaignId: string }>();
  
  // In a real implementation, we would fetch campaign data using the campaignId
  console.log(`Fetching campaign with ID: ${campaignId}`);
  
  const [campaign] = useState<Campaign>(mockCampaign);
  const [contacts] = useState<Contact[]>(mockContacts);
  const [activeTab, setActiveTab] = useState('overview');

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: '2-digit', 
      hour: '2-digit', 
      minute: '2-digit', 
      hour12: true 
    };
    return date.toLocaleDateString('en-US', options);
  };

  return (
    <div className="flex flex-col h-full space-y-6">
      {/* Header with back button */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Link to="/admin-dashboard/campaigns" className="text-gray-500 hover:text-gray-700">
            <Icons.ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-bold">{campaign.name}</h1>
          <StatusBadge status={campaign.status} />
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" className="space-x-2">
            <Icons.Edit className="w-4 h-4" />
            <span>Edit</span>
          </Button>
          <Button className="space-x-2">
            <Icons.SendHorizonal className="w-4 h-4" />
            <span>Send Test</span>
          </Button>
        </div>
      </div>
      
      {/* Campaign details tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 w-full max-w-md">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="contacts">Contacts</TabsTrigger>
          <TabsTrigger value="sequence">Sequence</TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Campaign Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Number Pool</p>
                  <p className="font-medium">{campaign.numberPool}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Timezone</p>
                  <p className="font-medium">{campaign.timezone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Created On</p>
                  <p className="font-medium">{formatDate(campaign.dateCreated)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <StatusBadge status={campaign.status} />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Contacts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-500">Total Contacts</p>
                  <p className="font-medium">{campaign.totalContacts}</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-500">Active</p>
                  <p className="font-medium">{contacts.filter(c => c.status === 'active').length}</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-500">Completed</p>
                  <p className="font-medium">{contacts.filter(c => c.status === 'completed').length}</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-500">Pending</p>
                  <p className="font-medium">{contacts.filter(c => c.status === 'pending').length}</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-500">Failed</p>
                  <p className="font-medium">{contacts.filter(c => c.status === 'failed').length}</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-500">Response Rate</p>
                  <p className="font-medium">42%</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-500">Conversion Rate</p>
                  <p className="font-medium">18%</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-500">Average Response Time</p>
                  <p className="font-medium">3.5 hours</p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Description */}
          {campaign.description && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{campaign.description}</p>
              </CardContent>
            </Card>
          )}
          
          {/* Analytics chart placeholder */}
          <Card>
            <CardHeader>
              <CardTitle>Campaign Performance</CardTitle>
              <CardDescription>Contact engagement over time</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] flex items-center justify-center bg-gray-50">
              <div className="text-gray-500 flex flex-col items-center">
                <Icons.BarChart3 className="w-12 h-12 mb-2" />
                <p>Analytics chart will be displayed here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Contacts Tab */}
        <TabsContent value="contacts" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Campaign Contacts</CardTitle>
                <CardDescription>Manage contacts assigned to this campaign</CardDescription>
              </div>
              <Button className="space-x-2">
                <Icons.UserPlus className="w-4 h-4" />
                <span>Add Contacts</span>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b">
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Contact</th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {contacts.map((contact) => (
                      <tr key={contact.id} className="hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                              <Icons.User className="h-4 w-4 text-gray-500" />
                            </div>
                            <div className="ml-3">
                              <p className="text-sm font-medium text-gray-900">{contact.name}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-700">{contact.phone}</td>
                        <td className="py-3 px-4 text-sm text-gray-700">{contact.email}</td>
                        <td className="py-3 px-4">
                          <StatusBadge status={contact.status} />
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-700">{formatDate(contact.lastContact)}</td>
                        <td className="py-3 px-4 text-sm">
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Icons.MessageSquare className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Icons.MoreVertical className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Sequence Tab */}
        <TabsContent value="sequence">
          <CampaignSequence campaign={campaign} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CampaignDetails;