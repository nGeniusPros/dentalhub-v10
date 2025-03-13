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
  type: 'sms' | 'call' | 'email' | 'social';
  direction: 'inbound' | 'outbound';
  content: string;
  timestamp: string;
  status: string;
  assignedTo?: string;
  read: boolean;
  audioUrl?: string; // For voice calls with audio recording
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
    read: true,
    audioUrl: '/audio/call-recording-1.mp3'
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
  },
  {
    id: '5',
    patientId: '102',
    patientName: 'Michael Brown',
    patientPhone: '(555) 987-6543',
    patientEmail: 'michael.b@example.com',
    type: 'call',
    direction: 'outbound',
    content: 'Follow-up call about treatment options and insurance coverage',
    timestamp: '2025-03-11T14:25:00',
    status: 'completed',
    read: true,
    audioUrl: '/audio/call-recording-2.mp3'
  },
  {
    id: '6',
    patientId: '104',
    patientName: 'Taylor Wilson',
    patientPhone: '(555) 789-0123',
    patientEmail: 'taylor.w@example.com',
    type: 'social',
    direction: 'inbound',
    content: 'I saw your post about the new whitening service. Do you have any availability next week?',
    timestamp: '2025-03-10T09:12:00',
    status: 'received',
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
  const [newMessage, setNewMessage] = useState<string>('');
  const [activeCompositionTab, setActiveCompositionTab] = useState<'sms' | 'email' | 'facebook' | 'livechat'>('sms');
  const [isAudioPlaying, setIsAudioPlaying] = useState<{[key: string]: boolean}>({});
  // Dialogs state
  const [isCallDialogOpen, setIsCallDialogOpen] = useState<boolean>(false);
  const [isSMSDialogOpen, setIsSMSDialogOpen] = useState<boolean>(false);
  const [showMarkAsClosedButton, setShowMarkAsClosedButton] = useState<boolean>(true);
  
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
  
  // Get a patient's conversation history
  const getPatientConversationHistory = (patientId: string) => {
    return communications.filter(comm => comm.patientId === patientId)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  };
  
  // Get unread count
  const getUnreadCount = () => {
    return communications.filter(comm => !comm.read).length;
  };

  // Toggle audio playback for call recordings
  const toggleAudioPlayback = (communicationId: string) => {
    if (isAudioPlaying[communicationId]) {
      // Stop playing this audio
      setIsAudioPlaying(prev => ({
        ...prev,
        [communicationId]: false
      }));
    } else {
      // Stop any currently playing audio and play this one
      setIsAudioPlaying(prev => {
        const newState = { ...prev };
        // Set all to false
        Object.keys(newState).forEach(key => {
          newState[key] = false;
        });
        // Set this one to true
        newState[communicationId] = true;
        return newState;
      });
    }
  };

  // Handle sending a message based on active tab
  const handleSendComposedMessage = () => {
    if (!newMessage.trim() || !selectedCommunication) return;
    
    const messageType = activeCompositionTab === 'sms' ? 'sms' :
                         activeCompositionTab === 'email' ? 'email' : 'social';
    
    const newMessageObj: CommunicationItem = {
      id: `msg-${Date.now()}`,
      patientId: selectedCommunication.patientId,
      patientName: selectedCommunication.patientName,
      patientPhone: selectedCommunication.patientPhone,
      patientEmail: selectedCommunication.patientEmail,
      type: messageType,
      direction: 'outbound',
      content: newMessage,
      timestamp: new Date().toISOString(),
      status: 'sent',
      read: true
    };
    
    setCommunications(prev => [newMessageObj, ...prev]);
    setNewMessage('');
  };
  
  // Use the showMarkAsClosedButton in the UI
  return (
    <div className="h-full flex flex-col border border-gray-200 rounded-md overflow-hidden">
      {/* 1. Top Categories/Navigation Bar - Area 1 in the image */}
      <div className="border-b border-gray-200 bg-white px-4 py-2">
        <div className="flex items-center">
          <div className="mr-4">
            <Button variant="outline" size="sm" className="h-8">
              <Icons.Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>
          <div className="flex space-x-1 overflow-x-auto hide-scrollbar">
            <Button
              variant={activeFilter === 'all' ? 'primary' : 'ghost'}
              size="sm"
              className="h-8"
              onClick={() => setActiveFilter('all')}
            >
              All Conversations
              <span className="ml-2 bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded-full text-xs">
                {communications.length}
              </span>
            </Button>
            
            <Button
              variant={activeFilter === 'unread' ? 'primary' : 'ghost'}
              size="sm"
              className="h-8"
              onClick={() => setActiveFilter('unread')}
            >
              Unread
              <span className="ml-2 bg-blue-500 text-white px-1.5 py-0.5 rounded-full text-xs">
                {getUnreadCount()}
              </span>
            </Button>
            
            <Button
              variant={activeFilter === 'sms' ? 'primary' : 'ghost'}
              size="sm"
              className="h-8"
              onClick={() => setActiveFilter('sms')}
            >
              SMS
            </Button>
            
            <Button
              variant={activeFilter === 'calls' ? 'primary' : 'ghost'}
              size="sm"
              className="h-8"
              onClick={() => setActiveFilter('calls')}
            >
              Calls
            </Button>
            
            <Button
              variant={activeFilter === 'email' ? 'primary' : 'ghost'}
              size="sm"
              className="h-8"
              onClick={() => setActiveFilter('email')}
            >
              Email
            </Button>
            
            <Button
              variant={activeFilter === 'social' ? 'primary' : 'ghost'}
              size="sm"
              className="h-8"
              onClick={() => setActiveFilter('social')}
            >
              Social
            </Button>
          </div>
          
          <div className="ml-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="w-48 h-8 pl-8 pr-4 py-1 text-sm border border-gray-200 rounded-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Icons.Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - All Conversations (Area 2 in the image) */}
        <div className="w-1/4 border-r border-gray-200 flex flex-col overflow-hidden">
          <div className="p-3 bg-blue-50 border-b border-gray-200">
            <div className="text-sm font-semibold">All Conversations</div>
          </div>
          <div className="flex-1 overflow-y-auto">
            <div className="divide-y divide-gray-200">
              {getFilteredCommunications().map(comm => (
                <div
                  key={comm.id}
                  className={`p-3 cursor-pointer hover:bg-gray-50 ${selectedCommunication?.id === comm.id ? 'bg-blue-50' : ''} ${!comm.read ? 'bg-blue-50/20' : ''}`}
                  onClick={() => selectCommunication(comm)}
                >
                  <div className="flex justify-between mb-1">
                    <div className="font-medium flex items-center">
                      {comm.type === 'sms' && <Icons.MessageSquare className="w-3 h-3 mr-1 text-blue-500" />}
                      {comm.type === 'call' && <Icons.Phone className="w-3 h-3 mr-1 text-green-500" />}
                      {comm.type === 'email' && <Icons.Mail className="w-3 h-3 mr-1 text-purple-500" />}
                      {comm.type === 'social' && <Icons.Share2 className="w-3 h-3 mr-1 text-orange-500" />}
                      <span className="text-sm truncate max-w-[120px]">{comm.patientName}</span>
                      {!comm.read && (
                        <span className="ml-1 w-2 h-2 bg-blue-500 rounded-full"></span>
                      )}
                    </div>
                    <span className="text-xs text-gray-500">{formatDate(comm.timestamp)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600 truncate max-w-[160px]">
                      {comm.content}
                    </p>
                    <div className="flex-shrink-0 flex items-center">
                      {comm.direction === 'inbound' ? (
                        <Icons.ArrowDownLeft className="w-3 h-3 text-blue-500" />
                      ) : (
                        <Icons.ArrowUpRight className="w-3 h-3 text-green-500" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Middle Content - Contains conversation history and composition area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Conversation History (Area 3 in the image) */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 border-b border-gray-200">
            {selectedCommunication ? (
              <div className="h-full">
                <div className="mb-4 flex justify-between items-center">
                  <h3 className="text-sm font-semibold">Conversation History</h3>
                  <div className="flex space-x-2">
                    {showMarkAsClosedButton && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowMarkAsClosedButton(false)}
                      >
                        Mark as Closed
                      </Button>
                    )}
                    <Button variant="outline" size="sm">
                      <Icons.Star className="w-3 h-3 mr-1" />
                      Follow
                    </Button>
                  </div>
                </div>
                
                {selectedPatientId && getPatientConversationHistory(selectedPatientId).map(msg => (
                  <div key={msg.id} className="w-full mb-4">
                    {msg.type === 'call' ? (
                      // Voice call with audio waveform visualization
                      <div className={`rounded-lg p-3 ${msg.direction === 'inbound' ? 'bg-white border border-gray-200' : 'bg-blue-50 border border-blue-200'}`}>
                        <div className="flex items-center mb-2">
                          <Icons.Phone className="w-4 h-4 mr-2 text-green-500" />
                          <span className="text-sm font-medium">{msg.direction === 'inbound' ? 'Incoming Call' : 'Outgoing Call'}</span>
                          <span className="ml-auto text-xs text-gray-500">{formatDate(msg.timestamp)}</span>
                        </div>
                        
                        <div className="mb-2 text-sm">
                          {msg.content}
                        </div>
                        
                        {msg.audioUrl && (
                          <div className="relative p-2 bg-white rounded border border-gray-200">
                            <div className="flex items-center">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 mr-2"
                                onClick={() => toggleAudioPlayback(msg.id)}
                              >
                                {isAudioPlaying[msg.id] ? (
                                  <Icons.Pause className="w-4 h-4" />
                                ) : (
                                  <Icons.Play className="w-4 h-4" />
                                )}
                              </Button>
                              
                              {/* Audio waveform visualization */}
                              <div className="flex-1 h-10 bg-blue-50 rounded relative">
                                <div className="absolute inset-0 px-2 flex items-center">
                                  {Array.from({ length: 40 }).map((_, i) => (
                                    <div
                                      key={i}
                                      className="w-1 mx-px bg-blue-500 rounded-full opacity-50"
                                      style={{
                                        height: `${Math.max(4, Math.sin(i / 2) * 20 + Math.random() * 10)}px`,
                                      }}
                                    />
                                  ))}
                                </div>
                              </div>
                              
                              <span className="ml-2 text-xs text-gray-500">0:00/3:10</span>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      // Regular message (SMS, email, social)
                      <div
                        className={`p-3 rounded-lg max-w-[80%] ${
                          msg.direction === 'inbound'
                            ? 'bg-white border border-gray-200 self-start'
                            : 'bg-blue-500 text-white self-end ml-auto'
                        }`}
                      >
                        <div className="text-sm">
                          {msg.content}
                        </div>
                        <div className="text-xs mt-1 opacity-70 flex justify-between">
                          <span>{formatDate(msg.timestamp)}</span>
                          <span>{msg.type === 'sms' ? 'SMS' : msg.type === 'email' ? 'Email' : msg.type === 'social' ? 'Social' : 'Message'}</span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <Icons.MessagesSquare className="w-12 h-12 mx-auto mb-4 opacity-20" />
                  <p>Select a conversation to view history</p>
                </div>
              </div>
            )}
          </div>
          
          {/* Composition Area (Area 4 in the image) */}
          {selectedCommunication && (
            <div className="p-3 border-t border-gray-200 bg-white">
              <div className="flex items-center mb-2 border-b border-gray-200">
                <button
                  className={`px-3 py-2 text-sm font-medium ${activeCompositionTab === 'sms' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                  onClick={() => setActiveCompositionTab('sms')}
                >
                  <Icons.MessageSquare className="w-4 h-4 inline mr-1" />
                  SMS
                </button>
                <button
                  className={`px-3 py-2 text-sm font-medium ${activeCompositionTab === 'email' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                  onClick={() => setActiveCompositionTab('email')}
                >
                  <Icons.Mail className="w-4 h-4 inline mr-1" />
                  Email
                </button>
                <button
                  className={`px-3 py-2 text-sm font-medium ${activeCompositionTab === 'facebook' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                  onClick={() => setActiveCompositionTab('facebook')}
                >
                  <Icons.Facebook className="w-4 h-4 inline mr-1" />
                  Facebook
                </button>
                <button
                  className={`px-3 py-2 text-sm font-medium ${activeCompositionTab === 'livechat' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                  onClick={() => setActiveCompositionTab('livechat')}
                >
                  <Icons.MessageCircle className="w-4 h-4 inline mr-1" />
                  Live chat
                </button>
                
                <div className="ml-auto">
                  <Button variant="ghost" size="sm">
                    <Icons.FileText className="w-4 h-4 mr-1" />
                    Use Template
                  </Button>
                </div>
              </div>
              
              <div className="flex items-start space-x-2">
                <textarea
                  className="flex-1 p-3 border border-gray-200 rounded text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  placeholder={`Write your message here...`}
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  rows={3}
                />
              </div>
              
              <div className="flex justify-between mt-2">
                <div className="flex space-x-2">
                  <Button variant="ghost" size="sm">
                    <Icons.Paperclip className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Icons.SmilePlus className="w-4 h-4" />
                  </Button>
                </div>
                <Button onClick={handleSendComposedMessage}>
                  Send
                  <Icons.Send className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          )}
        </div>
        
        {/* Right Panel - Contact Information (Area 5 in the image) */}
        <div className="w-1/4 border-l border-gray-200 bg-white overflow-y-auto">
          {selectedCommunication ? (
            <div className="h-full flex flex-col">
              {/* Contact Header with Action button */}
              <div className="p-3 border-b border-gray-200 bg-blue-50 flex justify-between items-center">
                <div>
                  <h2 className="text-base font-semibold">{selectedCommunication.patientName}</h2>
                  <p className="text-xs text-gray-500">General Info</p>
                </div>
                <div>
                  <Button variant="outline" size="sm" className="h-8">
                    Action
                    <Icons.ChevronDown className="w-3 h-3 ml-1" />
                  </Button>
                </div>
              </div>
              
              {/* Contact Details Section */}
              <div className="p-3 border-b border-gray-200">
                <div className="space-y-2">
                  <div>
                    <div className="flex items-center">
                      <Icons.Phone className="w-3 h-3 text-gray-400 mr-2" />
                      <p className="text-sm font-medium">{selectedCommunication.patientPhone}</p>
                    </div>
                    <p className="text-xs text-gray-500 ml-5">Phone Number</p>
                  </div>
                  
                  {selectedCommunication.patientEmail && (
                    <div>
                      <div className="flex items-center">
                        <Icons.Mail className="w-3 h-3 text-gray-400 mr-2" />
                        <p className="text-sm font-medium">{selectedCommunication.patientEmail}</p>
                      </div>
                      <p className="text-xs text-gray-500 ml-5">Email</p>
                    </div>
                  )}
                  
                  <div>
                    <div className="flex items-center">
                      <Icons.Calendar className="w-3 h-3 text-gray-400 mr-2" />
                      <p className="text-sm font-medium">Mar 11, 2025 2:01:30 pm</p>
                    </div>
                    <p className="text-xs text-gray-500 ml-5">Date Created</p>
                  </div>
                  
                  <div>
                    <div className="flex items-center">
                      <Icons.Clock className="w-3 h-3 text-gray-400 mr-2" />
                      <p className="text-sm font-medium">(UTC-08:00) Pacific Time - LA</p>
                    </div>
                    <p className="text-xs text-gray-500 ml-5">Timezone</p>
                  </div>
                  
                  <div className="flex items-center">
                    <label className="inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="relative w-8 h-4 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-blue-600"></div>
                      <span className="ms-2 text-xs text-gray-600">Do not contact</span>
                    </label>
                  </div>
                </div>
              </div>
              
              {/* Expandable Sections */}
              <div className="overflow-y-auto">
                {/* Patient indicators */}
                {selectedPatientId && (
                  <div className="p-3 border-b border-gray-200">
                    <div className="space-y-2">
                      {getPatientIndicators(selectedPatientId)?.dueForHygiene && (
                        <div className="flex items-center text-xs">
                          <span className="w-2 h-2 bg-amber-500 rounded-full mr-2"></span>
                          <span>Due for hygiene appointment</span>
                        </div>
                      )}
                      {getPatientIndicators(selectedPatientId)?.dueForRecall && (
                        <div className="flex items-center text-xs">
                          <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                          <span>Due for recall</span>
                        </div>
                      )}
                      {getPatientIndicators(selectedPatientId) ? (
                        <>
                          {getPatientIndicators(selectedPatientId)!.outstandingBalance > 0 && (
                            <div className="flex items-center text-xs">
                              <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                              <span>Outstanding balance: ${getPatientIndicators(selectedPatientId)!.outstandingBalance.toFixed(2)}</span>
                            </div>
                          )}
                          {getPatientIndicators(selectedPatientId)!.lastVisit && (
                            <div className="flex items-center text-xs">
                              <Icons.Calendar className="w-3 h-3 mr-1.5 text-gray-500" />
                              <span>Last visit: {new Date(getPatientIndicators(selectedPatientId)!.lastVisit || '').toLocaleDateString()}</span>
                            </div>
                          )}
                        </>
                      ) : null}
                    </div>
                  </div>
                )}
                
                {/* Quick Actions */}
                <div className="p-3 border-b border-gray-200">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-xs font-medium text-gray-500 uppercase">Quick Actions</h3>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => setIsCallDialogOpen(true)}
                    >
                      <Icons.Phone className="w-3 h-3 mr-1" />
                      Call
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => setIsSMSDialogOpen(true)}
                    >
                      <Icons.MessageSquare className="w-3 h-3 mr-1" />
                      SMS
                    </Button>
                  </div>
                </div>
                
                {/* Information Accordion Sections */}
                <div className="divide-y divide-gray-200">
                  {['Opportunities', 'Campaign Info', 'WooSender Number', 'WooAI', 'Custom Info', 'Notes', 'Tasks', 'Appointments'].map((section) => (
                    <div key={section} className="p-3">
                      <button className="flex items-center justify-between w-full text-left">
                        <h3 className="text-xs font-medium text-gray-500 uppercase">{section}</h3>
                        <Icons.ChevronRight className="w-3 h-3 text-gray-400" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center p-4 text-gray-500">
              <div className="text-center">
                <Icons.User className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p>Select a conversation to view contact details</p>
              </div>
            </div>
          )}
        </div>
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