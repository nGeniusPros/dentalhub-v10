import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Link } from 'react-router-dom';
import { practiceDataService, PatientDetailsData } from '../../services/practiceDataService';

const PatientDashboard = () => {
  const patientIdForTesting = '415';

  const [patientInfo, setPatientInfo] = useState<PatientDetailsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const familyMembers = [
    { name: "John Johnson", relation: "Spouse", nextAppointment: "Mar 20, 2024" },
    { name: "Emily Johnson", relation: "Daughter", nextAppointment: "Apr 5, 2024" },
    { name: "Michael Johnson", relation: "Son", nextAppointment: "None Scheduled" }
  ];

  const quickActions = [
    { label: "Book Appointment", icon: "Calendar", path: "/patient-dashboard/appointments" },
    { label: "Message Office", icon: "MessageSquare", path: "/patient-dashboard/chat" },
    { label: "View Documents", icon: "FileText", path: "/patient-dashboard/documents" },
    { label: "Make Payment", icon: "CreditCard", path: "/patient-dashboard/billing" }
  ];

  useEffect(() => {
    const fetchPatientData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await practiceDataService.getPatientDetails(patientIdForTesting);
        if (data) {
          setPatientInfo(data);
        } else {
          setError(`Failed to fetch patient details for ID ${patientIdForTesting}.`);
        }
      } catch (err) {
        console.error("Error in PatientDashboard fetching data:", err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPatientData();
  }, [patientIdForTesting]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Icons.Loader2 className="h-8 w-8 animate-spin text-navy" />
        <p className="ml-2 text-lg">Loading patient data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8 bg-red-100 border border-red-400 text-red-700 rounded-lg">
        <Icons.AlertTriangle className="h-12 w-12 mx-auto mb-4 text-red-500" />
        <h2 className="text-xl font-semibold mb-2">Error Loading Patient Data</h2>
        <p>{error}</p>
        <p className="mt-4 text-sm">Please try again later or contact support.</p>
      </div>
    );
  }

  if (!patientInfo) {
    return (
      <div className="text-center p-8 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded-lg">
        <Icons.Info className="h-12 w-12 mx-auto mb-4 text-yellow-500" />
        <h2 className="text-xl font-semibold mb-2">No Patient Data</h2>
        <p>Patient information could not be found.</p>
      </div>
    );
  }

  const formatDateOfBirth = (isoDate: string | undefined) => {
    if (!isoDate) return "N/A";
    try {
      const date = new Date(isoDate + 'T00:00:00');
      return date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
    } catch {
      return isoDate;
    }
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Patient Information Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white shadow-lg rounded-xl p-6"
      >
        <div className="flex items-center space-x-4 mb-6">
          <div className="bg-navy-light p-3 rounded-full">
            <Icons.User className="h-8 w-8 text-navy" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{patientInfo.fullName}</h1>
            <p className="text-gray-500">Patient Profile</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-sm">
          <div>
            <p className="text-gray-500 font-medium">Date of Birth</p>
            <p className="text-gray-700">{formatDateOfBirth(patientInfo.dateOfBirth)}</p>
          </div>
          <div>
            <p className="text-gray-500 font-medium">Email Address</p>
            <p className="text-gray-700">{patientInfo.email || 'N/A'}</p>
          </div>
          <div>
            <p className="text-gray-500 font-medium">Phone Number</p>
            <p className="text-gray-700">{patientInfo.phoneNumber || 'N/A'}</p>
          </div>
          <div>
            <p className="text-gray-500 font-medium">Address</p>
            <p className="text-gray-700">
              {patientInfo.address?.streetAddress || ''} 
              {patientInfo.address?.city ? `, ${patientInfo.address.city}` : ''}
              {patientInfo.address?.state ? `, ${patientInfo.address.state}` : ''}
              {patientInfo.address?.zipCode ? ` ${patientInfo.address.zipCode}` : ''}
              {!patientInfo.address?.streetAddress && !patientInfo.address?.city && 'N/A'}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {quickActions.map((action, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link
              to={action.path}
              className="block p-4 bg-white rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow"
            >
              <div className="flex flex-col items-center text-center">
                {React.createElement(Icons[action.icon as keyof typeof Icons], {
                  className: "w-6 h-6 text-primary-600 mb-2"
                })}
                <span className="text-sm font-medium text-gray-900">{action.label}</span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Family Members Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Family Members</h3>
          <Link
            to="/patient-dashboard/family"
            className="text-sm text-primary-600 hover:text-primary-700"
          >
            View All
          </Link>
        </div>
        <div className="space-y-4">
          {familyMembers.map((member, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                  <Icons.User className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{member.name}</p>
                  <p className="text-sm text-gray-500">{member.relation}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Next Appointment</p>
                <p className="text-sm font-medium text-gray-900">{member.nextAppointment}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Appointments</h3>
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="font-medium text-gray-900">Cleaning</p>
              <p className="text-sm text-gray-500">Mar 15, 2024 - 10:00 AM</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Documents</h3>
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="font-medium text-gray-900">Treatment Plan</p>
              <p className="text-sm text-gray-500">Updated Feb 28, 2024</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PatientDashboard;