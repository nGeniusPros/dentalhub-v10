/**
 * Interfaces for the SDR Agent Campaign System
 */

// Campaign types supported by the system
export type CampaignType = 
  | 'leadGeneration'
  | 'noResponse'
  | 'noShow'
  | 'reEngagement'
  | 'listValidation'
  | 'coldOffer'
  | 'powerHour'
  | 'holding';

// Schedule definition for each day
export interface DaySchedule {
  start: string;
  end: string;
}

// Weekly schedule configuration
export interface WeeklySchedule {
  monday?: DaySchedule;
  tuesday?: DaySchedule;
  wednesday?: DaySchedule;
  thursday?: DaySchedule;
  friday?: DaySchedule;
  saturday?: DaySchedule;
  sunday?: DaySchedule;
  [day: string]: DaySchedule | undefined;
}

// Configuration for the campaign manager
export interface CampaignConfig {
  enabled: boolean;
  officeName?: string;
  customSchedule?: boolean;
  schedule?: WeeklySchedule;
  voiceId?: string;
}

// A prospect (lead) in the system
export interface Prospect {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  source?: string;
  appointment?: {
    id?: string;
    date?: string;
    time?: string;
    status?: string;
    service?: string;
  };
}

// Automation event types
export type EventType = 'sms' | 'email' | 'ai_voice_call' | 'voicemail_drop';

// Automation event definition
export interface AutomationEvent {
  type: EventType;
  name: string;
  timing: string;
  message: string;
  subject?: string; // For email events
}

// Response handler actions
export type ResponseAction = 'offer_times' | 'book_appointment' | 'move_campaign' | 'mark_invalid' | 'default_reply';

// Response handler definition
export interface ResponseHandler {
  keywords: string[];
  action: ResponseAction;
  reply: string;
  targetCampaign?: CampaignType;
}

// Base Campaign interface
export interface ICampaign {
  name: string;
  nextCampaign: CampaignType | null;
  automationEvents: AutomationEvent[];
  responseHandlers: ResponseHandler[];
  processMessage(message: string): string;
}

// Campaign manager interface
export interface ICampaignManager {
  config: CampaignConfig;
  campaigns: Record<CampaignType, ICampaign>;
  prospects: Map<string, ProspectRecord>;
  appointments: Map<string, Appointment>;
  
  addProspect(prospect: Prospect, campaignName?: CampaignType): boolean;
  processResponse(prospectId: string, message: string): ResponseResult | null;
  personalizeMessage(message: string, prospect: Prospect): string;
  sendNextEvent(prospectId: string): boolean;
  moveToNextCampaign(prospectId: string, nextCampaignName: CampaignType): boolean;
  bookAppointment(prospectId: string, message: string): Appointment | false;
}

// Appointment interface
export interface Appointment {
  id: string;
  prospectId: string;
  date: string;
  time: string;
  status: 'scheduled' | 'completed' | 'no-show' | 'cancelled';
  service: string;
}

// Prospect record in the system
export interface ProspectRecord {
  data: Prospect;
  currentCampaign: CampaignType;
  stage: number;
  history: {
    campaign: CampaignType;
    timestamp: Date;
  }[];
  tags: Set<string>;
}

// Response result from processing a message
export interface ResponseResult {
  action: ResponseAction;
  reply: string;
  targetCampaign?: CampaignType;
}