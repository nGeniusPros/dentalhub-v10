import React from 'react';
import ExternalLayout from '@/components/external/ExternalLayout';
import { Button } from '@/components/ui/button';

const Careers = () => (
  <ExternalLayout>
    <section className="container mx-auto px-4 py-12 space-y-6 text-center">
      <h1 className="text-3xl font-bold text-navy">Join Our Team</h1>
      <p className="text-gray-darker">Help Transform Dental Practices</p>
      <p>At nGenius Pros, we're looking for talented individuals who are passionate about helping dental practices thrive.</p>
    </section>

    <section className="container mx-auto px-4 py-8 space-y-4">
      <h2 className="text-2xl font-bold text-navy">Why Work With Us</h2>
      <ul className="list-disc pl-5 space-y-2 text-gray-darker">
        <li>Competitive Compensation</li>
        <li>Professional Development</li>
        <li>Work-Life Balance</li>
        <li>Collaborative Culture</li>
      </ul>
    </section>

    <section className="container mx-auto px-4 py-8 text-center">
      <Button className="bg-gradient-to-r from-purple to-turquoise text-white">View All Openings</Button>
    </section>
  </ExternalLayout>
);

export default Careers;
