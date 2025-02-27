import React from 'react';
import { Button } from '../../components/ui/button';
import { motion } from 'framer-motion';

const GradientTester = () => {
  const gradientVariants = [
    'ocean',
    'gold',
    'tropical',
    'royal',
    'nature',
    'corporate'
  ];

  return (
    <div className="max-w-7xl mx-auto py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold mb-6">Gradient System Test</h1>
        <p className="text-gray-600 mb-8">
          This page demonstrates all available gradient variants in the DentalHub UI system.
        </p>
      </motion.div>

      {/* Background Gradients Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Background Gradients</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gradientVariants.map((variant) => (
            <div
              key={`bg-${variant}`}
              className={`p-8 rounded-lg shadow-md bg-gradient-${variant}`}
            >
              <h3 className={`text-xl font-medium ${['gold', 'tropical', 'nature'].includes(variant) ? 'text-navy' : 'text-white'}`}>
                {variant.charAt(0).toUpperCase() + variant.slice(1)}
              </h3>
              <code className={`mt-2 text-sm block ${['gold', 'tropical', 'nature'].includes(variant) ? 'text-navy opacity-70' : 'text-white opacity-70'}`}>
                bg-gradient-{variant}
              </code>
            </div>
          ))}
        </div>
      </div>

      {/* Text Gradients Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Text Gradients</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gradientVariants.map((variant) => (
            <div
              key={`text-${variant}`}
              className="p-8 rounded-lg shadow-md bg-white"
            >
              <h3 className={`text-2xl font-bold bg-gradient-${variant} text-transparent bg-clip-text`}>
                {variant.charAt(0).toUpperCase() + variant.slice(1)} Text
              </h3>
              <code className="mt-2 text-sm block text-gray-500">
                bg-gradient-{variant} + text-transparent + bg-clip-text
              </code>
            </div>
          ))}
        </div>
      </div>

      {/* Button Gradients Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Button Gradients</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gradientVariants.map((variant) => (
            <div
              key={`button-${variant}`}
              className="p-8 rounded-lg shadow-md bg-white"
            >
              <Button
                variant={`gradient-${variant}` as any}
                className="w-full"
              >
                {variant.charAt(0).toUpperCase() + variant.slice(1)} Button
              </Button>
              <code className="mt-4 text-sm block text-gray-500">
                variant="gradient-{variant}"
              </code>
            </div>
          ))}
        </div>
      </div>

      {/* Custom Combinations Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Custom Gradient Combinations</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Card with gradient header */}
          <div className="rounded-lg shadow-md overflow-hidden">
            <div className="bg-gradient-royal p-6">
              <h3 className="text-xl font-semibold text-white">Gradient Header Card</h3>
            </div>
            <div className="bg-white p-6">
              <p className="text-gray-700">Card content with gradient header section. This pattern can be used for sectional UI elements.</p>
            </div>
          </div>

          {/* Card with gradient border */}
          <div className="rounded-lg p-[2px] bg-gradient-tropical">
            <div className="bg-white p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-navy mb-3">Gradient Border Card</h3>
              <p className="text-gray-700">Card content with gradient border. This creates a subtle highlight effect around the card.</p>
            </div>
          </div>

          {/* Card with gradient overlay */}
          <div className="relative rounded-lg shadow-md overflow-hidden">
            <div className="absolute inset-0 bg-gradient-ocean opacity-90"></div>
            <div className="relative p-6">
              <h3 className="text-xl font-semibold text-white mb-3">Gradient Overlay Card</h3>
              <p className="text-white opacity-80">Card with a gradient overlay that allows content to show through with proper contrast.</p>
            </div>
          </div>

          {/* Card with gradient text and border */}
          <div className="rounded-lg p-[1px] bg-gradient-gold">
            <div className="bg-white p-6 rounded-lg">
              <h3 className="text-xl font-semibold bg-gradient-gold text-transparent bg-clip-text mb-3">Gradient Text and Border</h3>
              <p className="text-gray-700">Card with both gradient text and a gradient border for emphasis.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GradientTester;
