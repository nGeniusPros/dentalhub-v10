import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { StaffHRAccess } from '../../../components/hr/StaffHRAccess';
import { PerformanceMetrics } from '../../../components/staff/PerformanceMetrics';
import { PayrollSummary } from '../../../components/payroll/PayrollSummary';
import { BonusStructureSection } from '../../../components/staff/BonusStructureSection';
import { TrainingAssignmentButton } from '../../../components/staff/TrainingAssignmentButton';
import { StaffPerformance } from '../../../components/analytics/StaffPerformance';
import { StaffTraining } from '../../../components/analytics/StaffTraining';
import { StaffLeaderboard } from '../../../components/analytics/StaffLeaderboard';
import { NotesSection } from '../../../components/staff/NotesSection';
import type { PayrollData } from '../../../components/payroll/types';

const HRDashboard = () => {
  const [showHRAccess, setShowHRAccess] = useState(false);
  
  // Mock data for PayrollSummary
  const payrollData: PayrollData = {
    provider: {
      id: '1',
      name: 'ADP Workforce Now',
      icon: 'adp-icon',
      description: 'ADP Workforce Now Payroll Services',
      connected: true
    },
    payPeriod: {
      startDate: '2024-02-01',
      endDate: '2024-02-15'
    },
    timesheets: [
      {
        employeeId: '1',
        name: 'John Doe',
        regularHours: 80,
        overtimeHours: 5,
        ptoHours: 0,
        grossPay: 4250,
        deductions: 1062.50,
        netPay: 3187.50
      },
      {
        employeeId: '2',
        name: 'Jane Smith',
        regularHours: 80,
        overtimeHours: 5,
        ptoHours: 0,
        grossPay: 4250,
        deductions: 1062.50,
        netPay: 3187.50
      }
    ],
    summary: {
      regularHours: 160,
      overtimeHours: 10,
      totalHours: 170,
      totalGrossPay: 8500,
      totalDeductions: 2125,
      totalNetPay: 6375
    }
  };

  // Mock data for Staff Performance
  const staffPerformanceData = [
    {
      name: 'Dr. Smith',
      patients: 120,
      satisfaction: 95,
      revenue: 45000
    },
    {
      name: 'Dr. Johnson',
      patients: 115,
      satisfaction: 92,
      revenue: 42000
    },
    {
      name: 'Dr. Williams',
      patients: 105,
      satisfaction: 88,
      revenue: 38000
    },
    {
      name: 'Dr. Brown',
      patients: 95,
      satisfaction: 90,
      revenue: 35000
    }
  ];

  // Mock data for Staff Training
  const trainingData = [
    { name: 'Completed', value: 68, color: '#4BC5BD' },
    { name: 'In Progress', value: 22, color: '#6B4C9A' },
    { name: 'Not Started', value: 10, color: '#1B2B5B' }
  ];

  // Mock data for Staff Notes
  const [notes, setNotes] = useState([
    {
      id: '1',
      content: 'Completed quarterly performance review. Exceeded expectations in patient care metrics.',
      category: 'performance',
      date: '2024-02-20',
      author: 'HR Manager'
    },
    {
      id: '2',
      content: 'Successfully completed advanced dental procedures training.',
      category: 'training',
      date: '2024-02-18',
      author: 'Training Coordinator'
    }
  ]);

  // Mock data for BonusStructure
  const [bonusStructure, setBonusStructure] = useState({
    enrolled: true,
    type: 'production',
    frequency: 'monthly',
    targets: [
      { metric: 'Production', target: 50000, bonus: 1000 },
      { metric: 'Collections', target: 45000, bonus: 800 }
    ],
    notes: 'Bonus structure subject to quarterly review'
  });

  const handleAddNote = (note: Omit<typeof notes[0], 'id' | 'date'>) => {
    const newNote = {
      ...note,
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0]
    };
    setNotes([newNote, ...notes]);
  };

  const handleDeleteNote = (id: string) => {
    setNotes(notes.filter(note => note.id !== id));
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">HR Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage staff performance, payroll, and HR documents</p>
        </div>
        <div className="flex gap-3">
          <TrainingAssignmentButton
            staffId="all"
            staffName="All Staff"
          />
          <Button
            onClick={() => setShowHRAccess(true)}
            variant="outline"
          >
            <Icons.FileText className="w-4 h-4 mr-2" />
            HR Documents
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Performance Metrics Section */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <PerformanceMetrics />
          </div>

          {/* Staff Performance Chart */}
          <StaffPerformance data={staffPerformanceData} />

          {/* Staff Training Progress */}
          <StaffTraining data={trainingData} />

          {/* Staff Notes Section */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <NotesSection
              notes={notes}
              onAddNote={handleAddNote}
              onDeleteNote={handleDeleteNote}
            />
          </div>
        </motion.div>

        {/* Right Column */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          {/* Payroll Summary Section */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <PayrollSummary
              data={payrollData}
              onSubmit={() => console.log('Payroll submitted')}
            />
          </div>

          {/* Staff Leaderboard */}
          <StaffLeaderboard />

          {/* Bonus Structure Section */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <BonusStructureSection
              value={bonusStructure}
              onChange={setBonusStructure}
            />
          </div>
        </motion.div>
      </div>

      {/* HR Files Access Modal */}
      <StaffHRAccess
        staffId="all"
        isOpen={showHRAccess}
        onClose={() => setShowHRAccess(false)}
      />
    </div>
  );
};

export default HRDashboard;