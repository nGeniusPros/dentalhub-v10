// Add/update these imports at the top
import {
  NexHealthPatient,
  GetPatientsQueryParams,
  NexHealthPatientListResponse, // Assuming Netlify func returns this structure
  PatientListDisplayItem,
  NexHealthCreatePatientPayload,
  NexHealthCreatePatientResponse, // Assuming Netlify func returns this
  PatientDetailsData, // Already used, ensure it's from nexhealth.ts if defined there
  // NexHealthPatientDetailResponse, // If getPatientDetails makes a direct API call through a generic fetcher
} from '../types/nexhealth';
// Remove local PatientListItem and PaginatedPatientsResponse if they exist in this file

// ... (other existing interfaces like RevenueData, MonthlyReportData, etc. remain unchanged)

export const practiceDataService = {
  // ... (other existing methods like getRevenueData, getMonthlyReport, etc. remain unchanged)

  /**
   * Get detailed information for a specific patient.
   * @param patientId - The ID of the patient to retrieve.
   * @returns Promise with patient details data or null if an error occurs.
   */
  async getPatientDetails(patientId: string): Promise<PatientDetailsData | null> {
    if (!patientId) {
      console.error('Patient ID is required for getPatientDetails');
      return null;
    }
    try {
      // Assuming the Netlify function 'get-patient-details' returns a structure
      // where the patient object is directly under a 'data' field.
      // This matches NexHealthPatientDetailResponse if the Netlify function forwards it.
      const response = await fetch(`/.netlify/functions/nexhealth/get-patient-details?patientId=${patientId}`);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: response.statusText }));
        console.error(`Error fetching patient details for ID ${patientId}: ${response.status}`, errorData);
        throw new Error(`Failed to fetch patient details: ${errorData.message || response.statusText}`);
      }
      const result: { data: NexHealthPatient } = await response.json(); // Matches our previous assumption for GetPatientDetailsApiResponse

      if (!result.data) {
        console.error(`No patient data returned for ID ${patientId}`, result);
        return null;
      }
      
      const patient = result.data;

      // Transform NexHealthPatient to PatientDetailsData
      // Ensure PatientDetailsData in nexhealth.ts is the one being used.
      const patientDetails: PatientDetailsData = {
        id: patient.id,
        fullName: patient.name || `${patient.first_name || ''} ${patient.last_name || ''}`.trim(),
        email: patient.email,
        phoneNumber: patient.bio?.phone_number || patient.bio?.cell_phone_number || null,
        dateOfBirth: patient.bio?.date_of_birth || null,
        address: {
          streetAddress: patient.bio?.address_line_1 || patient.bio?.street_address || null,
          city: patient.bio?.city || null,
          state: patient.bio?.state || null,
          zipCode: patient.bio?.zip_code || null,
        },
        gender: patient.bio?.gender || null,
        isInactive: patient.inactive,
        isNewPatient: patient.bio?.new_patient,
        createdAt: patient.created_at,
        updatedAt: patient.updated_at,
        balanceAmount: patient.balance?.amount,
        foreignId: patient.foreign_id,
        locationIds: patient.location_ids,
      };
      return patientDetails;
    } catch (error) {
      console.error('Error in getPatientDetails service:', error);
      return null;
    }
  },

  /**
   * Get a list of patients with optional search, filtering, and pagination.
   * @param queryParams - Parameters for filtering, sorting, and pagination.
   * @returns Promise with the list of patients and total count, or null if an error occurs.
   */
  async getPatientsList(queryParams?: GetPatientsQueryParams): Promise<{ patients: PatientListDisplayItem[], totalCount: number } | null> {
    try {
      const params = new URLSearchParams();
      if (queryParams) {
        Object.entries(queryParams).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            if (Array.isArray(value)) {
              value.forEach(v => params.append(key, v.toString()));
            } else {
              params.append(key, value.toString());
            }
          }
        });
      }

      // We'll need a new Netlify function, e.g., 'get-patients-list'
      // This function will internally call NexHealth GET /patients
      const response = await fetch(`/.netlify/functions/nexhealth/get-patients-list?${params.toString()}`);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: response.statusText }));
        console.error('Error fetching patients list:', response.status, errorData);
        throw new Error(`Failed to fetch patients list: ${errorData.message || response.statusText}`);
      }

      // Assuming the Netlify function returns the full NexHealthPatientListResponse structure
      const result: NexHealthPatientListResponse = await response.json();

      if (!result.data || !result.data.patients) {
        console.error('No patient data returned from list endpoint', result);
        return { patients: [], totalCount: 0 };
      }

      const displayPatients: PatientListDisplayItem[] = result.data.patients.map(patient => ({
        id: patient.id,
        name: patient.name || `${patient.first_name || ''} ${patient.last_name || ''}`.trim(),
        email: patient.email,
        phoneNumber: patient.bio?.phone_number || patient.bio?.cell_phone_number || null,
        status: patient.inactive ? 'inactive' : 'active',
        createdAt: patient.created_at,
        dateOfBirth: patient.bio?.date_of_birth,
        // lastVisit, balance, nextAppointment would require more complex data fetching/joining
      }));

      return {
        patients: displayPatients,
        totalCount: result.count || 0,
      };
    } catch (error) {
      console.error('Error in getPatientsList service:', error);
      return null;
    }
  },

  /**
   * Create a new patient.
   * @param payload - Data for the new patient.
   * @returns Promise with the created patient data or null if an error occurs.
   */
  async createPatient(payload: NexHealthCreatePatientPayload): Promise<NexHealthPatient | null> {
    try {
      // We'll need a new Netlify function, e.g., 'create-new-patient'
      // This function will internally call NexHealth POST /patients
      const response = await fetch('/.netlify/functions/nexhealth/create-new-patient', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: response.statusText }));
        console.error('Error creating patient:', response.status, errorData);
        throw new Error(`Failed to create patient: ${errorData.message || response.statusText}`);
      }

      // Assuming the Netlify function returns the full NexHealthCreatePatientResponse structure
      const result: NexHealthCreatePatientResponse = await response.json();

      if (!result.data || !result.data.user) {
        console.error('No patient data returned after creation', result);
        return null;
      }
      
      return result.data.user;
    } catch (error) {
      console.error('Error in createPatient service:', error);
      return null;
    }
  },

  // ... (testNexHealthConnection and other methods remain)
};

// fetchDashboardData helper function remains unchanged

