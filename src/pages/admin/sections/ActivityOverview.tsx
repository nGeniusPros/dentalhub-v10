import React from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Toothbrush } from '../../../lib/dental-icons';
import { NoAppointmentsState } from '../../../components/EmptyStateSamples';

export const ActivityOverview = () => {
  const hasActivities = false; // Toggle this to show/hide empty state

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Toothbrush className="w-6 h-6 text-navy" />
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
            <p className="text-sm text-gray-500">Patient and staff activity stream</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Icons.Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Icons.RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {hasActivities ? (
        <div className="space-y-4">
          {/* Activity items would go here */}
          <div className="flex items-start p-4 border-b border-gray-100">
            <div className="bg-purple/10 p-2 rounded-full mr-4">
              <Icons.User className="w-5 h-5 text-purple" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-gray-900">New Patient Registration</h4>
                <span className="text-xs text-gray-500">2 hours ago</span>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Patient <span className="font-medium">John Smith</span> has completed registration
              </p>
            </div>
          </div>
          
          {/* More activity items... */}
        </div>
      ) : (
        <div className="py-6">
          <div className="flex justify-center">
            <div className="w-full max-w-md">
              <NoAppointmentsState />
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};
