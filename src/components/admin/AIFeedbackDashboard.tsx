import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase-client';
import { useAuthContext } from '../../contexts/AuthContext';
import { Badge, Button, Card, Dropdown, Pagination, Spinner } from 'flowbite-react';
import { TextInput } from '../ui/TextInput';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { CheckCircle, Filter, Search, ThumbsDown, ThumbsUp, XCircle } from 'lucide-react';

type AIFeedback = {
  id: string;
  query_id: string;
  response_id: string;
  user_id: string;
  user_role: string;
  agent_type: string;
  was_helpful: boolean | null;
  helpfulness_rating: number | null;
  feedback_type: string;
  feedback_text: string | null;
  corrected_response: string | null;
  model_version: string | null;
  is_validated: boolean;
  created_at: string;
  updated_at: string;
  // Join data
  user_email?: string;
  query_text?: string;
  response_text?: string;
};

/**
 * AI Feedback Dashboard Component for administrators and experts
 * Allows reviewing, filtering and validating AI feedback
 */
export const AIFeedbackDashboard: React.FC = () => {
  const { user } = useAuthContext();
  const [feedbackItems, setFeedbackItems] = useState<AIFeedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    agentType: 'all',
    userRole: 'all',
    feedbackType: 'all',
    isValidated: 'all',
    wasHelpful: 'all',
  });

  const ITEMS_PER_PAGE = 10;

  // Check if user has access to this dashboard
  const hasAccess = 
    user?.role === 'admin' || 
    user?.role === 'expert' || 
    user?.role === 'staff';

  // Fetch feedback data
  useEffect(() => {
    if (!hasAccess) return;
    
    const fetchFeedback = async () => {
      setLoading(true);
      try {
        // Build query with filters
        let query = supabase
          .from('ai_feedback')
          .select(`
            *,
            auth.users!user_id(email)
          `)
          .order('created_at', { ascending: false })
          .range((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE - 1);
        
        // Apply filters
        if (filters.agentType !== 'all') {
          query = query.eq('agent_type', filters.agentType);
        }
        
        if (filters.userRole !== 'all') {
          query = query.eq('user_role', filters.userRole);
        }
        
        if (filters.feedbackType !== 'all') {
          query = query.eq('feedback_type', filters.feedbackType);
        }
        
        if (filters.isValidated !== 'all') {
          query = query.eq('is_validated', filters.isValidated === 'validated');
        }
        
        if (filters.wasHelpful !== 'all') {
          if (filters.wasHelpful === 'helpful') {
            query = query.eq('was_helpful', true);
          } else if (filters.wasHelpful === 'unhelpful') {
            query = query.eq('was_helpful', false);
          }
        }
        
        // Apply search if provided
        if (searchTerm) {
          query = query.or(`feedback_text.ilike.%${searchTerm}%,corrected_response.ilike.%${searchTerm}%`);
        }
        
        const { data, error: fetchError } = await query;
        
        if (fetchError) throw fetchError;
        
        // Get total count for pagination
        const { count, error: countError } = await supabase
          .from('ai_feedback')
          .count();
          
        if (countError) throw countError;
        
        // Format the data
        const formattedData = data.map((item: any) => ({
          ...item,
          user_email: item.auth?.users?.email || 'Unknown',
        }));
        
        setFeedbackItems(formattedData);
        setTotalPages(Math.ceil((count || 0) / ITEMS_PER_PAGE));
      } catch (err) {
        console.error('Error fetching feedback:', err);
        setError('Failed to load feedback data. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchFeedback();
  }, [currentPage, filters, searchTerm, hasAccess]);

  // Validate/invalidate feedback
  const toggleValidation = async (id: string, currentValue: boolean) => {
    try {
      const { error } = await supabase
        .from('ai_feedback')
        .update({ is_validated: !currentValue })
        .eq('id', id);
        
      if (error) throw error;
      
      // Update local state
      setFeedbackItems(prev => 
        prev.map(item => 
          item.id === id 
            ? { ...item, is_validated: !currentValue } 
            : item
        )
      );
    } catch (err) {
      console.error('Error updating validation status:', err);
      setError('Failed to update validation status. Please try again.');
    }
  };

  // Fetch original query and response
  const fetchQueryAndResponse = async (queryId: string, responseId: string, feedbackId: string) => {
    try {
      // This is a placeholder - in a real app, you would fetch the original query and response
      // from wherever they are stored (e.g., conversation history table)
      
      // For demonstration, we'll just update the local state with placeholder text
      setFeedbackItems(prev => 
        prev.map(item => 
          item.id === feedbackId 
            ? { 
                ...item, 
                query_text: 'Original query would be fetched here', 
                response_text: 'Original response would be fetched here' 
              } 
            : item
        )
      );
    } catch (err) {
      console.error('Error fetching query and response:', err);
    }
  };

  // If user doesn't have access
  if (!hasAccess) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-semibold text-red-600">Access Denied</h2>
        <p className="mt-2">You don't have permission to view this dashboard.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">AI Feedback Dashboard</h1>
      
      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <TextInput
            id="search"
            type="text"
            icon={Search}
            placeholder="Search feedback text..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Dropdown label="Agent" icon={Filter}>
            <Dropdown.Item onClick={() => setFilters({...filters, agentType: 'all'})}>
              All Agents
            </Dropdown.Item>
            <Dropdown.Item onClick={() => setFilters({...filters, agentType: 'consultant'})}>
              Consultant
            </Dropdown.Item>
            <Dropdown.Item onClick={() => setFilters({...filters, agentType: 'coding'})}>
              Coding
            </Dropdown.Item>
            <Dropdown.Item onClick={() => setFilters({...filters, agentType: 'treatment'})}>
              Treatment
            </Dropdown.Item>
            <Dropdown.Item onClick={() => setFilters({...filters, agentType: 'lab'})}>
              Lab
            </Dropdown.Item>
          </Dropdown>
          
          <Dropdown label="User Role" icon={Filter}>
            <Dropdown.Item onClick={() => setFilters({...filters, userRole: 'all'})}>
              All Roles
            </Dropdown.Item>
            <Dropdown.Item onClick={() => setFilters({...filters, userRole: 'patient'})}>
              Patient
            </Dropdown.Item>
            <Dropdown.Item onClick={() => setFilters({...filters, userRole: 'staff'})}>
              Staff
            </Dropdown.Item>
            <Dropdown.Item onClick={() => setFilters({...filters, userRole: 'dentist'})}>
              Dentist
            </Dropdown.Item>
            <Dropdown.Item onClick={() => setFilters({...filters, userRole: 'expert'})}>
              Expert
            </Dropdown.Item>
          </Dropdown>
          
          <Dropdown label="Feedback Type" icon={Filter}>
            <Dropdown.Item onClick={() => setFilters({...filters, feedbackType: 'all'})}>
              All Types
            </Dropdown.Item>
            <Dropdown.Item onClick={() => setFilters({...filters, feedbackType: 'thumbs'})}>
              Thumbs
            </Dropdown.Item>
            <Dropdown.Item onClick={() => setFilters({...filters, feedbackType: 'rating'})}>
              Rating
            </Dropdown.Item>
            <Dropdown.Item onClick={() => setFilters({...filters, feedbackType: 'correction'})}>
              Correction
            </Dropdown.Item>
            <Dropdown.Item onClick={() => setFilters({...filters, feedbackType: 'comment'})}>
              Comment
            </Dropdown.Item>
          </Dropdown>
          
          <Dropdown label="Validation" icon={Filter}>
            <Dropdown.Item onClick={() => setFilters({...filters, isValidated: 'all'})}>
              All
            </Dropdown.Item>
            <Dropdown.Item onClick={() => setFilters({...filters, isValidated: 'validated'})}>
              Validated
            </Dropdown.Item>
            <Dropdown.Item onClick={() => setFilters({...filters, isValidated: 'unvalidated'})}>
              Not Validated
            </Dropdown.Item>
          </Dropdown>
          
          <Dropdown label="Helpfulness" icon={Filter}>
            <Dropdown.Item onClick={() => setFilters({...filters, wasHelpful: 'all'})}>
              All
            </Dropdown.Item>
            <Dropdown.Item onClick={() => setFilters({...filters, wasHelpful: 'helpful'})}>
              Helpful
            </Dropdown.Item>
            <Dropdown.Item onClick={() => setFilters({...filters, wasHelpful: 'unhelpful'})}>
              Not Helpful
            </Dropdown.Item>
          </Dropdown>
        </div>
      </div>
      
      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center h-64">
          <Spinner size="xl" />
        </div>
      )}
      
      {/* Error State */}
      {error && (
        <div className="p-4 mb-4 text-red-800 bg-red-100 rounded-lg">
          <p>{error}</p>
          <Button color="failure" className="mt-2" onClick={() => setError(null)}>
            Dismiss
          </Button>
        </div>
      )}
      
      {/* Feedback Items */}
      {!loading && !error && feedbackItems.length === 0 && (
        <div className="text-center p-6 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No feedback items found matching your criteria.</p>
        </div>
      )}
      
      {!loading && !error && feedbackItems.length > 0 && (
        <div className="space-y-4">
          {feedbackItems.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <div className="flex flex-col md:flex-row gap-4 justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge color={item.agent_type === 'consultant' ? 'indigo' : 
                                 item.agent_type === 'coding' ? 'blue' : 
                                 item.agent_type === 'treatment' ? 'green' : 'purple'}>
                      {item.agent_type}
                    </Badge>
                    <Badge color={item.user_role === 'expert' ? 'red' : 
                                 item.user_role === 'dentist' ? 'yellow' : 
                                 item.user_role === 'staff' ? 'green' : 'gray'}>
                      {item.user_role}
                    </Badge>
                    <Badge color={item.is_validated ? 'success' : 'warning'}>
                      {item.is_validated ? 'Validated' : 'Pending Validation'}
                    </Badge>
                    {item.was_helpful !== null && (
                      <Badge color={item.was_helpful ? 'success' : 'failure'} icon={item.was_helpful ? ThumbsUp : ThumbsDown}>
                        {item.was_helpful ? 'Helpful' : 'Not Helpful'}
                      </Badge>
                    )}
                  </div>
                  
                  <p className="text-sm text-gray-500 mb-2">
                    From: {item.user_email} • {new Date(item.created_at).toLocaleString()}
                  </p>
                  
                  {item.feedback_text && (
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold mb-1">Feedback:</h4>
                      <p className="text-sm bg-gray-50 p-3 rounded">{item.feedback_text}</p>
                    </div>
                  )}
                  
                  {item.corrected_response && (
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold mb-1">Corrected Response:</h4>
                      <p className="text-sm bg-gray-50 p-3 rounded">{item.corrected_response}</p>
                    </div>
                  )}
                  
                  {/* Show Query and Response when expanded */}
                  {item.query_text && (
                    <div className="mb-2">
                      <h4 className="text-sm font-semibold mb-1">Original Query:</h4>
                      <p className="text-sm bg-blue-50 p-3 rounded">{item.query_text}</p>
                    </div>
                  )}
                  
                  {item.response_text && (
                    <div>
                      <h4 className="text-sm font-semibold mb-1">AI Response:</h4>
                      <p className="text-sm bg-green-50 p-3 rounded">{item.response_text}</p>
                    </div>
                  )}
                </div>
                
                <div className="flex flex-row md:flex-col gap-2 justify-end">
                  <Button 
                    size="sm" 
                    color={item.is_validated ? "success" : "gray"}
                    onClick={() => toggleValidation(item.id, item.is_validated)}
                  >
                    {item.is_validated ? (
                      <><XCircle className="h-4 w-4 mr-1" /> Invalidate</>
                    ) : (
                      <><CheckCircle className="h-4 w-4 mr-1" /> Validate</>
                    )}
                  </Button>
                  
                  {!item.query_text && (
                    <Button 
                      size="sm" 
                      color="light"
                      onClick={() => fetchQueryAndResponse(item.query_id, item.response_id, item.id)}
                    >
                      <Search className="h-4 w-4 mr-1" /> View Context
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            showIcons
          />
        </div>
      )}
    </div>
  );
};

export default AIFeedbackDashboard;
