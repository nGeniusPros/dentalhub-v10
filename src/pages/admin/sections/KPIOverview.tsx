import React from 'react';
import { motion } from 'framer-motion';
import StatsCard from '../../../components/dashboard/StatsCard';

export const KPIOverview = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatsCard
        title="Monthly Revenue"
        value="$145,678"
        change={8}
        icon="DollarSign"
        variant="ocean"
        isGlowing={true}
      />
      <StatsCard
        title="Patient Growth"
        value="3,456"
        change={12}
        icon="Users"
        variant="royal"
      />
      <StatsCard
        title="Treatment Acceptance"
        value="78%"
        change={5}
        icon="Tooth"
        variant="gold"
      />
      <StatsCard
        title="Appointment Fill Rate"
        value="94%"
        change={3}
        icon="DentalCalendar"
        variant="tropical"
      />
      <StatsCard
        title="Insurance Claims"
        value="245"
        change={7}
        icon="FileCheck"
        variant="nature"
      />
      <StatsCard
        title="Average Wait Time"
        value="12min"
        change={-4}
        icon="DentalClock"
        variant="corporate"
      />
      <StatsCard
        title="Patient Satisfaction"
        value="4.8"
        change={2}
        icon="Star"
        variant="gold"
        isGlowing={true}
      />
      <StatsCard
        title="Staff Productivity"
        value="94%"
        change={6}
        icon="DentistChair"
        variant="ocean"
      />
    </div>
  );
};