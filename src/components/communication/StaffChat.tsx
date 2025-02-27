import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Button } from '../ui/button';
import { DentalHubAvatar } from '../ui/DentalHubAvatar';

export const StaffChat = () => {
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Array<{
    id: string;
    sender: string;
    senderId?: string;
    senderName?: string;
    content: string;
    timestamp: string;
  }>>([]);

  // Mock data for demonstration
  const currentUser = {
    id: 'user123',
    name: 'Dr. Johnson'
  };
  
  const otherStaff = {
    id: 'staff456',
    name: 'Nurse Smith'
  };

  const handleSend = () => {
    if (!message.trim()) return;
    
    setMessages([
      ...messages,
      {
        id: Date.now().toString(),
        sender: 'me',
        senderId: currentUser.id,
        senderName: currentUser.name,
        content: message,
        timestamp: new Date().toISOString()
      }
    ]);
    setMessage('');
    
    // Mock response for demonstration
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'other',
          senderId: otherStaff.id,
          senderName: otherStaff.name,
          content: 'Thanks for the update!',
          timestamp: new Date().toISOString()
        }
      ]);
    }, 2000);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <h3 className="font-semibold">Staff Chat</h3>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'} mb-4`}
          >
            {msg.sender !== 'me' && (
              <DentalHubAvatar
                userId={msg.senderId}
                name={msg.senderName}
                size="sm"
                theme="simple"
                className="mr-2 self-end"
              />
            )}
            <div className={`max-w-[80%] p-3 rounded-lg ${
              msg.sender === 'me' 
                ? 'bg-navy text-white' 
                : 'bg-gray-lighter'
            }`}>
              <p className="text-sm">{msg.content}</p>
              <span className="text-xs opacity-70">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </span>
            </div>
            {msg.sender === 'me' && (
              <DentalHubAvatar
                userId={msg.senderId}
                name={msg.senderName}
                size="sm"
                theme="simple"
                className="ml-2 self-end"
              />
            )}
          </div>
        ))}
      </div>

      <div className="p-4 border-t">
        <div className="flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1 px-3 py-2 border rounded-lg"
            placeholder="Type a message..."
          />
          <Button onClick={handleSend}>
            <Icons.Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};