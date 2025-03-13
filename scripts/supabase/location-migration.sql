-- DentalHub Multi-Location Migration Script
-- This script adds multi-location support to an existing Supabase database

-- Create locations table if it doesn't exist
CREATE TABLE IF NOT EXISTS locations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  postal_code TEXT NOT NULL,
  contact_phone TEXT NOT NULL,
  contact_email TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE locations IS 'Dental practice locations';

-- Create trigger to update updated_at automatically
CREATE OR REPLACE FUNCTION update_locations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_locations_updated_at ON locations;
CREATE TRIGGER update_locations_updated_at
BEFORE UPDATE ON locations
FOR EACH ROW
EXECUTE FUNCTION update_locations_updated_at();

-- Create user_locations junction table for many-to-many relationship
CREATE TABLE IF NOT EXISTS user_locations (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  location_id UUID REFERENCES locations(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'staff', -- Role can be different per location
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, location_id)
);

COMMENT ON TABLE user_locations IS 'Junction table linking users to locations';

-- Create default location if none exists
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM locations LIMIT 1) THEN
    INSERT INTO locations (name, address, city, state, postal_code, contact_phone, contact_email)
    VALUES (
      'Main Office', 
      '123 Dental Way', 
      'San Francisco', 
      'CA', 
      '94103', 
      '555-123-4567', 
      'info@dentalhub.com'
    );
  END IF;
END
$$;

-- Add location_id column to tables that need location segmentation
-- Loop through tables to add location_id column (if not exists)
DO $$
DECLARE
  table_name TEXT;
BEGIN
  -- List of tables that need location_id
  FOR table_name IN 
    SELECT unnest(ARRAY[
      'patients',
      'appointments',
      'treatments',
      'invoices',
      'inventories',
      'medical_records',
      'insurance_claims',
      'prescriptions',
      'staff_schedules'
    ])
  LOOP
    -- Check if table exists
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = table_name AND table_schema = 'public') THEN
      -- Check if column already exists
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = table_name AND column_name = 'location_id' AND table_schema = 'public') THEN
        -- Add location_id column
        EXECUTE format('ALTER TABLE %I ADD COLUMN location_id UUID REFERENCES locations(id) ON DELETE SET NULL;', table_name);
        
        -- Get the ID of the first location to use as default
        EXECUTE format('
          UPDATE %I 
          SET location_id = (SELECT id FROM locations ORDER BY created_at LIMIT 1)
          WHERE location_id IS NULL;
        ', table_name);
      END IF;
    END IF;
  END LOOP;
END
$$;

-- Create Row Level Security (RLS) policies for location-based tables
-- Example for patients table (repeat similar policies for other tables)
-- Drop existing policies first
DROP POLICY IF EXISTS "Users can only view patients at their location" ON patients;
DROP POLICY IF EXISTS "Users can only insert patients at their location" ON patients;
DROP POLICY IF EXISTS "Users can only update patients at their location" ON patients;
DROP POLICY IF EXISTS "Users can only delete patients at their location" ON patients;

-- Enable RLS on patients table
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;

-- Create policies for location-based access
CREATE POLICY "Users can only view patients at their location"
ON patients
FOR SELECT
USING (
  location_id IN (
    SELECT location_id FROM user_locations
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can only insert patients at their location"
ON patients
FOR INSERT
WITH CHECK (
  location_id IN (
    SELECT location_id FROM user_locations
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can only update patients at their location"
ON patients
FOR UPDATE
USING (
  location_id IN (
    SELECT location_id FROM user_locations
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can only delete patients at their location"
ON patients
FOR DELETE
USING (
  location_id IN (
    SELECT location_id FROM user_locations
    WHERE user_id = auth.uid()
  )
);

-- Create super_admin role that can access all locations
CREATE POLICY "Super admins can access all patients"
ON patients
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE id = auth.uid() AND role = 'super_admin'
  )
);

-- Create stored procedure to migrate existing users to the default location
CREATE OR REPLACE PROCEDURE migrate_users_to_default_location()
LANGUAGE plpgsql
AS $$
DECLARE
  default_location_id UUID;
BEGIN
  -- Get the default location ID
  SELECT id INTO default_location_id FROM locations ORDER BY created_at LIMIT 1;
  
  -- Insert users into user_locations if they don't have any location associations
  INSERT INTO user_locations (user_id, location_id, role)
  SELECT 
    u.id, 
    default_location_id, 
    u.role
  FROM 
    auth.users u
  LEFT JOIN 
    user_locations ul ON u.id = ul.user_id
  WHERE 
    ul.user_id IS NULL;
    
  RAISE NOTICE 'Migrated users to default location';
END;
$$;

-- Execute the stored procedure to migrate users
CALL migrate_users_to_default_location();

-- Create custom function to get user's locations
CREATE OR REPLACE FUNCTION get_user_locations(user_id UUID)
RETURNS TABLE (
  id UUID,
  name TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  postal_code TEXT,
  contact_phone TEXT,
  contact_email TEXT,
  role TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    l.id,
    l.name,
    l.address,
    l.city,
    l.state,
    l.postal_code,
    l.contact_phone,
    l.contact_email,
    ul.role
  FROM
    locations l
  JOIN
    user_locations ul ON l.id = ul.location_id
  WHERE
    ul.user_id = get_user_locations.user_id;
END;
$$ LANGUAGE plpgsql;

-- Create a function to check if a user has access to a specific location
CREATE OR REPLACE FUNCTION user_has_location_access(user_id UUID, location_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM user_locations
    WHERE user_id = user_has_location_access.user_id
    AND location_id = user_has_location_access.location_id
  );
END;
$$ LANGUAGE plpgsql;

-- Set up functions for patient transfer between locations
CREATE OR REPLACE FUNCTION transfer_patient_to_location(
  patient_id UUID,
  new_location_id UUID,
  requesting_user_id UUID
)
RETURNS BOOLEAN AS $$
DECLARE
  has_access BOOLEAN;
BEGIN
  -- Check if user has access to the target location
  SELECT user_has_location_access(requesting_user_id, new_location_id) INTO has_access;
  
  IF NOT has_access THEN
    RAISE EXCEPTION 'User does not have access to the target location';
    RETURN FALSE;
  END IF;
  
  -- Update patient's location
  UPDATE patients
  SET location_id = new_location_id
  WHERE id = patient_id;
  
  -- Log the transfer
  INSERT INTO audit_logs (
    user_id,
    action,
    table_name,
    record_id,
    details
  ) VALUES (
    requesting_user_id,
    'PATIENT_TRANSFER',
    'patients',
    patient_id,
    json_build_object(
      'new_location_id', new_location_id
    )
  );
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- Done!
RAISE NOTICE 'Multi-location migration completed successfully';