import React from 'react';
import EmptyState from './EmptyState';

export const NoAppointmentsState = () => {
  return (
    <EmptyState
      title="No Appointments Yet"
      description="You don't have any upcoming appointments. Schedule your next dental check-up to stay on top of your oral health."
      illustration="/illustrations/characters/charater style 2/8.png"
      action={{
        label: "Schedule Now",
        onClick: () => console.log("Navigate to appointment scheduling")
      }}
    />
  );
};

export const NoPatientRecordsState = () => {
  return (
    <EmptyState
      title="No Patient Records Found"
      description="There are no patient records matching your search criteria. Try adjusting your filters or add a new patient record."
      illustration="/illustrations/characters/charater style 2/13.png"
      action={{
        label: "Add New Patient",
        onClick: () => console.log("Navigate to add patient form")
      }}
    />
  );
};

export const NoNotificationsState = () => {
  return (
    <EmptyState
      title="No Notifications"
      description="You're all caught up! There are no new notifications at this time."
      illustration="/illustrations/characters/charater style 2/15.png"
      icon="Bell"
    />
  );
};

export const NoTreatmentPlansState = () => {
  return (
    <EmptyState
      title="No Treatment Plans"
      description="No active treatment plans found for this patient. Create a new treatment plan to get started."
      illustration="/illustrations/characters/charater style 2/5.png"
      action={{
        label: "Create Treatment Plan",
        onClick: () => console.log("Navigate to create treatment plan")
      }}
    />
  );
};

export const NoInvoicesState = () => {
  return (
    <EmptyState
      title="No Invoices Found"
      description="There are no invoices in the system yet. Create your first invoice to get started."
      illustration="/illustrations/characters/charater style 2/11.png"
      action={{
        label: "Create Invoice",
        onClick: () => console.log("Navigate to create invoice")
      }}
    />
  );
};

const EmptyStateSamples = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-4 text-navy">Appointments</h2>
        <NoAppointmentsState />
      </div>
      
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-4 text-navy">Patient Records</h2>
        <NoPatientRecordsState />
      </div>
      
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-4 text-navy">Notifications</h2>
        <NoNotificationsState />
      </div>
      
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-4 text-navy">Treatment Plans</h2>
        <NoTreatmentPlansState />
      </div>
      
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-4 text-navy">Invoices</h2>
        <NoInvoicesState />
      </div>
    </div>
  );
};

export default EmptyStateSamples;
