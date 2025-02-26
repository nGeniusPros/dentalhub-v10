import React from 'react';
import { AIConsultantChat } from '../components/ai/AIConsultantChat';

/**
 * AI Consultant Page
 * 
 * A dedicated page for the AI Dental Practice Consultant.
 * This page provides a full-screen chat interface where users can
 * interact with the AI orchestrator to get practice insights,
 * recommendations, and lab case management assistance.
 */
const AIConsultantPage: React.FC = () => {
  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-gray-800">AI Dental Practice Consultant</h1>
            <div className="text-sm text-gray-500">
              Powered by DentalHub AI
            </div>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="flex-grow max-w-7xl w-full mx-auto p-4">
        <div className="bg-white rounded-lg shadow-md h-full overflow-hidden">
          <AIConsultantChat />
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-white border-t p-4">
        <div className="max-w-7xl mx-auto text-center text-sm text-gray-500">
          <p>
            DentalHub AI Consultant provides insights based on practice data. 
            Recommendations should be reviewed by practice management professionals.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default AIConsultantPage;