// NOTE: This file now removes all 3D/Spline integrations for a simpler UI design

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Button } from '../../components/ui/button';
import { useAIConsultant } from '../../hooks/use-ai-consultant';
import type { AIConsultantPrompt } from '../../lib/types/ai';
import ConversationStarter from '../../components/ai/ConversationStarter';
import AgentCard from '../../components/ai/AgentCard';
import { DentalHubAvatar } from '../../components/ui/DentalHubAvatar';
import PracticeInsightScene from '../../components/ai/PracticeInsightScene';
import { 
  AIFeedbackDashboard, 
  AIConsultantChat, 
  AIResponseFeedback,
  AISDRAgentChat, 
  AIMarketingManagerChat, 
  AISocialMediaManagerChat 
} from '../../components/ai';
import { v4 as uuidv4 } from 'uuid';
import { AGENT_TYPES, FEEDBACK_CONTEXTS, USER_ROLES } from '../../constants/ai-agents';

// We keep the ErrorBoundary to catch rendering errors in this page
class ErrorBoundary extends React.Component<{ fallback?: React.ReactNode; children?: React.ReactNode }, { hasError: boolean }> {
  constructor(props: { fallback?: React.ReactNode; children?: React.ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(/* error */): { hasError: boolean } {
    return { hasError: true }
  }

  componentDidCatch() {
    console.error("ErrorBoundary caught an error")
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || <div className="p-6 text-center">Something went wrong.</div>
    }
    return this.props.children
  }
}

// Local chat component with unique name
export function LocalHeadOrchestratorChat({ selectedQuestion, title, description }: { selectedQuestion?: string, title?: string, description?: string }) {
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([]);
  const { generateInsight, loading, error } = useAIConsultant();
  // Generate a unique ID for this AI response session
  const responseId = useMemo(() => uuidv4(), []);

  const [question, setQuestion] = useState(selectedQuestion || '');

  React.useEffect(() => {
    if (selectedQuestion) {
      setQuestion(selectedQuestion);
    }
  }, [selectedQuestion]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!question.trim()) return;

    setMessages((prev) => [...prev, { role: 'user', content: question }]);

    const prompt: AIConsultantPrompt = {
      metrics: {
        monthlyRevenue: 150000,
        patientCount: 1200,
        appointmentFillRate: 75,
        treatmentAcceptance: 65,
      },
      // @ts-expect-error - Adding head-orchestrator focus area
      focusArea: 'head-orchestrator',
      question: question,
      dateRange: { start: "2023-01-01", end: "2023-12-31" },
      responseId: responseId, // Include responseId for tracking
    };

    try {
      const result = await generateInsight(prompt);
      setMessages((prev) => [...prev, { role: 'assistant', content: result }]);
    } catch (err) {
      console.error(err);
    } finally {
      setQuestion('');
    }
  }

