// NOTE: This file now removes all 3D/Spline integrations for a simpler UI design

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Button } from '../../components/ui/button';
import { useAIConsultant } from '../../hooks/use-ai-consultant';
import type { AIConsultantPrompt } from '../../lib/types/ai';
import ConversationStarter from '../../components/ai/ConversationStarter';
import AgentCard from '../../components/ai/AgentCard';

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
    };

    const insight = await generateInsight(prompt);
    if (insight) {
      setMessages((prev) => [...prev, { role: 'assistant', content: insight.description }]);
    }

    setQuestion('');
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 h-[400px] flex flex-col">
      <div className="p-4 border-b border-gray-200 bg-gradient-corporate text-white rounded-t-xl">
        <div className="flex items-center gap-3">
          <Icons.Brain className="w-6 h-6" />
          <div>
            <h3 className="font-semibold">{title}</h3>
            <p className="text-sm opacity-80">{description}</p>
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
              <div
                className={`max-w-[80%] p-3 rounded-lg ${
                  message.role === 'user'
                    ? 'bg-navy hover:bg-navy-light text-white ml-4'
                    : 'bg-gray-lighter text-gray-darker mr-4'
                }`}
              >
                {message.content}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
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
    </div>
  );
}

const allQuestions = [
  "Show me the production per hour for last month",
  "What's our hygiene productivity trend over the past quarter?",
  "Compare treatment acceptance rates between January and March",
  "Analyze schedule optimization percentage for Q1 2024",
  "Show me last month's production numbers",
  "Pull up today's schedule",
  "Get the collection rate for this quarter",
  "How many new patients did we have this month?",
  "Show me hygiene production for each hygienist",
  "What's our current accounts receivable?",
  "Get me the treatment acceptance rate for Dr. Smith",
  "Compare our performance to last year",
  "Are we meeting our production goals?",
  "Why is revenue down this month?",
  "Show me trends in patient cancellations",
  "Which procedures are most profitable?",
  "How efficient is our hygiene department?",
  "What's causing our schedule gaps?",
  "How can we increase production?",
  "What should we do about cancellations?",
  "Give me ideas to improve case acceptance",
  "Help me optimize the schedule",
  "How can we reduce no-shows?",
  "What's the best way to handle insurance delays?",
  "How can we grow our new patient numbers?",
  "Create training for treatment presentation",
  "Help me coach the front desk on scheduling",
  "Give me talking points for the morning huddle",
  "How should we implement these changes?",
  "Train my team on handling payment discussions",
  "Create a guide for insurance verification",
  "Help me motivate my hygiene team",
  "What's the most profitable way to schedule next week?",
  "Help me fill tomorrow's openings",
  "How should I organize the hygiene schedule?",
  "Optimize Dr. Johnson's column",
  "What procedures should we prioritize?",
  "Balance the workload between providers",
  "Find the best time for a crown prep",
  "The schedule is empty next week - what should we do?",
  "Production is down - analyze the issue and tell me how to fix it",
  "We're not meeting goals - give me a complete plan to improve",
  "Help me make this month more profitable",
  "Our hygiene department is struggling - analyze and create a solution",
  "What are the key metrics for growth?",
  "How to increase case acceptance?",
  "Best marketing strategies?",
  "Building referral programs?",
  "Improving satisfaction scores?",
  "Reducing wait times?",
  "Handling complaints?",
  "Better waiting room experience?",
  "Optimizing scheduling?",
  "Reducing no-shows?",
  "Front desk efficiency?",
  "Inventory management?",
  "Improving retention?",
  "Training new staff?",
  "Team meetings?",
  "Performance reviews?",
  "Increasing revenue?",
  "Insurance collections?",
  "Membership programs?",
  "Fee scheduling?"
];

const dataRetrievalQuestions = [
  "Show me last month's production numbers",
  "Pull up today's schedule",
  "Get the collection rate for this quarter",
  "How many new patients did we have this month?",
  "Show me hygiene production for each hygienist",
  "What's our current accounts receivable?",
  "Get me the treatment acceptance rate for Dr. Smith"
];

const analysisQuestions = [
  "Compare our performance to last year",
  "Are we meeting our production goals?",
  "Why is revenue down this month?",
  "Show me trends in patient cancellations",
  "Which procedures are most profitable?",
  "How efficient is our hygiene department?",
  "What's causing our schedule gaps?"
];

const recommendationQuestions = [
  "How can we increase production?",
  "What should we do about cancellations?",
  "Give me ideas to improve case acceptance",
  "Help me optimize the schedule",
  "How can we reduce no-shows?",
  "What's the best way to handle insurance delays?",
  "How can we grow our new patient numbers?"
];

const coachingQuestions = [
  "Create training for treatment presentation",
  "Help me coach the front desk on scheduling",
  "Give me talking points for the morning huddle",
  "How should we implement these changes?",
  "Train my team on handling payment discussions",
  "Create a guide for insurance verification",
  "Help me motivate my hygiene team"
];

const profitabilitySchedulingQuestions = [
  "What's the most profitable way to schedule next week?",
  "Help me fill tomorrow's openings",
  "How should I organize the hygiene schedule?",
  "Optimize Dr. Johnson's column",
  "What procedures should we prioritize?",
  "Balance the workload between providers",
  "Find the best time for a crown prep"
];

const commonCombinationQuestions = [
  "The schedule is empty next week - what should we do?",
  "Production is down - analyze the issue and tell me how to fix it",
  "We're not meeting goals - give me a complete plan to improve",
  "Help me make this month more profitable",
  "Our hygiene department is struggling - analyze and create a solution"
];

