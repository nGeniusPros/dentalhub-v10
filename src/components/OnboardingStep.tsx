import React from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';

type OnboardingStepProps = {
  title: string;
  description: string;
  illustration: string;
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onPrevious: () => void;
  onSkip?: () => void;
  isLastStep?: boolean;
};

const OnboardingStep: React.FC<OnboardingStepProps> = ({
  title,
  description,
  illustration,
  currentStep,
  totalSteps,
  onNext,
  onPrevious,
  onSkip,
  isLastStep = false,
}) => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1 
      } 
    },
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.5 }
    },
  };

  return (
    <motion.div 
      className="flex flex-col items-center p-6 max-w-4xl mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Progress indicator */}
      <motion.div className="w-full mb-6" variants={itemVariants}>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-darker">
            Step {currentStep} of {totalSteps}
          </span>
          {onSkip && (
            <button 
              onClick={onSkip}
              className="text-sm text-navy hover:underline"
            >
              Skip
            </button>
          )}
        </div>
        <div className="h-2 bg-gray-light rounded-full overflow-hidden">
          <div 
            className="h-full bg-navy" 
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
      </motion.div>
      
      {/* Illustration */}
      <motion.div className="mb-8" variants={itemVariants}>
        <img 
          src={illustration} 
          alt={title} 
          className="max-w-full h-auto max-h-72"
        />
      </motion.div>
      
      {/* Content */}
      <motion.h2 
        className="text-2xl font-bold text-navy mb-4 text-center"
        variants={itemVariants}
      >
        {title}
      </motion.h2>
      
      <motion.p 
        className="text-gray-darker mb-8 text-center max-w-md"
        variants={itemVariants}
      >
        {description}
      </motion.p>
      
      {/* Navigation buttons */}
      <motion.div 
        className="flex gap-4 justify-center"
        variants={itemVariants}
      >
        {currentStep > 1 && (
          <button
            onClick={onPrevious}
            className="px-4 py-2 border border-navy text-navy rounded-lg hover:bg-navy hover:text-white transition-colors flex items-center gap-2"
          >
            <Icons.ArrowLeft size={16} />
            Previous
          </button>
        )}
        
        <button
          onClick={onNext}
          className="px-4 py-2 bg-navy text-white rounded-lg hover:bg-navy-light transition-colors flex items-center gap-2"
        >
          {isLastStep ? 'Get Started' : 'Next'}
          {!isLastStep && <Icons.ArrowRight size={16} />}
        </button>
      </motion.div>
    </motion.div>
  );
};

export default OnboardingStep;
