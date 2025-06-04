// Represents the detailed patient object from NexHealth API
// Used in GET /patients/{id}, as items in GET /patients list, and in POST /patients response (under 'user')
export interface NexHealthPatient {
  id: number;
  email: string | null;
  first_name: string | null;
  middle_name?: string | null;
  last_name: string | null;
  name: string; // Combination of first and last name
  created_at: string; // ISO 8601 date string
  updated_at: string; // ISO 8601 date string
  institution_id?: number;
  foreign_id?: string | null;
  foreign_id_type?: string | null;
  bio: Partial<NexHealthPatientBio>; // Can be {} or partially filled
  inactive: boolean;
  last_sync_time?: string | null; // ISO 8601 date string
  guarantor_id?: number | null;
  unsubscribe_sms?: boolean;
  balance?: { // Deprecated, but present in API examples
    amount: string;
    currency: string;
  };
  billing_type?: string | null; // Partially supported
  chart_id?: string | null;     // Partially supported
  preferred_language?: string | null; // Partially supported
  preferred_locale?: string | null;
  location_ids?: number[];
}

// Represents the 'bio' object within a NexHealthPatient
export interface NexHealthPatientBio {
  city: string | null;
  state: string | null;
  gender: 'Male' | 'Female' | 'Other' | string | null; // API examples show 'Female', 'Male'. Allow string for other values.
  zip_code: string | null;
  new_patient?: boolean; // Present in GET /patients list items' bio and POST /patients response bio
  non_patient?: boolean;
  phone_number: string | null;
  date_of_birth: string | null; // YYYY-MM-DD
  address_line_1: string | null;
  address_line_2?: string | null;
  street_address?: string | null; // Can be a combination or separate
  cell_phone_number?: string | null;
  home_phone_number?: string | null;
  work_phone_number?: string | null;
  previous_foreign_id?: string | null;
  // Fields from POST /patients request body bio
  weight?: number; // in KG
  height?: number; // in CM
  insurance_name?: string;
  ssn?: string;
  race?: string;
  custom_contact_number?: string;
}

// --- API Response Interfaces ---

// For GET /patients (List Patients)
export interface NexHealthPatientListResponse {
  code: boolean;
  description: string | null;
  error: string | null;
  data: {
    patients: NexHealthPatient[];
  };
  count: number; // Total number of patients matching query
}

// For POST /patients (Create Patient)
export interface NexHealthCreatePatientResponse {
  code: boolean;
  description: string | null; // e.g., "Registration successful"
  error: string | null;
  data: {
    user: NexHealthPatient; // The created patient object is under 'user'
  };
  count: number | null; // API example shows null
}

// For GET /patients/{id} (View Specific Patient)
export interface NexHealthPatientDetailResponse {
  code: boolean;
  description: string | null;
  error: string | null;
  data: NexHealthPatient; // The patient object is directly under 'data'
  count: number | null; // API example shows null
}

// --- API Request Payload Interfaces ---

// For POST /patients (Create Patient)
export interface NexHealthCreatePatientPayload {
  provider?: {
    provider_id: number | string; // API example uses number
  };
  patient: {
    first_name: string;
    last_name: string;
    email?: string | null;
    bio: {
      date_of_birth: string; // YYYY-MM-DD
      phone_number: string;
      gender?: 'Male' | 'Female' | 'Other' | string; // API defaults to Female if not provided
      home_phone_number?: string;
      cell_phone_number?: string;
      work_phone_number?: string;
      custom_contact_number?: string;
      weight?: number;
      height?: number;
      street_address?: string;
      address_line_1?: string;
      address_line_2?: string;
      city?: string;
      state?: string;
      zip_code?: string;
      insurance_name?: string;
      ssn?: string;
      race?: string;
    };
  };
}

// --- Frontend Specific Data Structures (if different or for transformation) ---

// This interface was previously used by Patients.tsx for the detailed view.
// It maps closely to NexHealthPatient, but gives us a place for frontend-specific transformations if needed.
export interface PatientDetailsData {
  id: number; // from NexHealthPatient.id
  fullName: string; // from NexHealthPatient.name or constructed
  email: string | null; // from NexHealthPatient.email
  phoneNumber: string | null; // from NexHealthPatient.bio.phone_number or cell_phone_number
  dateOfBirth: string | null; // from NexHealthPatient.bio.date_of_birth
  address?: {
    streetAddress: string | null; // from NexHealthPatient.bio.address_line_1 or street_address
    city: string | null; // from NexHealthPatient.bio.city
    state: string | null; // from NexHealthPatient.bio.state
    zipCode: string | null; // from NexHealthPatient.bio.zip_code
  };
  gender: string | null; // from NexHealthPatient.bio.gender
  isInactive: boolean; // from NexHealthPatient.inactive
  isNewPatient?: boolean; // from NexHealthPatient.bio.new_patient
  // Additional fields from NexHealthPatient that might be useful for display
  createdAt?: string; // from NexHealthPatient.created_at
  updatedAt?: string; // from NexHealthPatient.updated_at
  balanceAmount?: string; // from NexHealthPatient.balance.amount (deprecated)
  foreignId?: string | null; // from NexHealthPatient.foreign_id
  locationIds?: number[]; // from NexHealthPatient.location_ids
}

// Interface for items in the patient list displayed in the UI
// This might be a subset of NexHealthPatient or include derived/formatted fields.
export interface PatientListDisplayItem {
  id: number;
  name: string;
  email: string | null;
  phoneNumber: string | null;
  status: 'active' | 'inactive';
  // Optional fields that were in mock data, to be sourced from API if needed
  lastVisit?: string;
  balance?: string; // e.g., from NexHealthPatient.balance.amount (deprecated)
  nextAppointment?: string;
  // Fields from NexHealthPatient for direct display or sorting/filtering
  createdAt?: string;
  dateOfBirth?: string | null;
}

// Query parameters for GET /patients, to be used by the service layer
export interface GetPatientsQueryParams {
  name?: string;
  email?: string;
  phone_number?: string;
  date_of_birth?: string; // YYYY-MM-DD
  inactive?: boolean;
  foreign_id?: string;
  updated_since?: string; // ISO 8601 date-time
  new_patient?: boolean;
  non_patient?: boolean;
  forms_syncable?: boolean;
  location_strict?: boolean;
  include?: string[]; // e.g., ['appointments']
  sort?: string; // e.g., 'name', '-created_at'
  appointment_date_start?: string; // YYYY-MM-DD
  appointment_date_end?: string; // YYYY-MM-DD
  page?: number;
  per_page?: number;
}
