/**
 * Practice Data Service
 * 
 * This service provides a unified interface for accessing practice management data
 * from various sources (NexHealth, etc.) through our abstraction layer.
 */

// Revenue dashboard data types
export interface RevenueData {
  annual: {
    actual: number;
    goal: number;
    performance: number;
    previousYear: number;
    yoyChange: number;
  };
  periodic: Array<{
    label: string;
    revenue: number;
    count: number;
  }>;
  timeframe: 'monthly' | 'quarterly' | 'annual';
  year: number;
  metrics: {
    totalCharges: number;
    collectionRate: number;
    averagePayment: number;
  };
}

// Monthly report data types
export interface MonthlyReportData {
  title: string;
  period: {
    month: number;
    year: number;
    startDate: string;
    endDate: string;
  };
  revenue: {
    total: number;
    average: number;
    byDay: Array<{
      day: number;
      amount: number;
    }>;
  };
  appointments: {
    total: number;
    completed: number;
    completionRate: number;
    noShowRate: number;
  };
  procedures: {
    total: number;
    byType: Array<{
      count: number;
      revenue: number;
      name: string;
    }>;
  };
}

// Active patients data types
export interface ActivePatientsData {
  total: number;
  newPatients: number;
  returningPatients: number;
  byAge: Array<{
    ageGroup: string;
    count: number;
  }>;
  byProvider: Array<{
    provider: string;
    count: number;
  }>;
}

// Treatment success data types
export interface TreatmentSuccessData {
  period: {
    start: string;
    end: string;
    label: string;
  };
  overall: {
    totalProcedures: number;
    completedProcedures: number;
    completionRate: number;
    totalTreatmentPlans: number;
    completedTreatmentPlans: number;
    treatmentPlanCompletionRate: number;
  };
  proceduresByType: Array<{
    type: string;
    count: number;
    completed: number;
    completionRate: number;
    revenue: number;
  }>;
  treatmentPlans: Array<{
    id: string;
    patientId: string;
    date: string;
    totalProcedures: number;
    completedProcedures: number;
    completionRate: number;
    status: 'completed' | 'in-progress' | 'not-started';
  }>;
  averageTreatmentLength: number;
}

// Patient satisfaction data types
export interface PatientSatisfactionData {
  period: {
    start: string;
    end: string;
    label: string;
  };
  overall: {
    totalResponses: number;
    averageScore: number;
    npsScore: number;
  };
  scoreDistribution: Array<{
    score: number;
    count: number;
    percentage: number;
  }>;
  byProvider: Array<{
    provider: string;
    averageScore: number;
    responseCount: number;
  }>;
  recentFeedback: Array<{
    patientId: string;
    date: string;
    score: number;
    feedback: string;
  }>;
}

// Patient Details data types
export interface PatientDetailsData {
  id: number;
  firstName: string;
  lastName: string;
  fullName: string; // Combination of first and last name
  email: string;
  dateOfBirth: string; // Expected in YYYY-MM-DD format from API
  phoneNumber: string; // Primary phone number
  // Optional fields from NexHealth 'bio' object if needed later
  address?: {
    streetAddress?: string; // maps to 'street_address' or 'address_line_1'
    city?: string;
    state?: string;
    zipCode?: string;
  };
  gender?: string;
  isNewPatient?: boolean;
  isInactive?: boolean;
}

// Patient List Item data types
export interface PatientListItem {
  id: string; // Changed from number to string to align with NexHealth typical ID format
  firstName: string;
  lastName: string;
  fullName: string;
  dateOfBirth?: string; // YYYY-MM-DD
  lastVisitDate?: string; // YYYY-MM-DD, crucial for recalls
  // recallStatus?: 'due' | 'scheduled' | 'contacted'; // Example, if available from API
  contact?: {
    email?: string;
    phone?: string;
  };
  // Add other fields relevant for list views and basic filtering as discovered
}

export interface PaginatedPatientsResponse {
  patients: PatientListItem[];
  pagination: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    perPage: number;
  };
}

