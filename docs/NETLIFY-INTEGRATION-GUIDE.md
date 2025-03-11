# DentalHub Netlify Integration Guide

This guide shows how to update your existing components to work with Netlify Functions.

## Overview

When deploying to Netlify, backend API calls need to use Netlify Functions instead of directly calling Supabase. We've created an API utility (`src/utils/api.ts`) that handles this automatically:

- In development: Uses direct Supabase calls
- In production: Routes requests through Netlify Functions

## How to Update Your Components

### Step 1: Import the API utility

Replace direct Supabase imports with our API utility:

```diff
- import { supabase } from '../lib/supabase';
+ import { api } from '../utils/api';
```

### Step 2: Replace Supabase calls with API calls

#### Before:

```typescript
// Direct Supabase query
const fetchPatients = async () => {
  const { data, error } = await supabase
    .from('patients')
    .select('*')
    .order('created_at', { ascending: false });
    
  if (error) throw error;
  return data;
};
```

#### After:

```typescript
// Using API utility
const fetchPatients = async () => {
  try {
    const data = await api.get('patients');
    return data;
  } catch (error) {
    console.error('Error fetching patients:', error);
    throw error;
  }
};
```

### Step 3: Update Authentication

#### Before:

```typescript
// Direct Supabase auth
const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  
  if (error) throw error;
  return data;
};
```

#### After:

```typescript
// Using API utility
const signIn = async (email: string, password: string) => {
  try {
    const result = await api.post('auth/session', {
      action: 'SIGNIN',
      email,
      password
    });
    return result;
  } catch (error) {
    console.error('Error signing in:', error);
    throw error;
  }
};
```

## Example: Updating a Patient List Component

### Before:

```tsx
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function PatientList() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function loadPatients() {
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) {
        console.error('Error loading patients:', error);
        return;
      }
      
      setPatients(data);
      setLoading(false);
    }
    
    loadPatients();
  }, []);
  
  // Rest of component...
}
```

### After:

```tsx
import { useState, useEffect } from 'react';
import { api } from '../utils/api';

export function PatientList() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function loadPatients() {
      try {
        const data = await api.get('patients');
        setPatients(data);
      } catch (error) {
        console.error('Error loading patients:', error);
      } finally {
        setLoading(false);
      }
    }
    
    loadPatients();
  }, []);
  
  // Rest of component...
}
```

## Testing Your Integration

1. Test locally first:
   - Run `npm run dev` to test in development mode
   - The API utility will use direct Supabase calls

2. Deploy to Netlify:
   - Push your changes to your repository
   - Netlify will build and deploy your app
   - The API utility will automatically switch to using Netlify Functions

3. Verify functionality:
   - Test all features of your app on the deployed site
   - Check the browser console for any errors
   - Use the Network tab to inspect API calls

## Example Component

We've included an example component in `src/examples/NetlifyApiExample.tsx` that demonstrates how to use the API utility with various endpoints. You can use this as a reference when updating your components.