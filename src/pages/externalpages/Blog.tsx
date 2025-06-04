import React from 'react';
import ExternalLayout from '@/components/external/ExternalLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const Blog = () => (
  <ExternalLayout>
    <section className="container mx-auto px-4 py-12 text-center space-y-6">
      <h1 className="text-3xl font-bold text-navy">Insights &amp; Perspectives for Modern Dental Practices</h1>
      <p className="text-gray-darker">Unconventional wisdom to help your practice thrive in a changing industry</p>
    </section>

    <section className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto text-center space-y-4">
        <p>Subscribe to Our Newsletter</p>
        <Input placeholder="Your email address" />
        <Button className="bg-gradient-to-r from-purple to-turquoise text-white w-full">Subscribe</Button>
      </div>
    </section>
  </ExternalLayout>
);

export default Blog;
