import React, { useState } from 'react';
import * as Icons from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { useCommunication } from '../../../contexts/CommunicationContext';
import VoiceCallDialog from '../../../components/communication/VoiceCallDialog';
import SMSDialog from '../../../components/communication/SMSDialog';

// Types
interface CommunicationItem {
  id: string;
  patientId: string;
  patientName: string;
  patientPhone: string;
  patientEmail?: string;
  type: 'sms' | 'call' | 'email';
  direction: 'inbound' | 'outbound';
  content: string;
  timestamp: string;
  status: string;
  assignedTo?: string;
  read: boolean;
}

interface PatientNote {
  id: string;
  content: string;
  timestamp: string;
  createdBy: string;
}

// Mock data
const mockCommunications: CommunicationItem[] = [
  {
    id: '1',
    patientId: '101',
    patientName: 'Sarah Johnson',
    patientPhone: '(555) 123-4567',
    patientEmail: 'sarah.j@example.com',
    type: 'sms',
    direction: 'outbound',
    content: 'Hi Sarah, this is a reminder about your appointment tomorrow at 2pm. Reply CONFIRM to confirm or call us to reschedule.',
    timestamp: '2025-02-25T09:30:00',
    status: 'delivered',
    read: true
  },
  {
    id: '2',
    patientId: '101',
    patientName: 'Sarah Johnson',
    patientPhone: '(555) 123-4567',
    patientEmail: 'sarah.j@example.com',
    type: 'sms',
    direction: 'inbound',
    content: 'CONFIRM',
    timestamp: '2025-02-25T09:35:00',
    status: 'received',
    read: false
  },
  {
    id: '3',
    patientId: '102',
    patientName: 'Michael Brown',
    patientPhone: '(555) 987-6543',
    patientEmail: 'michael.b@example.com',
    type: 'call',
    direction: 'inbound',
    content: 'Discussed rescheduling appointment from March 15 to March 18',
    timestamp: '2025-02-25T10:15:00',
    status: 'completed',
    assignedTo: 'Dr. Smith',
    read: true
  },
  {
    id: '4',
    patientId: '103',
    patientName: 'Emma Davis',
    patientPhone: '(555) 456-7890',
    patientEmail: 'emma.d@example.com',
    type: 'email',
    direction: 'inbound',
    content: 'I have a question about my recent billing statement. There seems to be a charge I don\'t recognize...',
    timestamp: '2025-02-24T16:42:00',
    status: 'unassigned',
    read: false
  }
];

// Patient indicators data
interface PatientIndicator {
  patientId: string;
  lastVisit: string | null;
  lastContact: string | null;
  dueForHygiene: boolean;
  dueForRecall: boolean;
  insuranceExpiration: string | null;
  outstandingBalance: number;
}

const mockPatientIndicators: Record<string, PatientIndicator> = {
  '101': {
    patientId: '101',
    lastVisit: '2024-12-15',
    lastContact: '2025-02-25',
    dueForHygiene: true,
    dueForRecall: false,
    insuranceExpiration: '2025-06-30',
    outstandingBalance: 150.00
  },
  '102': {
    patientId: '102',
    lastVisit: '2025-01-20',
    lastContact: '2025-02-25',
    dueForHygiene: false,
    dueForRecall: true,
    insuranceExpiration: '2025-12-31',
    outstandingBalance: 0
  },
  '103': {
    patientId: '103',
    lastVisit: '2024-11-05',
    lastContact: '2025-02-24',
    dueForHygiene: true,
    dueForRecall: true,
    insuranceExpiration: '2025-04-15',
    outstandingBalance: 75.50
  }
};

