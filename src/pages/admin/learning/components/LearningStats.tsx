import React from 'react';
import { motion } from 'framer-motion';
import StatsCard from '../../../../components/dashboard/StatsCard';

export const LearningStats = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatsCard
        title="Points Earned"
        value="1,250"
        change={15}
        icon="Award"
        variant="royal"
        isGlowing={true}
      />
      <StatsCard
        title="Courses Completed"
        value="8"
        change={2}
        icon="GraduationCap"
        variant="ocean"
      />
      <StatsCard
        title="Active Challenges"
        value="3"
        change={1}
        icon="Target"
        variant="gold"
      />
      <StatsCard
        title="Current Rank"
        value="Gold"
        icon="Trophy"
        variant="tropical"
      />
    </div>
  );
};