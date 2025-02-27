import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Button } from '../../components/ui/button';
import DentalIcons, { DentalChart as DentalChartIcon, Tooth, Molar, DentalDrill } from '../../lib/dental-icons';
import DentalChart, { ToothData } from '../../components/dental/DentalChart';

// Sample data for demonstration
const initialTeeth: ToothData[] = [
  // Upper Right Quadrant
  { id: 1, position: 'UR1', status: 'healthy', treatment: '' },
  { id: 2, position: 'UR2', status: 'healthy', treatment: '' },
  { id: 3, position: 'UR3', status: 'needs-treatment', treatment: 'Crown needed' },
  { id: 4, position: 'UR4', status: 'healthy', treatment: '' },
  { id: 5, position: 'UR5', status: 'healthy', treatment: '' },
  { id: 6, position: 'URM1', status: 'treated', treatment: 'Filling (composite)' },
  { id: 7, position: 'URM2', status: 'healthy', treatment: '' },
  { id: 8, position: 'URM3', status: 'missing', treatment: '' },
  
  // Upper Left Quadrant
  { id: 9, position: 'UL1', status: 'healthy', treatment: '' },
  { id: 10, position: 'UL2', status: 'healthy', treatment: '' },
  { id: 11, position: 'UL3', status: 'healthy', treatment: '' },
  { id: 12, position: 'UL4', status: 'needs-treatment', treatment: 'Deep cleaning' },
  { id: 13, position: 'UL5', status: 'healthy', treatment: '' },
  { id: 14, position: 'ULM1', status: 'treated', treatment: 'Root canal' },
  { id: 15, position: 'ULM2', status: 'healthy', treatment: '' },
  { id: 16, position: 'ULM3', status: 'missing', treatment: '' },
  
  // Lower Right Quadrant
  { id: 17, position: 'LR1', status: 'healthy', treatment: '' },
  { id: 18, position: 'LR2', status: 'healthy', treatment: '' },
  { id: 19, position: 'LR3', status: 'healthy', treatment: '' },
  { id: 20, position: 'LR4', status: 'healthy', treatment: '' },
  { id: 21, position: 'LR5', status: 'needs-treatment', treatment: 'Possible extraction' },
  { id: 22, position: 'LRM1', status: 'treated', treatment: 'Filling (amalgam)' },
  { id: 23, position: 'LRM2', status: 'healthy', treatment: '' },
  { id: 24, position: 'LRM3', status: 'missing', treatment: '' },
  
  // Lower Left Quadrant
  { id: 25, position: 'LL1', status: 'healthy', treatment: '' },
  { id: 26, position: 'LL2', status: 'healthy', treatment: '' },
  { id: 27, position: 'LL3', status: 'healthy', treatment: '' },
  { id: 28, position: 'LL4', status: 'healthy', treatment: '' },
  { id: 29, position: 'LL5', status: 'needs-treatment', treatment: 'Cavity detected' },
  { id: 30, position: 'LLM1', status: 'healthy', treatment: '' },
  { id: 31, position: 'LLM2', status: 'healthy', treatment: '' },
  { id: 32, position: 'LLM3', status: 'missing', treatment: '' },
];

const treatments = [
  { name: 'Cleaning', icon: <DentalIcons.Toothbrush className="w-5 h-5 text-turquoise" />, cost: '$120', urgency: 'Low' },
  { name: 'Fillings (3)', icon: <DentalDrill className="w-5 h-5 text-blue" />, cost: '$450', urgency: 'Medium' },
  { name: 'Crown', icon: <Molar className="w-5 h-5 text-gold" />, cost: '$950', urgency: 'High' },
  { name: 'Root Canal', icon: <Tooth className="w-5 h-5 text-navy" />, cost: '$1,200', urgency: 'Medium' }
];

