import React, { useState } from 'react';
import { Button } from '../../components/ui/button';
import * as Icons from 'lucide-react';

interface ConversationStarterProps {
  onAsk: (question: string) => void;
}

const ConversationStarter: React.FC<ConversationStarterProps> = ({ onAsk }) => {
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    if (!question.trim()) return;
    setLoading(true);
    await onAsk(question);
    setQuestion('');
    setLoading(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Start a Conversation</h3>
      <div className="relative">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask a question..."
          className="w-full px-4 py-2 pr-12 border border-gray-300 rounded-lg text-gray-700 focus:ring-2 focus:ring-blue-200 focus:border-transparent"
        />
        <Button
          onClick={handleAsk}
          disabled={loading}
          className="absolute right-2 top-1/2 -translate-y-1/2 !p-1 hover:bg-blue-50"
        >
          {loading ? (
            <Icons.Loader2 className="w-5 h-5 animate-spin text-blue-600" />
          ) : (
            <Icons.ArrowRight className="w-5 h-5 text-blue-600" />
          )}
        </Button>
      </div>
    </div>
  );
};

export default ConversationStarter;