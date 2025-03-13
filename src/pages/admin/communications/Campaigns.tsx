import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';

// Types
interface Campaign {
  id: string;
  name: string;
  numberPool: string;
  timezone: string;
  totalContacts: number;
  dateCreated: string;
  status: 'active' | 'inactive';
}

// Mock data for campaigns 
const mockCampaigns: Campaign[] = [
  {
    id: '1',
    name: '1 - Outbound Dental Grant | Cold List Validation',
    numberPool: 'OC Smile Experts',
    timezone: '(UTC-08:00) Pacific Time (Los Angeles)',
    totalContacts: 0,
    dateCreated: '2023-11-05T08:32:22',
    status: 'active'
  },
  {
    id: '2',
    name: '2 - Outbound Dental Grant | List Offer',
    numberPool: 'OC Smile Experts',
    timezone: '(UTC-08:00) Pacific Time (Los Angeles)',
    totalContacts: 0,
    dateCreated: '2023-11-05T07:45:09',
    status: 'active'
  },
  {
    id: '3',
    name: '3 - Outbound Dental Grant | Cold List O.',
    numberPool: 'OC Smile Experts',
    timezone: '(UTC-08:00) Pacific Time (Los Angeles)',
    totalContacts: 0,
    dateCreated: '2023-11-05T08:32:22',
    status: 'active'
  },
  {
    id: '4',
    name: '7 - Outbound Dental Grant | Cold List',
    numberPool: 'OC Smile Experts',
    timezone: '(UTC-08:00) Pacific Time (Los Angeles)',
    totalContacts: 0,
    dateCreated: '2023-11-05T08:32:22',
    status: 'active'
  },
  {
    id: '5',
    name: '8 - Outbound Dental Grant | Cold List H.',
    numberPool: 'OC Smile Experts',
    timezone: '(UTC-08:00) Pacific Time (Los Angeles)',
    totalContacts: 0,
    dateCreated: '2023-11-05T08:32:22',
    status: 'active'
  },
  {
    id: '6',
    name: '9 - Outbound Dental Grant | Cold List R.',
    numberPool: 'OC Smile Experts',
    timezone: '(UTC-08:00) Pacific Time (Los Angeles)',
    totalContacts: 0,
    dateCreated: '2023-11-05T08:32:22',
    status: 'active'
  },
  {
    id: '7',
    name: '4 - Outbound Dental Grant | Cold List N.',
    numberPool: 'OC Smile Experts',
    timezone: '(UTC-08:00) Pacific Time (Los Angeles)',
    totalContacts: 0,
    dateCreated: '2023-11-05T08:32:22',
    status: 'active'
  },
  {
    id: '8',
    name: '5 - Outbound Dental Grant | Cold List N.',
    numberPool: 'OC Smile Experts',
    timezone: '(UTC-08:00) Pacific Time (Los Angeles)',
    totalContacts: 0,
    dateCreated: '2023-11-05T08:32:22',
    status: 'active'
  },
  {
    id: '9',
    name: '7 - Outbound Dental Grant | Wrong Contact',
    numberPool: 'OC Smile Experts',
    timezone: '(UTC-08:00) Pacific Time (Los Angeles)',
    totalContacts: 0,
    dateCreated: '2023-11-05T07:45:09',
    status: 'active'
  },
  {
    id: '10',
    name: '8 - Outbound Dental Grant | Re-Engage',
    numberPool: 'OC Smile Experts',
    timezone: '(UTC-08:00) Pacific Time (Los Angeles)',
    totalContacts: 0,
    dateCreated: '2023-11-05T07:45:09',
    status: 'active'
  },
  {
    id: '11',
    name: '6 - Outbound Dental Grant | No Show',
    numberPool: 'OC Smile Experts',
    timezone: '(UTC-08:00) Pacific Time (Los Angeles)',
    totalContacts: 0,
    dateCreated: '2023-11-05T07:45:09',
    status: 'active'
  },
  {
    id: '12',
    name: '8 - Outbound Dental Grant | Holding',
    numberPool: 'OC Smile Experts',
    timezone: '(UTC-08:00) Pacific Time (Los Angeles)',
    totalContacts: 0,
    dateCreated: '2023-11-05T07:45:09',
    status: 'inactive'
  },
  {
    id: '13',
    name: '9 - Outbound Dental Grant | No Response',
    numberPool: 'OC Smile Experts',
    timezone: '(UTC-08:00) Pacific Time (Los Angeles)',
    totalContacts: 0,
    dateCreated: '2023-11-05T07:45:09',
    status: 'active'
  },
  {
    id: '14',
    name: '10 - Outbound Dental Grant | Aged List V.',
    numberPool: 'OC Smile Experts',
    timezone: '(UTC-08:00) Pacific Time (Los Angeles)',
    totalContacts: 0,
    dateCreated: '2023-11-05T07:45:09',
    status: 'active'
  },
  {
    id: '15',
    name: '1 - OCSE - Lead Generation | Website Opt In',
    numberPool: 'OC Smile Experts',
    timezone: '(UTC-08:00) Pacific Time (Los Angeles)',
    totalContacts: 0,
    dateCreated: '2023-09-09T15:30:00',
    status: 'active'
  },
  {
    id: '16',
    name: '2 - OCSE - Re-Engagement | Veneer',
    numberPool: 'OC Smile Experts',
    timezone: '(UTC-08:00) Pacific Time (Los Angeles)',
    totalContacts: 0,
    dateCreated: '2023-09-17T15:55:00',
    status: 'active'
  },
  {
    id: '17',
    name: '3 - OCSE - Lead Generation | Dental Grant',
    numberPool: 'OC Smile Experts',
    timezone: '(UTC-08:00) Pacific Time (Los Angeles)',
    totalContacts: 1,
    dateCreated: '2023-01-25T08:17:30',
    status: 'active'
  }
];

const Campaigns: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCampaigns = mockCampaigns.filter(campaign => 
    campaign.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Toggle campaign status
  const toggleCampaignStatus = (id: string) => {
    // In a real application, this would update the status in the database
    console.log(`Toggling status for campaign ${id}`);
  };

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
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center p-4 border-b border-gray-200">
        <h1 className="text-2xl font-bold">Campaigns</h1>
        <div className="flex space-x-2">
          <Input
            type="text"
            placeholder="Search campaigns..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64"
          />
          <Button className="ml-2">
            <Icons.Plus className="w-4 h-4 mr-2" />
            Add Campaign
          </Button>
        </div>
      </div>
      
      <div className="flex-1 overflow-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12">
                Off/On
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Campaign Name <Icons.ArrowDownUp className="w-3 h-3 inline-block ml-1" />
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Number Pool
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Timezone
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Contact
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date Time Created
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredCampaigns.map((campaign) => (
              <tr key={campaign.id} className="hover:bg-gray-50">
                <td className="px-6 py-2">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={campaign.status === 'active'}
                      onChange={() => toggleCampaignStatus(campaign.id)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </td>
                <td className="px-6 py-2">
                  <Link 
                    to={`/admin-dashboard/campaigns/${campaign.id}`}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    {campaign.name}
                  </Link>
                </td>
                <td className="px-6 py-2 text-sm text-gray-700">{campaign.numberPool}</td>
                <td className="px-6 py-2 text-sm text-gray-700">{campaign.timezone}</td>
                <td className="px-6 py-2 text-sm text-gray-700">{campaign.totalContacts}</td>
                <td className="px-6 py-2 text-sm text-gray-700">{formatDate(campaign.dateCreated)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Campaigns;