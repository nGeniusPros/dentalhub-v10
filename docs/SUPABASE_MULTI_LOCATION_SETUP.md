# Supabase Multi-Location Setup Guide

This guide walks you through setting up multi-location support in your DentalHub application using Supabase as the backend database service.

## Prerequisites

- Existing Supabase project with DentalHub schema
- Admin access to your Supabase project
- Supabase CLI installed locally (optional, but recommended)

## 1. Run the Migration Script

The `location-migration.sql` script in the `scripts/supabase` directory sets up all the necessary tables and policies for multi-location support.

### Option A: Using the Supabase Dashboard

1. Log in to your Supabase dashboard
2. Go to the SQL Editor
3. Open the file `scripts/supabase/location-migration.sql` from this repository
4. Copy the entire SQL script
5. Paste it into the SQL Editor in Supabase dashboard
6. Click "Run" to execute the script

### Option B: Using the Supabase CLI

```bash
# Navigate to the project root
cd dentalhub-v10

# Run the migration script using the Supabase CLI
supabase db push --db-url=YOUR_SUPABASE_URL

# Or run the script directly
supabase db run scripts/supabase/location-migration.sql
```

## 2. Understanding the Schema Changes

After running the migration script, your database will have these new tables:

- `locations` - Stores all practice locations
- `user_locations` - Junction table mapping users to locations

And the following tables will have a new `location_id` column:
- `patients`
- `appointments`
- `treatments`
- `invoices`
- `inventories`
- `medical_records`
- `insurance_claims`
- `prescriptions`
- `staff_schedules`

## 3. Testing Row-Level Security (RLS)

The migration script sets up Row-Level Security policies to ensure users can only access data from their assigned locations. To test this:

1. Create two test locations in the `locations` table
2. Create two test users
3. In the `user_locations` table, assign User A to Location A and User B to Location B
4. Create test patients in both locations
5. Verify that User A can only see patients from Location A, and User B can only see patients from Location B

## 4. Configuring the Frontend

The frontend needs to be configured to work with the multi-location setup:

### Location Context Provider

The application includes a LocationContext provider that manages the user's current location:

```jsx
// In your App component
import { LocationProvider } from './contexts/LocationContext';

function App() {
  return (
    <AuthProvider>
      <LocationProvider>
        {/* Rest of your app */}
      </LocationProvider>
    </AuthProvider>
  );
}
```

### API Requests

All API requests should include the current location ID:

```jsx
// Example of a location-aware API request
const { currentLocation } = useLocation();

const fetchPatients = async () => {
  try {
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .eq('location_id', currentLocation.id);
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching patients:', error);
  }
};
```

## 5. Super Admin Access

The migration creates special policies for super admins to access all locations:

1. To make a user a super admin, set their role to 'super_admin' in the Auth system
2. Super admins can see and manage data from all locations

```sql
-- Example query to make a user a super admin
UPDATE auth.users
SET role = 'super_admin'
WHERE email = 'admin@dentalhub.com';
```

## 6. Common Operations

### Transferring a Patient Between Locations

Use the `transfer_patient_to_location` function:

```sql
-- Transfer a patient to a new location
SELECT transfer_patient_to_location(
  'patient-uuid-here',
  'new-location-uuid-here',
  'requesting-user-uuid-here'
);
```

### Getting a User's Accessible Locations

Use the `get_user_locations` function:

```sql
-- Get all locations a user has access to
SELECT * FROM get_user_locations('user-uuid-here');
```

### Checking Location Access

Use the `user_has_location_access` function:

```sql
-- Check if a user has access to a specific location
SELECT user_has_location_access(
  'user-uuid-here',
  'location-uuid-here'
);
```

## 7. Production Considerations

### Backup Strategy

Be sure to update your backup strategy to account for the new location-based segmentation:

```bash
# Example backup command with location data
pg_dump -t locations -t user_locations -t patients -t appointments your_database > backup.sql
```

### Performance Optimization

For large multi-location practices, consider adding these indexes:

```sql
-- Add indexes for improved performance
CREATE INDEX IF NOT EXISTS idx_patients_location_id ON patients(location_id);
CREATE INDEX IF NOT EXISTS idx_appointments_location_id ON appointments(location_id);
CREATE INDEX IF NOT EXISTS idx_user_locations_user_id ON user_locations(user_id);
CREATE INDEX IF NOT EXISTS idx_user_locations_location_id ON user_locations(location_id);
```

## 8. Troubleshooting

### Missing Location Associations

If existing users aren't associated with locations:

```sql
-- Manually associate a user with a location
INSERT INTO user_locations (user_id, location_id, role)
VALUES ('user-uuid-here', 'location-uuid-here', 'staff');
```

### Data Visibility Issues

If a user can't see data they should have access to:

1. Verify the user has the correct location associations in `user_locations`
2. Check that the data has the correct `location_id`
3. Ensure RLS policies are correctly set up for the table

## Conclusion

With these changes, your DentalHub application is now ready to support multiple locations. Users will only see data from their assigned locations, and patient data is properly segmented for privacy and compliance.

For more details on using the multi-location features in the frontend application, see the `docs/MULTI_LOCATION_GUIDE.md` file.