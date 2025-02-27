import React from 'react';
import { Button } from './button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './card';
import { Input } from './input';
import { Badge } from './badge';
import { LineChartComponent } from './charts/LineChartComponent';
import { BarChartComponent } from './charts/BarChartComponent';
import { PieChartComponent } from './charts/PieChartComponent';
import { chartColors, sampleChartData } from '../../lib/chartStyles';
import { Progress } from './progress';
import { StatsCard } from './stats-card';
import { PracticeSnapshotCard } from './practice-snapshot-card';

export const StyleGuide: React.FC = () => {
  return (
    <div className="p-8 bg-gray-smoke min-h-screen">
      <h1 className="text-3xl font-bold text-navy mb-8">DentalHub UI Style Guide</h1>
      
      {/* Buttons Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-navy mb-4">Buttons</h2>
        <div className="flex flex-wrap gap-4">
          <Button variant="primary">Primary Button</Button>
          <Button variant="secondary">Secondary Button</Button>
          <Button variant="outline">Outline Button</Button>
          <Button variant="gold">Gold Button</Button>
          <Button variant="turquoise">Turquoise Button</Button>
          <Button variant="destructive">Destructive Button</Button>
          <Button variant="ghost">Ghost Button</Button>
          <Button variant="link">Link Button</Button>
        </div>
      </section>
      
      {/* Cards Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-navy mb-4">Cards</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Card Title</CardTitle>
              <CardDescription>Card description text goes here</CardDescription>
            </CardHeader>
            <CardContent>
              <p>This is the main content of the card. The card has a hover effect that adds a subtle glow.</p>
            </CardContent>
            <CardFooter>
              <Button variant="primary">Action</Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Patient Information</CardTitle>
              <CardDescription>View and manage patient details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-darker mb-1">Name</p>
                  <p className="font-medium">John Smith</p>
                </div>
                <div>
                  <p className="text-sm text-gray-darker mb-1">Next Appointment</p>
                  <p className="font-medium">June 15, 2025 - 10:30 AM</p>
                </div>
                <div>
                  <p className="text-sm text-gray-darker mb-1">Status</p>
                  <Badge variant="success">Active Patient</Badge>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="mr-2">Edit</Button>
              <Button variant="primary">View Details</Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Treatment Plan</CardTitle>
              <CardDescription>Upcoming procedures</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex justify-between">
                  <span>Dental Cleaning</span>
                  <Badge variant="info">Scheduled</Badge>
                </li>
                <li className="flex justify-between">
                  <span>X-Ray Review</span>
                  <Badge variant="secondary">Pending</Badge>
                </li>
                <li className="flex justify-between">
                  <span>Root Canal (Tooth #14)</span>
                  <Badge variant="warning">Requires Attention</Badge>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button variant="primary">Manage Plan</Button>
            </CardFooter>
          </Card>
        </div>
      </section>
      
      {/* Charts Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-navy mb-4">Charts</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Line Chart</CardTitle>
              <CardDescription>Navy-based stroke colors with opacity</CardDescription>
            </CardHeader>
            <CardContent>
              <LineChartComponent 
                data={sampleChartData.lineData}
                lines={[
                  { key: 'revenue', name: 'Monthly Revenue ($)' },
                  { key: 'patients', name: 'Patient Count', color: chartColors.gold.opacity }
                ]}
                xAxisKey="month"
                height={300}
              />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Bar Chart</CardTitle>
              <CardDescription>Rounded corners with brand colors</CardDescription>
            </CardHeader>
            <CardContent>
              <BarChartComponent 
                data={sampleChartData.barData}
                bars={[
                  { key: 'completed', name: 'Completed' },
                  { key: 'scheduled', name: 'Scheduled' }
                ]}
                xAxisKey="category"
                height={300}
              />
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Pie Chart</CardTitle>
              <CardDescription>Color system for segments with proper radius</CardDescription>
            </CardHeader>
            <CardContent>
              <PieChartComponent 
                data={sampleChartData.pieData}
                height={300}
              />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Stacked Bar Chart</CardTitle>
              <CardDescription>Stacked visualization with brand colors</CardDescription>
            </CardHeader>
            <CardContent>
              <BarChartComponent 
                data={sampleChartData.barData}
                bars={[
                  { key: 'completed', name: 'Completed' },
                  { key: 'scheduled', name: 'Scheduled' }
                ]}
                xAxisKey="category"
                height={300}
                stacked={true}
              />
            </CardContent>
          </Card>
        </div>
      </section>
      
      {/* Gradient Components Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-navy mb-4">Gradient Components</h2>
        <div className="space-y-6">
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-darker">Ocean Gradient</h4>
            <Progress value={75} variant="gradient-ocean" size="md" />
          </div>
          
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-darker">Gold Gradient</h4>
            <Progress value={60} variant="gradient-gold" size="md" />
          </div>
          
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-darker">Tropical Gradient</h4>
            <Progress value={45} variant="gradient-tropical" size="md" />
          </div>
          
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-darker">Royal Gradient</h4>
            <Progress value={90} variant="gradient-royal" size="md" />
          </div>
          
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-darker">Nature Gradient</h4>
            <Progress value={30} variant="gradient-nature" size="md" />
          </div>
          
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-darker">Corporate Gradient</h4>
            <Progress value={85} variant="gradient-corporate" size="md" />
          </div>
          
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-darker">Progress Sizes</h4>
            <div className="space-y-4">
              <Progress value={65} variant="gradient-ocean" size="sm" />
              <Progress value={65} variant="gradient-ocean" size="md" />
              <Progress value={65} variant="gradient-ocean" size="lg" />
            </div>
          </div>
          
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-darker">With Percentage</h4>
            <Progress value={42} variant="gradient-gold" size="md" showValue={true} />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="col-span-1">
            <StatsCard
              title="Total Revenue"
              value="$24,500"
              change={12.5}
              icon="DollarSign"
              variant="ocean"
            />
          </div>
          <div className="col-span-1">
            <StatsCard
              title="New Patients"
              value="143"
              change={-3.2}
              icon="Users"
              variant="gold"
            />
          </div>
          <div className="col-span-1">
            <StatsCard
              title="Appointments"
              value="287"
              change={5.8}
              icon="Calendar"
              variant="tropical"
            />
          </div>
          <div className="col-span-1">
            <StatsCard
              title="Treatment Success"
              value="92%"
              change={1.4}
              icon="HeartPulse"
              variant="royal"
              isGlowing={true}
            />
          </div>
          <div className="col-span-1">
            <StatsCard
              title="Retention Rate"
              value="89%"
              change={2.7}
              icon="Activity"
              variant="nature"
            />
          </div>
          <div className="col-span-1">
            <StatsCard
              title="Satisfaction"
              value="4.9/5"
              change={0.3}
              icon="Star"
              variant="corporate"
              isGlowing={true}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="col-span-1">
            <PracticeSnapshotCard
              title="Monthly Revenue"
              value="$124,500"
              change={8.2}
              icon="DollarSign"
              variant="ocean"
              linkTo="#"
              description="Total revenue for the current month"
            />
          </div>
          <div className="col-span-1">
            <PracticeSnapshotCard
              title="Patient Satisfaction"
              value="4.8/5"
              change={0.2}
              icon="Star"
              variant="gold"
              linkTo="#"
              description="Average rating from patient feedback"
              isGlowing={true}
            />
          </div>
          <div className="col-span-1">
            <PracticeSnapshotCard
              title="Treatment Completion"
              value="94%"
              change={3.1}
              icon="Award"
              variant="royal"
              linkTo="#"
              description="Percentage of completed treatment plans"
            />
          </div>
        </div>
      </section>
      
      {/* Inputs Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-navy mb-4">Inputs</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
          <div>
            <label className="block text-sm font-medium text-gray-darker mb-1">
              Standard Input
            </label>
            <Input placeholder="Enter text here..." />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-darker mb-1">
              Disabled Input
            </label>
            <Input disabled placeholder="This input is disabled" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-darker mb-1">
              Email Input
            </label>
            <Input type="email" placeholder="Enter your email" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-darker mb-1">
              Password Input
            </label>
            <Input type="password" placeholder="Enter your password" />
          </div>
        </div>
      </section>
      
      {/* Status Badges Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-navy mb-4">Status Badges</h2>
        <div className="flex flex-wrap gap-4">
          <Badge variant="default">Default</Badge>
          <Badge variant="primary">Primary</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="error">Error</Badge>
          <Badge variant="info">Info</Badge>
          <Badge variant="outline">Outline</Badge>
        </div>
      </section>
    </div>
  );
};

export default StyleGuide;
