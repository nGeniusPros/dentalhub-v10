# DentalHub Multi-Location Guide

## Overview

DentalHub supports multi-location dental practices and DSOs (Dental Service Organizations) by providing a comprehensive location management system. This guide explains how location data is segmented, how to work with multiple locations, and best practices for managing patient data across different practice locations.

## Database Segmentation

### Location-Based Data Segmentation

DentalHub uses a **location-based segmentation approach** in the Supabase database. Here's how data is organized:

1. **Location Table**: Contains all practice locations with their details (address, contact info, etc.)
2. **User-Location Association**: Users can be assigned to one or multiple locations
3. **Row-Level Security (RLS)**: Database tables use `location_id` as a foreign key to segment data
4. **Data Isolation**: Queries automatically filter by the user's current location context

### Key Database Tables and Their Location Associations

| Table | Location Association | Notes |
|-------|---------------------|-------|
| `locations` | Primary location table | Contains all location data |
| `users` | Many-to-many via `user_locations` | Users can belong to multiple locations |
| `patients` | Direct `location_id` column | Patients belong to a specific location |
| `appointments` | Direct `location_id` column | Appointments are location-specific |
| `treatments` | Direct `location_id` column | Treatments are location-specific |
| `invoices` | Direct `location_id` column | Invoices are location-specific |
| `inventory` | Direct `location_id` column | Each location has its own inventory |

### Row-Level Security Example

```sql
CREATE POLICY "Users can only view patients at their location"
ON patients
FOR SELECT
USING (
  location_id IN (
    SELECT location_id FROM user_locations
    WHERE user_id = auth.uid()
  )
);
```

## Working with Multiple Locations

### Switching Between Locations

Users with access to multiple locations can switch their active location using the **Location Switcher** component available in the application header. This change affects all data displayed throughout the application.

### User Permissions & Access Control

1. **Location-Specific Roles**: Users can have different roles at different locations
2. **Super Admins**: Can access and manage all locations
3. **Location Admins**: Can manage a specific location
4. **Staff**: Access is limited to their assigned location(s)

## Best Practices for Multi-Location Management

### Patient Data Management

1. **Patient Assignment**: Patients are typically assigned to their primary location
2. **Patient Transfer**: A patient can be transferred between locations when needed
3. **Patient History**: Patient history follows them between locations

### Data Segmentation for Privacy & Compliance

1. **HIPAA Compliance**: Location-based segmentation helps maintain HIPAA compliance
2. **Access Controls**: Staff only see patient data from their assigned locations
3. **Audit Logs**: All access to patient data is logged with location context

### Multi-Location Reporting

1. **Location-Specific Reports**: Generate reports for individual locations
2. **Consolidated Reports**: For admins, aggregated reports across all locations
3. **Financial Segmentation**: Financial data is segmented by location

## Technical Implementation

### Location Context Provider

The application uses React's Context API to maintain the current location context:

```tsx
// LocationContext manages the current location and available locations
const LocationContext = createContext<LocationContextType | null>(null);

// useLocation hook provides access to the location context
export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};
```

### Location-Aware Components

Components use the `useLocation` hook to access and respect the current location context:

```tsx
const { currentLocation } = useLocation();

// Queries filter by the current location
const fetchPatients = async () => {
  const response = await fetch(`/api/patients?locationId=${currentLocation.id}`);
  // ...
};
```

## Location Management Features

1. **Location Creation & Management**: Admins can add and configure new locations
2. **User Assignment**: Assign users to one or multiple locations
3. **Location Settings**: Each location can have its own settings like:
   - Business hours
   - Available services
   - Billing configurations
   - Branding elements

## Data Synchronization & Backups

1. **Cross-Location Synchronization**: Certain global data is synchronized across locations
2. **Backup Segmentation**: Backups can be performed per-location or globally
3. **Disaster Recovery**: Recovery plans consider location-based data segmentation

## Conclusion

DentalHub's multi-location architecture allows dental practices to efficiently manage multiple locations while maintaining proper data segmentation and security. By following the best practices outlined in this guide, users can effectively work with patient data across multiple practice locations.