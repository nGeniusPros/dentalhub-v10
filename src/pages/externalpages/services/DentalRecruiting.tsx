import React from 'react';
import ExternalLayout from '@/components/external/ExternalLayout';
import { Button } from '@/components/ui/button';

const DentalRecruiting = () => (
  <ExternalLayout>
    <section className="container mx-auto px-4 py-12 space-y-6">
      <h1 className="text-3xl font-bold text-navy">Strategic Dental Recruiting</h1>
      <p className="text-lg text-gray-darker">Find and Retain Top Dental Talent</p>
      <p>Our specialized dental recruiting services help you build a skilled, reliable team that elevates your practice and enhances patient care.</p>
      <Button className="bg-gradient-to-r from-purple to-turquoise text-white">Schedule a Free Consultation</Button>
    </section>

    <section className="container mx-auto px-4 py-12 space-y-4">
      <h2 className="text-2xl font-bold text-navy">Dental Staffing Challenges</h2>
      <h3 className="font-semibold">Talent Shortage</h3>
      <p>The dental industry faces a critical shortage of qualified hygienists, assistants, and administrative staff, making it increasingly difficult to find skilled professionals.</p>
      <h3 className="font-semibold">High Turnover</h3>
      <p>Dental practices often struggle with staff retention, leading to constant recruitment cycles, training costs, and disruption to patient care.</p>
      <h3 className="font-semibold">Time-Consuming Process</h3>
      <p>Practice owners and office managers spend countless hours on job postings, resume screening, and interviews, taking valuable time away from patients and practice management.</p>
    </section>

    <section className="container mx-auto px-4 py-12 space-y-4">
      <h2 className="text-2xl font-bold text-navy">Our Dental Recruiting Solution</h2>
      <p>nGenius Pros offers a comprehensive recruiting service designed specifically for dental practices. Our team of specialized recruiters understands the unique staffing needs of dental offices and has built an extensive network of qualified candidates.</p>
      <p>We handle every aspect of the recruiting process, from creating compelling job descriptions to screening candidates, conducting initial interviews, and facilitating final hiring decisions. Our approach is both thorough and efficient, ensuring you find the right fit for your practice culture.</p>
      <p>By partnering with nGenius Pros for your recruiting needs, you can reduce the time and stress associated with hiring, improve staff retention, and build a team that contributes to practice growth and patient satisfaction.</p>
    </section>

    <section className="container mx-auto px-4 py-12">
      <h2 className="text-2xl font-bold text-navy mb-4">Our Comprehensive Recruiting Services</h2>
      <ul className="list-disc pl-5 space-y-2 text-gray-darker">
        <li>Needs Assessment</li>
        <li>Strategic Sourcing</li>
        <li>Thorough Screening</li>
        <li>Candidate Presentation</li>
        <li>Interview Coordination</li>
        <li>Onboarding Support</li>
      </ul>
    </section>

    <section className="container mx-auto px-4 py-12">
      <h2 className="text-2xl font-bold text-navy mb-4">Benefits of Our Dental Recruiting Services</h2>
      <ul className="list-disc pl-5 space-y-2 text-gray-darker">
        <li>Access to Top Talent</li>
        <li>Time Savings</li>
        <li>Improved Retention</li>
        <li>Reduced Hiring Costs</li>
      </ul>
    </section>

    <section className="container mx-auto px-4 py-12 text-center space-y-4">
      <h2 className="text-2xl font-bold text-navy">Ready to Build Your Dream Dental Team?</h2>
      <Button className="bg-gradient-to-r from-purple to-turquoise text-white">Schedule a Free Consultation</Button>
    </section>
  </ExternalLayout>
);

export default DentalRecruiting;
