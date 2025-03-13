import React, { useState } from 'react';
import * as Icons from 'lucide-react';
import { Button } from '../../../components/ui/button';

// Types
interface Campaign {
  id: string;
  name: string;
  isActive: boolean;
  numberPool: string;
  timezone: string;
  totalContacts: number;
  dateCreated: string;
  color: string;
}

// Mock data
const mockCampaigns: Campaign[] = [
  {
    id: '1',
    name: '1-Outbound Dental Grant | Cold List Various',
    isActive: true,
    numberPool: 'OC Smile Experts',
    timezone: '(UTC-08:00) Pacific Time (Los Angeles)',
    totalContacts: 0,
    dateCreated: '2025-03-05T08:22:00',
    color: 'blue'
  },
  {
    id: '2',
    name: '2-Outbound Dental Grant | Last Offer',
    isActive: true,
    numberPool: 'OC Smile Experts',
    timezone: '(UTC-08:00) Pacific Time (Los Angeles)',
    totalContacts: 0,
    dateCreated: '2025-03-05T07:45:09',
    color: 'blue'
  },
  {
    id: '3',
    name: '3-Outbound Dental Grant | Cold List Ohio',
    isActive: true,
    numberPool: 'OC Smile Experts',
    timezone: '(UTC-08:00) Pacific Time (Los Angeles)',
    totalContacts: 0,
    dateCreated: '2025-03-05T08:22:00',
    color: 'blue'
  },
  {
    id: '4',
    name: '7-Outbound Dental Grant | Cold List Various',
    isActive: true,
    numberPool: 'OC Smile Experts',
    timezone: '(UTC-08:00) Pacific Time (Los Angeles)',
    totalContacts: 0,
    dateCreated: '2025-03-05T08:22:00',
    color: 'blue'
  },
  {
    id: '5',
    name: '5-Outbound Dental Grant | Cold List Hawaii',
    isActive: true,
    numberPool: 'OC Smile Experts',
    timezone: '(UTC-08:00) Pacific Time (Los Angeles)',
    totalContacts: 0,
    dateCreated: '2025-03-05T08:22:00',
    color: 'blue'
  },
  {
    id: '6',
    name: '5-Outbound Dental Grant | Cold List Reno',
    isActive: true,
    numberPool: 'OC Smile Experts',
    timezone: '(UTC-08:00) Pacific Time (Los Angeles)',
    totalContacts: 0,
    dateCreated: '2025-03-05T08:22:00',
    color: 'blue'
  },
  {
    id: '7',
    name: '3-Outbound Dental Grant | Cold List Nebraska',
    isActive: true,
    numberPool: 'OC Smile Experts',
    timezone: '(UTC-08:00) Pacific Time (Los Angeles)',
    totalContacts: 0,
    dateCreated: '2025-03-05T08:22:00',
    color: 'blue'
  },
  {
    id: '8',
    name: '7-Outbound Dental Grant | Cold List North Dakota',
    isActive: true,
    numberPool: 'OC Smile Experts',
    timezone: '(UTC-08:00) Pacific Time (Los Angeles)',
    totalContacts: 0,
    dateCreated: '2025-03-05T08:22:00',
    color: 'blue'
  },
  {
    id: '9',
    name: '7-Outbound Dental Grant | Wrong Contact',
    isActive: true,
    numberPool: 'OC Smile Experts',
    timezone: '(UTC-08:00) Pacific Time (Los Angeles)',
    totalContacts: 0,
    dateCreated: '2025-03-05T07:45:09',
    color: 'blue'
  },
  {
    id: '10',
    name: '5-Outbound Dental Grant | Re-Engage',
    isActive: true,
    numberPool: 'OC Smile Experts',
    timezone: '(UTC-08:00) Pacific Time (Los Angeles)',
    totalContacts: 0,
    dateCreated: '2025-03-05T07:45:09',
    color: 'blue'
  },
  {
    id: '11',
    name: '5-Outbound Dental Grant | No Show',
    isActive: true,
    numberPool: 'OC Smile Experts',
    timezone: '(UTC-08:00) Pacific Time (Los Angeles)',
    totalContacts: 0,
    dateCreated: '2025-03-05T07:45:09',
    color: 'blue'
  },
  {
    id: '12',
    name: '5-Outbound Dental Grant | Holding',
    isActive: false,
    numberPool: 'OC Smile Experts',
    timezone: '(UTC-08:00) Pacific Time (Los Angeles)',
    totalContacts: 0,
    dateCreated: '2025-03-05T07:45:09',
    color: 'blue'
  },
  {
    id: '13',
    name: '5-Outbound Dental Grant | No Response',
    isActive: true,
    numberPool: 'OC Smile Experts',
    timezone: '(UTC-08:00) Pacific Time (Los Angeles)',
    totalContacts: 0,
    dateCreated: '2025-03-05T07:45:09',
    color: 'blue'
  },
  {
    id: '14',
    name: '5-Outbound Dental Grant | Aged List Various',
    isActive: true,
    numberPool: 'OC Smile Experts',
    timezone: '(UTC-08:00) Pacific Time (Los Angeles)',
    totalContacts: 0,
    dateCreated: '2025-03-05T07:45:09',
    color: 'blue'
  },
  {
    id: '15',
    name: '2-OCSE - Lead Generation | Website Opt-in',
    isActive: true,
    numberPool: 'OC Smile Experts',
    timezone: '(UTC-08:00) Pacific Time (Los Angeles)',
    totalContacts: 0,
    dateCreated: '2024-09-09T15:40:00',
    color: 'green'
  },
  {
    id: '16',
    name: '2-OCSE - Re-Engagement | Viewers',
    isActive: true,
    numberPool: 'OC Smile Experts',
    timezone: '(UTC-08:00) Pacific Time (Los Angeles)',
    totalContacts: 0,
    dateCreated: '2024-09-17T15:56:00',
    color: 'green'
  },
  {
    id: '17',
    name: '1-OCSE - Lead Generation | Dental Grant',
    isActive: true,
    numberPool: 'OC Smile Experts',
    timezone: '(UTC-08:00) Pacific Time (Los Angeles)',
    totalContacts: 1,
    dateCreated: '2024-01-25T11:30:00',
    color: 'green'
  },
  {
    id: '18',
    name: '4-OCSE - No Show | Viewers',
    isActive: true,
    numberPool: 'OC Smile Experts',
    timezone: '(UTC-08:00) Pacific Time (Los Angeles)',
    totalContacts: 0,
    dateCreated: '2024-09-17T17:07:00',
    color: 'green'
  },
  {
    id: '19',
    name: '4-OCSE - No Response | Viewers',
    isActive: true,
    numberPool: 'OC Smile Experts',
    timezone: '(UTC-08:00) Pacific Time (Los Angeles)',
    totalContacts: 0,
    dateCreated: '2024-09-17T17:07:00',
    color: 'green'
  },
  {
    id: '20',
    name: '4-OCSE - Re-Engagement | PPO Ad',
    isActive: true,
    numberPool: 'OC Smile Experts',
    timezone: '(UTC-08:00) Pacific Time (Los Angeles)',
    totalContacts: 0,
    dateCreated: '2024-07-12T17:25:00',
    color: 'green'
  },
  {
    id: '21',
    name: '4-OCSE - No Show | PPO Ad',
    isActive: true,
    numberPool: 'OC Smile Experts',
    timezone: '(UTC-08:00) Pacific Time (Los Angeles)',
    totalContacts: 0,
    dateCreated: '2024-07-12T17:45:00',
    color: 'green'
  }
];

