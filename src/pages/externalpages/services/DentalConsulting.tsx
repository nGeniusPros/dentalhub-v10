import React from 'react';
import ExternalLayout from '@/components/external/ExternalLayout';
import { Button } from '@/components/ui/button';

const DentalConsulting = () => (
  <ExternalLayout>
    <section className="container mx-auto px-4 py-12 space-y-6">
      <h1 className="text-3xl font-bold text-navy">Expert Dental Practice Consulting</h1>
      <p className="text-lg text-gray-darker">Optimize Operations, Maximize Profitability</p>
      <p>Our specialized dental consulting services help you streamline workflows, enhance patient experience, and boost your practice's financial performance.</p>
      <Button className="bg-gradient-to-r from-purple to-turquoise text-white">Schedule a Free Consultation</Button>
    </section>

    <section className="container mx-auto px-4 py-12 space-y-4">
      <h2 className="text-2xl font-bold text-navy">Common Practice Management Challenges</h2>
      <h3 className="font-semibold">Operational Inefficiencies</h3>
      <p>Many dental practices struggle with workflow bottlenecks, scheduling issues, and administrative inefficiencies that limit productivity and growth.</p>
      <h3 className="font-semibold">Declining Profitability</h3>
      <p>Increasing costs, changing reimbursement models, and competitive pressures can erode practice profitability without strategic management.</p>
      <h3 className="font-semibold">Growth Plateaus</h3>
      <p>Practices often hit growth ceilings due to capacity constraints, marketing limitations, or inability to scale systems and processes effectively.</p>
    </section>

    <section className="container mx-auto px-4 py-12 space-y-4">
      <h2 className="text-2xl font-bold text-navy">Our Dental Consulting Solution</h2>
      <p>nGenius Pros offers comprehensive practice consulting services designed specifically for dental practices. Our team of experienced consultants brings expertise in practice management, operations, finance, and marketing to help you overcome challenges and achieve your goals.</p>
      <p>We take a data-driven approach to identify opportunities for improvement and develop customized strategies that align with your practice vision. Our consultants work collaboratively with your team to implement changes and measure results.</p>
      <p>By partnering with nGenius Pros for consulting services, you gain access to specialized expertise that can transform your practice operations, enhance patient experience, and drive sustainable growth and profitability.</p>
    </section>

    <section className="container mx-auto px-4 py-12">
      <h2 className="text-2xl font-bold text-navy mb-4">Our Comprehensive Consulting Services</h2>
      <ul className="list-disc pl-5 space-y-2 text-gray-darker">
        <li>Practice Assessment</li>
        <li>Strategic Planning</li>
        <li>Operational Optimization</li>
        <li>Financial Management</li>
        <li>Team Development</li>
        <li>Technology Integration</li>
      </ul>
    </section>

    <section className="container mx-auto px-4 py-12">
      <h2 className="text-2xl font-bold text-navy mb-4">Benefits of Our Dental Consulting Services</h2>
      <ul className="list-disc pl-5 space-y-2 text-gray-darker">
        <li>Increased Efficiency</li>
        <li>Enhanced Profitability</li>
        <li>Sustainable Growth</li>
        <li>Improved Team Performance</li>
      </ul>
    </section>

    <section className="container mx-auto px-4 py-12 text-center space-y-4">
      <h2 className="text-2xl font-bold text-navy">Ready to Transform Your Dental Practice?</h2>
      <Button className="bg-gradient-to-r from-purple to-turquoise text-white">Schedule a Free Consultation</Button>
    </section>
  </ExternalLayout>
);

export default DentalConsulting;
