import React from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { useNavigate } from 'react-router-dom';
import { DentalCalendar, DentalChart } from '../../../lib/dental-icons';

export const DashboardHeader = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold bg-gradient-ocean text-transparent bg-clip-text">
            Practice Overview
          </h1>
          <p className="text-gray-500 mt-1">Welcome back, Dr. Sarah Wilson</p>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline"
            onClick={() => navigate('/admin-dashboard/reports')}
            className="text-gray-700 hover:text-gray-900"
          >
            <DentalChart className="w-5 h-5 mr-2" />
            Generate Report
          </Button>
          <Button 
            variant="gradient-royal"
            onClick={() => navigate('/admin-dashboard/ai-consultant')}
            className="text-white"
          >
            <Icons.Brain className="w-4 h-4 mr-2" />
            AI Insights
          </Button>
          <Button 
            variant="gradient-ocean"
            onClick={() => navigate('/admin-dashboard/appointment')}
          >
            <DentalCalendar className="w-5 h-5 mr-2 text-white" />
            Schedule Appointment
          </Button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-xl overflow-hidden bg-gradient-to-r from-navy/5 to-turquoise/5 border border-gray-200 shadow-sm"
      >
        <div className="flex items-center">
          <div className="p-6 lg:p-8 flex-1">
            <h2 className="text-xl font-semibold text-navy mb-2">Good afternoon, Dr. Wilson</h2>
            <p className="text-gray-600 mb-4">Your practice is performing well today. There are 5 patients waiting in the reception area.</p>
            <div className="flex gap-3">
              <Button variant="gradient-royal" size="sm">
                <Icons.Users className="w-4 h-4 mr-2" />
                View Waiting List
              </Button>
              <Button variant="outline" size="sm">
                <Icons.Clock className="w-4 h-4 mr-2" />
                Today's Schedule
              </Button>
            </div>
          </div>
          <div className="hidden lg:block pr-8">
            <img 
              src="/illustrations/characters/charater style 2/3.png" 
              alt="Welcome illustration" 
              className="h-48 w-auto object-contain"
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
};