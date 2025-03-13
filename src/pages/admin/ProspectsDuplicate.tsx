import React from 'react';
import * as Icons from 'lucide-react';
import { Button } from '../../components/ui/button';

const ProspectsDuplicate = () => {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className="relative mr-4">
            <input
              type="text"
              placeholder="Search duplicate contacts..."
              className="pl-9 pr-4 py-2 border border-gray-200 rounded-md w-64"
            />
            <Icons.Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          </div>
          <div className="flex space-x-2">
            <button className="px-3 py-2 bg-white border border-gray-200 rounded-md text-sm flex items-center text-gray-600">
              <Icons.Filter className="w-4 h-4 mr-2" />
              Filter
            </button>
          </div>
        </div>
        <div>
          <Button variant="primary" className="flex items-center text-white">
            <Icons.RefreshCcw className="w-4 h-4 mr-2" />
            Find Duplicates
          </Button>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="px-6 py-20 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Icons.Users className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Duplicate Contacts Found</h3>
          <p className="text-gray-500 max-w-md">
            When duplicate contacts are detected, they will appear here. You can merge duplicate records to keep your database clean.
          </p>
          <Button 
            variant="outline" 
            className="mt-6 flex items-center"
          >
            <Icons.RefreshCcw className="w-4 h-4 mr-2" />
            Scan For Duplicates
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProspectsDuplicate;