import type { NavSection } from './types';

const quickAccessSection: NavSection = {
    category: "Quick Access",
    items: [
      { icon: "DollarSign", label: "Practice Revenue", path: "/dashboard/revenue-dashboard" },
      { icon: "BarChart2", label: "Monthly Revenue Report", path: "/dashboard/monthly-report" },
      { icon: "Users2", label: "Active Patients", path: "/dashboard/active-patients" },
      { icon: "Activity", label: "Treatment Plan Success", path: "/dashboard/treatment-success" },
      { icon: "Star", label: "Patient Satisfaction", path: "/dashboard/patient-satisfaction" },
      { icon: "LineChart", label: "Daily Huddle KPI's", path: "/dashboard/daily-huddle" },
    ],
  };

const practiceAcceleratorsSection: NavSection = {
    category: "Practice Accelerators",
    items: [
      { icon: "LayoutDashboard", label: "Dashboard", path: "/admin-dashboard" },
      { icon: "Brain", label: "AI Consultant", path: "/admin-dashboard/ai-consultant" },
      { icon: "Users2", label: "Patients", path: "/admin-dashboard/patients" },
      { icon: "CalendarCheck", label: "Appointments", path: "/admin-dashboard/appointments" },
      { icon: "UserCog", label: "Staff", path: "/admin-dashboard/staff" },
      { icon: "Users2", label: "HR", path: "/admin-dashboard/hr" },
      { icon: "Crown", label: "Membership Plans", path: "/admin-dashboard/membership-plans" },
    ],
  };

const resourcesSection: NavSection = {
    category: "Resources",
    items: [
      {
        label: 'Resources',
        icon: 'Files',
        path: '/admin-dashboard/resources'
      },
      {
        label: 'Knowledge Base',
        icon: 'Database',
        path: '/admin-dashboard/knowledge-base'
      },
      {
        label: 'Learning Center',
        icon: 'GraduationCap',
        path: '/admin-dashboard/learning'
      },
      {
        label: 'Marketplace',
        icon: 'Store',
        path: '/admin-dashboard/marketplace'
      }
    ]
  };

const communicationsSection: NavSection = {
    category: "Communications",
    items: [
      { icon: "MessageCircle", label: "All Conversation", path: "/admin-dashboard/communications" },
      { icon: "MessageSquare", label: "SMS Campaigns", path: "/admin-dashboard/sms-campaigns" },
      { icon: "Mail", label: "Email Dashboard", path: "/admin-dashboard/email-dashboard" },
      { icon: "Phone", label: "Voice Campaigns", path: '/admin-dashboard/voice-campaigns' },
      { icon: "Globe2", label: "Social Media", path: '/admin-dashboard/social-media' },
    ],
  };

const systemSection: NavSection = {
    category: "System",
    items: [
      { icon: "Building2", label: "Contact Manager", path: "/admin-dashboard/contact-manager" },
      { icon: "Settings", label: "Settings", path: "/admin-dashboard/settings" },
    ],
  };

export const adminNavItems: NavSection[] = [
  quickAccessSection,
  practiceAcceleratorsSection,
  communicationsSection,
  resourcesSection,
  systemSection,
];

export const staffNavItems: NavSection[] = [
  {
    category: "Quick Access",
    items: [
      { icon: "LayoutDashboard", label: "Dashboard", path: "/staff-dashboard" },
      { icon: "Users2", label: "Patients", path: "/staff-dashboard/patients" },
      { icon: "CalendarCheck", label: "Appointments", path: "/staff-dashboard/appointments" },
    ],
  },
  {
    category: "Clinical",
    items: [
      { icon: "Stethoscope", label: "Treatments", path: "/staff-dashboard/treatments" },
      { icon: "FileText", label: "Patient Records", path: "/staff-dashboard/records" },
    ],
  },
  {
    category: "Communications",
    items: [
      { icon: "MessageSquare", label: "Messages", path: "/staff-dashboard/messages" },
      { icon: "Phone", label: "Call Center", path: "/staff-dashboard/call-center" },
    ],
  },
  {
    category: "System",
    items: [
      { icon: "Settings", label: "Settings", path: "/staff-dashboard/settings" },
    ],
  }
];

export const patientNavItems: NavSection[] = [
  {
    category: "Main",
    items: [
      { icon: "LayoutDashboard", label: "Dashboard", path: "/patient-dashboard" },
      { icon: "CalendarCheck", label: "Appointments", path: "/patient-dashboard/appointments" },
      { icon: "Crown", label: "Membership", path: "/patient-dashboard/membership" },
    ],
  },
  {
    category: "Records",
    items: [
      { icon: "FileText", label: "Documents", path: "/patient-dashboard/documents" },
      { icon: "CreditCard", label: "Billing", path: "/patient-dashboard/billing" },
    ],
  },
  {
    category: "Communication",
    items: [
      { icon: "MessageSquare", label: "Messages", path: "/patient-dashboard/messages" },
      { icon: "Settings", label: "Settings", path: "/patient-dashboard/settings" },
    ],
  }
];
