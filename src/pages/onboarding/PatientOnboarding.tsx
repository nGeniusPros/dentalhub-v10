import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import OnboardingStep from '../../components/OnboardingStep';

const PatientOnboarding = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  
  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete onboarding
      navigate('/patient-dashboard');
    }
  };
  
  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const handleSkip = () => {
    navigate('/patient-dashboard');
  };
  
  const steps = [
    {
      title: "Welcome to Your Dental Hub",
      description: "Your one-stop destination for managing your dental health and appointments from anywhere, anytime.",
      illustration: "/illustrations/characters-with-objects/charaters w objects style 2/16.png"
    },
    {
      title: "Schedule Appointments Easily",
      description: "Find the perfect time slot for your next visit and book appointments with just a few clicks.",
      illustration: "/illustrations/characters-with-objects/charaters w objects style 2/17.png"
    },
    {
      title: "Access Your Dental Records",
      description: "View your complete dental history, prescriptions, and treatment plans securely online.",
      illustration: "/illustrations/characters-with-objects/charaters w objects style 2/18.png"
    },
    {
      title: "Get Important Notifications",
      description: "Stay informed with timely reminders about upcoming appointments and payment due dates.",
      illustration: "/illustrations/characters-with-objects/charaters w objects style 2/19.png"
    }
  ];
  
  const currentStepData = steps[currentStep - 1];
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-lighter">
      <OnboardingStep
        title={currentStepData.title}
        description={currentStepData.description}
        illustration={currentStepData.illustration}
        currentStep={currentStep}
        totalSteps={steps.length}
        onNext={handleNext}
        onPrevious={handlePrevious}
        onSkip={handleSkip}
        isLastStep={currentStep === steps.length}
      />
    </div>
  );
};

export default PatientOnboarding;
