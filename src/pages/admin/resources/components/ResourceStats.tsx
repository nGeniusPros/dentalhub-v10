import React from 'react';
import StatsCard from '../../../../components/dashboard/StatsCard';

export const ResourceStats = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatsCard
        title="Total Resources"
        value="245"
        change={12}
        icon="Files"
        variant="corporate"
        isGlowing={true}
      />
      <StatsCard
        title="Downloads Today"
        value="45"
        change={8}
        icon="Download"
        variant="ocean"
      />
      <StatsCard
        title="Active Users"
        value="89"
        change={15}
        icon="Users"
        variant="royal"
      />
      <StatsCard
        title="Required Forms"
        value="12"
        change={0}
        icon="ClipboardCheck"
        variant="gold"
      />
    </div>
  );
};