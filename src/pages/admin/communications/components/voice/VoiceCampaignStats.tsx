import React from 'react';
import { motion } from 'framer-motion';
import StatsCard from '../../../../../components/dashboard/StatsCard';

export const VoiceCampaignStats = () => {
  return (
    <motion.div 
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <StatsCard
        title="Active Campaigns"
        value="5"
        change={2}
        icon="Phone"
        variant="gold"
        isGlowing={true}
      />
      <StatsCard
        title="Total Calls"
        value="1,234"
        change={8}
        icon="PhoneCall"
        variant="corporate"
      />
      <StatsCard
        title="Connection Rate"
        value="68%"
        change={5}
        icon="PhoneOutgoing"
        variant="ocean"
      />
      <StatsCard
        title="Response Rate"
        value="45%"
        change={3}
        icon="MessageSquare"
        variant="nature"
      />
    </motion.div>
  );
};