// Daily huddle data types
export interface DailyHuddleData {
  date: {
    iso: string;
    display: string;
  };
  summary: {
    totalAppointments: number;
    confirmedAppointments: number;
    confirmationRate: number;
    expectedRevenue: number;
  };
  appointments: {
    byStatus: Array<{
      status: string;
      count: number;
    }>;
    byProvider: Array<{
      provider: string;
      total: number;
      confirmed: number;
      unconfirmed: number;
      confirmationRate: number;
    }>;
    byTime: Array<{
      hour: string;
      appointments: Array<{
        id: string;
        patientId: string;
        patientName: string;
        startTime: string;
        endTime: string;
        status: string;
        providerId: string;
        appointmentType: string;
        operatory: string;
      }>;
    }>;
  };
  procedures: {
    total: number;
    byType: Array<{
      type: string;
      count: number;
      totalFee: number;
    }>;
  };
}

/**
 * Practice Data Service for accessing practice management data
 */
export const practiceDataService = {
  /**
   * Get revenue dashboard data
   * @param timeframe - Time period for the data (monthly, quarterly, annual)
   * @param year - Year for the data
   * @returns Promise with revenue data or null if error
   */
  async getRevenueData(
    timeframe: 'monthly' | 'quarterly' | 'annual' = 'monthly', 
    year?: number
  ): Promise<RevenueData | null> {
    const params = new URLSearchParams();
    params.append('timeframe', timeframe);
    if (year) params.append('year', year.toString());
    
    return await fetchDashboardData<RevenueData>('revenue', params);
  },
  
  /**
   * Get monthly report data
   * @param year - Year for the report
   * @param month - Month for the report (1-12)
   * @returns Promise with monthly report data or null if error
   */
  async getMonthlyReport(
    year?: number, 
    month?: number
  ): Promise<MonthlyReportData | null> {
    const params = new URLSearchParams();
    if (year) params.append('year', year.toString());
    if (month) params.append('month', month.toString());
    
    return await fetchDashboardData<MonthlyReportData>('monthly-report', params);
  },
  
  /**
   * Get active patients data
   * @param period - Time period for the data (week, month, quarter, year)
   * @returns Promise with active patients data or null if error
   */
  async getActivePatients(
    period: 'week' | 'month' | 'quarter' | 'year' = 'month'
  ): Promise<ActivePatientsData | null> {
    const params = new URLSearchParams();
    params.append('period', period);
    
    return await fetchDashboardData<ActivePatientsData>('active-patients', params);
  },
  
  /**
   * Get treatment success data
   * @param period - Time period for the data (month, quarter, year)
   * @returns Promise with treatment success data or null if error
   */
  async getTreatmentSuccess(
    period: 'month' | 'quarter' | 'year' = 'month'
  ): Promise<TreatmentSuccessData | null> {
    const params = new URLSearchParams();
    params.append('period', period);
    
    return await fetchDashboardData<TreatmentSuccessData>('treatment-success', params);
  },
  
  /**
   * Get patient satisfaction data
   * @param period - Time period for the data (month, quarter, year)
   * @returns Promise with patient satisfaction data or null if error
   */
  async getPatientSatisfaction(
    period: 'month' | 'quarter' | 'year' = 'month'
  ): Promise<PatientSatisfactionData | null> {
    const params = new URLSearchParams();
    params.append('period', period);
    
    return await fetchDashboardData<PatientSatisfactionData>('patient-satisfaction', params);
  },
  
  /**
   * Get daily huddle data
   * @param date - Specific date for the huddle (YYYY-MM-DD format)
   * @returns Promise with daily huddle data or null if error
   */
  async getDailyHuddle(
    date?: string
  ): Promise<DailyHuddleData | null> {
    const params = new URLSearchParams();
    if (date) params.append('date', date);
    
    return await fetchDashboardData<DailyHuddleData>('daily-huddle', params);
  },
  
  /**
   * Test NexHealth API connection
   * @returns Promise with test results or null if error
   */
  /**
   * Get detailed information for a specific patient.
   * @param patientId - The ID of the patient to retrieve.
   * @returns Promise with patient details data or null if an error occurs.
   */
  async getPatientDetails(patientId: string): Promise<PatientDetailsData | null> {
    if (!patientId) {
      console.error('Patient ID is required to fetch patient details.');
      return null;
    }
    try {
      // We'll assume a Netlify function endpoint like /api/nexhealth/patient/:patientId
      const response = await fetch(`/api/nexhealth/patient/${patientId}`);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: response.statusText }));
        console.error(`Error fetching patient details for ID ${patientId}: ${response.status}`, errorData.message || response.statusText);
        return null;
      }
      const data: PatientDetailsData = await response.json();
      // Basic validation or transformation can happen here if needed
      if (!data || !data.id) {
          console.error('Received invalid patient data structure from API for ID:', patientId);
          return null;
      }
      return data;
    } catch (error) {
      console.error(`Failed to fetch patient details for ID ${patientId}:`, error);
      return null;
    }
  },

  /**
   * Get a paginated list of patients with optional search and filtering.
   * @param options - Optional parameters for pagination, search, and filtering.
   * @returns Promise with paginated patient list or null if error.
   */
  async getPatientsList(options?: {
    page?: number;
    perPage?: number;
    searchTerm?: string;
    filters?: Record<string, string | number | boolean | undefined>; // To pass various filter criteria
  }): Promise<PaginatedPatientsResponse | null> {
    const params = new URLSearchParams();
    if (options?.page) params.append('page', options.page.toString());
    if (options?.perPage) params.append('per_page', options.perPage.toString());
    if (options?.searchTerm) params.append('search', options.searchTerm); // 'search' is a common param name
    
    if (options?.filters) {
      for (const key in options.filters) {
        // Ensure the filter value is not undefined or null before appending
        if (options.filters[key] !== undefined && options.filters[key] !== null) {
          params.append(key, options.filters[key].toString());
        }
      }
    }

    // The backend Netlify function for this will be at '/api/nexhealth/patients'
    const apiPath = '/api/nexhealth/patients'; 
    
    try {
      // TODO: Replace with a call to a generic fetch helper if available,
      // or adapt fetchDashboardData if it can be made more generic.
      // For now, direct fetch:
      const response = await fetch(`${apiPath}?${params.toString()}`, {
        headers: {
          'Accept': 'application/json',
          // Add any other necessary headers, e.g., Authorization if required directly here,
          // though typically handled by the backend function calling NexHealth.
        },
      });

      if (!response.ok) {
        // Attempt to get more detailed error info from response body
        let errorDetails = `Error fetching patients list: ${response.status} ${response.statusText}`;
        try {
          const errorBody = await response.json();
          errorDetails += ` - ${JSON.stringify(errorBody)}`;
        } catch {
          // Ignore if response body is not JSON or empty
        }
        console.error(errorDetails);
        return null;
      }
      return await response.json() as PaginatedPatientsResponse;
    } catch (error) {
      console.error('Network or other error fetching patients list:', error);
      return null;
    }
  },

  /**
   * Test NexHealth API connection
   * @returns Promise with test results or null if error
   */
  async testNexHealthConnection(): Promise<{ message: string; results: Array<{ endpoint: string; success: boolean; count?: number; sample?: { id: string }; error?: string }>; allSuccessful: boolean } | null> {
    try {
      const response = await fetch('/api/nexhealth/test');
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error testing NexHealth connection:', error);
      return null;
    }
  }
};

/**
 * Helper function to fetch data from dashboard endpoints
 * @param endpoint - API endpoint name
 * @param params - Query parameters
 * @returns Promise with data or null if error
 */
async function fetchDashboardData<T>(endpoint: string, params: URLSearchParams): Promise<T | null> {
  try {
    const url = `/api/dashboard/${endpoint}?${params.toString()}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const result = await response.json();
    return result.data as T;
  } catch (error) {
    console.error(`Error fetching dashboard data: ${endpoint}`, error);
    return null;
  }
}
