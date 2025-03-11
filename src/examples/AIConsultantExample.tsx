import React, { useState } from 'react';
import { ai, ChatMessage } from '../utils/ai';

/**
 * Example component demonstrating the use of the AI utility
 * for dental consultations and diagnostics
 */
const AIConsultantExample: React.FC = () => {
  // State for chat messages
  const [messages, setMessages] = useState<ChatMessage[]>([
    ai.systemMessage('You are a dental assistant AI. Provide helpful information about dental care.'),
  ]);
  
  // State for user input
  const [userInput, setUserInput] = useState('');
  
  // State for symptoms input (for diagnosis demo)
  const [symptoms, setSymptoms] = useState('');
  
  // State for diagnosis result
  const [diagnosis, setDiagnosis] = useState('');
  
  // State for treatment recommendations
  const [treatment, setTreatment] = useState('');
  
  // Loading states
  const [chatLoading, setChatLoading] = useState(false);
  const [diagnosisLoading, setDiagnosisLoading] = useState(false);
  const [treatmentLoading, setTreatmentLoading] = useState(false);
  
  // Error states
  const [chatError, setChatError] = useState('');
  const [diagnosisError, setDiagnosisError] = useState('');
  const [treatmentError, setTreatmentError] = useState('');

  /**
   * Handle sending a message to the AI
   */
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userInput.trim()) return;
    
    // Create a new user message
    const userMessage = ai.userMessage(userInput);
    
    // Update messages with user message
    setMessages(prev => [...prev, userMessage]);
    
    // Clear input and error
    setUserInput('');
    setChatError('');
    
    // Set loading state
    setChatLoading(true);
    
    try {
      // Send message to AI
      const response = await ai.chat([...messages, userMessage]);
      
      // Get assistant response
      const assistantMessage = response.choices[0].message;
      
      // Update messages with assistant response
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      setChatError('Failed to get AI response. Please try again.');
    } finally {
      setChatLoading(false);
    }
  };

  /**
   * Handle getting a diagnosis based on symptoms
   */
  const handleGetDiagnosis = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!symptoms.trim()) return;
    
    // Clear previous diagnosis, treatment, and error
    setDiagnosis('');
    setTreatment('');
    setDiagnosisError('');
    
    // Set loading state
    setDiagnosisLoading(true);
    
    try {
      // Get diagnosis from AI
      const diagnosisResult = await ai.getDentalDiagnosis(symptoms);
      
      // Update diagnosis
      setDiagnosis(diagnosisResult);
    } catch (error) {
      console.error('Diagnosis error:', error);
      setDiagnosisError('Failed to get diagnosis. Please try again.');
    } finally {
      setDiagnosisLoading(false);
    }
  };

  /**
   * Handle getting treatment recommendations based on diagnosis
   */
  const handleGetTreatment = async () => {
    if (!diagnosis) return;
    
    // Clear previous treatment and error
    setTreatment('');
    setTreatmentError('');
    
    // Set loading state
    setTreatmentLoading(true);
    
    try {
      // Get treatment recommendations from AI
      const treatmentResult = await ai.getTreatmentRecommendations(diagnosis);
      
      // Update treatment
      setTreatment(treatmentResult);
    } catch (error) {
      console.error('Treatment error:', error);
      setTreatmentError('Failed to get treatment recommendations. Please try again.');
    } finally {
      setTreatmentLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">AI Dental Consultant</h1>
      
      {/* Chat Section */}
      <div className="mb-8 p-4 border rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Chat with Dental AI</h2>
        
        {/* Messages Display */}
        <div className="mb-4 h-60 overflow-y-auto border rounded p-2">
          {messages.map((message, index) => (
            message.role !== 'system' && (
              <div 
                key={index} 
                className={`mb-2 p-2 rounded ${
                  message.role === 'user' 
                    ? 'bg-blue-100 ml-8' 
                    : 'bg-gray-100 mr-8'
                }`}
              >
                <div className="font-semibold">
                  {message.role === 'user' ? 'You' : 'Dental Assistant AI'}:
                </div>
                <div>{message.content}</div>
              </div>
            )
          ))}
          
          {chatLoading && (
            <div className="text-center p-2">
              <span className="inline-block animate-pulse">Thinking...</span>
            </div>
          )}
          
          {chatError && (
            <div className="text-red-500 p-2">{chatError}</div>
          )}
        </div>
        
        {/* Message Input */}
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Ask about dental care..."
            className="flex-1 p-2 border rounded"
            disabled={chatLoading}
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-blue-300"
            disabled={chatLoading || !userInput.trim()}
          >
            Send
          </button>
        </form>
      </div>
      
      {/* Diagnosis Section */}
      <div className="mb-8 p-4 border rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Get Preliminary Diagnosis</h2>
        
        {/* Symptoms Input */}
        <form onSubmit={handleGetDiagnosis} className="mb-4">
          <div className="mb-2">
            <label htmlFor="symptoms" className="block mb-1">
              Describe your symptoms:
            </label>
            <textarea
              id="symptoms"
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              placeholder="Example: Sharp pain in lower right molar when drinking cold water..."
              className="w-full p-2 border rounded h-24"
              disabled={diagnosisLoading}
            />
          </div>
          
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded disabled:bg-green-300"
            disabled={diagnosisLoading || !symptoms.trim()}
          >
            Get Diagnosis
          </button>
        </form>
        
        {diagnosisLoading && (
          <div className="text-center p-2">
            <span className="inline-block animate-pulse">Analyzing symptoms...</span>
          </div>
        )}
        
        {diagnosisError && (
          <div className="text-red-500 p-2">{diagnosisError}</div>
        )}
        
        {diagnosis && (
          <div className="mt-4">
            <h3 className="font-semibold">Preliminary Assessment:</h3>
            <div className="p-3 bg-gray-100 rounded mt-1">{diagnosis}</div>
            
            {!treatment && !treatmentLoading && (
              <button
                onClick={handleGetTreatment}
                className="mt-2 bg-indigo-500 text-white px-4 py-2 rounded"
              >
                Get Treatment Recommendations
              </button>
            )}
          </div>
        )}
        
        {treatmentLoading && (
          <div className="text-center p-2 mt-2">
            <span className="inline-block animate-pulse">Preparing recommendations...</span>
          </div>
        )}
        
        {treatmentError && (
          <div className="text-red-500 p-2 mt-2">{treatmentError}</div>
        )}
        
        {treatment && (
          <div className="mt-4">
            <h3 className="font-semibold">Treatment Recommendations:</h3>
            <div className="p-3 bg-blue-50 rounded mt-1">{treatment}</div>
          </div>
        )}
      </div>
      
      <div className="bg-yellow-100 p-3 rounded text-sm">
        <p className="font-semibold">Important Note:</p>
        <p>
          This AI consultant is for demonstration purposes only. Always consult with a qualified
          dental professional for accurate diagnosis and treatment plans.
        </p>
      </div>
    </div>
  );
};

export default AIConsultantExample;