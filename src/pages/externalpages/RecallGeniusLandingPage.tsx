import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Mockup } from "@/components/ui/mockup";
import { Glow } from "@/components/ui/glow";
import { LucideMessageSquare, LucideArrowRight, LucideCheck, LucideCheckCircle, LucideChevronDown, LucideChevronRight, LucideDollarSign, LucideBrain, LucideUsers, LucideCalendar } from "lucide-react";
import { Link } from "react-router-dom";
import StatsCard from "@/components/dashboard/StatsCard";
import FeatureHighlight from "@/components/FeatureHighlight";

// Portal card component for the second section
interface PortalCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  features: string[];
  buttonText: string;
}

const PortalCard: React.FC<PortalCardProps> = ({
  title,
  description,
  icon,
  features,
  buttonText,
}) => {
  // Define the login route based on the title
  const getLoginRoute = () => {
    if (title === "Patient Portal") return "/login/patient";
    if (title === "Staff Portal") return "/login/staff";
    if (title === "Admin Portal") return "/login/admin";
    return "/";
  };

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-glow transition-shadow p-6 flex flex-col items-center">
      <div className="w-16 h-16 flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-navy mb-2">{title}</h3>
      <p className="text-gray-darker text-center mb-4">{description}</p>
      <ul className="w-full space-y-2 mb-6">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center text-sm">
            <div className="inline-flex items-center justify-center text-turquoise mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            {feature}
          </li>
        ))}
      </ul>
      <Button 
        className="bg-gradient-to-r from-purple to-turquoise text-white w-full"
        asChild
      >
        <Link to={getLoginRoute()}>
          {buttonText}
        </Link>
      </Button>
    </div>
  );
};

// FAQ Item Component
const FaqItem = ({ question, answer }: { question: string; answer: string }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="border-b border-gray-light last:border-b-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-between items-center w-full py-5 text-left"
      >
        <h3 className="text-lg font-medium text-navy">{question}</h3>
        <div>
          {isOpen ? (
            <LucideChevronDown className="h-5 w-5 text-navy" />
          ) : (
            <LucideChevronRight className="h-5 w-5 text-navy" />
          )}
        </div>
      </button>
      {isOpen && (
        <div className="pb-5">
          <p className="text-gray-darker">{answer}</p>
        </div>
      )}
    </div>
  );
};

// Testimonial Card Component
const TestimonialCard = ({ quote, author, role, image }: { quote: string; author: string; role: string; image: string }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="mb-4 text-gold">
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
          <path d="M11.192 15.757c0-.88-.23-1.618-.69-2.217-.326-.412-.768-.683-1.327-.812-.55-.128-1.07-.137-1.54-.028-.16.032-.52.112-1.1.248-.73.168-1.29.3-1.71.393.5-1.524 1.233-2.593 2.2-3.22.966-.626 2.184-.942 3.654-.942v-2.134c-1.326 0-2.52.214-3.585.642-1.066.427-1.975 1.03-2.727 1.808-.75.773-1.337 1.698-1.757 2.773-.42 1.07-.63 2.235-.63 3.497 0 1.205.148 2.26.445 3.167.298.9.738 1.668 1.32 2.29.58.626 1.296 1.1 2.146 1.427.85.32 1.816.482 2.89.482.714 0 1.413-.07 2.105-.21.692-.143 1.304-.354 1.834-.635.53-.28.972-.62 1.328-1.017.354-.398.63-.846.83-1.347.197-.5.295-1.07.295-1.71zm10.264 0c0-.88-.23-1.618-.69-2.217-.326-.42-.77-.695-1.327-.824-.56-.13-1.07-.14-1.54-.03-.16.033-.506.113-1.07.248-.73.168-1.29.3-1.71.394.497-1.525 1.233-2.594 2.2-3.22.966-.626 2.184-.942 3.654-.942v-2.12c-1.326 0-2.522.214-3.585.642-1.066.427-1.975 1.03-2.727 1.808-.75.773-1.34 1.7-1.758 2.775-.42 1.068-.63 2.233-.63 3.495 0 1.205.148 2.26.445 3.167.298.9.737 1.667 1.318 2.29.583.626 1.297 1.1 2.147 1.427.85.32 1.816.483 2.89.483.714 0 1.413-.07 2.105-.21.692-.143 1.304-.354 1.834-.635.53-.28.972-.62 1.328-1.016.355-.4.63-.85.83-1.35.2-.5.294-1.07.294-1.713z" />
        </svg>
      </div>
      <p className="text-gray-darker mb-6 italic">{quote}</p>
      <div className="flex items-center">
        <img src={image} alt={author} className="w-12 h-12 rounded-full mr-4 object-cover" />
        <div>
          <h4 className="font-bold text-navy">{author}</h4>
          <p className="text-gray-dark text-sm">{role}</p>
        </div>
      </div>
    </div>
  );
};

