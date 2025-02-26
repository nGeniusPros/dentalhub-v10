import React from 'react';
import KnowledgeBaseManager from '../../components/ai/KnowledgeBaseManager';

/**
 * Knowledge Base Management Page
 * 
 * Admin page for managing the AI knowledge base entries and bundles.
 * This page provides a UI for adding, editing, and organizing knowledge
 * that will be used by the AI agents to provide more contextual responses.
 */
const KnowledgeBasePage: React.FC = () => {
  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold text-gray-800">Knowledge Base Management</h1>
      <p className="text-gray-600 mb-6">
        Add and manage knowledge entries that will be used by the AI agents to provide more accurate and contextual responses.
        You can create knowledge bundles, assign entries to specific agents, and organize your knowledge base efficiently.
      </p>

      <KnowledgeBaseManager />
    </div>
  );
};

export default KnowledgeBasePage;