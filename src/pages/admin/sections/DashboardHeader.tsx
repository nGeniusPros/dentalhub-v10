import React from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { useNavigate } from 'react-router-dom';
import { DentalCalendar } from '../../../lib/dental-icons';

export const DashboardHeader = () => {
  const navigate = useNavigate();

  return (
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
          <Icons.FileText className="w-4 h-4 mr-2" />
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
  );
};