// Feature Card Component
const FeatureCard = ({ title, description, icon }: { title: string; description: string; icon: React.ReactNode }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-glow transition-shadow p-6">
      <div className="w-12 h-12 bg-navy/10 text-navy rounded-lg flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-navy mb-2">{title}</h3>
      <p className="text-gray-darker">{description}</p>
    </div>
  );
};

// Legal Document Modal Component
const LegalDocumentModal = ({ 
  isOpen, 
  onClose, 
  title, 
  content 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  title: string; 
  content: string 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-navy">{title}</h2>
          <button 
            onClick={onClose}
            className="text-gray-darker hover:text-navy"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="prose max-w-none">
          <div dangerouslySetInnerHTML={{ __html: content }} />
        </div>
      </div>
    </div>
  );
};

// Waitlist Form Component
const WaitlistForm = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 max-w-md mx-auto">
      <h3 className="text-xl font-bold text-navy mb-4">Join the Exclusive Waitlist</h3>
      
      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
          <input type="email" required className="w-full px-3 py-2 border border-gray-300 rounded-md" />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Practice Name</label>
          <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md" />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Number of Chairs/Operatories</label>
          <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
            <option>1-3</option>
            <option>4-6</option>
            <option>7-10</option>
            <option>11+</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Current Practice Management Software</label>
          <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
            <option>Dentrix</option>
            <option>Open Dental</option>
            <option>Eaglesoft</option>
            <option>Other</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">What's your biggest challenge with patient recalls?</label>
          <textarea className="w-full px-3 py-2 border border-gray-300 rounded-md" rows={3}></textarea>
        </div>
        
        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-navy to-navy-light hover:from-navy-light hover:to-navy text-white font-medium"
        >
          Secure My Spot on the Waitlist
        </Button>
      </form>
      
      <div className="mt-4 text-center text-sm text-gray-500">
        <span className="font-bold text-navy">47 of 100 spots claimed</span>
      </div>
    </div>
  );
};

