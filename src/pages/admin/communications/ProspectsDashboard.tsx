import React, { useState } from 'react';
import * as Icons from 'lucide-react';
import { Button } from '../../../components/ui/button';

// Types
interface Prospect {
  id: string;
  name: string;
  status: 'lead' | 'responded' | 'scheduled' | 'showed' | 'won' | 'lost';
  email: string;
  phone: string;
  dateCreated: string;
  assignedTo: string;
  lastContact: string | null;
  campaignName?: string;
  campaignId?: string;
  opportunityValue?: number;
  notes: string[];
  tags: string[];
}

const mockProspects: Prospect[] = [
  {
    id: '101',
    name: 'Michael Bady',
    status: 'lead',
    email: 'mbady@ingersumarketing.com',
    phone: '(714) 240-3095',
    dateCreated: '2025-02-25T10:34:13',
    assignedTo: 'Natasha Blake',
    lastContact: '2025-02-25T10:45:00',
    campaignName: '1-OCSE - Lead Generation | Dental Grant',
    campaignId: '17',
    notes: [],
    tags: []
  },
  {
    id: '102',
    name: 'Sarah Johnson',
    status: 'responded',
    email: 'sarah.j@example.com',
    phone: '(555) 123-4567',
    dateCreated: '2025-02-20T14:22:00',
    assignedTo: 'Natasha Blake',
    lastContact: '2025-02-25T09:35:00',
    campaignName: '5-Outbound Dental Grant | Cold List Hawaii',
    campaignId: '5',
    notes: ['Interested in cosmetic dentistry'],
    tags: ['Cosmetic', 'Insurance Inquiry']
  },
  {
    id: '103',
    name: 'Emma Davis',
    status: 'scheduled',
    email: 'emma.d@example.com',
    phone: '(555) 456-7890',
    dateCreated: '2025-02-15T11:05:00',
    assignedTo: 'Natasha Blake',
    lastContact: '2025-02-24T16:42:00',
    campaignName: '3-Outbound Dental Grant | Cold List Ohio',
    campaignId: '3',
    opportunityValue: 1250,
    notes: ['Scheduled for initial consultation on March 15th'],
    tags: ['High Value', 'Implants']
  },
  {
    id: '104',
    name: 'Taylor Wilson',
    status: 'showed',
    email: 'taylor.w@example.com',
    phone: '(555) 789-0123',
    dateCreated: '2025-02-10T09:30:00',
    assignedTo: 'Natasha Blake',
    lastContact: '2025-03-10T09:12:00',
    campaignName: '2-Outbound Dental Grant | Last Offer',
    campaignId: '2',
    opportunityValue: 850,
    notes: ['Had initial consult, interested in veneers'],
    tags: ['Veneers', 'Financing']
  },
  {
    id: '105',
    name: 'James Martinez',
    status: 'won',
    email: 'james.m@example.com',
    phone: '(555) 234-5678',
    dateCreated: '2025-02-05T13:45:00',
    assignedTo: 'Natasha Blake',
    lastContact: '2025-03-05T14:30:00',
    campaignName: '1-Outbound Dental Grant | Cold List Various',
    campaignId: '1',
    opportunityValue: 2300,
    notes: ['Converted to patient, full treatment plan accepted'],
    tags: ['Full Plan', 'Insurance Coverage']
  },
  {
    id: '106',
    name: 'Olivia Anderson',
    status: 'lost',
    email: 'olivia.a@example.com',
    phone: '(555) 876-5432',
    dateCreated: '2025-01-28T10:15:00',
    assignedTo: 'Natasha Blake',
    lastContact: '2025-02-27T11:20:00',
    campaignName: '7-Outbound Dental Grant | Cold List Various',
    campaignId: '4',
    notes: ['Decided to go with another provider due to location'],
    tags: ['Location Issue']
  }
];

