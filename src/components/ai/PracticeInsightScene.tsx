import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon, ChartIcons } from '../ui/icon-strategy';
import { SplineScene } from '../ui/splite';

interface PracticeInsightSceneProps {
  className?: string;
  splineScene?: string;
  onInteract?: () => void;
}

const PracticeInsightScene: React.FC<PracticeInsightSceneProps> = ({
  className,
  splineScene,
  onInteract
}) => {
  const [sceneError, setSceneError] = useState(false);

  // Fallback visualization when Spline scene fails to load
  const FallbackVisualization = () => (
    <div className="w-full h-[400px] bg-navy-lighter/5 flex flex-col items-center justify-center p-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div 
          className="bg-gradient-gold rounded-xl p-5 flex items-center text-white shadow-lg cursor-pointer"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onInteract?.('production')}
        >
          <div className="bg-white/20 p-3 rounded-full mr-4">
            <Icon name="BarChart" size={28} className="text-white" />
          </div>
          <div>
            <h3 className="font-bold text-xl">Production</h3>
            <p className="opacity-80 text-sm">$32,145 MTD</p>
          </div>
        </motion.div>
        
        <motion.div 
          className="bg-gradient-tropical rounded-xl p-5 flex items-center text-white shadow-lg cursor-pointer"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onInteract?.('trends')}
        >
          <div className="bg-white/20 p-3 rounded-full mr-4">
            <Icon name="trending" size={28} className="text-white" />
          </div>
          <div>
            <h3 className="font-bold text-xl">Trends</h3>
            <p className="opacity-80 text-sm">+12% Growth</p>
          </div>
        </motion.div>
        
        <motion.div 
          className="bg-gradient-royal rounded-xl p-5 flex items-center text-white shadow-lg cursor-pointer"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onInteract?.('growth')}
        >
          <div className="bg-white/20 p-3 rounded-full mr-4">
            <Icon name="TrendingUp" size={28} className="text-white" />
          </div>
          <div>
            <h3 className="font-bold text-xl">Growth</h3>
            <p className="opacity-80 text-sm">18 New Patients</p>
          </div>
        </motion.div>
      </div>
      
      <p className="text-navy-default text-center max-w-md">
        Interact with our AI Consultant to discover insights about your practice's performance and potential areas for growth.
      </p>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`w-full rounded-xl overflow-hidden shadow-glow-lg ${className}`}
    >
      {sceneError || !splineScene ? (
        <FallbackVisualization />
      ) : (
        <SplineScene
          scene={splineScene}
          className="w-full h-[400px]"
          title="Practice Performance Insights"
          subtitle="Interact with the 3D model to discover performance trends"
          interactionPrompt="Explore Practice Metrics"
          onSceneLoad={() => console.log("Scene loaded successfully")}
          onError={() => setSceneError(true)}
          spotlight={true}
          interactive={true}
        />
      )}

      <div className="bg-gradient-corporate p-4 text-white">
        <h3 className="text-lg font-bold mb-2 text-gold-default">Improve Your Practice Performance</h3>
        <p className="text-sm mb-4">
          Our AI-powered insights can help identify opportunities for growth and optimization in your practice.
        </p>
        <div className="flex justify-end">
          <button
            onClick={onInteract}
            className="px-4 py-2 bg-gold-default text-navy-default rounded-lg text-sm font-medium 
                     hover:bg-gold-light transition-colors flex items-center gap-2"
          >
            Get Started
            <span>→</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default PracticeInsightScene;
