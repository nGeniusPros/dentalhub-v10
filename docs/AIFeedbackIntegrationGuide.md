# AI Feedback Integration Guide: HOC Pattern

This guide demonstrates how to integrate AI feedback functionality into your components using the Higher-Order Component (HOC) pattern - the recommended approach for the DentalHub platform.

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Integration Steps](#integration-steps)
4. [Configuration Options](#configuration-options)
5. [Security Considerations](#security-considerations)
6. [Best Practices](#best-practices)
7. [Troubleshooting](#troubleshooting)

## Overview

The HOC Pattern wraps your AI components with feedback functionality, ensuring:

- Consistent feedback collection across all AI components
- Proper tracking of AI responses via unique IDs
- Standardized input validation and sanitization
- Minimal code changes to existing components

## Prerequisites

Make sure you have the following dependencies installed:

```bash
npm install @supabase/supabase-js uuid
```

Also ensure that your `.env` file contains the necessary Supabase configuration:

```
REACT_APP_SUPABASE_URL=your_supabase_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Integration Steps

### 1. Import the HOC and Constants

```tsx
import { withAIFeedback } from '../utils/integrateAIFeedback';
import { AGENT_TYPES, FEEDBACK_CONTEXTS, USER_ROLES } from '../constants/ai-agents';
```

### 2. Create Your Base AI Component

Ensure your base component accepts and uses the `responseId` prop:

```tsx
interface MyAIComponentProps {
  prompt: string;
  // This will be injected by the HOC
  responseId?: string;
  // Other props...
}

function MyAIComponent({ prompt, responseId, ...otherProps }: MyAIComponentProps) {
  // When making API calls to your AI service,
  // include the responseId to track this specific response
  const getAIResponse = async () => {
    // Example API call with responseId
    const response = await fetch('/api/ai', {
      method: 'POST',
      body: JSON.stringify({ prompt, responseId })
    });
    // Process response...
  };
  
  // Rest of your component...
}
```

### 3. Wrap Your Component with the HOC

```tsx
// Create the enhanced component with feedback
const MyAIComponentWithFeedback = withAIFeedback(MyAIComponent, {
  // Always use constants for consistency!
  agentType: AGENT_TYPES.ASSISTANT,
  feedbackContext: FEEDBACK_CONTEXTS.CLINICAL_INQUIRY,
  defaultUserRole: USER_ROLES.DENTIST,
  // Optional configuration
  showCommentField: true,
});

// Export the enhanced component
export default MyAIComponentWithFeedback;
```

### 4. Use the Enhanced Component in Your App

```tsx
function SomeParentComponent() {
  return (
    <div>
      <h2>AI Assistant</h2>
      <MyAIComponentWithFeedback 
        prompt="What's the recommended procedure for..." 
        // Optionally override the user role
        userRole={USER_ROLES.EXPERT}
      />
    </div>
  );
}
```

## Configuration Options

The `withAIFeedback` HOC accepts the following options:

| Option | Type | Description | Default |
|--------|------|-------------|---------|
| `agentType` | `AgentType` | Type of AI agent (use constants!) | *Required* |
| `feedbackContext` | `FeedbackContext` | Context in which the AI is used | `'general'` |
| `defaultUserRole` | `UserRole` | Default role if not provided in props | `'guest'` |
| `enableFeedbackTracking` | `boolean` | Whether to enable feedback UI | `true` |
| `showCommentField` | `boolean` | Show comment field option | `true` |

## Security Considerations

The HOC implementation includes several security measures:

1. **Input Validation**: All inputs are validated against predefined constants
2. **Fallback Values**: Invalid inputs fall back to safe default values
3. **Input Sanitization**: User comments are sanitized to prevent XSS and SQL injection
4. **Type Safety**: TypeScript types ensure correct usage

## Best Practices

1. **Always Use Constants**: Use the predefined constants for agent types, contexts, and roles
2. **Pass User Context**: When possible, pass the actual user role from your auth system
3. **Track Response IDs**: Include the responseId in your AI API calls for proper tracking
4. **Handle Errors**: Implement proper error handling for feedback submission
5. **Consider Performance**: Only enable feedback in production environments

## Troubleshooting

### Common Issues

1. **Feedback Not Saving**
   - Check Supabase configuration in your `.env` file
   - Ensure the `ai_feedback` table exists in your Supabase database

2. **TypeScript Errors**
   - Ensure you're using the constants from `constants/ai-agents.ts`
   - Make sure your base component accepts the `responseId` prop

3. **Component Not Rendering**
   - Check that the HOC is properly applied
   - Ensure all required props are passed

### Need Help?

For any issues or questions, contact the DentalHub AI Team or check the internal documentation for more detailed information.

---

## Example Implementation

See the complete example in: `src/examples/AIFeedbackExample.tsx`
