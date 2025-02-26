import React from 'react';
import { LocalHeadOrchestratorChat } from '../../pages/admin/AIPracticeConsultant';

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

  const handleAsk = (question: string) => {
    onAsk(question);
  };

  return (
    <div className="rounded-xl p-6 shadow-lg border border-gray-200 bg-white hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
      <img src={agent.image} alt={agent.title} className="w-24 h-24 rounded-full object-cover mb-4" />
      <h3 className="text-xl font-bold text-gray-800">{agent.title}</h3>
      <p className="mt-2 text-gray-600">{agent.description}</p>

      <div className="mt-4">
        <h4 className="text-lg font-semibold text-gray-700">Example Questions:</h4>
        <ul className="list-none pl-5 text-gray-600">
          {agent.questions.map((q, index) => (
            <li key={index} className="cursor-pointer hover:text-blue-500" onClick={() => handleAsk(q)}>{q}</li>
          ))}
        </ul>
      </div>
      <div className="mt-4">
      <LocalHeadOrchestratorChat selectedQuestion={agent.id} title={agent.title} description={agent.description} />
      </div>
    </div>
  );
};

export default AgentCard;