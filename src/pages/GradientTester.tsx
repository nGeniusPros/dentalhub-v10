import React from 'react';
import StatsCard from '../components/dashboard/StatsCard';
import PracticeSnapshotCard from '../components/dashboard/PracticeSnapshotCard';
import { Progress } from '../components/ui/progress';
import { Button } from '../components/ui/button';

const GradientTester = () => {
  return (
    <div className="p-8 space-y-12">
      <div>
        <h1 className="text-3xl font-bold mb-6 bg-gradient-ocean text-transparent bg-clip-text">
          DentalHub Gradient Test Page
        </h1>
        <p className="text-gray-dark mb-4">
          This page displays all gradient components to verify correct implementation.
        </p>
      </div>

      <section>
        <h2 className="text-2xl font-semibold mb-6">Gradient Buttons</h2>
        <div className="flex flex-wrap gap-4">
          <Button variant="gradient-ocean">Ocean Button</Button>
          <Button variant="gradient-gold">Gold Button</Button>
          <Button variant="gradient-tropical">Tropical Button</Button>
          <Button variant="gradient-royal">Royal Button</Button>
          <Button variant="gradient-nature">Nature Button</Button>
          <Button variant="gradient-corporate">Corporate Button</Button>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-6">Progress Bars</h2>
        <div className="space-y-6 max-w-3xl">
          <div>
            <h3 className="text-lg font-medium mb-2">Ocean Progress</h3>
            <Progress value={65} variant="gradient-ocean" size="md" />
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2">Gold Progress</h3>
            <Progress value={75} variant="gradient-gold" size="md" />
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2">Tropical Progress</h3>
            <Progress value={45} variant="gradient-tropical" size="md" />
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2">Royal Progress</h3>
            <Progress value={85} variant="gradient-royal" size="md" />
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2">Nature Progress</h3>
            <Progress value={55} variant="gradient-nature" size="md" showValue={true} />
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2">Corporate Progress</h3>
            <Progress value={95} variant="gradient-corporate" size="md" showValue={true} />
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-6">Stats Cards</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatsCard
            title="Ocean Gradient"
            value="$128,450"
            change={8.4}
            icon="DollarSign"
            variant="ocean"
          />
          <StatsCard
            title="Gold Gradient"
            value="950"
            change={12.3}
            icon="Users"
            variant="gold"
          />
          <StatsCard
            title="Tropical Gradient"
            value="87%"
            change={-2.1}
            icon="CheckCircle"
            variant="tropical"
          />
          <StatsCard
            title="Royal Gradient"
            value="24"
            change={5.7}
            icon="Calendar"
            variant="royal"
            isGlowing={true}
          />
          <StatsCard
            title="Nature Gradient"
            value="4.9/5"
            change={0.3}
            icon="Star"
            variant="nature"
          />
          <StatsCard
            title="Corporate Gradient"
            value="156"
            change={14.2}
            icon="TrendingUp"
            variant="corporate"
            isGlowing={true}
          />
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-6">Snapshot Cards</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <PracticeSnapshotCard
            title="Ocean Variant"
            value="$145,670"
            change={5.6}
            icon="DollarSign"
            variant="ocean"
            linkTo="#"
            description="With ocean gradient styling"
          />
          <PracticeSnapshotCard
            title="Gold Variant"
            value="1,284"
            change={3.2}
            icon="Users"
            variant="gold"
            linkTo="#"
            description="With gold gradient styling"
            isGlowing={true}
          />
          <PracticeSnapshotCard
            title="Tropical Variant"
            value="92%"
            change={-1.4}
            icon="Star"
            variant="tropical"
            linkTo="#"
            description="With tropical gradient styling"
          />
          <PracticeSnapshotCard
            title="Royal Variant"
            value="4.7/5"
            change={0.2}
            icon="Award"
            variant="royal"
            linkTo="#"
            description="With royal gradient styling"
            isGlowing={true}
          />
          <PracticeSnapshotCard
            title="Nature Variant"
            value="78%"
            change={7.8}
            icon="Activity"
            variant="nature"
            linkTo="#"
            description="With nature gradient styling"
          />
          <PracticeSnapshotCard
            title="Corporate Variant"
            value="245"
            change={12.5}
            icon="Calendar"
            variant="corporate"
            linkTo="#"
            description="With corporate gradient styling"
          />
        </div>
      </section>
    </div>
  );
};

export default GradientTester;
