import React from 'react';
import FeatureHighlight from '../../components/FeatureHighlight';

const FeatureShowcase = () => {
  return (
    <div className="max-w-7xl mx-auto py-12 px-4">
      <div className="text-center mb-16">
        <h1 className="text-3xl font-bold text-navy mb-4">Dental Hub Features</h1>
        <p className="text-gray-darker max-w-2xl mx-auto">
          Explore the powerful features that make Dental Hub the perfect solution for modern dental practices
        </p>
      </div>
      
      <div className="space-y-16">
        <FeatureHighlight
          title="Smart Appointment Scheduling"
          description="Our intelligent scheduling system optimizes your calendar automatically, reducing gaps between appointments and maximizing your productivity. Patients can book appointments online, and the system will send automated reminders to minimize no-shows."
          illustration="/illustrations/characters/charater style 2/3.png"
          direction="right"
          ctaButton={{
            label: "Learn More",
            onClick: () => console.log("Navigate to appointment feature details")
          }}
        />
        
        <FeatureHighlight
          title="Comprehensive Patient Management"
          description="Maintain detailed patient records including medical history, treatment plans, images, and documents all in one secure location. Access patient information instantly from any device, making patient care seamless and efficient."
          illustration="/illustrations/characters/charater style 2/6.png"
          direction="left"
          ctaButton={{
            label: "See How It Works",
            onClick: () => console.log("Navigate to patient management demo")
          }}
        />
        
        <FeatureHighlight
          title="Advanced Treatment Planning"
          description="Create detailed treatment plans with visual timelines that patients can easily understand. Track progress, automate follow-ups, and ensure no treatment step is missed with our comprehensive planning tools."
          illustration="/illustrations/characters/charater style 2/5.png"
          direction="right"
          ctaButton={{
            label: "Explore Features",
            onClick: () => console.log("Navigate to treatment planning details")
          }}
        />
        
        <FeatureHighlight
          title="Seamless Billing & Insurance"
          description="Streamline your financial workflows with integrated billing, payment processing, and insurance claim management. Generate professional invoices, track payments, and handle insurance claims efficiently all within the same platform."
          illustration="/illustrations/characters/charater style 2/12.png"
          direction="left"
          ctaButton={{
            label: "View Billing Features",
            onClick: () => console.log("Navigate to billing features")
          }}
        />
        
        <FeatureHighlight
          title="AI-Powered Insights"
          description="Leverage artificial intelligence to gain valuable insights into your practice performance, patient trends, and treatment outcomes. Make data-driven decisions to improve patient care and practice efficiency."
          illustration="/illustrations/characters/charater style 2/14.png"
          direction="right"
          ctaButton={{
            label: "Discover AI Features",
            onClick: () => console.log("Navigate to AI insights demo")
          }}
        />
      </div>
      
      <div className="mt-16 text-center">
        <h2 className="text-2xl font-bold text-navy mb-4">Ready to Transform Your Dental Practice?</h2>
        <p className="text-gray-darker max-w-2xl mx-auto mb-8">
          Join thousands of dental professionals who have already enhanced their practice with Dental Hub.
        </p>
        <button className="px-6 py-3 bg-navy text-white rounded-lg hover:bg-navy-light transition-colors">
          Get Started Today
        </button>
      </div>
    </div>
  );
};

export default FeatureShowcase;
