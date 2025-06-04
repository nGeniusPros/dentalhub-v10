import React from 'react';
import ExternalLayout from '@/components/external/ExternalLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Contact = () => (
  <ExternalLayout>
    <section className="container mx-auto px-4 py-12 text-center space-y-6">
      <h1 className="text-3xl font-bold text-navy">Contact Us</h1>
      <p className="text-gray-darker">Have questions about our services? Ready to transform your dental practice? We're here to help.</p>
    </section>

    <section className="container mx-auto px-4 py-8 space-y-4 max-w-md">
      <Input placeholder="First Name" />
      <Input placeholder="Last Name" />
      <Input placeholder="Email Address" />
      <Input placeholder="Phone Number" />
      <Input placeholder="Practice Name" />
      <Input placeholder="I'm Interested In" />
      <Input placeholder="Message" />
      <Button className="bg-gradient-to-r from-purple to-turquoise text-white w-full">Send Message</Button>
    </section>
  </ExternalLayout>
);

export default Contact;
