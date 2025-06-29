import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import LandingPage from '../pages/externalpages/LandingPage';
import RecallGeniusLandingPage from '../pages/externalpages/RecallGeniusLandingPage';
import Dashboard from '../pages/admin/Dashboard';
import RevenueDashboard from '../pages/admin/quickaccess/RevenueDashboard';
import MonthlyRevenueReport from '../pages/admin/quickaccess/MonthlyRevenueReport';
import ActivePatientsDashboard from '../pages/admin/quickaccess/ActivePatientsDashboard';
import PatientSatisfactionDashboard from '../pages/admin/quickaccess/PatientSatisfactionDashboard';
import TreatmentSuccessDashboard from '../pages/admin/quickaccess/TreatmentSuccessDashboard';
import DailyHuddleDashboard from '../pages/admin/quickaccess/DailyHuddleDashboard';
import TestNexHealth from '../pages/admin/quickaccess/TestNexHealth';
import AdminDashboard from '../pages/admin/AdminDashboard';
import CommunicationsDashboard from '../pages/admin/communications/CommunicationsDashboard';
import StaffDashboard from '../pages/staff/StaffDashboard';
import DashboardLayout from '../components/layout/DashboardLayout';
import InsuranceARDashboard from '../pages/admin/insurance/InsuranceARDashboard';
import HRDashboard from '../pages/admin/hr/HRDashboard';
import AdminLogin from '../pages/login/AdminLogin';
import StaffLogin from '../pages/login/StaffLogin';
import PatientLogin from '../pages/login/PatientLogin';
import PatientDashboard from '../pages/patient/PatientDashboard';
import MembershipPlans from '../pages/admin/MembershipPlans';
import Membership from '../pages/patient/Membership';
import Appointments from '../pages/patient/Appointments';
import AIPracticeConsultant from '../pages/admin/AIPracticeConsultant';
import KnowledgeBasePage from '../pages/admin/KnowledgeBasePage';
import Patients from '../pages/admin/adminpatients/Patients';
import Prospects from '../pages/admin/Prospects';
import SMSCampaigns from '../pages/admin/communications/SMSCampaigns';
import Campaigns from '../pages/admin/communications/Campaigns';
import PasswordManager from '../pages/admin/settings/PasswordManager';
import VendorManagement from '../pages/admin/settings/VendorManagement';
import GeneralSettings from '../pages/admin/settings/GeneralSettings';
import UserManagement from '../pages/admin/settings/UserManagement';
import Marketplace from '../pages/admin/marketplace/Marketplace';
import StaffManagement from '../pages/admin/hr/StaffManagement';
import EmailDashboard from '../pages/admin/communications/EmailDashboard';
import { EmailProvider } from '../contexts/EmailContext';
import VoiceCampaigns from '../pages/admin/communications/VoiceCampaigns';
import SocialMediaDashboard from '../pages/admin/social/SocialMediaDashboard';
import LearningDashboard from '../pages/admin/learning/LearningDashboard';
import ResourcesDashboard from '../pages/admin/resources/ResourcesDashboard';
import AdminAppointmentsDashboard from '../pages/admin/appointments';
import StaffAppointmentsDashboard from '../pages/staff/appointments';
import GradientTester from '../pages/test/GradientTester';
import CalendarTest from '../pages/test/CalendarTest';
import RecallGeniusSimple from '../examples/RecallGeniusSimple';
import AIFeedbackDashboard from '../components/admin/AIFeedbackDashboard';
import AIFeedbackAnalytics from '../components/admin/AIFeedbackAnalytics';
import { ClaimsDashboard } from '../pages/admin/claims/ClaimsDashboard';
import NewClaimPage from '../pages/admin/claims/NewClaimPage';
import ClaimDetailsPage from '../pages/admin/claims/ClaimDetailsPage';
import ClaimsReportingPage from '../pages/admin/claims/ClaimsReportingPage';
import CampaignDetails from '../pages/admin/communications/CampaignDetails';
import DentalBilling from '../pages/externalpages/services/DentalBilling';
import DentalRecruiting from '../pages/externalpages/services/DentalRecruiting';
import DentalConsulting from '../pages/externalpages/services/DentalConsulting';
import Resources from '../pages/externalpages/Resources';
import Blog from '../pages/externalpages/Blog';
import BlogPost from '../pages/externalpages/BlogPost';
import About from '../pages/externalpages/About';
import Contact from '../pages/externalpages/Contact';
import Careers from '../pages/externalpages/Careers';
import SuperkiddosProposalPage from '../pages/externalpages/SuperkiddosProposalPage';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/recall" element={<RecallGeniusLandingPage />} />
      <Route path="/services">
        <Route path="dental-billing" element={<DentalBilling />} />
        <Route path="dental-recruiting" element={<DentalRecruiting />} />
        <Route path="dental-consulting" element={<DentalConsulting />} />
      </Route>
      {/* Add specific resource routes before the general one */}
      <Route path="/resources/category/:categorySlug" element={<Resources />} />
      <Route path="/resources/type/:typeSlug" element={<Resources />} />
      <Route path="/resources" element={<Resources />} />

      {/* Blog routes */}
      <Route path="/blog/category/:categorySlug" element={<Blog />} />
      <Route path="/blog/:postSlug" element={<BlogPost />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/careers" element={<Careers />} />
      <Route path="/external/superkiddos-proposal" element={<SuperkiddosProposalPage />} />
      
      {/* Login routes */}
      <Route path="/login">
        <Route index element={<Navigate to="/login/admin" replace />} />
        <Route path="patient" element={<PatientLogin />} />
        <Route path="staff" element={<StaffLogin />} />
        <Route path="admin" element={<AdminLogin />} />
      </Route>

      {/* Practice Dashboard Routes */}
      <Route path="/dashboard" element={<DashboardLayout role="admin" />}>
        <Route index element={<Dashboard />} />
        <Route path="revenue-dashboard" element={<RevenueDashboard />} />
        
        {/* Additional dashboard routes will be added here */}
        <Route path="active-patients" element={<ActivePatientsDashboard />} />
        <Route path="patient-satisfaction" element={<PatientSatisfactionDashboard />} />
        <Route path="treatment-success" element={<TreatmentSuccessDashboard />} />
        <Route path="monthly-report" element={<MonthlyRevenueReport />} />
        <Route path="daily-huddle" element={<DailyHuddleDashboard />} />
        <Route path="test-nexhealth" element={<TestNexHealth />} />
      </Route>

      {/* Admin routes */}
      <Route path="/admin-dashboard" element={<DashboardLayout role="admin" />}>
        <Route index element={<AdminDashboard />} />
        <Route path="ai-consultant" element={<AIPracticeConsultant />} />
        <Route path="ai-feedback" element={<AIFeedbackDashboard />} />
        <Route path="ai-analytics" element={<AIFeedbackAnalytics />} />
        <Route path="knowledge-base" element={<KnowledgeBasePage />} />
        <Route path="hr" element={<HRDashboard />} />
        <Route path="insurance" element={<InsuranceARDashboard />} />
        <Route path="patients" element={<Patients />} />
        <Route path="prospects" element={<Prospects />} />
        <Route path="staff" element={<StaffManagement />} />
        <Route path="membership-plans" element={<MembershipPlans />} />
        <Route path="appointments" element={<AdminAppointmentsDashboard />} />
        <Route path="sms-campaigns" element={<SMSCampaigns />} />
        <Route path="campaigns" element={<Campaigns />} />
        <Route path="campaigns/:campaignId" element={<CampaignDetails />} />
        <Route path="resources" element={<ResourcesDashboard />} />
        <Route path="email-dashboard" element={
          <EmailProvider>
            <EmailDashboard />
          </EmailProvider>
        } />
        <Route path="voice-campaigns" element={<VoiceCampaigns />} />
        <Route path="social-media" element={<SocialMediaDashboard />} />
        <Route path="learning" element={<LearningDashboard />} />
        <Route path="settings" element={<GeneralSettings />} />
        <Route path="settings/passwords" element={<PasswordManager />} />
        <Route path="settings/users" element={<UserManagement />} />
        <Route path="contact-manager" element={<VendorManagement />} />
        <Route path="marketplace" element={<Marketplace />} />
        <Route path="communications" element={<CommunicationsDashboard />} />
        <Route path="gradients" element={<GradientTester />} />
        
        {/* Claims routes */}
        <Route path="claims" element={<Outlet />}>
          <Route index element={<ClaimsDashboard />} />
          <Route path="new" element={<NewClaimPage />} />
          <Route path=":claimId" element={<ClaimDetailsPage />} />
          <Route path="reporting" element={<ClaimsReportingPage />} />
          {/* <Route path="batch" element={<BatchProcessingPage />} /> */}
        </Route>
        
        {/* Add other admin routes */}
      </Route>

      {/* Staff routes */}
      <Route path="/staff-dashboard" element={<DashboardLayout role="staff" />}>
        <Route index element={<StaffDashboard />} />
        <Route path="appointments" element={<StaffAppointmentsDashboard />} />
        {/* Add staff routes */}
      </Route>

      {/* Patient routes */}
      <Route path="/patient-dashboard" element={<DashboardLayout role="patient" />}>
        <Route index element={<PatientDashboard />} />
        <Route path="membership" element={<Membership />} />
        <Route path="appointments" element={<Appointments />} />
        {/* Add patient routes */}
      </Route>

      {/* Testing routes */}
      <Route path="/test/gradients" element={<GradientTester />} />
      <Route path="/test/calendar" element={<CalendarTest />} />
      <Route path="/test/recall-genius" element={<RecallGeniusLandingPage />} />
      <Route path="/test/recall-simple" element={<RecallGeniusSimple />} />

      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};