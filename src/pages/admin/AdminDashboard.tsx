import React, { useState } from 'react';
import * as Icons from 'lucide-react';
import { Button } from '../../components/ui/button';
import { DashboardHeader } from './sections/DashboardHeader';
import { KPIOverview } from './sections/KPIOverview';
import { RevenueAnalytics } from './sections/RevenueAnalytics';
import { PatientMetrics } from './sections/PatientMetrics';
import { StaffPerformance } from './sections/StaffPerformance';
import { MarketingMetrics } from './sections/MarketingMetrics';
import { TreatmentAnalytics } from './sections/TreatmentAnalytics';
import { AppointmentOverview } from './sections/AppointmentOverview';
import { HygieneAnalytics } from './sections/HygieneAnalytics';
import { ActivityOverview } from './sections/ActivityOverview';

const AdminDashboard = () => {
  const [showChat, setShowChat] = useState(false);

  return (
    <div className="space-y-6">
      <DashboardHeader />
      <KPIOverview />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueAnalytics />
        <PatientMetrics />
      </div>

      <ActivityOverview />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StaffPerformance />
        <MarketingMetrics />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TreatmentAnalytics />
        <AppointmentOverview />
      </div>

      <HygieneAnalytics />

      {showChat && (
        <div className="fixed bottom-4 right-4 w-96 h-[600px] bg-white rounded-xl shadow-2xl border border-gray-200">
          <div className="flex flex-col h-full">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Chat</h3>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowChat(false)}
                >
                  <Icons.X className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              {/* Chat messages will go here */}
            </div>
            <div className="p-4 border-t border-gray-200">
              <div className="flex gap-2">
                <input
                  type="text"
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg"
                  placeholder="Type a message..."
                />
                <Button>
                  <Icons.Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Chat toggle button */}
      <div className="fixed bottom-4 right-4">
        <Button 
          variant="gradient-ocean"
          size="icon"
          className="rounded-full w-12 h-12 shadow-lg"
          onClick={() => setShowChat(!showChat)}
        >
          {showChat ? (
            <Icons.X className="w-5 h-5" />
          ) : (
            <Icons.MessageSquare className="w-5 h-5" />
          )}
        </Button>
      </div>
    </div>
  );
};

export default AdminDashboard;