  return (
    <div className="border border-gray-200 bg-white rounded-lg shadow-sm overflow-hidden flex flex-col h-[400px]">
      <div className="bg-navy-default p-4 text-white">
        <div className="flex items-center">
          <DentalHubAvatar 
            size="md"
            theme="gradient"
            userId={title}
            name={title || "AI Consultant"}
            className="mr-3"
          />
          <div>
            <h3 className="font-semibold">{title || "AI Consultant"}</h3>
            <p className="text-sm opacity-80">{description || "Ask any practice question to our AI orchestrator"}</p>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4 relative">
        <AnimatePresence>
          {messages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.role === 'assistant' && (
                <DentalHubAvatar
                  size="sm"
                  theme="gradient"
                  userId={title}
                  name={title || "AI Consultant"}
                  className="mr-2 flex-shrink-0 mt-1"
                />
              )}
              <div
                className={`max-w-[80%] p-3 rounded-lg ${
                  message.role === 'user'
                    ? 'bg-navy hover:bg-navy-light text-white ml-4'
                    : 'bg-gray-lighter text-gray-darker mr-4'
                }`}
              >
                <p>{message.content}</p>
              </div>
              {message.role === 'user' && (
                <DentalHubAvatar
                  size="sm"
                  theme="navy"
                  userId="current-user"
                  name="You"
                  className="ml-2 flex-shrink-0 mt-1"
                />
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {loading && (
          <div className="flex justify-start">
            <div className="flex items-center space-x-2 bg-gray-lighter p-3 rounded-lg">
              <div className="w-2 h-2 bg-navy rounded-full animate-pulse delay-100"></div>
              <div className="w-2 h-2 bg-navy rounded-full animate-pulse delay-200"></div>
              <div className="w-2 h-2 bg-navy rounded-full animate-pulse delay-300"></div>
            </div>
          </div>
        )}

        {error && (
          <div className="text-red-500 p-3 bg-red-50 rounded-lg">
            There was an error processing your request. Please try again.
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200">
        <div className="relative">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask about your practice performance..."
            className="w-full px-4 py-2 pr-12 border border-gray-200 rounded-lg focus:ring-2 focus:ring-navy/20 focus:border-navy"
            disabled={loading}
          />
          <button
            type="submit"
            className="absolute right-1 top-1 bg-navy-default hover:bg-navy-light text-white rounded-lg p-2"
            disabled={loading}
          >
            <Icons.Send size={16} className="text-current" />
          </button>
        </div>
      </form>

      {/* Add feedback UI for agent responses */}
      {messages.length > 0 && !loading && (
        <div className="px-2 py-1 border-t border-gray-200">
          <AIResponseFeedback
            responseId={responseId}
            agentType={AGENT_TYPES.ASSISTANT}
            feedbackContext={FEEDBACK_CONTEXTS.ADMINISTRATIVE}
            userRole={USER_ROLES.DENTIST}
            compact={true}
            showCommentField={true}
          />
        </div>
      )}
    </div>
  );
}

// Special chat component for agent cards with smaller height
export function AgentHeadOrchestratorChat({ 
  selectedQuestion, 
  title, 
  description, 
  responseId: externalResponseId,
  onResponseReceived
}: { 
  selectedQuestion?: string, 
  title?: string, 
  description?: string, 
  responseId?: string,
  onResponseReceived?: () => void
}) {
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([]);
  const { generateInsight, loading, error } = useAIConsultant();
  // Use external responseId if provided, otherwise generate a new one
  const responseId = React.useMemo(() => externalResponseId || uuidv4(), [externalResponseId]);
  // Track if we have received at least one response
  const [hasReceivedResponse, setHasReceivedResponse] = useState(false);

  const [question, setQuestion] = useState(selectedQuestion || '');

  React.useEffect(() => {
    if (selectedQuestion) {
      setQuestion(selectedQuestion);
    }
  }, [selectedQuestion]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!question.trim()) return;

    setMessages((prev) => [...prev, { role: 'user', content: question }]);

    const prompt: AIConsultantPrompt = {
      metrics: {
        monthlyRevenue: 150000,
        patientCount: 1200,
        appointmentFillRate: 75,
        treatmentAcceptance: 65,
      },
      // @ts-expect-error - Adding head-orchestrator focus area
      focusArea: 'head-orchestrator',
      question: question,
      dateRange: { start: "2023-01-01", end: "2023-12-31" },
      responseId: responseId, // Include responseId for tracking
    };

    try {
      const result = await generateInsight(prompt);
      setMessages((prev) => [...prev, { role: 'assistant', content: result }]);
      setHasReceivedResponse(true);
      onResponseReceived?.();
    } catch (err) {
      console.error(err);
    } finally {
      setQuestion('');
    }
  }

  return (
    <div className="border border-gray-200 bg-white rounded-lg shadow-sm overflow-hidden flex flex-col h-[180px]">
      <div className="flex-1 overflow-y-auto p-2 space-y-2 relative">
        <AnimatePresence>
          {messages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.role === 'assistant' && (
                <DentalHubAvatar
                  size="xs"
                  theme="gradient"
                  userId={title}
                  name={title || "AI Consultant"}
                  className="mr-1 flex-shrink-0 mt-1"
                />
              )}
              <div
                className={`max-w-[85%] p-2 text-sm rounded-lg ${
                  message.role === 'user'
                    ? 'bg-navy hover:bg-navy-light text-white ml-2'
                    : 'bg-gray-lighter text-gray-darker mr-2'
                }`}
              >
                <p>{message.content}</p>
              </div>
              {message.role === 'user' && (
                <DentalHubAvatar
                  size="xs"
                  theme="navy"
                  userId="current-user"
                  name="You"
                  className="ml-1 flex-shrink-0 mt-1"
                />
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {loading && (
          <div className="flex justify-start">
            <div className="flex items-center space-x-1 bg-gray-lighter p-2 rounded-lg">
              <div className="w-1.5 h-1.5 bg-navy rounded-full animate-pulse delay-100"></div>
              <div className="w-1.5 h-1.5 bg-navy rounded-full animate-pulse delay-200"></div>
              <div className="w-1.5 h-1.5 bg-navy rounded-full animate-pulse delay-300"></div>
            </div>
          </div>
        )}

        {error && (
          <div className="text-red-500 p-2 bg-red-50 rounded-lg text-xs">
            Error. Please try again.
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="p-2 border-t border-gray-200">
        <div className="relative">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask a question..."
            className="w-full px-3 py-1 pr-8 text-sm border border-gray-200 rounded-lg focus:ring-1 focus:ring-navy/20 focus:border-navy"
            disabled={loading}
          />
          <button
            type="submit"
            className="absolute right-1 top-1 bg-navy-default hover:bg-navy-light text-white rounded-lg p-1"
            disabled={loading}
          >
            <Icons.Send size={12} className="text-current" />
          </button>
        </div>
      </form>
      
      {/* Add feedback UI for agent responses */}
      {messages.length > 0 && !loading && hasReceivedResponse && (
        <div className="px-2 py-1 border-t border-gray-200">
          <AIResponseFeedback
            responseId={responseId}
            agentType={AGENT_TYPES.ASSISTANT}
            feedbackContext={FEEDBACK_CONTEXTS.ADMINISTRATIVE}
            userRole={USER_ROLES.DENTIST}
            compact={true}
            showCommentField={true}
          />
        </div>
      )}
    </div>
  );
}

// Main orchestrator and specialized agents
const SUB_AGENTS = [
  {
    id: 'head-orchestrator',
    title: 'Head Brain Consultant',
    description: 'Coordinates between specialized agents for complete practice insights.',
    image: '/illustrations/characters-with-objects/1.png',
    questions: [
      "Show me the production per hour for last month",
      "What's our hygiene productivity trend over the past quarter?",
      "Compare treatment acceptance rates between January and March",
      "Analyze schedule optimization percentage for Q1 2024",
      "Show me last month's production numbers",
      "Pull up today's schedule",
      "Get the collection rate for this quarter"
    ],
  },
  {
    id: 'data-retrieval',
    title: 'Data Retrieval Agent',
    description: 'Fetches raw data: production, schedules, AR, etc.',
    image: '/illustrations/characters-with-objects/2.png',
    questions: [
      "Show me last month's production numbers",
      "Pull up today's schedule",
      "Get the collection rate for this quarter",
      "How many new patients did we have this month?",
      "Show me hygiene production for each hygienist",
      "What's our current accounts receivable?",
      "Get me the treatment acceptance rate for Dr. Smith"
    ],
  },
  {
    id: 'data-analysis',
    title: 'Data Analysis Agent',
    description: 'Analyzes KPI trends, identifies patterns and correlations.',
    image: '/illustrations/characters-with-objects/3.png',
    questions: [
      "Compare our performance to last year",
      "Are we meeting our production goals?",
      "Why is revenue down this month?",
      "Show me trends in patient cancellations",
      "Which procedures are most profitable?",
      "How efficient is our hygiene department?",
      "What's causing our schedule gaps?"
    ],
  },
  {
    id: 'recommendation',
    title: 'Recommendation Agent',
    description: 'Provides actionable recommendations based on practice data.',
    image: '/illustrations/characters-with-objects/4.png',
    questions: [
      "How can we increase production?",
      "What should we do about cancellations?",
      "Give me ideas to improve case acceptance",
      "Help me optimize the schedule",
      "How can we reduce no-shows?",
      "What's the best way to handle insurance delays?",
      "How can we grow our new patient numbers?"
    ],
  },
  {
    id: 'lab-case-manager',
    title: 'Lab Case Manager Agent',
    description: 'Tracks lab cases, due dates, and quality control.',
    image: '/illustrations/characters-with-objects/5.png',
    questions: [
      "Show me overdue lab cases",
      "Track the status of patient John Smith's crown",
      "What lab cases are due this week?",
      "List cases ready for delivery",
      "Create follow-up tasks for pending lab cases"
    ],
  },
  {
    id: 'procedure-code',
    title: 'Procedure Code Agent',
    description: 'Optimizes code utilization and compliance.',
    image: '/illustrations/characters-with-objects/6.png',
    questions: [
      "How can we improve our coding for periodontal procedures?",
      "What codes should we use for this complex restoration?",
      "Are we missing any billable procedures?",
      "Help me understand the difference between D2740 and D2750",
      "What's the proper code for this implant restoration?"
    ],
  },
  {
    id: 'supplies-manager',
    title: 'Supplies Manager Agent',
    description: 'Manages inventory and supply chain optimization.',
    image: '/illustrations/characters-with-objects/7.png',
    questions: [
      "What supplies are running low?",
      "How can we optimize our inventory costs?",
      "Compare prices between our current suppliers",
      "Set up automatic reordering for critical items",
      "What's our monthly spend on disposables?"
    ],
  },
  {
    id: 'profitability-appointment',
    title: 'Profitability Appointment Agent',
    description: 'Optimizes scheduling for maximum revenue.',
    image: '/illustrations/characters-with-objects/8.png',
    questions: [
      "What's the most profitable way to schedule next week?",
      "Help me fill tomorrow's openings",
      "How should I organize the hygiene schedule?",
      "Optimize Dr. Johnson's column",
      "What procedures should we prioritize?",
      "Balance the workload between providers",
      "Find the best time for a crown prep"
    ],
  },
  {
    id: 'marketing-roi',
    title: 'Marketing ROI Agent',
    description: 'Evaluates campaign performance and ROI.',
    image: '/illustrations/characters-with-objects/9.png',
    questions: [
      "What are the key metrics for growth?",
      "How to increase case acceptance?",
      "Best marketing strategies?",
      "Building referral programs?",
      "Which marketing channels have the best ROI?"
    ],
  },
  {
    id: 'hygiene-analytics',
    title: 'Hygiene Analytics Agent',
    description: 'Monitors hygiene department performance.',
    image: '/illustrations/characters-with-objects/10.png',
    questions: [
      "What's our hygiene production per hour?",
      "How does our periodontal therapy acceptance compare to benchmarks?",
      "Are we diagnosing enough perio cases?",
      "How many patients are overdue for hygiene?",
      "What's our hygienist productivity by provider?"
    ],
  },
  {
    id: 'patient-demographics',
    title: 'Patient Demographics Agent',
    description: 'Analyzes patient population and trends.',
    image: '/illustrations/characters-with-objects/11.png',
    questions: [
      "Improving satisfaction scores?",
      "Reducing wait times?",
      "Handling complaints?",
      "Better waiting room experience?",
      "What's our patient age distribution?"
    ],
  },
  {
    id: 'operations-agent',
    title: 'Operations Agent',
    description: 'Analyzes operational efficiency.',
    image: '/illustrations/characters-with-objects/13.png',
    questions: [
      "Optimizing scheduling?",
      "Reducing no-shows?",
      "Front desk efficiency?",
      "Inventory management?",
      "How can we improve our morning huddle?"
    ],
  },
  {
    id: 'staff-training',
    title: 'Staff Training Agent',
    description: 'Manages staff development and performance.',
    image: '/illustrations/characters-with-objects/14.png',
    questions: [
      "Improving retention?",
      "Training new staff?",
      "Team meetings?",
      "Performance reviews?",
      "How to implement effective role-playing exercises?"
    ],
  }
];

const AIPracticeConsultant = () => {
  const [selectedQuestion, setSelectedQuestion] = useState('');

  const handleAsk = (newQuestion: string) => {
    setSelectedQuestion(newQuestion);
  };

  // Function to direct questions to specific agents based on topic
  const handleTopicInteraction = (topic: string) => {
    switch(topic) {
      case 'production':
        setSelectedQuestion("What's our total production this month compared to last?");
        break;
      case 'trends':
        setSelectedQuestion("Show me the trends in our hygiene department performance");
        break;
      case 'growth':
        setSelectedQuestion("How can we improve our new patient acquisition?");
        break;
      default:
        setSelectedQuestion("How can I improve my practice performance?");
    }
  };

  // Filter out the head agent from the SUB_AGENTS array
  const specializedAgents = SUB_AGENTS.filter(agent => agent.id !== 'head-orchestrator');

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold text-gray-800">AI Dental Practice Consultant</h1>
      <p className="text-gray-600 mb-6">
        Ask questions and get intelligent insights from our multi-agent AI system designed specifically for dental practices.
      </p>

      {/* Section 1: PracticeInsightScene - Interactive Visualization */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
          <span className="bg-gradient-tropical text-white p-2 rounded-lg mr-2 inline-flex">
            <Icons.BarChart size={20} />
          </span>
          Practice Insights
        </h2>
        <PracticeInsightScene 
          onInteract={handleTopicInteraction} 
        />
      </div>
      
      <div className="border-t border-gray-200 my-8 pt-6"></div>

      {/* Section 2: Head Brain Consultant as the main interface */}
      <div>
        <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
          <span className="bg-gradient-corporate text-white p-2 rounded-lg mr-2 inline-flex">
            <Icons.Brain size={20} />
          </span>
          Head Brain Consultant
        </h2>
        <p className="text-gray-600 mb-4">
          Ask any practice question to our AI orchestrator, which will coordinate with specialized agents for comprehensive insights.
        </p>
        <div className="mb-8">
          <LocalHeadOrchestratorChat
            selectedQuestion={selectedQuestion}
            title="Head Brain Consultant"
            description="Ask any practice question to our AI orchestrator"
          />
        </div>
      </div>
      
      <div className="border-t border-gray-200 my-8 pt-6"></div>

      {/* Section 3: Specialized Consultant Agents grid */}
      <div>
        <h2 className="text-xl font-bold mt-8 mb-4 text-gray-800 flex items-center">
          <span className="bg-gradient-royal text-white p-2 rounded-lg mr-2 inline-flex">
            <Icons.Users size={20} />
          </span>
          Specialized Consultant Agents
        </h2>
        <p className="text-gray-600 mb-4">
          Our AI system has specialized agents for different aspects of your dental practice.
          Click on any agent to engage with a specific consultant or ask a question to the Head Brain Consultant above.
        </p>

        <ErrorBoundary>
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {specializedAgents.map((agent) => (
              <AgentCard key={agent.id} agent={agent} onAsk={handleAsk}>
                <AIResponseFeedback
                  responseId={agent.id}
                  agentType={AGENT_TYPES.ASSISTANT}
                  feedbackContext={FEEDBACK_CONTEXTS.ADMINISTRATIVE}
                  userRole={USER_ROLES.DENTIST}
                  compact={true}
                  showCommentField={true}
                />
              </AgentCard>
            ))}
          </div>
        </ErrorBoundary>
      </div>

      <div className="border-t border-gray-200 my-8 pt-6"></div>

      {/* Section 4: AI Business Development Agents */}
      <div>
        <h2 className="text-xl font-bold mt-8 mb-4 text-gray-800 flex items-center">
          <span className="bg-gradient-ocean text-white p-2 rounded-lg mr-2 inline-flex">
            <Icons.TrendingUp size={20} />
          </span>
          Business Development Agents
        </h2>
        <p className="text-gray-600 mb-4">
          Leverage our specialized AI agents for sales development, marketing management, and social media strategy to grow your practice.
        </p>

        <ErrorBoundary>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div>
              <h3 className="text-lg font-semibold text-navy mb-3">Sales Development Rep</h3>
              <AISDRAgentChat />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-turquoise mb-3">Marketing Manager</h3>
              <AIMarketingManagerChat />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-purple mb-3">Social Media Manager</h3>
              <AISocialMediaManagerChat />
            </div>
          </div>
        </ErrorBoundary>
      </div>
    </div>
  );
};

export default AIPracticeConsultant;