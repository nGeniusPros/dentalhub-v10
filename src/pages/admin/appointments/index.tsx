import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { AppointmentActions } from '../../../components/appointments/AppointmentActions';
import { FullscreenCalendar } from '../../../components/ui/fullscreen-calendar';

const AdminAppointmentsDashboard = () => {
  const [selectedView, setSelectedView] = useState<'calendar' | 'list'>('calendar');

  // Create calendar data with current month dates instead of hardcoded February 2025
  // Use useMemo to keep data stable across renders
  const appointmentCalendarData = useMemo(() => {
    // Create appointments for current month, focusing on current week
    const day1 = new Date();
    const day2 = new Date();
    day2.setDate(day2.getDate() + 1);
    const day3 = new Date();
    day3.setDate(day3.getDate() + 2);
    
    return [
      {
        day: day1,
        events: [
          {
            id: 1,
            name: "John Smith - Cleaning",
            time: "10:00 AM",
            datetime: `${day1.toISOString().split('T')[0]}T10:00`,
          },
          {
            id: 2,
            name: "Sarah Johnson - Check-up",
            time: "11:30 AM",
            datetime: `${day1.toISOString().split('T')[0]}T11:30`,
          },
          {
            id: 3,
            name: "Michael Brown - Root Canal",
            time: "2:00 PM",
            datetime: `${day1.toISOString().split('T')[0]}T14:00`,
          },
        ],
      },
      {
        day: day2,
        events: [
          {
            id: 4,
            name: "Emily Davis - Tooth Extraction",
            time: "9:00 AM",
            datetime: `${day2.toISOString().split('T')[0]}T09:00`,
          },
          {
            id: 5,
            name: "Robert Wilson - Denture Fitting",
            time: "1:00 PM",
            datetime: `${day2.toISOString().split('T')[0]}T13:00`,
          },
        ],
      },
      {
        day: day3,
        events: [
          {
            id: 6,
            name: "Jessica Martinez - Crown Placement",
            time: "11:00 AM",
            datetime: `${day3.toISOString().split('T')[0]}T11:00`,
          },
          {
            id: 7,
            name: "Thomas Anderson - Teeth Whitening",
            time: "3:30 PM",
            datetime: `${day3.toISOString().split('T')[0]}T15:30`,
          },
        ],
      },
    ];
  }, []); // Empty dependency array ensures this only runs once

  const appointments = [
    {
      patient: "John Smith",
      time: "2025-02-14 10:00 AM",
      type: "Cleaning",
      status: "Confirmed"
    },
    {
      patient: "Sarah Johnson",
      time: "2025-02-14 11:30 AM",
      type: "Check-up",
      status: "Pending"
    },
    {
      patient: "Michael Brown",
      time: "2025-02-14 2:00 PM",
      type: "Root Canal",
      status: "Confirmed"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-navy via-purple to-turquoise text-transparent bg-clip-text">
            Appointments Dashboard
          </h1>
          <p className="text-gray-600">Manage your practice schedule efficiently</p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            className={selectedView === 'calendar' ? 'bg-navy text-white' : ''}
            onClick={() => setSelectedView('calendar')}
          >
            <Icons.Calendar className="w-4 h-4 mr-2" />
            Calendar
          </Button>
          <Button
            variant="outline"
            className={selectedView === 'list' ? 'bg-navy text-white' : ''}
            onClick={() => setSelectedView('list')}
          >
            <Icons.List className="w-4 h-4 mr-2" />
            List
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-xl shadow-glow"
        >
          <div className="flex items-center gap-3 mb-2">
            <Icons.Calendar className="w-5 h-5 text-navy" />
            <h3 className="text-lg font-semibold text-navy">Today's Appointments</h3>
          </div>
          <p className="text-3xl font-bold text-navy-light">24</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-6 rounded-xl shadow-glow"
        >
          <div className="flex items-center gap-3 mb-2">
            <Icons.CheckCircle className="w-5 h-5 text-green" />
            <h3 className="text-lg font-semibold text-navy">Confirmed</h3>
          </div>
          <p className="text-3xl font-bold text-green">18</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-xl shadow-glow"
        >
          <div className="flex items-center gap-3 mb-2">
            <Icons.Clock className="w-5 h-5 text-gold" />
            <h3 className="text-lg font-semibold text-navy">Pending</h3>
          </div>
          <p className="text-3xl font-bold text-gold">6</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white p-6 rounded-xl shadow-glow"
        >
          <div className="flex items-center gap-3 mb-2">
            <Icons.Users className="w-5 h-5 text-purple" />
            <h3 className="text-lg font-semibold text-navy">New Patients</h3>
          </div>
          <p className="text-3xl font-bold text-purple">8</p>
        </motion.div>
      </div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl shadow-glow p-6 overflow-hidden flex flex-col h-[calc(100vh-280px)]"
      >
        {selectedView === 'calendar' ? (
          <div className="flex-1 flex flex-col h-full">
            <div className="mb-4">
              <h1 className="text-3xl font-bold">Appointments</h1>
            </div>
            
            <div className="flex-1 overflow-hidden">
              <FullscreenCalendar
                key="appointment-calendar"
                data={appointmentCalendarData}
              />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {appointments.map((appointment, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:shadow-glow transition-shadow"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-2 h-2 rounded-full ${
                    appointment.status === 'Confirmed' ? 'bg-green' : 'bg-gold'
                  }`} />
                  <div>
                    <h4 className="font-semibold text-navy">{appointment.patient}</h4>
                    <p className="text-sm text-gray-600">{appointment.time} - {appointment.type}</p>
                  </div>
                </div>
                <AppointmentActions appointment={appointment} />
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default AdminAppointmentsDashboard;
