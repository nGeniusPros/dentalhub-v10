import React from 'react';
import ExternalLayout from '@/components/external/ExternalLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Resources = () => (
  <ExternalLayout>
    <section className="container mx-auto px-4 py-12 text-center space-y-6">
      <h1 className="text-3xl font-bold text-navy">Unlock Your Practice Potential</h1>
      <p className="text-gray-darker">Insights &amp; Tools from nGenius Pros to Transform Your Dental Practice</p>
    </section>

    <section className="container mx-auto px-4 py-8 space-y-4">
      <h2 className="text-2xl font-bold text-navy">Featured Resources</h2>
      <p>Comprehensive guides, tools, and insights to help your dental practice thrive</p>
      <ul className="list-disc pl-5 space-y-2 text-gray-darker">
        <li>Decoding Dental AI: A Practice Owner's Guide to Separating Transformative Technology from Trends</li>
        <li>The Burnout Epidemic in Dentistry: AI-Driven Strategies for a Healthier, More Productive Practice</li>
      </ul>
    </section>

    <section className="container mx-auto px-4 py-12 text-center space-y-4">
      <h2 className="text-2xl font-bold text-navy">Stay Updated with the Latest Resources</h2>
      <p>Subscribe to our newsletter to receive new resources, insights, and updates directly to your inbox.</p>
      <div className="max-w-md mx-auto space-y-4">
        <Input placeholder="Full Name" />
        <Input placeholder="Email Address" />
        <Input placeholder="Practice Name (Optional)" />
        <Button className="bg-gradient-to-r from-purple to-turquoise text-white w-full">Subscribe Now</Button>
      </div>
      <p className="text-sm text-gray-dark">We respect your privacy. Unsubscribe at any time.</p>
    </section>
  </ExternalLayout>
);

export default Resources;
