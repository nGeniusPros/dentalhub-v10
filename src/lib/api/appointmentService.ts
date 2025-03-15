import { supabaseClient } from '../supabaseClient';

// Define interfaces for Appointment data
export interface Appointment {
  id: string;
  profile_id: string;
  location_id: string;
  appointment_time: string;
  status: 'scheduled' | 'completed' | 'canceled' | 'no-show';
  created_at: string;
  location?: {
    name: string;
    address: string;
    city: string;
    state: string;
  };
  profile?: {
    first_name: string;
    last_name: string;
    phone: string;
    email: string;
  };
}

// Filter options for appointment queries
export interface AppointmentFilter {
  locationId?: string;
  profileId?: string;
  startDate?: string;
  endDate?: string;
  status?: string;
}

// Appointment API methods
const appointmentApi = {
  // Get appointments with filters
  getAppointments: async (filters?: AppointmentFilter) => {
    try {
      let query = supabaseClient
        .from('appointments')
        .select(`
          *,
          location:locations(id, name, address, city, state),
          profile:profiles(id, first_name, last_name, phone, email)
        `);
      
      // Apply filters
      if (filters) {
        if (filters.locationId) {
          query = query.eq('location_id', filters.locationId);
        }
        
        if (filters.profileId) {
          query = query.eq('profile_id', filters.profileId);
        }
        
        if (filters.status) {
          query = query.eq('status', filters.status);
        }
        
        if (filters.startDate) {
          query = query.gte('appointment_time', filters.startDate);
        }
        
        if (filters.endDate) {
          query = query.lte('appointment_time', filters.endDate);
        }
      }
      
      // Order by appointment time
      query = query.order('appointment_time');
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching appointments:', error);
      return { data: null, error };
    }
  },
  
  // Get appointments for a specific day
  getAppointmentsByDay: async (date: string, locationId?: string) => {
    try {
      // Parse the date and create start/end of day
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      
      let query = supabaseClient
        .from('appointments')
        .select(`
          *,
          location:locations(id, name, address, city, state),
          profile:profiles(id, first_name, last_name, phone, email)
        `)
        .gte('appointment_time', startOfDay.toISOString())
        .lte('appointment_time', endOfDay.toISOString());
      
      if (locationId) {
        query = query.eq('location_id', locationId);
      }
      
      query = query.order('appointment_time');
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching appointments by day:', error);
      return { data: null, error };
    }
  },
  
  // Get a single appointment by ID
  getAppointmentById: async (id: string) => {
    try {
      const { data, error } = await supabaseClient
        .from('appointments')
        .select(`
          *,
          location:locations(id, name, address, city, state),
          profile:profiles(id, first_name, last_name, phone, email)
        `)
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching appointment:', error);
      return { data: null, error };
    }
  },
  
  // Create a new appointment
  createAppointment: async (appointment: Partial<Appointment>) => {
    try {
      const { data, error } = await supabaseClient
        .from('appointments')
        .insert([{
          ...appointment,
          status: appointment.status || 'scheduled',
          created_at: new Date().toISOString()
        }])
        .select()
        .single();
      
      if (error) throw error;
      
      return { data, error: null };
    } catch (error) {
      console.error('Error creating appointment:', error);
      return { data: null, error };
    }
  },
  
  // Update an existing appointment
  updateAppointment: async (id: string, appointment: Partial<Appointment>) => {
    try {
      const { data, error } = await supabaseClient
        .from('appointments')
        .update(appointment)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      return { data, error: null };
    } catch (error) {
      console.error('Error updating appointment:', error);
      return { data: null, error };
    }
  },
  
  // Delete an appointment
  deleteAppointment: async (id: string) => {
    try {
      const { data, error } = await supabaseClient
        .from('appointments')
        .delete()
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      return { data, error: null };
    } catch (error) {
      console.error('Error deleting appointment:', error);
      return { data: null, error };
    }
  },
  
  // Update appointment status
  updateAppointmentStatus: async (id: string, status: Appointment['status']) => {
    try {
      const { data, error } = await supabaseClient
        .from('appointments')
        .update({ status })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      return { data, error: null };
    } catch (error) {
      console.error('Error updating appointment status:', error);
      return { data: null, error };
    }
  }
};

export default appointmentApi;