const quickQuestionsPracticeGrowth = [
  "What are the key metrics for growth?",
  "How to increase case acceptance?",
  "Best marketing strategies?",
  "Building referral programs?"
];

const quickQuestionsPatientExperience = [
  "Improving satisfaction scores?",
  "Reducing wait times?",
  "Handling complaints?",
  "Better waiting room experience?"
];

const quickQuestionsOperations = [
  "Optimizing scheduling?",
  "Reducing no-shows?",
  "Front desk efficiency?",
  "Inventory management?"
];

const quickQuestionsStaffTraining = [
  "Improving retention?",
  "Training new staff?",
  "Team meetings?",
  "Performance reviews?"
];

const quickQuestionsFinancialGrowth = [
  "Increasing revenue?",
  "Insurance collections?",
  "Membership programs?",
  "Fee scheduling?"
];

const SUB_AGENTS = [
  {
    id: 'data-retrieval',
    title: 'Data Retrieval Agent',
    description: 'Fetches raw data: production, schedules, AR, etc.',
    image: '/illustrations/characters-with-objects/1.png',
    questions: dataRetrievalQuestions,
  },
  {
    id: 'data-analysis',
    title: 'Data Analysis Agent',
    description: 'Analyzes KPI trends, identifies correlations.',
    image: '/illustrations/characters-with-objects/2.png',
    questions: analysisQuestions,
  },
  {
    id: 'lab-case-manager',
    title: 'Lab Case Manager Agent',
    description: 'Tracks lab cases and quality control.',
    image: '/illustrations/characters-with-objects/3.png',
    questions: commonCombinationQuestions,
  },
  {
    id: 'procedure-code',
    title: 'Procedure Code Agent',
    description: 'Optimizes code utilization and compliance.',
    image: '/illustrations/characters-with-objects/4.png',
    questions: recommendationQuestions,
  },
  {
    id: 'supplies-manager',
    title: 'Supplies Manager Agent',
    description: 'Manages inventory and supply chain optimization.',
    image: '/illustrations/characters-with-objects/5.png',
    questions: quickQuestionsFinancialGrowth,
  },
  {
    id: 'profitability-appointment',
    title: 'Profitability Appointment Agent',
    description: 'Optimizes scheduling for maximum revenue.',
    image: '/illustrations/characters-with-objects/6.png',
    questions: profitabilitySchedulingQuestions,
  },
  {
    id: 'marketing-roi',
    title: 'Marketing ROI Agent',
    description: 'Evaluates campaign performance and ROI.',
    image: '/illustrations/characters-with-objects/7.png',
    questions: quickQuestionsPracticeGrowth,
  },
  {
    id: 'hygiene-analytics',
    title: 'Hygiene Analytics Agent',
    description: 'Monitors hygiene department performance.',
    image: '/illustrations/characters-with-objects/8.png',
    questions: analysisQuestions,
  },
  {
    id: 'patient-demographics',
    title: 'Patient Demographics Agent',
    description: 'Analyzes patient population and trends.',
    image: '/illustrations/characters-with-objects/9.png',
    questions: quickQuestionsPatientExperience,
  },
  {
    id: 'osha-compliance',
    title: 'OSHA Compliance Agent',
    description: 'Ensures compliance with regulations.',
    image: '/illustrations/characters-with-objects/10.png',
    questions: coachingQuestions,
  },
  {
    id: 'revenue-agent',
    title: 'Revenue Agent',
    description: 'Tracks financial performance and growth.',
    image: '/illustrations/characters-with-objects/11.png',
    questions: analysisQuestions,
  },
  {
    id: 'patient-care',
    title: 'Patient Care Agent',
    description: 'Monitors satisfaction and care quality.',
    image: '/illustrations/characters-with-objects/12.png',
    questions: quickQuestionsPatientExperience,
  },
  {
    id: 'operations-agent',
    title: 'Operations Agent',
    description: 'Analyzes operational efficiency.',
    image: '/illustrations/characters-with-objects/13.png',
    questions: quickQuestionsOperations,
  },
  {
    id: 'staff-training',
    title: 'Staff Training Agent',
    description: 'Manages staff development and performance.',
    image: '/illustrations/characters-with-objects/14.png',
    questions: quickQuestionsStaffTraining,
  }
];

const AIPracticeConsultant = () => {
  const [question, setQuestion] = useState('');

  const handleAsk = (newQuestion: string) => {
    setQuestion(newQuestion);
  };

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold text-gray-800">AI Dental Practice Consultant</h1>
      <p className="text-gray-600 mb-6">
        Ask questions and get intelligent insights from our multi-agent AI system designed specifically for dental practices.
      </p>

      <ConversationStarter onAsk={(question) => console.log("Question submitted:", question)} />

      <h2 className="text-xl font-bold mt-8 text-gray-800">Specialized Consultant Agents</h2>
      <p className="text-gray-600 mb-4">
        Our AI system has specialized agents for different aspects of your dental practice. Ask specific questions to each agent for more detailed insights.
      </p>

      <ErrorBoundary>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8" style={{display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gridGap: "1rem"}}>
          {SUB_AGENTS.map((agent) => (
            <AgentCard key={agent.id} agent={agent} onAsk={handleAsk}   />
          ))}
        </div>
      </ErrorBoundary>
    </div>
  )
}

export default AIPracticeConsultant