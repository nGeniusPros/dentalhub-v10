import React from 'react';
import * as Icons from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';

// Types
interface Campaign {
  id: string;
  name: string;
  numberPool: string;
  timezone: string;
  totalContacts: number;
  dateCreated: string;
  status: 'active' | 'inactive';
  description?: string;
}

interface CampaignSequenceProps {
  campaign: Campaign;
}

interface SequenceStep {
  id: string;
  type: 'sms' | 'email' | 'voice' | 'delay';
  content?: string;
  delay?: {
    value: number;
    unit: 'minutes' | 'hours' | 'days';
  };
  condition?: string;
}

// Mock sequence steps
const mockSequenceSteps: SequenceStep[] = [
  {
    id: '1',
    type: 'sms',
    content: 'Hi {{firstName}}, this is Dr. Smith from OC Smile Experts. We are offering a limited-time dental grant program and thought you might be interested. Would you like to learn more?'
  },
  {
    id: '2',
    type: 'delay',
    delay: {
      value: 2,
      unit: 'days'
    },
    condition: 'If no response'
  },
  {
    id: '3',
    type: 'sms',
    content: 'Hi {{firstName}}, Dr. Smith from OC Smile Experts again. Just checking if you received my previous message about our dental grant program. It could save you up to 60% on dental procedures. Interested?'
  },
  {
    id: '4',
    type: 'delay',
    delay: {
      value: 3,
      unit: 'days'
    },
    condition: 'If no response'
  },
  {
    id: '5',
    type: 'sms',
    content: 'Last chance, {{firstName}}! Our dental grant program is ending soon. Reply YES if you would like to schedule a free consultation to discuss how you could benefit.'
  }
];

const CampaignSequence: React.FC<CampaignSequenceProps> = ({ campaign }) => {
  // Display information for the campaign
  
  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6 text-gray-500 flex items-center">
        <Icons.Info className="w-5 h-5 mr-2 text-blue-500" />
        {campaign.name} automation will stop once contact responds.
      </div>
      
      <Card>
        <CardHeader className="flex items-center justify-between">
          <CardTitle>Campaign Sequence</CardTitle>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <Icons.Copy className="w-4 h-4 mr-2" />
              Duplicate
            </Button>
            <Button size="sm">
              <Icons.Plus className="w-4 h-4 mr-2" />
              Add Step
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-6">
            {mockSequenceSteps.map((step, index) => (
              <div key={step.id} className="relative">
                {/* Connecting line */}
                {index < mockSequenceSteps.length - 1 && (
                  <div className="absolute top-16 bottom-0 left-6 w-0.5 bg-gray-200 -mb-6 z-0"></div>
                )}
                
                {/* Step card */}
                <div className="relative z-10 flex items-start">
                  {/* Step icon */}
                  <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
                    step.type === 'sms' 
                      ? 'bg-blue-100 text-blue-600' 
                      : step.type === 'email' 
                      ? 'bg-green-100 text-green-600'
                      : step.type === 'voice'
                      ? 'bg-purple-100 text-purple-600'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {step.type === 'sms' && <Icons.MessageSquare className="w-5 h-5" />}
                    {step.type === 'email' && <Icons.Mail className="w-5 h-5" />}
                    {step.type === 'voice' && <Icons.Phone className="w-5 h-5" />}
                    {step.type === 'delay' && <Icons.Clock className="w-5 h-5" />}
                  </div>
                  
                  {/* Step content */}
                  <div className="ml-4 flex-1">
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium capitalize">
                          {step.type === 'delay' 
                            ? `Wait ${step.delay?.value} ${step.delay?.unit}`
                            : `${step.type.toUpperCase()} Message`
                          }
                        </h3>
                        <div className="flex space-x-1">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Icons.Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Icons.Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      {step.condition && (
                        <div className="mb-2 text-sm text-gray-500 italic">
                          {step.condition}
                        </div>
                      )}
                      
                      {step.content && (
                        <div className="text-sm border-l-2 border-gray-200 pl-3 py-1">
                          {step.content}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Final step - add button */}
            <div className="flex justify-center">
              <Button variant="outline" className="border-dashed">
                <Icons.Plus className="w-4 h-4 mr-2" />
                Add Another Step
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CampaignSequence;