const CommunicationsDashboard: React.FC = () => {
  // Communication context
  useCommunication(); // Will use calls and messages when we integrate with real backend
  
  // State
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [communications, setCommunications] = useState<CommunicationItem[]>(mockCommunications);
  const [selectedCommunication, setSelectedCommunication] = useState<CommunicationItem | null>(null);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [conversationNotes, setConversationNotes] = useState<PatientNote[]>([]);
  const [newNote, setNewNote] = useState<string>('');
  
  // Dialogs state
  const [isCallDialogOpen, setIsCallDialogOpen] = useState<boolean>(false);
  const [isSMSDialogOpen, setIsSMSDialogOpen] = useState<boolean>(false);
  
  // Select a communication
  const selectCommunication = (comm: CommunicationItem) => {
    setSelectedCommunication(comm);
    setSelectedPatientId(comm.patientId);
    
    // Mark as read
    setCommunications(prev => 
      prev.map(c => c.id === comm.id ? { ...c, read: true } : c)
    );
  };
  
  // Get patient indicators
  const getPatientIndicators = (patientId: string): PatientIndicator | null => {
    return mockPatientIndicators[patientId] || null;
  };
  
  // Filter communications
  const getFilteredCommunications = () => {
    let filtered = [...communications];
    
    // Apply filter
    switch (activeFilter) {
      case 'unread':
        filtered = filtered.filter(comm => !comm.read);
        break;
      case 'sms':
        filtered = filtered.filter(comm => comm.type === 'sms');
        break;
      case 'calls':
        filtered = filtered.filter(comm => comm.type === 'call');
        break;
      case 'email':
        filtered = filtered.filter(comm => comm.type === 'email');
        break;
      case 'unassigned':
        filtered = filtered.filter(comm => !comm.assignedTo);
        break;
      // Default is 'all', no filtering needed
    }
    
    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(comm => 
        comm.patientName.toLowerCase().includes(query) ||
        comm.content.toLowerCase().includes(query) ||
        comm.patientPhone.includes(query)
      );
    }
    
    // Sort by timestamp (newest first)
    return filtered.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  };
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }).format(date);
  };
  
  // Add a note
  const addNote = () => {
    if (!newNote.trim() || !selectedPatientId) return;
    
    const note: PatientNote = {
      id: `note-${Date.now()}`,
      content: newNote,
      timestamp: new Date().toISOString(),
      createdBy: 'Current User'
    };
    
    setConversationNotes(prev => [...prev, note]);
    setNewNote('');
  };
  
  // Handle sending a new message
  const handleSendMessage = (message: string) => {
    if (!message.trim() || !selectedCommunication) return;
    
    const newMessage: CommunicationItem = {
      id: `msg-${Date.now()}`,
      patientId: selectedCommunication.patientId,
      patientName: selectedCommunication.patientName,
      patientPhone: selectedCommunication.patientPhone,
      patientEmail: selectedCommunication.patientEmail,
      type: 'sms',
      direction: 'outbound',
      content: message,
      timestamp: new Date().toISOString(),
      status: 'sent',
      read: true
    };
    
    setCommunications(prev => [newMessage, ...prev]);
  };
  
  // Get a patient's conversation history
  const getPatientConversationHistory = (patientId: string) => {
    return communications.filter(comm => comm.patientId === patientId)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  };
  
  // Open SMS dialog
  const openSMSDialog = () => {
    if (selectedCommunication) {
      setIsSMSDialogOpen(true);
    }
  };
  
  // Open call dialog
  const openCallDialog = () => {
    if (selectedCommunication) {
      setIsCallDialogOpen(true);
    }
  };
  
  // Get unread count
  const getUnreadCount = () => {
    return communications.filter(comm => !comm.read).length;
  };
  
  return (
    <div className="h-full flex">
      {/* Left Sidebar - Filters */}
      <div className="w-64 border-r border-gray-200 bg-gray-50 p-4 space-y-4">
        <h2 className="text-lg font-semibold">Communication</h2>
        
        <div className="space-y-2">
          <div 
            className={`p-2 rounded-md cursor-pointer flex justify-between items-center ${activeFilter === 'all' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'}`}
            onClick={() => setActiveFilter('all')}
          >
            <div className="flex items-center">
              <Icons.MessageCircle className="w-4 h-4 mr-2" />
              <span>All Communications</span>
            </div>
            <span className="bg-gray-200 text-gray-800 px-2 py-0.5 rounded-full text-xs">
              {communications.length}
            </span>
          </div>
          
          <div 
            className={`p-2 rounded-md cursor-pointer flex justify-between items-center ${activeFilter === 'unread' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'}`}
            onClick={() => setActiveFilter('unread')}
          >
            <div className="flex items-center">
              <Icons.Bell className="w-4 h-4 mr-2" />
              <span>Unread</span>
            </div>
            <span className="bg-blue-500 text-white px-2 py-0.5 rounded-full text-xs">
              {getUnreadCount()}
            </span>
          </div>
          
          <div 
            className={`p-2 rounded-md cursor-pointer flex justify-between items-center ${activeFilter === 'sms' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'}`}
            onClick={() => setActiveFilter('sms')}
          >
            <div className="flex items-center">
              <Icons.MessageSquare className="w-4 h-4 mr-2" />
              <span>SMS</span>
            </div>
          </div>
          
          <div 
            className={`p-2 rounded-md cursor-pointer flex justify-between items-center ${activeFilter === 'calls' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'}`}
            onClick={() => setActiveFilter('calls')}
          >
            <div className="flex items-center">
              <Icons.Phone className="w-4 h-4 mr-2" />
              <span>Calls</span>
            </div>
          </div>
          
          <div 
            className={`p-2 rounded-md cursor-pointer flex justify-between items-center ${activeFilter === 'email' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'}`}
            onClick={() => setActiveFilter('email')}
          >
            <div className="flex items-center">
              <Icons.Mail className="w-4 h-4 mr-2" />
              <span>Email</span>
            </div>
          </div>
          
          <div 
            className={`p-2 rounded-md cursor-pointer flex justify-between items-center ${activeFilter === 'unassigned' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'}`}
            onClick={() => setActiveFilter('unassigned')}
          >
            <div className="flex items-center">
              <Icons.UserX className="w-4 h-4 mr-2" />
              <span>Unassigned</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Middle Section - Conversation List */}
      <div className="flex-1 border-r border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <input
              type="text"
              placeholder="Search communications..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
        </div>
        
        <div className="divide-y divide-gray-200">
          {getFilteredCommunications().map(comm => (
            <div 
              key={comm.id}
              className={`p-4 cursor-pointer hover:bg-gray-50 ${selectedCommunication?.id === comm.id ? 'bg-blue-50' : ''} ${!comm.read ? 'bg-blue-50/20' : ''}`}
              onClick={() => selectCommunication(comm)}
            >
              <div className="flex justify-between mb-1">
                <div className="font-medium flex items-center">
                  {comm.type === 'sms' && <Icons.MessageSquare className="w-3.5 h-3.5 mr-2 text-blue-500" />}
                  {comm.type === 'call' && <Icons.Phone className="w-3.5 h-3.5 mr-2 text-green-500" />}
                  {comm.type === 'email' && <Icons.Mail className="w-3.5 h-3.5 mr-2 text-purple-500" />}
                  {comm.patientName}
                  {!comm.read && (
                    <span className="ml-2 w-2 h-2 bg-blue-500 rounded-full"></span>
                  )}
                </div>
                <span className="text-xs text-gray-500">{formatDate(comm.timestamp)}</span>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600 truncate max-w-md">
                  {comm.content}
                </p>
                <div className="flex-shrink-0 flex items-center">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    comm.direction === 'inbound' 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {comm.direction === 'inbound' ? 'Received' : 'Sent'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Right Panel - Conversation Details */}
      <div className="w-96 bg-white">
        {selectedCommunication ? (
          <div className="h-full flex flex-col">
            {/* Patient header */}
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-semibold">{selectedCommunication.patientName}</h2>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={openSMSDialog}>
                    <Icons.MessageSquare className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={openCallDialog}>
                    <Icons.Phone className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Icons.Mail className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <Icons.Phone className="w-3.5 h-3.5 mr-1.5" />
                <span>{selectedCommunication.patientPhone}</span>
              </div>
              {selectedCommunication.patientEmail && (
                <div className="flex items-center text-sm text-gray-500">
                  <Icons.Mail className="w-3.5 h-3.5 mr-1.5" />
                  <span>{selectedCommunication.patientEmail}</span>
                </div>
              )}
            </div>
            
            {/* Patient indicators */}
            {selectedPatientId && (
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <h3 className="text-sm font-medium mb-2">Patient Indicators</h3>
                <div className="space-y-2">
                  {getPatientIndicators(selectedPatientId)?.dueForHygiene && (
                    <div className="flex items-center text-sm">
                      <span className="w-2 h-2 bg-amber-500 rounded-full mr-2"></span>
                      <span>Due for hygiene appointment</span>
                    </div>
                  )}
                  {getPatientIndicators(selectedPatientId)?.dueForRecall && (
                    <div className="flex items-center text-sm">
                      <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                      <span>Due for recall</span>
                    </div>
                  )}
                  {getPatientIndicators(selectedPatientId) ? (
                    <>
                      {getPatientIndicators(selectedPatientId)!.outstandingBalance > 0 && (
                        <div className="flex items-center text-sm">
                          <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                          <span>Outstanding balance: ${getPatientIndicators(selectedPatientId)!.outstandingBalance.toFixed(2)}</span>
                        </div>
                      )}
                      {getPatientIndicators(selectedPatientId)!.lastVisit && (
                        <div className="flex items-center text-sm">
                          <Icons.Calendar className="w-3.5 h-3.5 mr-1.5 text-gray-500" />
                          <span>Last visit: {new Date(getPatientIndicators(selectedPatientId)!.lastVisit || '').toLocaleDateString()}</span>
                        </div>
                      )}
                    </>
                  ) : null}
                </div>
              </div>
            )}
            
            {/* Conversation history */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {selectedPatientId && getPatientConversationHistory(selectedPatientId).map(msg => (
                <div 
                  key={msg.id} 
                  className={`p-3 rounded-lg max-w-[80%] ${
                    msg.direction === 'inbound' 
                      ? 'bg-gray-100 text-gray-800 self-start' 
                      : 'bg-blue-500 text-white self-end ml-auto'
                  }`}
                >
                  <div className="text-sm">
                    {msg.content}
                  </div>
                  <div className="text-xs mt-1 opacity-70 flex justify-between">
                    <span>{formatDate(msg.timestamp)}</span>
                    <span>{msg.type === 'sms' ? 'SMS' : msg.type === 'call' ? 'Call' : 'Email'}</span>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Notes section */}
            <div className="p-4 border-t border-gray-200">
              <h3 className="text-sm font-medium mb-2">Notes</h3>
              <div className="mb-4 max-h-32 overflow-y-auto">
                {conversationNotes.length === 0 ? (
                  <p className="text-sm text-gray-500 italic">No notes yet</p>
                ) : (
                  <div className="space-y-2">
                    {conversationNotes.map(note => (
                      <div key={note.id} className="p-2 bg-yellow-50 border border-yellow-100 rounded text-sm">
                        <p>{note.content}</p>
                        <div className="text-xs text-gray-500 mt-1">
                          {new Date(note.timestamp).toLocaleString()} - {note.createdBy}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex items-start space-x-2">
                <textarea
                  className="flex-1 p-2 border border-gray-200 rounded text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  placeholder="Add a note..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  rows={2}
                />
                <Button onClick={addNote}>
                  Add
                </Button>
              </div>
            </div>
            
            {/* Send message section */}
            <div className="p-4 border-t border-gray-200">
              <form onSubmit={(e) => {
                e.preventDefault();
                const input = e.currentTarget.querySelector('input') as HTMLInputElement;
                if (input?.value) {
                  handleSendMessage(input.value);
                  input.value = '';
                }
              }}>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    className="flex-1 p-2 border border-gray-200 rounded"
                    placeholder="Type a message..."
                  />
                  <Button type="submit">
                    <Icons.Send className="w-4 h-4" />
                  </Button>
                </div>
              </form>
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center p-4 text-gray-500">
            <div className="text-center">
              <Icons.MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p>Select a conversation to view details</p>
            </div>
          </div>
        )}
      </div>
      
      {/* Dialogs */}
      {selectedCommunication && (
        <>
          <VoiceCallDialog
            isOpen={isCallDialogOpen}
            onClose={() => setIsCallDialogOpen(false)}
            patientPhone={selectedCommunication.patientPhone}
            patientName={selectedCommunication.patientName}
          />
          
          <SMSDialog
            isOpen={isSMSDialogOpen}
            onClose={() => setIsSMSDialogOpen(false)}
            patientPhone={selectedCommunication.patientPhone}
            patientName={selectedCommunication.patientName}
          />
        </>
      )}
    </div>
  );
};

export default CommunicationsDashboard;