export const TreatmentPlan = () => {
  const [selectedTooth, setSelectedTooth] = useState<ToothData | null>(null);
  const [teeth, setTeeth] = useState<ToothData[]>(initialTeeth);

  const handleToothClick = (toothId: number) => {
    const tooth = teeth.find(t => t.id === toothId) || null;
    setSelectedTooth(tooth);
  };

  return (
    <div className="container mx-auto py-6 max-w-6xl">
      <div className="flex items-center mb-6">
        <DentalChartIcon className="w-7 h-7 mr-3 text-navy" />
        <h1 className="text-2xl font-semibold text-gray-900">Treatment Plan</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Dental Chart Section */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg border border-gray-200 p-4"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Dental Chart</h2>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Icons.Printer className="w-4 h-4 mr-2" />
                  Print
                </Button>
                <Button variant="outline" size="sm">
                  <Icons.Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
            <DentalChart teeth={teeth} onToothClick={handleToothClick} />
          </motion.div>
        </div>

        {/* Treatment Information */}
        <div className="lg:col-span-1">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 h-full"
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Treatment Information</h2>
            
            {selectedTooth ? (
              <div className="space-y-4">
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  {selectedTooth.position.includes('M') ? 
                    <Molar className={`w-8 h-8 mr-3 ${getStatusColorClass(selectedTooth.status)}`} /> : 
                    <Tooth className={`w-8 h-8 mr-3 ${getStatusColorClass(selectedTooth.status)}`} />
                  }
                  <div>
                    <h3 className="font-medium">Tooth #{selectedTooth.id}</h3>
                    <p className="text-sm text-gray-500">{getPositionName(selectedTooth.position)}</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-2">Status</h3>
                  <div className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(selectedTooth.status)}`}>
                    {getStatusName(selectedTooth.status)}
                  </div>
                </div>

                {selectedTooth.treatment && (
                  <div>
                    <h3 className="text-sm font-medium mb-2">Recommended Treatment</h3>
                    <p className="text-sm bg-gold/10 text-gold-darker p-2 rounded">
                      {selectedTooth.treatment}
                    </p>
                  </div>
                )}

                <Button className="w-full bg-navy hover:bg-navy-light">
                  Update Treatment
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-gray-500 text-sm">Select a tooth from the chart to see details and treatment options.</p>
                
                <div className="mt-6">
                  <h3 className="text-sm font-medium mb-3">Recommended Treatments</h3>
                  <div className="space-y-3">
                    {treatments.map((treatment, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center">
                          {treatment.icon}
                          <span className="ml-2 font-medium">{treatment.name}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-sm mr-3">{treatment.cost}</span>
                          <div className={`px-2 py-0.5 rounded-full text-xs ${getUrgencyBadgeClass(treatment.urgency)}`}>
                            {treatment.urgency}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-500">Subtotal:</span>
                    <span className="font-medium">$2,720</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-500">Insurance coverage:</span>
                    <span className="font-medium">-$1,632</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-gray-200">
                    <span className="font-medium">Patient responsibility:</span>
                    <span className="font-semibold text-navy">$1,088</span>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

// Helper functions
function getStatusName(status: ToothData['status']): string {
  switch (status) {
    case 'healthy': return 'Healthy';
    case 'treated': return 'Treated';
    case 'needs-treatment': return 'Needs Treatment';
    case 'missing': return 'Missing';
    default: return 'Unknown';
  }
}

function getStatusColorClass(status: ToothData['status']): string {
  switch (status) {
    case 'healthy': return 'text-green';
    case 'treated': return 'text-navy';
    case 'needs-treatment': return 'text-gold';
    case 'missing': return 'text-gray-dark';
    default: return 'text-gray';
  }
}

function getStatusBadgeClass(status: ToothData['status']): string {
  switch (status) {
    case 'healthy': return 'bg-green/10 text-green';
    case 'treated': return 'bg-navy/10 text-navy';
    case 'needs-treatment': return 'bg-gold/10 text-gold-darker';
    case 'missing': return 'bg-gray-darker/10 text-gray-darker';
    default: return 'bg-gray-light text-gray-darker';
  }
}

function getUrgencyBadgeClass(urgency: string): string {
  switch (urgency) {
    case 'Low': return 'bg-green/10 text-green';
    case 'Medium': return 'bg-gold/10 text-gold-darker';
    case 'High': return 'bg-red-500/10 text-red-500';
    default: return 'bg-gray-light text-gray-darker';
  }
}

function getPositionName(position: string): string {
  // Extract quadrant and position
  const quadrant = position.substring(0, 2);
  const isBack = position.includes('M');
  const number = position.replace(/[^\d]/g, '');
  
  let quadrantName = '';
  switch (quadrant) {
    case 'UR': quadrantName = 'Upper Right'; break;
    case 'UL': quadrantName = 'Upper Left'; break;
    case 'LR': quadrantName = 'Lower Right'; break;
    case 'LL': quadrantName = 'Lower Left'; break;
  }
  
  const toothType = isBack ? 'Molar' : 'Incisor/Canine/Premolar';
  
  return `${quadrantName} ${toothType} ${number}`;
}

export default TreatmentPlan;