const ProspectsDashboard: React.FC = () => {
  // State
  const [prospects, setProspects] = useState<Prospect[]>(mockProspects);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedProspect, setSelectedProspect] = useState<Prospect | null>(null);
  const [isAddNoteOpen, setIsAddNoteOpen] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [newTag, setNewTag] = useState('');

  // Filter prospects based on search query
  const getFilteredProspects = () => {
    if (!searchQuery) return prospects;
    
    const query = searchQuery.toLowerCase();
    return prospects.filter(prospect => 
      prospect.name.toLowerCase().includes(query) ||
      prospect.email.toLowerCase().includes(query) ||
      prospect.phone.includes(query) ||
      (prospect.campaignName && prospect.campaignName.toLowerCase().includes(query))
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

  // Add a note to the selected prospect
  const handleAddNote = () => {
    if (!selectedProspect || !newNote.trim()) return;
    
    const updatedProspects = prospects.map(prospect => {
      if (prospect.id === selectedProspect.id) {
        return {
          ...prospect,
          notes: [...prospect.notes, newNote]
        };
      }
      return prospect;
    });
    
    setProspects(updatedProspects);
    
    // Update selected prospect
    const updatedProspect = updatedProspects.find(p => p.id === selectedProspect.id);
    if (updatedProspect) {
      setSelectedProspect(updatedProspect);
    }
    
    setNewNote('');
    setIsAddNoteOpen(false);
  };

  // Add a tag to the selected prospect
  const handleAddTag = () => {
    if (!selectedProspect || !newTag.trim()) return;
    
    const updatedProspects = prospects.map(prospect => {
      if (prospect.id === selectedProspect.id) {
        return {
          ...prospect,
          tags: [...prospect.tags, newTag]
        };
      }
      return prospect;
    });
    
    setProspects(updatedProspects);
    
    // Update selected prospect
    const updatedProspect = updatedProspects.find(p => p.id === selectedProspect.id);
    if (updatedProspect) {
      setSelectedProspect(updatedProspect);
    }
    
    setNewTag('');
  };

  // Mark as closed won
  const markAsWon = () => {
    if (!selectedProspect) return;
    
    const updatedProspects = prospects.map(prospect => {
      if (prospect.id === selectedProspect.id) {
        return {
          ...prospect,
          status: 'won' as const
        };
      }
      return prospect;
    });
    
    setProspects(updatedProspects);
    
    // Update selected prospect
    const updatedProspect = updatedProspects.find(p => p.id === selectedProspect.id);
    if (updatedProspect) {
      setSelectedProspect(updatedProspect);
    }
  };

  // Mark as closed lost
  const markAsLost = () => {
    if (!selectedProspect) return;
    
    const updatedProspects = prospects.map(prospect => {
      if (prospect.id === selectedProspect.id) {
        return {
          ...prospect,
          status: 'lost' as const
        };
      }
      return prospect;
    });
    
    setProspects(updatedProspects);
    
    // Update selected prospect
    const updatedProspect = updatedProspects.find(p => p.id === selectedProspect.id);
    if (updatedProspect) {
      setSelectedProspect(updatedProspect);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
        <h1 className="text-2xl font-semibold">All Contacts</h1>
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
            <Icons.UserPlus className="w-4 h-4 mr-2" />
            Add Contact
          </Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left panel - Prospect list */}
        <div className="w-3/5 overflow-auto border-r border-gray-200">
          <table className="w-full">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Phone</th>
                <th className="px-4 py-3 text-left">Date Created</th>
                <th className="px-4 py-3 text-left">Assigned To</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {getFilteredProspects().map(prospect => (
                <tr 
                  key={prospect.id} 
                  className={`hover:bg-gray-50 cursor-pointer ${selectedProspect?.id === prospect.id ? 'bg-blue-50' : ''}`}
                  onClick={() => setSelectedProspect(prospect)}
                >
                  <td className="px-4 py-3">
                    <div className="font-medium text-sm">{prospect.name}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      prospect.status === 'lead' ? 'bg-gray-100 text-gray-800' :
                      prospect.status === 'responded' ? 'bg-blue-100 text-blue-800' :
                      prospect.status === 'scheduled' ? 'bg-green-100 text-green-800' :
                      prospect.status === 'showed' ? 'bg-purple-100 text-purple-800' :
                      prospect.status === 'won' ? 'bg-emerald-100 text-emerald-800' :
                      'bg-red-100 text-red-800'
                    }`}>{prospect.status.charAt(0).toUpperCase() + prospect.status.slice(1)}</span>
                  </td>
                  <td className="px-4 py-3 text-sm">{prospect.email}</td>
                  <td className="px-4 py-3 text-sm">{prospect.phone}</td>
                  <td className="px-4 py-3 text-sm">{formatDate(prospect.dateCreated)}</td>
                  <td className="px-4 py-3 text-sm">{prospect.assignedTo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Right panel - Prospect details */}
        <div className="w-2/5 overflow-y-auto bg-white">
          {selectedProspect ? (
            <div className="h-full flex flex-col">
              {/* Contact Header with Action button */}
              <div className="p-4 border-b border-gray-200 bg-blue-50 flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-semibold">{selectedProspect.name}</h2>
                  <p className="text-sm text-gray-500">Prospect Info</p>
                </div>
                <div className="flex space-x-2">
                  <div className="relative inline-block text-left">
                    <Button
                      variant="outline"
                      size="sm"
                      id="status-menu-button"
                      aria-expanded="true"
                      aria-haspopup="true"
                      onClick={() => {
                        const dropdown = document.getElementById('status-dropdown');
                        if (dropdown) {
                          dropdown.classList.toggle('hidden');
                        }
                      }}
                    >
                      Mark as Closed
                      <Icons.ChevronDown className="w-4 h-4 ml-1" />
                    </Button>
                    <div
                      id="status-dropdown"
                      className="hidden absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                      role="menu"
                      aria-orientation="vertical"
                      aria-labelledby="status-menu-button"
                      tabIndex={-1}
                    >
                      <div className="py-1" role="none">
                        <button
                          className="text-gray-700 block w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                          onClick={markAsWon}
                        >
                          Closed Won
                        </button>
                        <button
                          className="text-gray-700 block w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                          onClick={markAsLost}
                        >
                          Closed Lost
                        </button>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Action
                    <Icons.ChevronDown className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>

              {/* Assignee Info */}
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-sm font-medium text-gray-500 uppercase mb-3">Assignee Info</h3>
                <div className="flex items-center mb-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 mr-2">
                    {selectedProspect.assignedTo.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{selectedProspect.assignedTo}</p>
                    <p className="text-xs text-gray-500">Assigned Date: {formatDate(selectedProspect.dateCreated)}</p>
                  </div>
                </div>
                <button className="text-xs text-blue-600">See History</button>
              </div>

              {/* Notes section */}
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-gray-500 uppercase">Notes</h3>
                  <span className="text-xs text-gray-500">
                    {selectedProspect.notes.length === 0 ? 'Notes Empty' : `${selectedProspect.notes.length} Notes`}
                  </span>
                </div>

                {selectedProspect.notes.length > 0 ? (
                  <div className="space-y-2 mb-3">
                    {selectedProspect.notes.map((note, index) => (
                      <div key={index} className="p-2 bg-gray-50 rounded text-sm">
                        {note}
                      </div>
                    ))}
                  </div>
                ) : null}

                {isAddNoteOpen ? (
                  <div className="mt-2">
                    <textarea
                      className="w-full p-2 border border-gray-200 rounded text-sm"
                      placeholder="Enter note..."
                      rows={3}
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                    />
                    <div className="flex justify-end mt-2 space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setIsAddNoteOpen(false);
                          setNewNote('');
                        }}
                      >
                        Cancel
                      </Button>
                      <Button 
                        size="sm"
                        onClick={handleAddNote}
                        disabled={!newNote.trim()}
                      >
                        Add Note
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => setIsAddNoteOpen(true)}
                  >
                    Add Note
                  </Button>
                )}
              </div>
              
              {/* Tags section */}
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-gray-500 uppercase">Tags</h3>
                  <span className="text-xs text-gray-500">
                    {selectedProspect.tags.length === 0 ? 'Tags Empty' : `${selectedProspect.tags.length} Tags`}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 mb-3">
                  {selectedProspect.tags.map((tag, index) => (
                    <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex space-x-2">
                  <input
                    type="text"
                    className="flex-1 p-1 border border-gray-200 rounded text-sm"
                    placeholder="Enter tag..."
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && newTag.trim()) {
                        handleAddTag();
                      }
                    }}
                  />
                  <Button 
                    size="sm"
                    onClick={handleAddTag}
                    disabled={!newTag.trim()}
                  >
                    Add Tag
                  </Button>
                </div>
              </div>

              {/* Appointments section */}
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-gray-500 uppercase">Appointments</h3>
                  <span className="text-xs text-gray-500">Appointments Empty</span>
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  Add Appointment
                </Button>
              </div>

              {/* Tasks section */}
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-gray-500 uppercase">Tasks</h3>
                  <span className="text-xs text-gray-500">Tasks Empty</span>
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  Add Task
                </Button>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center p-4 text-gray-500">
              <div className="text-center">
                <Icons.User className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p>Select a contact to view details</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProspectsDashboard;