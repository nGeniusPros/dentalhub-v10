import React from 'react';
import { motion } from 'framer-motion';
import StatsCard from '../../../../../components/dashboard/StatsCard';
import { Icon } from '../../../../../components/ui/icon-strategy';

export const StaffStats = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatsCard
        title="Total Staff"
        value="24"
        change={8}
        icon="Users"
        variant="royal"
        isGlowing={true}
      />
      <StatsCard
        title="Active Staff"
        value="22"
        change={5}
        icon="UserCheck"
        variant="corporate"
      />
      <StatsCard
        title="Satisfaction"
        value="92%"
        change={3}
        icon="Heart"
        variant="gold"
      />
      <StatsCard
        title="Retention Rate"
        value="95%"
        change={2}
        icon="UserPlus"
        variant="ocean"
      />
    </div>
  );
};