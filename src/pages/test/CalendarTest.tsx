import React from 'react';
import { FullscreenCalendar } from '../../components/ui/fullscreen-calendar';

const CalendarTest = () => {
  // Create simple test data for the calendar
  const testCalendarData = [
    {
      day: new Date(),
      events: [
        {
          id: 1,
          name: "Test Appointment 1",
          time: "10:00 AM",
          datetime: new Date().toISOString().split('T')[0] + "T10:00",
        },
        {
          id: 2,
          name: "Test Appointment 2",
          time: "2:00 PM",
          datetime: new Date().toISOString().split('T')[0] + "T14:00",
        },
      ],
    },
    // Tomorrow
    {
      day: new Date(new Date().setDate(new Date().getDate() + 1)),
      events: [
        {
          id: 3,
          name: "Test Appointment 3",
          time: "11:30 AM",
          datetime: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0] + "T11:30",
        },
      ],
    },
  ];

  return (
    <div className="p-6 h-screen flex flex-col">
      <h1 className="text-2xl font-bold mb-4">Calendar Test Page</h1>
      <p className="mb-4">This is a test page for the calendar component.</p>
      
      <div className="flex-1 overflow-hidden">
        <FullscreenCalendar data={testCalendarData} />
      </div>
    </div>
  );
};

export default CalendarTest;