export default function LandingPage() {
  // State for legal document modals
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showCookiePolicy, setShowCookiePolicy] = useState(false);

  // Privacy Policy HTML content
  const privacyPolicyContent = `
    <h1>Privacy Policy</h1>
    <p><strong>Last Updated: March 14, 2025</strong></p>
    <h2>1. Introduction</h2>
    <p>Welcome to RecallGenius, a product of nGenius Pros LLC ("we," "our," or "us"). At RecallGenius, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website, join our waitlist, or use our services.</p>
    <p>Please read this Privacy Policy carefully. By accessing or using our website and services, you acknowledge that you have read, understood, and agree to be bound by all the terms outlined in this Privacy Policy.</p>
    <!-- More privacy policy content here -->
  `;

  // Terms of Service HTML content
  const termsContent = `
    <h1>Terms of Service</h1>
    <p><strong>Last Updated: March 14, 2025</strong></p>
    <h2>1. Introduction</h2>
    <p>Welcome to RecallGenius, a product of nGenius Pros LLC. These Terms of Service ("Terms") govern your access to and use of the RecallGenius website, waitlist, and services (collectively, the "Services"). By accessing or using our Services, you agree to be bound by these Terms and our Privacy Policy.</p>
    <p>If you do not agree to these Terms, please do not access or use our Services.</p>
    <!-- More terms content here -->
  `;

  // Cookie Policy HTML content
  const cookiePolicyContent = `
    <h1>Cookie Policy</h1>
    <p><strong>Last Updated: March 14, 2025</strong></p>
    <h2>1. Introduction</h2>
    <p>This Cookie Policy explains how RecallGenius, a product of nGenius Pros LLC ("we," "our," or "us") uses cookies and similar technologies on our website. This policy provides you with information about how we use cookies, what types of cookies we use, and how you can control them.</p>
    <!-- More cookie policy content here -->
  `;

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-smoke">
      {/* Header Component */}
      <header className="bg-white py-4">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex justify-between items-center">
            <div className="flex items-center">
              <Link to="/" className="text-lg font-bold text-navy">RecallGenius</Link>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => scrollToSection('how-it-works')} 
                className="text-sm text-gray-700 hover:text-navy"
              >
                How It Works
              </button>
              <button 
                onClick={() => scrollToSection('features')} 
                className="text-sm text-gray-700 hover:text-navy"
              >
                Features
              </button>
              <button 
                onClick={() => scrollToSection('faq')} 
                className="text-sm text-gray-700 hover:text-navy"
              >
                FAQ
              </button>
              {/* Call-to-Action Button */}
          <Button className="bg-gradient-to-r from-turquoise to-navy text-white font-medium hover:from-navy hover:to-turquoise transition-colors" asChild>
            <Link to="/signup">
              Join the Waitlist
            </Link>
          </Button>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section id="hero" className="relative overflow-hidden bg-gray-smoke py-16 md:py-24 lg:py-32">
        <div className="relative mx-auto max-w-[1280px] px-4">
          <div className="relative z-10 flex flex-col items-center text-center">
            {/* Heading */}
            <h1 className={cn(
              "inline-block animate-appear",
              "text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl",
              "leading-[1.1] text-navy",
              "mb-6",
            )}>
              Stop Losing $52,000+ a Year<br />to Missed Appointments!
            </h1>

            {/* Description */}
            <p className={cn(
              "max-w-[650px] animate-appear opacity-0 [animation-delay:150ms]",
              "text-base sm:text-lg md:text-xl",
              "text-gray-darker",
              "font-medium mb-8",
            )}>
              Be among the first to access RecallGenius: The AI-powered recall solution 
              that identifies overdue patients, sends personalized reminders, and rebooks 
              no-shows automatically—reclaiming an average of $36,000+ in lost production annually.
            </p>

            {/* CTAs */}
            <div className="relative z-10 flex flex-wrap justify-center gap-4 mb-8
                animate-appear opacity-0 [animation-delay:300ms]">
              <Button
                size="lg"
                className={cn(
                  "bg-gradient-to-r from-navy to-navy-light hover:from-navy-light hover:to-navy",
                  "text-white font-medium shadow-lg",
                  "transition-all duration-300",
                )}
              >
                Join the Exclusive Waitlist
              </Button>

              <div className="text-sm text-gray-500 mt-3 sm:mt-4">
                <span className="font-bold">Limited to 100 dental practices</span> for our initial release • <span className="text-navy font-bold">47 spots claimed</span>
              </div>
            </div>

            {/* Mockup */}
            <div className="relative w-full max-w-5xl mx-auto">
              <Mockup
                className={cn(
                  "animate-appear opacity-0 [animation-delay:700ms]",
                  "shadow-[0_0_50px_-12px_rgba(0,0,0,0.3)]",
                  "border-navy/10",
                )}
              >
                <img
                  src="/front-pages/landing-page/Admin Dashboard.png"
                  alt="RecallGenius Dashboard"
                  width={1200}
                  height={720}
                  className="w-full h-auto"
                  loading="lazy"
                  decoding="async"
                />
              </Mockup>
            </div>

            {/* Subheading under mockup */}
            <p className={cn(
              "max-w-[800px] mt-8 animate-appear opacity-0 [animation-delay:900ms]",
              "text-base sm:text-lg",
              "text-gray-darker",
              "font-medium italic text-center",
            )}>
              Experience the revolutionary RecallGenius by nGenius Pros—an AI-powered recall solution 
              that identifies overdue patients, sends personalized reminders, and rebooks no-shows 
              automatically, recovering an average of $36,000+ annually.
            </p>
          </div>
        </div>

        {/* Background Glow */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <Glow
            variant="center"
            className="animate-appear-zoom opacity-0 [animation-delay:1000ms]"
          />
        </div>
      </section>

      {/* Problem Section */}
      <section id="problem" className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-navy mb-2">
              Missed Appointments Cost Your Practice Up to $52,000+ a Year
            </h2>
          </div>

          <div className="bg-gray-smoke rounded-xl p-8 max-w-3xl mx-auto">
            <ul className="space-y-4">
              <li className="flex items-start">
                <div className="mt-1 mr-3 text-navy">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-gray-darker">Research shows 15% of dental appointments are missed, with each no-show costing $200-$292 in lost revenue</p>
              </li>
              <li className="flex items-start">
                <div className="mt-1 mr-3 text-navy">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-gray-darker">For a practice with 1,200 annual appointments, this equates to $36,000-$52,686 in yearly losses</p>
              </li>
              <li className="flex items-start">
                <div className="mt-1 mr-3 text-navy">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-gray-darker">Recall appointments for cleanings ($150/visit) and SRPs ($250/quadrant) form the backbone of predictable practice revenue</p>
              </li>
              <li className="flex items-start">
                <div className="mt-1 mr-3 text-navy">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-gray-darker">Staff wastes valuable time on manual recall attempts while fixed overhead costs (75% of expenses) remain unchanged</p>
              </li>
              <li className="flex items-start">
                <div className="mt-1 mr-3 text-navy">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-gray-darker">Patients who miss preventive care often need costlier restorative treatments later ($800-$1,700 vs. $200-$300)</p>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-navy mb-2">
              How RecallGenius Works
            </h2>
            <p className="text-gray-darker max-w-3xl mx-auto">
              Our AI-powered recall solution helps you identify overdue patients, send personalized reminders, and rebook no-shows automatically.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              title="Automated Recall Campaigns"
              description="Identifies overdue patients and sends personalized reminders via text/email that can generate an additional $120,000 annually compared to manual systems."
              icon={<LucideCalendar className="h-6 w-6" />}
            />
            <FeatureCard 
              title="No-Show Recovery"
              description="Detects cancellations in real-time and helps rebook from your waitlist, preventing the 15% appointment loss rate typical in dental practices."
              icon={<LucideUsers className="h-6 w-6" />}
            />
            <FeatureCard 
              title="1-Click Rescheduling"
              description="Patients confirm or reschedule with a single tap on their phone, dramatically reducing the $200-$292 loss per missed appointment."
              icon={<LucideBrain className="h-6 w-6" />}
            />
          </div>
        </div>
      </section>

      {/* Feature Grid Section */}
      <section id="features" className="py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-navy mb-2">
              RecallGenius: Your AI-Powered Recall Assistant
            </h2>
            <p className="text-gray-darker max-w-3xl mx-auto">
              Joining our waitlist gives you priority access to these powerful features when we launch
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              title="Real-Time ROI Dashboard"
              description="See exactly how many appointments were recovered and quantify revenue impact, with practices typically reclaiming $36,000+ annually."
              icon={<LucideDollarSign className="h-6 w-6" />}
            />
            <FeatureCard 
              title="Automated Marketing"
              description="Run targeted campaigns to reactivate dormant patients and drive new patient acquisition, helping to maximize your ROI."
              icon={<LucideMessageSquare className="h-6 w-6" />}
            />
            <FeatureCard 
              title="HIPAA-Compliant System"
              description="Rest assured your patient data is always secure and protected while our system handles both cleanings and SRP recalls."
              icon={<LucideCheckCircle className="h-6 w-6" />}
            />
          </div>
        </div>
      </section>

      {/* Waitlist Benefits Section */}
      <section className="py-24 px-4 bg-gray-smoke">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-navy mb-2">
              Why Join Our Exclusive Waitlist?
            </h2>
            <p className="text-gray-darker max-w-3xl mx-auto">
              Secure these special benefits available only to our first 100 dental practices
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-navy text-white rounded-xl shadow-sm hover:shadow-glow transition-shadow p-6">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="text-sm opacity-75">Missed Appointments</p>
                  <h3 className="text-xl font-bold mb-1">15%</h3>
                </div>
                <div className="bg-navy-light rounded-full p-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              <div className="text-sm text-white/80 mt-4">
                <p>Research shows 15% of dental appointments are missed, affecting your practice's bottom line</p>
              </div>
              <div className="text-xs text-white/60 mt-2">
                First™
              </div>
            </div>
            
            <div className="bg-amber-100 text-gray-900 rounded-xl shadow-sm hover:shadow-glow transition-shadow p-6">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="text-sm opacity-75">Revenue Loss</p>
                  <h3 className="text-xl font-bold mb-1">$200-$292</h3>
                </div>
                <div className="bg-amber-200 rounded-full p-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="text-sm mt-4">
                <p>Each missed appointment costs your practice between $200-$292 in direct revenue loss</p>
              </div>
              <div className="text-xs text-amber-800/60 mt-2">
                Per Appointment
              </div>
            </div>
            
            <div className="bg-teal-100 text-gray-900 rounded-xl shadow-sm hover:shadow-glow transition-shadow p-6">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="text-sm opacity-75">Annual Loss</p>
                  <h3 className="text-xl font-bold mb-1">$36,000-$52,686</h3>
                </div>
                <div className="bg-teal-200 rounded-full p-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              </div>
              <div className="text-sm mt-4">
                <p>For a practice with 1,200 annual appointments, missed visits can cost up to $52,686 yearly</p>
              </div>
              <div className="text-xs text-teal-800/60 mt-2">
                Recoverable
              </div>
            </div>
            
            <div className="bg-purple-100 text-gray-900 rounded-xl shadow-sm hover:shadow-glow transition-shadow p-6">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="text-sm opacity-75">Digital ROI</p>
                  <h3 className="text-xl font-bold mb-1">$120,000</h3>
                </div>
                <div className="bg-purple-200 rounded-full p-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
              </div>
              <div className="text-sm mt-4">
                <p>Practices using digital recall systems generate an additional $120,000 in annual revenue</p>
              </div>
              <div className="text-xs text-purple-800/60 mt-2">
                Additional Revenue
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Waitlist Form Section */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-navy mb-2">
              Secure Your Spot Before We Reach Capacity
            </h2>
            <p className="text-gray-darker max-w-3xl mx-auto">
              Join 47 forward-thinking dental practices already on our waitlist. Be among the first to transform 
              your recall process and reclaim up to $52,686 in lost production each year.
            </p>
          </div>

          <WaitlistForm />
        </div>
      </section>

      {/* Testimonial Section - Updated for waitlist */}
      <section className="py-24 px-4 bg-gray-smoke">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-navy mb-2">
              What Forward-Thinking Dental Practices Are Saying
            </h2>
            <p className="text-gray-darker max-w-3xl mx-auto">
              Dental professionals are excited about RecallGenius's upcoming launch
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <TestimonialCard 
              quote="We've been searching for a solution to our recall challenges for years. The financial data on missed appointments is eye-opening. I can't wait to see how RecallGenius helps us reclaim that lost revenue."
              author="Dr. Sarah Johnson"
              role="Dentist, Johnson Family Dental"
              image="/images/testimonials/dentist1.jpg"
            />
            <TestimonialCard 
              quote="The idea of automating our recall process is incredibly appealing. If RecallGenius can help us recover even half of our no-show losses, it would make a significant difference to our bottom line."
              author="Dr. Michael Chen"
              role="Practice Owner, Bright Smile Dentistry"
              image="/images/testimonials/dentist2.jpg"
            />
            <TestimonialCard 
              quote="I joined the waitlist immediately. The prospect of saving staff time while recapturing lost appointments makes this a no-brainer. Being an early adopter with founder's pricing is icing on the cake."
              author="Melissa Rodriguez"
              role="Office Manager, Coastal Dental"
              image="/images/testimonials/manager1.jpg"
            />
          </div>
        </div>
      </section>

      {/* FAQ Section - Updated with waitlist-specific questions */}
      <section id="faq" className="py-24 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-navy mb-2">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-darker max-w-3xl mx-auto">
              Everything you need to know about RecallGenius
            </p>
          </div>

          <div className="bg-gray-smoke rounded-xl shadow-sm p-6">
            <FaqItem 
              question="When will RecallGenius be available?"
              answer="We're launching to our first 100 waitlist members in Q2 2025. Join now to secure your spot and receive priority access when we launch."
            />
            <FaqItem 
              question="How does RecallGenius integrate with my existing practice management software?"
              answer="RecallGenius offers seamless integration with all major practice management systems including Dentrix, Eaglesoft, Open Dental, and many more. Our team handles the entire integration process, typically taking 2-3 business days with minimal disruption to your practice."
            />
            <FaqItem 
              question="Is RecallGenius HIPAA compliant?"
              answer="Absolutely. RecallGenius is fully HIPAA compliant with end-to-end encryption, secure cloud storage, and role-based access controls. We conduct regular security audits and provide a Business Associate Agreement (BAA) to all practices."
            />
            <FaqItem 
              question="Is joining the waitlist a commitment to purchase?"
              answer="Not at all. Joining gives you priority access when we launch, but there's no obligation to purchase. We want you to make the right decision for your practice when the time comes."
            />
            <FaqItem 
              question="How will I measure ROI?"
              answer="Our real-time dashboard will show reactivated patients, no-shows prevented, and total revenue recovered. With the average practice losing $36,000-$52,686 annually to missed appointments, most practices see complete ROI within months."
            />
            <FaqItem 
              question="How does RecallGenius help with both cleanings and SRP appointments?"
              answer="Our system intelligently tracks both standard 6-month cleaning recalls and the more frequent 3-4 month SRP recalls for periodontal patients. With cleanings averaging $150 and SRPs at $250 per quadrant, these routine procedures are essential to your practice revenue—and RecallGenius ensures they stay filled."
            />
            <FaqItem 
              question="How does this compare to my current recall system?"
              answer="Most practices using manual recall systems face a 15% no-show rate. Practices implementing digital systems like RecallGenius have reported an additional $120,000 annually from scheduled recall appointments compared to manual methods."
            />
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section - Updated for waitlist */}
      <section className="relative py-32 px-4 overflow-hidden">
        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
              Ready to Transform Your Dental Practice?
            </h2>
            <p className="text-white/80 text-lg max-w-3xl mx-auto mb-8">
              Join our exclusive waitlist today and be among the first to reclaim up to $52,686 in 
              lost production with RecallGenius's AI-powered recall solution.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button
                size="lg"
                className="bg-white text-navy hover:bg-gray-lighter font-semibold"
              >
                Join the Waitlist Now
              </Button>
            </div>
          </div>
          
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-white">
            <div className="flex items-center">
              <LucideCheck className="mr-2 h-5 w-5 text-turquoise" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center">
              <LucideCheck className="mr-2 h-5 w-5 text-turquoise" />
              <span>No obligation</span>
            </div>
            <div className="flex items-center">
              <LucideCheck className="mr-2 h-5 w-5 text-turquoise" />
              <span>Limited to 100 practices</span>
            </div>
            <div className="flex items-center">
              <LucideCheck className="mr-2 h-5 w-5 text-turquoise" />
              <span>Founder's pricing for life</span>
            </div>
          </div>
        </div>
        
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-ocean z-0"></div>
      </section>

      {/* Footer - Updated with legal links */}
      <footer className="bg-navy py-12 px-4 text-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">RecallGenius</h3>
            <p className="text-white/70">
              The next generation dental recall management solution,
              powered by AI and designed for modern dental practices.
            </p>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">Contact</h3>
            <ul className="space-y-2 text-white/70">
              <li>Email: info@ngeniusmarketing.com</li>
              <li>Phone: 949-203-1936</li>
              <li>Address: 4193 Flat Rocks Dr. SUITE# 200 OFFICE# 412, Riverside, CA 92505</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">Legal</h3>
            <ul className="space-y-2 text-white/70">
              <li>
                <button 
                  onClick={() => setShowPrivacyPolicy(true)}
                  className="hover:text-white cursor-pointer transition-colors"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setShowTerms(true)}
                  className="hover:text-white cursor-pointer transition-colors"
                >
                  Terms of Service
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setShowCookiePolicy(true)}
                  className="hover:text-white cursor-pointer transition-colors"
                >
                  Cookie Policy
                </button>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-white/20 text-center text-white/50">
          &copy; {new Date().getFullYear()} nGenius Pros LLC. All rights reserved.
        </div>
      </footer>

      {/* Legal Document Modals */}
      <LegalDocumentModal 
        isOpen={showPrivacyPolicy}
        onClose={() => setShowPrivacyPolicy(false)}
        title="Privacy Policy"
        content={privacyPolicyContent}
      />
      
      <LegalDocumentModal 
        isOpen={showTerms}
        onClose={() => setShowTerms(false)}
        title="Terms of Service"
        content={termsContent}
      />
      
      <LegalDocumentModal 
        isOpen={showCookiePolicy}
        onClose={() => setShowCookiePolicy(false)}
        title="Cookie Policy"
        content={cookiePolicyContent}
      />
    </div>
  );
}
