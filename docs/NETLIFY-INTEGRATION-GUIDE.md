# DentalHub Netlify Integration Guide

This guide provides detailed instructions for updating your existing components to use the new API utility, ensuring they work properly when deployed to Netlify.

## Why Do Components Need Updates?

When deployed to Netlify, direct Supabase client calls from the frontend often fail due to CORS restrictions, authentication issues, or missing server-side context. Our solution routes all backend operations through Netlify Functions when in production, while maintaining direct Supabase access during local development.

## API Utility Overview

The `src/utils/api.ts` utility provides:

- Environment detection (development vs. production)
- Automatic routing of requests to the appropriate endpoint
- Consistent error handling
- Support for all common API operations (GET, POST, PUT, DELETE)

## Basic Integration Steps

### 1. Import the API Utility

```typescript
// Replace this:
import { supabase } from '../path/to/supabase';

// With this:
import { api } from '../utils/api';
```

### 2. Replace Supabase Queries

#### Examples

**Fetching Data (Before):**
```typescript
const fetchPatients = async () => {
  const { data, error } = await supabase
    .from('patients')
    .select('*')
    .order('created_at', { ascending: false });
    
  if (error) {
    console.error('Error fetching patients:', error);
    return [];
  }
  
  return data || [];
};
```

**Fetching Data (After):**
```typescript
const fetchPatients = async () => {
  try {
    const data = await api.get('patients');
    return data || [];
  } catch (error) {
    console.error('Error fetching patients:', error);
    return [];
  }
};
```

**Creating Records (Before):**
```typescript
const createPatient = async (patientData) => {
  const { data, error } = await supabase
    .from('patients')
    .insert(patientData)
    .select();
    
  if (error) {
    console.error('Error creating patient:', error);
    throw error;
  }
  
  return data[0];
};
```

**Creating Records (After):**
```typescript
const createPatient = async (patientData) => {
  try {
    const data = await api.post('patients', patientData);
    return data[0];
  } catch (error) {
    console.error('Error creating patient:', error);
    throw error;
  }
};
```

**Updating Records (Before):**
```typescript
const updatePatient = async (id, updates) => {
  const { data, error } = await supabase
    .from('patients')
    .update(updates)
    .eq('id', id)
    .select();
    
  if (error) {
    console.error('Error updating patient:', error);
    throw error;
  }
  
  return data[0];
};
```

**Updating Records (After):**
```typescript
const updatePatient = async (id, updates) => {
  try {
    const data = await api.put('patients', {
      id,
      ...updates
    });
    return data[0];
  } catch (error) {
    console.error('Error updating patient:', error);
    throw error;
  }
};
```

**Deleting Records (Before):**
```typescript
const deletePatient = async (id) => {
  const { error } = await supabase
    .from('patients')
    .delete()
    .eq('id', id);
    
  if (error) {
    console.error('Error deleting patient:', error);
    throw error;
  }
  
  return true;
};
```

**Deleting Records (After):**
```typescript
const deletePatient = async (id) => {
  try {
    await api.delete('patients', id);
    return true;
  } catch (error) {
    console.error('Error deleting patient:', error);
    throw error;
  }
};
```

### 3. Handle More Complex Queries

For more complex queries, our API utility supports special formats:

**Filtering, Sorting and Limiting (Before):**
```typescript
const { data, error } = await supabase
  .from('appointments')
  .select('*, patient:patients(*)')
  .eq('status', 'scheduled')
  .order('appointment_date', { ascending: true })
  .limit(10);
```

**Filtering, Sorting and Limiting (After):**
```typescript
const data = await api.post('appointments/query', {
  select: '*, patient:patients(*)',
  filters: [
    { field: 'status', operator: 'eq', value: 'scheduled' }
  ],
  sort: { field: 'appointment_date', ascending: true },
  limit: 10
});
```

## Integration with External Services

The API utility also routes requests to external services through Netlify Functions:

### AI Integration

```typescript
import { ai } from '../utils/ai';

// Generate AI-powered dental diagnosis
const diagnosis = await ai.getDentalDiagnosis(symptoms);

// Get treatment recommendations
const treatment = await ai.getTreatmentRecommendations(diagnosis);

// Basic chat interface
const response = await ai.chat([
  ai.systemMessage('You are a dental assistant AI.'),
  ai.userMessage('What causes tooth sensitivity?')
]);
```

### Social Media Integration

```typescript
// Post to social media
const result = await api.post('social/post', {
  post: 'Check out our new dental services!',
  platforms: ['twitter', 'facebook'],
  mediaUrls: ['https://example.com/image.jpg']
});
```

### Newsletter Integration

```typescript
// Add subscriber to newsletter
const subscriber = await api.post('newsletter/subscriber', {
  email: 'patient@example.com',
  publicationId: 'pub_123',
  firstName: 'John',
  lastName: 'Doe'
});

// Unsubscribe from newsletter
const result = await api.put('newsletter/subscriber', {
  email: 'patient@example.com',
  publicationId: 'pub_123',
  status: 'unsubscribed'
});
```

### Call Center Integration

```typescript
// Start a call
const call = await api.post('retell/start-call', {
  agentId: 'agent_123',
  phoneNumber: '+15551234567',
  userPhoneNumber: '+15557654321'
});
```

### Push Notifications

```typescript
// Send a notification
const notification = await api.post('notifications/send', {
  title: 'Appointment Reminder',
  body: 'Your dental checkup is tomorrow at 2pm',
  token: deviceToken, // For a single device
  // OR
  tokens: [deviceToken1, deviceToken2], // For multiple devices
  // OR
  topic: 'appointment-reminders', // For subscribers to a topic
  data: { appointmentId: '123' } // Optional additional data
});
```

## Testing Your Integration

After updating your components, test them in both environments:

1. **Development**: Run `npm run dev` to test locally
2. **Production**: Deploy to Netlify and test on the live site

Always check the browser's Console and Network tabs for errors.

## Common Integration Challenges

### 1. Authentication

If your components use Supabase authentication:

```typescript
// Before
const { data: { user } } = await supabase.auth.getUser();

// After
const user = await api.get('auth/user');
```

### 2. Storage

For file uploads and storage operations:

```typescript
// Before
const { data, error } = await supabase.storage
  .from('avatars')
  .upload(`public/${fileName}`, file);

// After
const formData = new FormData();
formData.append('file', file);
formData.append('bucket', 'avatars');
formData.append('path', `public/${fileName}`);

const data = await api.post('storage/upload', formData, {
  headers: {
    'Content-Type': 'multipart/form-data'
  }
});
```

### 3. Real-time Subscriptions

For real-time subscriptions, continue to use the direct Supabase client:

```typescript
// This still works in both environments
const subscription = supabase
  .channel('table-changes')
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'messages'
  }, (payload) => {
    // Handle new message
  })
  .subscribe();
```

## Need More Help?

Refer to these resources:
- `README-NETLIFY.md` for general deployment information
- `NETLIFY-DEBUGGING.md` for troubleshooting
- `NETLIFY-STARTUP-GUIDE.md` for step-by-step deployment
- `src/examples/` directory for working example components