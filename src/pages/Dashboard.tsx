import React from 'react';
import { AppointmentsChart } from '../components/dashboard/charts/AppointmentsChart';
import { RevenueChart } from '../components/dashboard/charts/RevenueChart';
import PracticeSnapshotGrid from '../components/dashboard/PracticeSnapshotGrid';



const Dashboard = () => {
  const [data, setData] = React.useState([]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/dashboard/charts');
        const data = await response.json();
        setData(data);
      } catch (error) {
        console.error('Error fetching dashboard chart data:', error);
      }
    };

    fetchData();
  }, []);
  return (
    <div className="space-y-8">
      {/* Header with welcome message and actions */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ngenius-black">DentalHub AI Dashboard</h1>
          <p className="text-ngenius-gray-500 mt-1">Welcome back, Dr. Sarah Wilson</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 text-sm font-medium text-ngenius-gray-700 bg-ngenius-white border border-ngenius-gray-200 rounded-lg hover:bg-ngenius-gray-50">
            Export
          </button>
          <button className="px-4 py-2 text-sm font-medium text-ngenius-white bg-ngenius-primary rounded-lg hover:bg-ngenius-primary/90">
            Add Patient
          </button>
        </div>
      </div>

      {/* Practice Snapshots Section (Quick Access) */}
      <PracticeSnapshotGrid />

      {/* Chart Section */}
      <div>
        <h2 className="text-xl font-semibold mb-4 bg-gradient-to-r from-navy to-purple text-transparent bg-clip-text">
          Overview Metrics
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AppointmentsChart data={data} />
          <RevenueChart data={data} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
