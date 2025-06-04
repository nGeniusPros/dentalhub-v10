import React from 'react';
import ExternalLayout from '@/components/external/ExternalLayout';
import { Button } from '@/components/ui/button';

const About = () => (
  <ExternalLayout>
    <section className="container mx-auto px-4 py-12 space-y-6">
      <h1 className="text-3xl font-bold text-navy">About nGenius Pros</h1>
      <p className="text-gray-darker">Transforming Dental Practice Management</p>
      <p>We're on a mission to help dental practices thrive by streamlining operations, maximizing revenue, and enhancing patient care.</p>
    </section>

    <section className="container mx-auto px-4 py-8 space-y-4">
      <h2 className="text-2xl font-bold text-navy">Our Story</h2>
      <p>Founded in 2022, nGenius Pros emerged from a simple observation: dental practices were spending too much time on administrative tasks and not enough time with patients.</p>
      <p>Today, nGenius Pros offers comprehensive solutions for dental practices of all sizes, from solo practitioners to large DSOs.</p>
    </section>

    <section className="container mx-auto px-4 py-8 space-y-4">
      <h2 className="text-2xl font-bold text-navy">Our Mission &amp; Values</h2>
      <ul className="list-disc pl-5 space-y-2 text-gray-darker">
        <li>Innovation</li>
        <li>Integrity</li>
        <li>Excellence</li>
        <li>Partnership</li>
      </ul>
    </section>

    <section className="container mx-auto px-4 py-8 text-center">
      <Button className="bg-gradient-to-r from-purple to-turquoise text-white">Schedule a Free Consultation</Button>
    </section>
  </ExternalLayout>
);

export default About;
