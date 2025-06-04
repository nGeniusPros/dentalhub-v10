import React from 'react';
import ExternalLayout from '@/components/external/ExternalLayout';
import { Button } from '@/components/ui/button';

const DentalBilling = () => (
  <ExternalLayout>
    <section className="container mx-auto px-4 py-12 space-y-6">
      <h1 className="text-3xl font-bold text-navy">Expert Dental Billing Services</h1>
      <p className="text-lg text-gray-darker">Maximize Revenue, Minimize Hassle</p>
      <p>Our specialized dental billing services help you increase collections, reduce claim denials, and streamline your revenue cycle so you can focus on what matters most - your patients.</p>
      <Button className="bg-gradient-to-r from-purple to-turquoise text-white">Schedule a Free Consultation</Button>
    </section>

    <section className="container mx-auto px-4 py-12 space-y-4">
      <h2 className="text-2xl font-bold text-navy">Common Dental Billing Challenges</h2>
      <h3 className="font-semibold">High Claim Denial Rates</h3>
      <p>Dental practices often face claim denials due to coding errors, missing information, or insurance policy changes, resulting in delayed or lost revenue.</p>
      <h3 className="font-semibold">Staff Overwhelm</h3>
      <p>In-house billing teams often struggle to keep up with the volume of claims, insurance follow-ups, and patient billing inquiries, leading to burnout and errors.</p>
      <h3 className="font-semibold">Cash Flow Issues</h3>
      <p>Delayed claim submissions, slow insurance payments, and inefficient collection processes can create serious cash flow problems for dental practices.</p>
    </section>

    <section className="container mx-auto px-4 py-12 space-y-4">
      <h2 className="text-2xl font-bold text-navy">Our Dental Billing Solution</h2>
      <p>nGenius Pros offers comprehensive dental billing services designed specifically for dental practices. Our team of experienced billing specialists handles every aspect of your revenue cycle, from claim submission to payment posting and everything in between.</p>
      <p>We leverage advanced technology and industry best practices to maximize your collections, reduce denials, and accelerate your cash flow. Our approach is both proactive and responsive, ensuring that nothing falls through the cracks.</p>
      <p>By outsourcing your dental billing to nGenius Pros, you can reduce overhead costs, improve cash flow, and free up your team to focus on providing exceptional patient care.</p>
    </section>

    <section className="container mx-auto px-4 py-12">
      <h2 className="text-2xl font-bold text-navy mb-4">Our Comprehensive Billing Services</h2>
      <ul className="list-disc pl-5 space-y-2 text-gray-darker">
        <li>Insurance Verification</li>
        <li>Claim Preparation &amp; Submission</li>
        <li>Denial Management</li>
        <li>Insurance Follow-Up</li>
        <li>Patient Billing &amp; Collections</li>
        <li>Reporting &amp; Analytics</li>
      </ul>
    </section>

    <section className="container mx-auto px-4 py-12">
      <h2 className="text-2xl font-bold text-navy mb-4">Benefits of Our Dental Billing Services</h2>
      <ul className="list-disc pl-5 space-y-2 text-gray-darker">
        <li>Increased Revenue</li>
        <li>Faster Payments</li>
        <li>Reduced Stress</li>
      </ul>
    </section>

    <section className="container mx-auto px-4 py-12 text-center space-y-4">
      <h2 className="text-2xl font-bold text-navy">Ready to Maximize Your Dental Practice Revenue?</h2>
      <Button className="bg-gradient-to-r from-purple to-turquoise text-white">Schedule a Free Consultation</Button>
    </section>
  </ExternalLayout>
);

export default DentalBilling;
