import React, { useState, useRef, useEffect } from 'react';
import { useOrchestrator } from '../../hooks/useOrchestrator';
import type { Recommendation } from '../../ai/recommendation/recommendation.agent';
import type { KPIAnalysis } from '../../ai/data-analysis/data-analysis.agent';
import type { LabCaseAnalysis } from '../../ai/lab-case-manager/lab-case-manager.agent';
import { DentalHubAvatar } from '../ui/DentalHubAvatar';
import { useAuthContext } from '../../contexts/AuthContext';
import AIResponseFeedback from './AIResponseFeedback';
import { useAIFeedback } from '../../hooks/useAIFeedback';
import { useAIConsultant } from '../../hooks/use-ai-consultant';
import type { AIConsultantPrompt } from '../../lib/types/ai';
import { motion, AnimatePresence } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Button } from '../ui/button';
import { v4 as uuidv4 } from 'uuid';
import { withAIFeedback } from '../../utils/integrateAIFeedback';
import { AGENT_TYPES, FEEDBACK_CONTEXTS, USER_ROLES } from '../../constants/ai-agents';

/**
 * AI Consultant Chat Component
 * Provides a chat interface for interacting with the AI orchestrator
 */
export const AIConsultantChat: React.FC = () => {
  const [question, setQuestion] = useState('');
  // Define types for chat messages and sections
  type SectionContent =
    | string
    | KPIAnalysis
    | Recommendation[]
    | LabCaseAnalysis;
    
  type ChatSection = {
    type: string;
    title: string;
    content: SectionContent;
  };
  
  type ChatMessage = {
    id: string;
    type: 'user' | 'ai';
    content: string;
    timestamp: Date;
    sections?: ChatSection[];
    feedbackSubmitted?: boolean;
  };
  
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  
  const { askOrchestrator, loading, error, response } = useOrchestrator();
  const { submitFeedback } = useAIFeedback();
  const { user } = useAuthContext();
  const endOfMessagesRef = useRef<HTMLDivElement>(null);
  
  // AI consultant data
  const aiConsultant = {
    id: 'ai-consultant',
    name: 'AI Dental Consultant',
    avatarId: 3 // Using a specific avatar from the set
  };
  
  // Scroll to bottom of chat when new messages arrive
  useEffect(() => {
    if (endOfMessagesRef.current) {
      endOfMessagesRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory]);
  
  // Add response to chat history when it arrives
  useEffect(() => {
    if (response) {
      setChatHistory(prev => [
        ...prev,
        {
          id: uuidv4(),
          type: 'ai',
          content: response.answer,
          timestamp: new Date(),
          sections: response.sections,
          feedbackSubmitted: false
        }
      ]);
    }
  }, [response]);

  /**
   * Handle asking a question to the AI
   */
  const handleAsk = async () => {
    if (!question.trim() || loading) return;
    
    // Add user question to chat history
    setChatHistory(prev => [
      ...prev,
      {
        id: uuidv4(),
        type: 'user',
        content: question,
        timestamp: new Date()
      }
    ]);
    
    // Call the AI orchestrator
    await askOrchestrator(question);
    
    // Clear the input
    setQuestion('');
  };

  /**
   * Handle pressing Enter to submit
   */
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAsk();
    }
  };

  /**
   * Handle AI response feedback submission
   */
  const handleFeedbackSubmit = (messageId: string, feedbackData: {
    wasHelpful?: boolean;
    feedbackType: 'thumbs' | 'rating' | 'correction' | 'comment';
    feedbackText?: string;
  }) => {
    // Find the message in chat history
    const message = chatHistory.find(msg => msg.id === messageId);
    if (!message) return;

    // Find the previous user message (the query)
    const messageIndex = chatHistory.findIndex(msg => msg.id === messageId);
    const queryMessage = messageIndex > 0 ? chatHistory[messageIndex - 1] : null;
    
    // Submit feedback to Supabase
    submitFeedback({
      queryId: queryMessage?.id || 'unknown',
      responseId: messageId,
      userRole: user?.role || 'user',
      agentType: 'consultant',
      wasHelpful: feedbackData.wasHelpful,
      feedbackType: feedbackData.feedbackType,
      feedbackText: feedbackData.feedbackText,
      modelVersion: 'v1.0' // This would come from the AI service in a production environment
    });
    
    // Mark the message as having received feedback
    setChatHistory(prev => 
      prev.map(msg => 
        msg.id === messageId 
          ? { ...msg, feedbackSubmitted: true }
          : msg
      )
    );
  };

  /**
   * Render a recommendations section
   */
  const renderRecommendations = (recommendations: Recommendation[]) => (
    <div className="bg-blue-50 p-4 rounded-md my-2">
      <h3 className="font-semibold text-blue-800 mb-2">Recommendations</h3>
      {recommendations.map((rec, index) => (
        <div key={index} className="mb-3 pb-3 border-b border-blue-100 last:border-0">
          <div className="flex items-center">
            <span className="bg-blue-700 text-white text-xs px-2 py-1 rounded mr-2">{rec.priority}</span>
            <h4 className="font-medium">{rec.title}</h4>
          </div>
          <p className="text-sm mt-1">{rec.description}</p>
          <div className="mt-2">
            <h5 className="text-xs font-semibold text-gray-500">Action Items:</h5>
            <ul className="list-disc pl-5 text-xs">
              {rec.actionItems.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );

  /**
   * Render a KPI analysis section
   */
  const renderKPIAnalysis = (analysis: KPIAnalysis) => (
    <div className="bg-green-50 p-4 rounded-md my-2">
      <h3 className="font-semibold text-green-800 mb-2">KPI Analysis</h3>
      <p className="text-sm whitespace-pre-wrap">{analysis.summary}</p>
      
      <div className="mt-3 grid grid-cols-2 gap-2">
        {Object.entries(analysis.metrics).map(([key, data]) => (
          <div key={key} className={`p-2 rounded ${data.status === 'on-target' ? 'bg-green-100' : 'bg-yellow-100'}`}>
            <div className="text-xs font-semibold">{key}</div>
            <div className="text-sm">{data.actual} / {data.goal}</div>
            <div className="text-xs">{data.performance.toFixed(1)}%</div>
          </div>
        ))}
      </div>
    </div>
  );

  /**
   * Render a lab case analysis section
   */
  const renderLabCaseAnalysis = (labData: LabCaseAnalysis) => (
    <div className="bg-purple-50 p-4 rounded-md my-2">
      <h3 className="font-semibold text-purple-800 mb-2">Lab Case Analysis</h3>
      <p className="text-sm whitespace-pre-wrap">{labData.summary}</p>
      
      {labData.pendingTasks.length > 0 && (
        <div className="mt-3">
          <h4 className="text-xs font-semibold">Pending Tasks</h4>
          <div className="mt-1 max-h-40 overflow-y-auto">
            {labData.pendingTasks.map((task, index) => (
              <div key={index} className="text-xs p-2 mb-1 rounded bg-white flex items-center">
                <span className={`px-1 py-0.5 rounded mr-2 ${
                  task.priority === 'high' ? 'bg-red-100 text-red-800' : 
                  task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' : 
                  'bg-blue-100 text-blue-800'
                }`}>
                  {task.priority}
                </span>
                <span>{task.description}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  /**
   * Render response section based on type
   */
  const renderSection = (type: string, content: SectionContent) => {
    switch (type) {
      case 'recommendations':
        return renderRecommendations(content as Recommendation[]);
      case 'kpi-analysis':
        return renderKPIAnalysis(content as KPIAnalysis);
      case 'lab-cases':
        return renderLabCaseAnalysis(content as LabCaseAnalysis);
      case 'deep-seek-context':
        return (
          <div className="bg-gray-50 p-4 rounded-md my-2">
            <h3 className="font-semibold text-gray-800 mb-2">Additional Context</h3>
            <p className="text-sm whitespace-pre-wrap">{content as string}</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="border-b p-4 flex items-center">
        <DentalHubAvatar
          userId={aiConsultant.id}
          name={aiConsultant.name}
          avatarId={aiConsultant.avatarId}
          size="sm"
          theme="gradient"
          className="mr-3"
        />
        <div>
          <h2 className="font-medium">{aiConsultant.name}</h2>
          <p className="text-xs text-gray-500">Dental Practice Intelligence</p>
        </div>
      </div>
      
      <div className="flex-grow overflow-y-auto p-4 bg-gray-50">
        {chatHistory.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-400">
            <div className="bg-white p-6 rounded-lg shadow-sm max-w-md text-center">
              <DentalHubAvatar
                userId={aiConsultant.id}
                name={aiConsultant.name}
                avatarId={aiConsultant.avatarId}
                size="lg"
                theme="gradient"
                className="mx-auto mb-4"
              />
              <h3 className="font-semibold text-gray-700 mb-2">AI Dental Consultant</h3>
              <p className="text-sm">
                I can help with practice analytics, patient insights, and dental business recommendations.
                Ask me anything about your practice performance.
              </p>
            </div>
          </div>
        ) : (
          chatHistory.map((msg, index) => (
            <div key={index} className={`mb-4 ${msg.type === 'user' ? 'flex justify-end' : 'flex justify-start'}`}>
              {msg.type === 'ai' && (
                <DentalHubAvatar
                  userId={aiConsultant.id}
                  name={aiConsultant.name}
                  avatarId={aiConsultant.avatarId}
                  size="sm"
                  theme="simple"
                  className="mr-2 mt-1 flex-shrink-0"
                />
              )}
              <div className="max-w-3/4">
                <div className={`p-3 rounded-lg ${
                  msg.type === 'user' 
                    ? 'bg-navy text-white' 
                    : 'bg-white border border-gray-200'
                }`}>
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>
                
                {/* Render specialized content sections for AI responses */}
                {msg.type === 'ai' && msg.sections && (
                  <div className="mt-2">
                    {msg.sections.map((section, i) => (
                      <div key={i}>
                        {renderSection(section.type, section.content)}
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Add feedback component for AI messages */}
                {msg.type === 'ai' && !msg.feedbackSubmitted && (
                  <AIResponseFeedback
                    queryId={chatHistory.length > 1 ? chatHistory[index-1].id : 'unknown'}
                    responseId={msg.id}
                    agentType="consultant"
                    onFeedbackSubmit={(data) => handleFeedbackSubmit(msg.id, data)}
                    userRole={user?.role || 'user'}
                  />
                )}
                
                <div className={`text-xs text-gray-500 mt-1 ${msg.type === 'user' ? 'text-right' : 'text-left'}`}>
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
              {msg.type === 'user' && (
                <DentalHubAvatar
                  userId={user?.id}
                  name={user?.name}
                  size="sm"
                  theme="simple"
                  className="ml-2 mt-1 flex-shrink-0"
                />
              )}
            </div>
          ))
        )}
        <div ref={endOfMessagesRef} />
      </div>
      
      {/* Error display */}
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 mx-4 mb-2">
          <p className="text-sm">{error}</p>
        </div>
      )}
      
      {/* Input area */}
      <div className="border-t p-4">
        <div className="flex items-center">
          <textarea
            className="flex-grow border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ask about KPIs, lab cases, or practice recommendations..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyPress={handleKeyPress}
            rows={2}
            disabled={loading}
          />
          <button
            className={`ml-2 px-4 py-2 rounded-lg ${
              loading 
                ? 'bg-gray-300 cursor-not-allowed' 
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
            onClick={handleAsk}
            disabled={loading}
          >
            {loading ? 'Thinking...' : 'Ask'}
          </button>
        </div>
        <div className="text-xs text-gray-500 mt-1">
          Press Enter to submit, Shift+Enter for new line
        </div>
      </div>
    </div>
  );
};

// Export the AIConsultantChat component as default
export default AIConsultantChat;

/**
 * AI SDR Agent Chat Component
 * Provides a chat interface for interacting with the AI Sales Development Rep
 */
export const AISDRAgentChat: React.FC<{ selectedQuestion?: string }> = ({ selectedQuestion }) => {
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([]);
  const { generateInsight, loading, error } = useAIConsultant();
  // Generate a unique ID for this AI response session
  const responseId = React.useMemo(() => uuidv4(), []);

  useEffect(() => {
    if (selectedQuestion) {
      setQuestion(selectedQuestion);
    }
  }, [selectedQuestion]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    // Add user message
    setMessages((prev) => [...prev, { role: 'user', content: question }]);

    // Customize the metrics for an SDR context
    const prompt: AIConsultantPrompt = {
      metrics: {
        monthlyRevenue: 150000,
        patientCount: 350,
        appointmentFillRate: 85,
        treatmentAcceptance: 72,
      },
      focusArea: 'sales', 
      question,
      responseId, // Include responseId for tracking
    };

    const insight = await generateInsight(prompt);
    if (insight) {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: insight.description },
      ]);
    }
    setQuestion('');
  };

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-glow transition-shadow h-[600px] flex flex-col">
      <div className="p-4 border-b border-gray-light bg-gradient-to-r from-navy to-navy-light text-white rounded-t-xl">
        <div className="flex items-center gap-3">
          <img 
            src="/avatars/avatar style 2/avatar-4.png" 
            alt="SDR Agent" 
            className="w-10 h-10 object-cover rounded-full bg-white p-1"
          />
          <div>
            <h3 className="font-semibold">SDR Agent</h3>
            <p className="text-sm opacity-80">
              Ask me anything about lead generation & sales outreach
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((msg, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-lg ${
                  msg.role === 'user'
                    ? 'bg-navy text-white ml-4'
                    : 'bg-gray-lighter text-gray-darker mr-4'
                }`}
              >
                {msg.content}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-light">
        <div className="relative">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask the SDR agent about leads, sales, etc..."
            className="w-full px-4 py-2 pr-12 border border-gray-light rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent"
            disabled={loading}
          />
          <Button
            type="submit"
            disabled={loading}
            className="absolute right-2 top-1/2 -translate-y-1/2 !p-1 hover:bg-gray-lighter"
          >
            {loading ? (
              <Icons.Loader2 className="w-5 h-5 animate-spin text-navy" />
            ) : (
              <Icons.Send className="w-5 h-5 text-navy" />
            )}
          </Button>
        </div>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </form>
      
      {/* Add feedback UI at the bottom of agent */}
      <div className="px-4 pb-4">
        <AIResponseFeedback
          responseId={responseId}
          agentType={AGENT_TYPES.ASSISTANT}
          feedbackContext={FEEDBACK_CONTEXTS.ADMINISTRATIVE}
          userRole={USER_ROLES.DENTIST}
        />
      </div>
    </div>
  );
};

/**
 * AI Marketing Manager Chat Component
 * Provides a chat interface for interacting with the AI Marketing Manager
 */
export const AIMarketingManagerChat: React.FC<{ selectedQuestion?: string }> = ({
  selectedQuestion,
}) => {
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>(
    []
  );
  const { generateInsight, loading, error } = useAIConsultant();
  // Generate a unique ID for this AI response session
  const responseId = React.useMemo(() => uuidv4(), []);

  useEffect(() => {
    if (selectedQuestion) {
      setQuestion(selectedQuestion);
    }
  }, [selectedQuestion]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    setMessages((prev) => [...prev, { role: 'user', content: question }]);

    // Example marketing-focused prompt with required metrics
    const prompt: AIConsultantPrompt = {
      metrics: {
        monthlyRevenue: 200000,
        patientCount: 450,
        appointmentFillRate: 82,
        treatmentAcceptance: 75,
      },
      focusArea: 'marketing',
      question,
      responseId, // Include responseId for tracking
    };

    const insight = await generateInsight(prompt);
    if (insight) {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: insight.description },
      ]);
    }
    setQuestion('');
  };

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-glow transition-shadow h-[600px] flex flex-col">
      <div className="p-4 border-b border-gray-light bg-gradient-to-r from-turquoise to-light-turquoise text-navy rounded-t-xl">
        <div className="flex items-center gap-3">
          <img 
            src="/avatars/avatar style 2/avatar-7.png" 
            alt="Marketing Manager Agent" 
            className="w-10 h-10 object-cover rounded-full bg-white p-1"
          />
          <div>
            <h3 className="font-semibold">Marketing Manager Agent</h3>
            <p className="text-sm opacity-80">
              Ask about campaigns, ROI, brand awareness, etc.
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((msg, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`flex ${
                msg.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-lg ${
                  msg.role === 'user'
                    ? 'bg-turquoise text-navy ml-4'
                    : 'bg-gray-lighter text-gray-darker mr-4'
                }`}
              >
                {msg.content}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-light">
        <div className="relative">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask about marketing strategies..."
            className="w-full px-4 py-2 pr-12 border border-gray-light rounded-lg focus:ring-2 focus:ring-turquoise focus:border-transparent"
            disabled={loading}
          />
          <Button
            type="submit"
            disabled={loading}
            className="absolute right-2 top-1/2 -translate-y-1/2 !p-1 hover:bg-gray-lighter"
          >
            {loading ? (
              <Icons.Loader2 className="w-5 h-5 animate-spin text-turquoise" />
            ) : (
              <Icons.Send className="w-5 h-5 text-turquoise" />
            )}
          </Button>
        </div>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </form>
      
      {/* Add feedback UI at the bottom of agent */}
      <div className="px-4 pb-4">
        <AIResponseFeedback
          responseId={responseId}
          agentType={AGENT_TYPES.ASSISTANT}
          feedbackContext={FEEDBACK_CONTEXTS.ADMINISTRATIVE}
          userRole={USER_ROLES.DENTIST}
        />
      </div>
    </div>
  );
};

/**
 * AI Social Media Manager Chat Component
 * Provides a chat interface for interacting with the AI Social Media Manager
 */
export const AISocialMediaManagerChat: React.FC<{ selectedQuestion?: string }> = ({
  selectedQuestion,
}) => {
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>(
    []
  );
  const { generateInsight, loading, error } = useAIConsultant();
  // Generate a unique ID for this AI response session
  const responseId = React.useMemo(() => uuidv4(), []);

  useEffect(() => {
    if (selectedQuestion) {
      setQuestion(selectedQuestion);
    }
  }, [selectedQuestion]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    setMessages((prev) => [...prev, { role: 'user', content: question }]);

    // Example social-media-focused prompt with required metrics
    const prompt: AIConsultantPrompt = {
      metrics: {
        monthlyRevenue: 175000,
        patientCount: 400,
        appointmentFillRate: 78,
        treatmentAcceptance: 68,
      },
      focusArea: 'social_media',
      question,
      responseId, // Include responseId for tracking
    };

    const insight = await generateInsight(prompt);
    if (insight) {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: insight.description },
      ]);
    }
    setQuestion('');
  };

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-glow transition-shadow h-[600px] flex flex-col">
      <div className="p-4 border-b border-gray-light bg-gradient-to-r from-purple to-light-purple text-white rounded-t-xl">
        <div className="flex items-center gap-3">
          <img 
            src="/avatars/avatar style 2/avatar-10.png" 
            alt="Social Media Manager Agent" 
            className="w-10 h-10 object-cover rounded-full bg-white p-1"
          />
          <div>
            <h3 className="font-semibold">Social Media Manager Agent</h3>
            <p className="text-sm opacity-80">
              Ask me anything about social media campaigns, analytics, engagement...
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((msg, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`flex ${
                msg.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-lg ${
                  msg.role === 'user'
                    ? 'bg-purple text-white ml-4'
                    : 'bg-gray-lighter text-gray-darker mr-4'
                }`}
              >
                {msg.content}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-light">
        <div className="relative">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask about social media marketing..."
            className="w-full px-4 py-2 pr-12 border border-gray-light rounded-lg focus:ring-2 focus:ring-purple focus:border-transparent"
            disabled={loading}
          />
          <Button
            type="submit"
            disabled={loading}
            className="absolute right-2 top-1/2 -translate-y-1/2 !p-1 hover:bg-gray-lighter"
          >
            {loading ? (
              <Icons.Loader2 className="w-5 h-5 animate-spin text-purple" />
            ) : (
              <Icons.Send className="w-5 h-5 text-purple" />
            )}
          </Button>
        </div>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </form>
      
      {/* Add feedback UI at the bottom of agent */}
      <div className="px-4 pb-4">
        <AIResponseFeedback
          responseId={responseId}
          agentType={AGENT_TYPES.ASSISTANT}
          feedbackContext={FEEDBACK_CONTEXTS.ADMINISTRATIVE}
          userRole={USER_ROLES.DENTIST}
        />
      </div>
    </div>
  );
};