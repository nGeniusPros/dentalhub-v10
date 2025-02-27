import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';
import { useNotifications } from '../../contexts/NotificationContext';
import { DentalHubAvatar } from '../ui/DentalHubAvatar';

interface TeamBuildingModuleProps {
  onComplete: (score: number) => void;
}

export const TeamBuildingModule: React.FC<TeamBuildingModuleProps> = ({
  onComplete
}) => {
  const [currentScenario, setCurrentScenario] = useState(0);
  const [score, setScore] = useState(0);
  const { dispatch: notifyDispatch } = useNotifications();

  // Mock team members for the exercise
  const teamMembers = [
    { id: 'team1', name: 'Dr. Emily Johnson', role: 'Lead Dentist' },
    { id: 'team2', name: 'Michael Chen', role: 'Dental Hygienist' },
    { id: 'team3', name: 'Sarah Rodriguez', role: 'Office Manager' },
    { id: 'team4', name: 'David Kim', role: 'Dental Assistant' },
    { id: 'team5', name: 'Lisa Patel', role: 'Receptionist' }
  ];

  const scenarios = [
    {
      id: '1',
      title: 'Communication Challenge',
      description: 'A team member is consistently late to meetings. How do you address this?',
      options: [
        {
          text: 'Send a stern email about punctuality',
          feedback: 'Direct but may be too impersonal',
          points: 5
        },
        {
          text: 'Have a private conversation to understand any underlying issues',
          feedback: 'Excellent! Shows empathy and professionalism',
          points: 10
        },
        {
          text: 'Ignore the behavior to avoid conflict',
          feedback: 'Avoiding the issue may lead to bigger problems',
          points: 0
        }
      ]
    },
    {
      id: '2',
      title: 'Conflict Resolution',
      description: 'Two team members disagree on the best approach for a project. What\'s your solution?',
      options: [
        {
          text: 'Schedule a meeting to discuss both approaches objectively',
          feedback: 'Great approach! Promotes open dialogue and collaboration',
          points: 10
        },
        {
          text: 'Choose the approach from the more experienced team member',
          feedback: 'Experience matters but collaboration is key',
          points: 5
        },
        {
          text: 'Let them figure it out themselves',
          feedback: 'This could lead to ongoing tension',
          points: 0
        }
      ]
    },
    {
      id: '3',
      title: 'Team Motivation',
      description: 'Team morale is low after a challenging project. How do you boost spirits?',
      options: [
        {
          text: 'Organize a team building activity',
          feedback: 'Good choice for rebuilding team spirit',
          points: 8
        },
        {
          text: 'Schedule individual check-ins with each team member',
          feedback: 'Excellent! Shows personal attention and care',
          points: 10
        },
        {
          text: 'Send an encouraging email to the team',
          feedback: 'Positive but could be more personal',
          points: 5
        }
      ]
    }
  ];

  const handleAnswer = (points: number, feedback: string) => {
    setScore(prev => prev + points);
    
    notifyDispatch({
      type: 'ADD_NOTIFICATION',
      payload: {
        id: Date.now().toString(),
        type: points >= 8 ? 'success' : points > 3 ? 'info' : 'warning',
        title: points >= 8 ? 'Great Choice!' : 'Consider This',
        message: feedback,
        autoClose: true
      }
    });
    
    if (currentScenario < scenarios.length - 1) {
      setCurrentScenario(prev => prev + 1);
    } else {
      onComplete(score + points);
    }
  };

  return (
    <div className="space-y-4">
      {/* Team Member Display */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <h3 className="text-lg font-semibold mb-3">Your Team</h3>
        <div className="flex flex-wrap gap-4">
          {teamMembers.map((member) => (
            <div key={member.id} className="flex flex-col items-center">
              <DentalHubAvatar
                userId={member.id}
                name={member.name}
                size="md"
                theme="gradient"
                className="mb-2"
              />
              <span className="text-sm font-medium text-center">{member.name.split(' ')[0]}</span>
              <span className="text-xs text-gray-500">{member.role}</span>
            </div>
          ))}
        </div>
      </div>

      <motion.div
        key={scenarios[currentScenario].id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="bg-white rounded-lg shadow-sm p-6"
      >
        <h2 className="text-xl font-semibold mb-2">{scenarios[currentScenario].title}</h2>
        <p className="text-gray-600 mb-6">{scenarios[currentScenario].description}</p>

        <div className="space-y-3">
          {scenarios[currentScenario].options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(option.points, option.feedback)}
              className="w-full p-4 text-left bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <p className="font-medium text-gray-900">{option.text}</p>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Progress Bar */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-500">Progress</span>
          <span className="font-medium">{Math.round((currentScenario / scenarios.length) * 100)}%</span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-300"
            style={{ width: `${(currentScenario / scenarios.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Score Display */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icons.Award className="w-5 h-5 text-yellow-500" />
            <span className="font-medium">Current Score</span>
          </div>
          <span className="text-lg font-bold text-primary">{score}</span>
        </div>
      </div>
    </div>
  );
};