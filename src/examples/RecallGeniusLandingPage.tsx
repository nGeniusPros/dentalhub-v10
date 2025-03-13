import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Mockup } from "@/components/ui/mockup";
import { Glow } from "@/components/ui/glow";
import { LucideMessageSquare, LucideArrowRight, LucideCheck, LucideCheckCircle, LucideChevronDown, LucideChevronRight, LucideDollarSign, LucideBrain, LucideUsers, LucideCalendar } from "lucide-react";
import { Link } from "react-router-dom";
import StatsCard from "@/components/dashboard/StatsCard";
import { Input } from "@/components/ui/input";

// Waitlist Form Component
const WaitlistForm = () => {
  const [email, setEmail] = useState("");
  const [practice, setPractice] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      setEmail("");
      setPractice("");
      // Simple notification is now shown via the UI state change
    }, 1000);
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-xl shadow-lg p-6">
      {submitted ? (
        <div className="text-center py-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-turquoise/20 text-turquoise mb-4">
            <LucideCheck className="h-8 w-8" />
          </div>
          <h3 className="text-xl font-bold text-navy mb-2">You're on the list!</h3>
          <p className="text-gray-darker">We'll notify you when RecallGenius launches. Thank you for your interest!</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <h3 className="text-xl font-bold text-navy mb-4">Join the RecallGenius Waitlist</h3>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-darker mb-1">
              Work Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="email@practice.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full"
            />
          </div>
          
          <div>
            <label htmlFor="practice" className="block text-sm font-medium text-gray-darker mb-1">
              Practice Name
            </label>
            <Input
              id="practice"
              type="text"
              placeholder="Your Dental Practice"
              value={practice}
              onChange={(e) => setPractice(e.target.value)}
              required
              className="w-full"
            />
          </div>
          
          <Button 
            type="submit"
            className="w-full bg-gradient-to-r from-navy to-navy-light hover:from-navy-light hover:to-navy text-white"
            disabled={submitting}
          >
            {submitting ? "Adding..." : "Join Waitlist"}
          </Button>
          
          <p className="text-xs text-gray-dark text-center mt-2">
            By joining, you agree to receive updates about RecallGenius. We respect your privacy and will never share your information.
          </p>
        </form>
      )}
    </div>
  );
};

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
    <div className="bg-white rounded-xl shadow-sm hover:shadow-glow transition-shadow p-6">
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

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-smoke">
      {/* Hero Section - Updated for RecallGenius */}
      <section className="relative overflow-hidden bg-gray-smoke py-16 md:py-24 lg:py-32">
        <div className="relative mx-auto max-w-[1280px] px-4">
          <div className="relative z-10 flex flex-col items-center text-center">
            {/* Heading */}
            <h1 className={cn(
              "inline-block animate-appear",
              "text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl",
              "leading-[1.1] text-navy",
              "mb-6",
            )}>
              Stop Losing $10,000 a Year to<br />Missed Appointments!
            </h1>

            {/* Description */}
            <p className={cn(
              "max-w-[650px] animate-appear opacity-0 [animation-delay:150ms]",
              "text-base sm:text-lg md:text-xl",
              "text-gray-darker",
              "font-medium mb-8",
            )}>
              Meet RecallGenius: Our HIPAA-compliant system that identifies overdue patients, 
              sends personalized reminders via email/SMS, and rebooks no-shows instantly—so your 
              team can focus on patient care, not phone calls.
            </p>

            {/* CTAs */}
            <div className="relative z-10 flex flex-wrap justify-center gap-4 mb-16
                animate-appear opacity-0 [animation-delay:300ms]">
              <Button
                size="lg"
                className={cn(
                  "bg-gradient-to-r from-navy to-navy-light hover:from-navy-light hover:to-navy",
                  "text-white font-medium shadow-lg",
                  "transition-all duration-300",
                )}
              >
                Join RecallGenius Waitlist
              </Button>

              <Button
                size="lg"
                variant="outline"
                className={cn(
                  "border-gray-light text-gray-darker hover:bg-gray-lighter",
                  "transition-all duration-300",
                )}
                asChild
              >
                <Link to="/contact">
                  <LucideMessageSquare className="mr-2 h-4 w-4" />
                  Request a Demo
                </Link>
              </Button>
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
                  src="/front-pages/landing-page/RecallGenius-Dashboard.png"
                  alt="RecallGenius Dashboard"
                  width={1200}
                  height={720}
                  className="w-full h-auto"
                  loading="lazy"
                  decoding="async"
                />
              </Mockup>
            </div>

            {/* Social Proof under mockup */}
            <p className={cn(
              "max-w-[800px] mt-8 animate-appear opacity-0 [animation-delay:900ms]",
              "text-base sm:text-lg",
              "text-gray-darker",
              "font-medium text-center",
            )}>
              <span className="font-bold">Trusted by 1,200+ Dental Practices</span> to recover lost appointments and maximize chair time
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

      {/* WAITLIST SECTION - New section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-navy mb-6">
                Join the RecallGenius Waitlist
              </h2>
              <p className="text-gray-darker mb-6">
                Be among the first to access our revolutionary AI-powered recall system when it launches. 
                RecallGenius is designed to help your practice:
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-5 h-5 bg-turquoise rounded-full flex items-center justify-center text-white">
                      <LucideCheck className="h-3 w-3" />
                    </div>
                  </div>
                  <p className="ml-3 text-gray-darker">
                    <span className="font-semibold">Identify overdue patients</span> who are falling through the cracks
                  </p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-5 h-5 bg-turquoise rounded-full flex items-center justify-center text-white">
                      <LucideCheck className="h-3 w-3" />
                    </div>
                  </div>
                  <p className="ml-3 text-gray-darker">
                    <span className="font-semibold">Send personalized reminders</span> via email and SMS
                  </p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-5 h-5 bg-turquoise rounded-full flex items-center justify-center text-white">
                      <LucideCheck className="h-3 w-3" />
                    </div>
                  </div>
                  <p className="ml-3 text-gray-darker">
                    <span className="font-semibold">Rebook no-shows instantly</span> with automated follow-ups
                  </p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-5 h-5 bg-turquoise rounded-full flex items-center justify-center text-white">
                      <LucideCheck className="h-3 w-3" />
                    </div>
                  </div>
                  <p className="ml-3 text-gray-darker">
                    <span className="font-semibold">Track ROI in real-time</span> with our comprehensive dashboard
                  </p>
                </li>
              </ul>
              <p className="text-navy font-semibold">
                Waitlist members will receive:
              </p>
              <ul className="space-y-2 mt-2 text-gray-darker">
                <li className="flex items-center">
                  <LucideArrowRight className="h-4 w-4 text-turquoise mr-2" />
                  Priority access when we launch
                </li>
                <li className="flex items-center">
                  <LucideArrowRight className="h-4 w-4 text-turquoise mr-2" />
                  Exclusive early-adopter pricing
                </li>
                <li className="flex items-center">
                  <LucideArrowRight className="h-4 w-4 text-turquoise mr-2" />
                  Personalized onboarding assistance
                </li>
              </ul>
            </div>
            <div>
              <WaitlistForm />
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section - New section */}
      <section className="py-20 px-4 bg-gray-smoke">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-navy mb-2">
              Missed Appointments Cost the Average Practice $10K+ a Year
            </h2>
            <p className="text-gray-darker max-w-3xl mx-auto">
              RecallGenius solves the most critical challenges facing dental practices today
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="w-12 h-12 bg-red-100 text-red-500 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-navy mb-2">30% No-Show Rate</h3>
              <p className="text-gray-darker">
                Nearly a third of patients forget or skip appointments without rescheduling, leaving gaps in your schedule.
              </p>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="w-12 h-12 bg-amber-100 text-amber-500 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-navy mb-2">5+ Hours Wasted</h3>
              <p className="text-gray-darker">
                Staff wastes valuable time each week on manual recall attempts that could be automated.
              </p>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="w-12 h-12 bg-blue-100 text-blue-500 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-navy mb-2">Lost Patients</h3>
              <p className="text-gray-darker">
                Overdue patients slip through the cracks—leading to lower production per hour and lost revenue.
              </p>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-navy mb-2">Outdated Systems</h3>
              <p className="text-gray-darker">
                Traditional recall systems are inefficient and require constant staff follow-up to be effective.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid Section */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-navy mb-2">
              RecallGenius Features
            </h2>
            <p className="text-gray-darker max-w-3xl mx-auto">
              Our AI-powered recall solution helps you reactivate dormant patients and fill your schedule
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              title="Automated Recall Campaigns"
              description="RecallGenius identifies overdue patients and instantly sends personalized reminders via text/email, filling your schedule before you notice gaps."
              icon={<LucideCalendar className="h-6 w-6" />}
            />
            <FeatureCard 
              title="No-Show Recovery"
              description="AI detects cancellations in real-time and rebooks from your waitlist automatically—keeping your chairs profitable and your staff unburdened."
              icon={<LucideUsers className="h-6 w-6" />}
            />
            <FeatureCard 
              title="1-Click Rescheduling"
              description="Patients confirm or reschedule with a single tap on their phone. This frictionless process drastically reduces lost revenue."
              icon={<LucideBrain className="h-6 w-6" />}
            />
            <FeatureCard 
              title="Real-Time ROI Dashboard"
              description="See exactly how many appointments were recovered, how much new revenue was booked, and the financial impact on your practice—no guesswork."
              icon={<LucideDollarSign className="h-6 w-6" />}
            />
            <FeatureCard 
              title="Multi-Channel Communication"
              description="Reach patients through their preferred channels—SMS, email, or phone calls—with customizable messaging that reflects your practice's voice."
              icon={<LucideMessageSquare className="h-6 w-6" />}
            />
            <FeatureCard 
              title="HIPAA Compliance"
              description="Built with security in mind, RecallGenius follows strict PHI guidelines with data encryption and role-based access controls."
              icon={<LucideCheckCircle className="h-6 w-6" />}
            />
          </div>
        </div>
      </section>

      {/* Simple 3-Step Action Plan */}
      <section className="py-20 px-4 bg-gray-smoke">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-navy mb-2">
              How RecallGenius Works
            </h2>
            <p className="text-gray-darker max-w-3xl mx-auto">
              A simple three-step process to transform your practice's recall system
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow-sm hover:shadow-glow transition-shadow p-6 text-center">
              <div className="w-16 h-16 bg-navy/10 text-navy rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-bold text-navy mb-2">Join the Waitlist</h3>
              <p className="text-gray-darker">
                Sign up to be among the first to access RecallGenius when it launches. No commitment required.
              </p>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm hover:shadow-glow transition-shadow p-6 text-center">
              <div className="w-16 h-16 bg-navy/10 text-navy rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-bold text-navy mb-2">AI-Driven Recalls</h3>
              <p className="text-gray-darker">
                RecallGenius automatically sends reminders, reactivates overdue patients, and rebooks last-minute cancellations.
              </p>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm hover:shadow-glow transition-shadow p-6 text-center">
              <div className="w-16 h-16 bg-navy/10 text-navy rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-bold text-navy mb-2">Enjoy a Full Schedule</h3>
              <p className="text-gray-darker">
                Watch no-shows drop by 40%+ in 30 days, reclaiming thousands in lost production.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-navy mb-2">
              Results That Speak For Themselves
            </h2>
            <p className="text-gray-darker max-w-3xl mx-auto">
              Dental practices using our technology have seen significant improvements in key performance indicators
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard 
              title="Reduction in No-Shows"
              value="42%"
              change="+15"
              icon="trending-up"
              variant="ocean"
              isGlowing={true}
            />
            <StatsCard 
              title="Staff Time Saved"
              value="5.5h"
              change="weekly"
              icon="users"
              variant="gold"
              isGlowing={true}
            />
            <StatsCard 
              title="Avg. Revenue Recovered"
              value="$8,300"
              change="monthly"
              icon="calendar"
              variant="tropical"
              isGlowing={true}
            />
            <StatsCard 
              title="ROI After 30 Days"
              value="400%"
              change="+19"
              icon="dollar-sign"
              variant="royal"
              isGlowing={true}
            />
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-24 px-4 bg-gray-smoke">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-navy mb-2">
              What Professionals Are Saying
            </h2>
            <p className="text-gray-darker max-w-3xl mx-auto">
              Dental professionals are experiencing remarkable results with our recall technology
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <TestimonialCard 
              quote="We recovered $8,000 in missed appointments within our first 30 days. The best part? My front desk got hours back each week!"
              author="Dr. Sarah Wilson"
              role="Wilson Family Dentistry"
              image="/images/testimonials/dentist1.jpg"
            />
            <TestimonialCard 
              quote="My hygienists love how easy it is to fill last-minute cancellations. The automated recall system is a no-brainer for any practice!"
              author="Dr. Michael Chen"
              role="Bright Smile Dentistry"
              image="/images/testimonials/dentist2.jpg"
            />
            <TestimonialCard 
              quote="The personalized patient communication has not only reduced our no-shows but has also improved our reviews and patient satisfaction scores."
              author="Melissa Rodriguez"
              role="Office Manager, Coastal Dental"
              image="/images/testimonials/manager1.jpg"
            />
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-navy mb-2">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-darker max-w-3xl mx-auto">
              Everything you need to know about RecallGenius
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <FaqItem 
              question="Is RecallGenius HIPAA compliant?"
              answer="Absolutely. RecallGenius is fully HIPAA compliant with end-to-end encryption, secure cloud storage, and role-based access controls. We conduct regular security audits and provide a Business Associate Agreement (BAA) to all practices."
            />
            <FaqItem 
              question="How does RecallGenius integrate with my existing practice management software?"
              answer="RecallGenius offers seamless integration with all major practice management systems including Dentrix, Eaglesoft, Open Dental, and many more. Our team handles the entire integration process, typically taking 2-3 business days with minimal disruption to your practice."
            />
            <FaqItem 
              question="How do I measure ROI with RecallGenius?"
              answer="Our real-time dashboard shows you exactly how many patients were reactivated, how many no-shows were prevented, and the total revenue recovered. You'll see the direct financial impact of RecallGenius on your practice."
            />
            <FaqItem 
              question="When will RecallGenius be available?"
              answer="RecallGenius is currently in the final stages of development and will be launching soon. By joining our waitlist, you'll be among the first to know when it's available and will receive priority access."
            />
            <FaqItem 
              question="What kind of support will RecallGenius provide?"
              answer="We'll offer comprehensive support including technical assistance, regular training webinars, and a dedicated success manager for every practice. Our team is committed to ensuring your practice gets maximum value from RecallGenius."
            />
          </div>
        </div>
      </section>

      {/* Join Waitlist CTA Section */}
      <section className="relative py-32 px-4 overflow-hidden">
        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
              Ready to Transform Your Dental Practice?
            </h2>
            <p className="text-white/80 text-lg max-w-3xl mx-auto mb-8">
              Join the RecallGenius waitlist today and be first in line when we launch.
              Stop losing $10,000+ a year to missed appointments!
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button
                size="lg"
                className="bg-white text-navy hover:bg-gray-lighter font-semibold"
              >
                Join the Waitlist
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10"
                asChild
              >
                <Link to="/contact">
                  Request a Demo
                </Link>
              </Button>
            </div>
          </div>
          
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-white">
            <div className="flex items-center">
              <LucideCheck className="mr-2 h-5 w-5 text-turquoise" />
              <span>Priority access</span>
            </div>
            <div className="flex items-center">
              <LucideCheck className="mr-2 h-5 w-5 text-turquoise" />
              <span>Early adopter pricing</span>
            </div>
            <div className="flex items-center">
              <LucideCheck className="mr-2 h-5 w-5 text-turquoise" />
              <span>Personalized onboarding</span>
            </div>
            <div className="flex items-center">
              <LucideCheck className="mr-2 h-5 w-5 text-turquoise" />
              <span>Free data migration</span>
            </div>
          </div>
        </div>
        
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-ocean z-0"></div>
      </section>

      {/* Portal Section */}
      <section className="py-20 px-4 bg-gray-smoke">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-navy mb-2">
              Access Your Portal
            </h2>
            <p className="text-gray-darker">
              Secure login to your personalized dashboard
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <PortalCard
              title="Patient Portal"
              description="Access your appointments, records, and treatment plans"
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-navy" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              }
              features={[
                "View Appointments",
                "Medical Records",
                "Billing History"
              ]}
              buttonText="Login"
            />
            
            <PortalCard
              title="Staff Portal"
              description="Manage patient care and daily operations"
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-navy" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              }
              features={[
                "Patient Management",
                "Schedule Control",
                "Treatment Plans"
              ]}
              buttonText="Login"
            />
            
            <PortalCard
              title="Admin Portal"
              description="Complete practice management and oversight"
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-navy" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
              }
              features={[
                "Practice Analytics",
                "Staff Management",
                "Financial Reports"
              ]}
              buttonText="Login"
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-navy py-12 px-4 text-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">RecallGenius</h3>
            <p className="text-white/70">
              The next generation dental recall system
              powered by AI and designed for modern dental practices.
            </p>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">Contact</h3>
            <ul className="space-y-2 text-white/70">
              <li>Email: contact@recallgenius.com</li>
              <li>Phone: (800) 123-4567</li>
              <li>Address: 123 Dental Ave, San Francisco, CA</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">Legal</h3>
            <ul className="space-y-2 text-white/70">
              <li>Privacy Policy</li>
              <li>Terms of Service</li>
              <li>HIPAA Compliance</li>
            </ul>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-white/20 text-center text-white/50">
          &copy; {new Date().getFullYear()} RecallGenius by nGenius Pros. All rights reserved.
        </div>
      </footer>
    </div>
  );
}