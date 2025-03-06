import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { AgentHeadOrchestratorChat } from '../../pages/admin/AIPracticeConsultant';
import { AIResponseFeedback } from '../ai';
import { AGENT_TYPES, FEEDBACK_CONTEXTS, USER_ROLES } from '../../constants/ai-agents';
import { v4 as uuidv4 } from 'uuid';

interface AgentCardProps {
  agent: {
    id: string;
    title: string;
    description: string;
    image: string;
    questions: string[];
  };
  onAsk: (question: string) => void;
}

const AgentCard: React.FC<AgentCardProps> = ({ agent, onAsk }) => {
  const [isHovered, setIsHovered] = useState(false);
  // Generate a unique ID for this AI response session
  const responseId = useMemo(() => uuidv4(), []);
  // Track if a response has been received to show feedback UI
  const [hasReceivedResponse, setHasReceivedResponse] = useState(false);

  const handleAsk = (question: string) => {
    onAsk(question);
  };

  // Callback function to be called after receiving a response
  const onResponseReceived = () => {
    setHasReceivedResponse(true);
  };

  // Limit questions display to maximum 3 for consistency
  const displayQuestions = agent.questions.slice(0, 3);

  // Determine gradient background based on agent ID
  const getGradientClass = () => {
    switch (agent.id) {
      case 'revenue-analysis':
        return 'bg-gradient-gold';
      case 'patient-experience':
      case 'recall-optimization':
        return 'bg-gradient-tropical';
      case 'team-performance':
        return 'bg-gradient-royal';
      case 'staff-training':
        return 'bg-gradient-ocean';
      case 'financial-growth':
      case 'profitability-scheduling':
        return 'bg-gradient-nature';
      case 'marketing-roi':
      case 'operations-agent':
        return 'bg-gradient-ocean';
      default:
        return 'bg-gradient-corporate';
    }
  };

  return (
    <motion.div 
      className="rounded-xl shadow-lg border border-gray-200 bg-white hover:shadow-xl transition-all duration-300 h-full flex flex-col overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ scale: 1.02 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`${getGradientClass()} p-4 text-white`}>
        <div className="flex items-center">
          <img 
            src={agent.image} 
            alt={agent.title} 
            className="w-16 h-16 rounded-full object-cover mr-3 border-2 border-white/40"
            onError={(e) => {
              // Fallback for failed image loads
              e.currentTarget.src = `/avatars/avatar style 2/avatar-${(agent.id.charCodeAt(0) % 15) + 1}.png`;
            }}
          />
          <div>
            <h3 className="text-lg font-bold">{agent.title}</h3>
            <p className="text-sm opacity-80">{agent.description}</p>
          </div>
        </div>
      </div>

      <div className="p-4 flex-1">
        <h4 className="text-sm font-semibold text-navy-default mb-2">Example Questions:</h4>
        <ul className="list-none pl-2 text-sm text-gray-600 space-y-1">
          {displayQuestions.map((q, index) => (
            <li 
              key={index} 
              className="cursor-pointer hover:text-navy-default py-1 flex items-start" 
              onClick={() => handleAsk(q)}
            >
              <span className="text-gold-default mr-2">•</span>
              <span className="hover:underline">{q}</span>
            </li>
          ))}
        </ul>
      </div>
      
      <div className="mt-auto p-3 border-t border-gray-100">
        <AgentHeadOrchestratorChat 
          selectedQuestion={agent.id} 
          title={agent.title} 
          description={agent.description}
          responseId={responseId} 
        />
        
        {/* Add feedback UI with comment icon */}
        <div className="mt-2 border-t border-gray-100 pt-2">
          <AIResponseFeedback
            responseId={responseId}
            agentType={AGENT_TYPES.ASSISTANT}
            feedbackContext={FEEDBACK_CONTEXTS.ADMINISTRATIVE}
            userRole={USER_ROLES.DENTIST}
            compact={true}
            showCommentField={true}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default AgentCard;