const CampaignsDashboard: React.FC = () => {
  // State
  const [campaigns, setCampaigns] = useState<Campaign[]>(mockCampaigns);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Filter campaigns based on search query
  const getFilteredCampaigns = () => {
    if (!searchQuery) return campaigns;
    
    const query = searchQuery.toLowerCase();
    return campaigns.filter(campaign => 
      campaign.name.toLowerCase().includes(query) ||
      campaign.numberPool.toLowerCase().includes(query)
    );
  };

  // Toggle campaign active status
  const toggleCampaignStatus = (id: string) => {
    setCampaigns(prevCampaigns => 
      prevCampaigns.map(campaign => 
        campaign.id === id 
          ? { ...campaign, isActive: !campaign.isActive } 
          : campaign
      )
    );
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).format(date);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
        <h1 className="text-2xl font-semibold">Campaigns</h1>
        <div className="flex space-x-3">
          <div className="relative">
            <input 
              type="text"
              placeholder="Search..." 
              className="h-9 pl-8 pr-3 border border-gray-200 rounded-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Icons.Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
          <Button>
            <Icons.PlusCircle className="w-4 h-4 mr-2" />
            Add Campaign
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <table className="w-full">
          <thead className="bg-gray-50 text-xs uppercase text-gray-500">
            <tr>
              <th className="w-16 px-4 py-3 text-left">Off/On</th>
              <th className="px-4 py-3 text-left">Campaign Name</th>
              <th className="px-4 py-3 text-left">Number Pool</th>
              <th className="px-4 py-3 text-left">Timezone</th>
              <th className="px-4 py-3 text-center">Total Contact</th>
              <th className="px-4 py-3 text-left">Date Time Created</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {getFilteredCampaigns().map(campaign => (
              <tr 
                key={campaign.id} 
                className="hover:bg-gray-50"
              >
                <td className="px-4 py-3">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={campaign.isActive}
                      onChange={() => toggleCampaignStatus(campaign.id)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </td>
                <td className="px-4 py-3 flex items-center">
                  <div 
                    className="w-2 h-2 rounded-full mr-2" 
                    style={{ backgroundColor: campaign.color === 'blue' ? '#3b82f6' : '#22c55e' }}
                  ></div>
                  <span className="font-medium text-sm">{campaign.name}</span>
                </td>
                <td className="px-4 py-3 text-sm">{campaign.numberPool}</td>
                <td className="px-4 py-3 text-sm">{campaign.timezone}</td>
                <td className="px-4 py-3 text-center text-sm">{campaign.totalContacts}</td>
                <td className="px-4 py-3 text-sm">{formatDate(campaign.dateCreated)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CampaignsDashboard;