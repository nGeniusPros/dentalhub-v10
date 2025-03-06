# SDR Agent Implementation Plan

## Overview

This document outlines the plan for implementing a Sales Development Representative (SDR) agent that will use the campaign automation business logic for dental practices. The agent will help manage prospect communications through various channels (SMS, email, voice calls) using predefined campaign sequences.

## Business Logic Structure

The provided business logic consists of:

1. **Base Campaign Class** - Provides common functionality for all campaigns
2. **Specialized Campaign Types**:
   - Lead Generation Campaign - For new leads showing initial interest
   - No Response Campaign - For leads who didn't respond to initial outreach
   - No Show Campaign - For leads who booked but missed appointments
   - Re-Engagement Campaign - For leads who haven't engaged in a while
   - List Validation Campaign - For validating contact information from cold lists
   - Cold Offer Campaign - For prospects from cold lists who have been validated
   - Power Hour Campaign - For intense follow-up with selected holding prospects
   - Holding Campaign - For inactive prospects

3. **Campaign Manager** - Orchestrates all campaigns and prospect movement

## Implementation Steps

### 1. Create Directory and File Structure

```
src/ai/sdr/
├── sdr.agent.ts            # Main agent implementation
├── campaigns/              # Campaign implementations
│   ├── base.campaign.ts    # Base campaign class
│   ├── lead-generation.campaign.ts
│   ├── no-response.campaign.ts
│   ├── no-show.campaign.ts
│   ├── re-engagement.campaign.ts
│   ├── list-validation.campaign.ts
│   ├── cold-offer.campaign.ts
│   ├── power-hour.campaign.ts
│   └── holding.campaign.ts
└── campaign-manager.ts     # Campaign orchestration logic
```

### 2. Update Export in AI Index

Update `src/ai/index.ts` to export the new SDR agent:

```typescript
// SDR Agent
export { SDRAgent } from './sdr/sdr.agent';
export type { CampaignType, ProspectRecord } from './sdr/sdr.agent';
```

### 3. Agent Implementation Details

#### 3.1 Base Campaign Class

The base campaign class should:
- Store configuration (office name, etc.)
- Process messages to replace placeholders
- Provide common functionality for all campaign types

#### 3.2 Specialized Campaign Classes

Each specialized campaign class should:
- Extend the base campaign class
- Define campaign-specific automationEvents (messages, timing, etc.)
- Implement responseHandlers for prospect replies

#### 3.3 Campaign Manager

The campaign manager should:
- Track prospects and their campaign progress
- Process responses based on campaign rules
- Move prospects between campaigns
- Schedule and send messages through the communication service
- Handle appointments and reminders

#### 3.4 SDR Agent

The main SDR agent should:
- Provide a clean interface for other parts of the application
- Instantiate the campaign manager
- Expose methods for:
  - Adding prospects to campaigns
  - Processing responses
  - Querying prospect status
  - Activating special campaign modes (like Power Hour)
  - Generating reports

### 4. Integration with Existing Systems

#### 4.1 Communication Services

Integrate with existing communication services in the application:
- Use the SMS API for sending text messages
- Use the voice API for making calls
- Use the email system for sending emails

```typescript
// Integration example
import communicationService from '../../lib/api/communicationService';

// Inside method for sending SMS
await communicationService.sms.send({
  to: prospect.phone,
  body: personalizedMessage
});
```

#### 4.2 DeepSeek Integration

Optionally integrate with DeepSeek for contextual knowledge:
- Retrieve practice-specific information
- Use context to enhance message personalization

#### 4.3 Appointment Scheduling

Integrate with the appointment scheduling system:
- Book appointments based on prospect responses
- Set reminders for appointments
- Check for no-shows

### 5. TypeScript Types and Interfaces

Define appropriate TypeScript interfaces:
- Campaign types
- Prospect record structure
- Message and event types
- Response handler types

### 6. Testing and Example Usage

Implement example usage:
- Create test prospects
- Add them to campaigns
- Simulate responses
- Track progress through campaigns

## Implementation Considerations

### Performance

- Efficiently store and retrieve prospect data
- Optimize message generation and personalization
- Consider batch processing for large numbers of prospects

### Security

- Ensure proper handling of PII (Personally Identifiable Information)
- Validate all inputs, especially phone numbers and email addresses
- Implement proper authorization checks

### Compliance

- Ensure all messages comply with SMS/email regulations (TCPA, CAN-SPAM)
- Include unsubscribe options in all communications
- Honor do-not-contact requests promptly

### Extensibility

- Design for easy addition of new campaign types
- Allow for customization of message templates
- Support A/B testing of different message sequences

## Next Steps

After implementing the SDR agent:

1. Create UI components for managing campaigns
2. Implement analytics to track campaign performance
3. Add ability to customize campaigns for different dental practices
4. Develop dashboards to visualize prospect movement through campaigns