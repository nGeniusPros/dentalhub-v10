import React from 'react';
import { HeroWithMockup } from '../components/HeroWithMockup';
import mockupImage from '../assets/images/mockup-example.svg';

export function HeroExample() {
  return (
    <HeroWithMockup
      title="Dental Hub: Modern Practice Management"
      subtitle="Next-Gen Solution"
      description="Streamline your dental practice with our all-in-one platform. From patient management to billing, we've got you covered."
      primaryCta={{
        text: "Get Started",
        href: "/signup",
      }}
      secondaryCta={{
        text: "Schedule Demo",
        href: "/demo",
      }}
      mockupImage={{
        src: mockupImage,
        alt: "Dental Hub Dashboard",
        width: 1280,
        height: 768
      }}
      gradientVariant="ocean"
    />
  );
}

// Add examples with other gradient variants
export function GoldHeroExample() {
  return (
    <HeroWithMockup
      title="Premium Patient Management"
      subtitle="Gold Standard"
      description="Elevate your practice with our premium dental management solution. Designed for practices that demand excellence."
      primaryCta={{
        text: "Explore Features",
        href: "/features",
      }}
      secondaryCta={{
        text: "View Pricing",
        href: "/pricing",
      }}
      mockupImage={{
        src: mockupImage,
        alt: "Dental Hub Premium Dashboard",
        width: 1280,
        height: 768
      }}
      gradientVariant="gold"
    />
  );
}

// Royal variant example
export function RoyalHeroExample() {
  return (
    <HeroWithMockup
      title="Advanced Analytics Dashboard"
      subtitle="Powerful Insights"
      description="Gain deep insights into your practice performance with our analytics tools. Make data-driven decisions easily."
      primaryCta={{
        text: "View Analytics",
        href: "/analytics",
      }}
      secondaryCta={{
        text: "GitHub",
        href: "https://github.com/nGeniusPros/dentalhub",
      }}
      mockupImage={mockupImage}
      gradientVariant="royal"
    />
  );
}

// Tropical variant for a lighter feel
export function TropicalHeroExample() {
  return (
    <HeroWithMockup
      title="Streamlined Patient Experience"
      subtitle="User-Friendly"
      description="Create a seamless experience for your patients from appointment booking to follow-up care."
      primaryCta={{
        text: "Patient Portal",
        href: "/patient-portal",
      }}
      mockupImage={mockupImage}
      gradientVariant="tropical"
    />
  );
}
