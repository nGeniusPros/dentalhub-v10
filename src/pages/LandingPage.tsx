import React from "react";
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
      {/* Hero Section */}
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
              The Future of Dental Practice<br />Management is Here!
            </h1>

            {/* Description */}
            <p className={cn(
              "max-w-[650px] animate-appear opacity-0 [animation-delay:150ms]",
              "text-base sm:text-lg md:text-xl",
              "text-gray-darker",
              "font-medium mb-8",
            )}>
              Transform your dental practice with next-gen AI:
              designed to enhance patient care, optimize operations, and maximize profitability.
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
                asChild
              >
                <Link to="/login/patient">
                  Get Started
                </Link>
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
                <a href="https://github.com/nGeniusPros/dentalhub-v10" target="_blank" rel="noopener noreferrer">
                  <LucideArrowRight className="mr-2 h-4 w-4" />
                  View on GitHub
                </a>
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
                  src="/front-pages/landing-page/Admin Dashboard.png"
                  alt="DentalHub Dashboard"
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
              Experience the revolutionary nGenius Pros Dental Hub—an all-in-one platform 
              that optimizes operations, boosts treatment acceptance, and keeps patients coming back effortlessly.
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

      {/* Feature Grid Section */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-navy mb-2">
              Powerful Features for Modern Dental Practices
            </h2>
            <p className="text-gray-darker max-w-3xl mx-auto">
              Streamline operations, enhance patient engagement, and boost your practice's efficiency with our AI-powered solution
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              title="Smart Scheduling"
              description="AI-powered scheduling that optimizes appointment times, reduces no-shows, and maximizes chair utilization."
              icon={<LucideCalendar className="h-6 w-6" />}
            />
            <FeatureCard 
              title="Patient Insights"
              description="Gain deep insights into patient preferences, behavior, and treatment acceptance patterns."
              icon={<LucideUsers className="h-6 w-6" />}
            />
            <FeatureCard 
              title="AI Treatment Planning"
              description="Leverage AI to analyze patient data and provide personalized treatment recommendations."
              icon={<LucideBrain className="h-6 w-6" />}
            />
            <FeatureCard 
              title="Financial Analytics"
              description="Comprehensive financial metrics and forecasting to optimize practice profitability."
              icon={<LucideDollarSign className="h-6 w-6" />}
            />
            <FeatureCard 
              title="Automated Marketing"
              description="Run targeted campaigns to reactivate dormant patients and drive new patient acquisition."
              icon={<LucideMessageSquare className="h-6 w-6" />}
            />
            <FeatureCard 
              title="Compliance Management"
              description="Stay compliant with regulations, monitor hygiene protocols, and manage certifications."
              icon={<LucideCheckCircle className="h-6 w-6" />}
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 px-4 bg-gray-smoke">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-navy mb-2">
              Results That Speak For Themselves
            </h2>
            <p className="text-gray-darker max-w-3xl mx-auto">
              Dental practices using our platform have seen significant improvements in key performance indicators
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard 
              title="Increased Revenue"
              value="32%"
              change="+15"
              icon="trending-up"
              variant="ocean"
              isGlowing={true}
            />
            <StatsCard 
              title="Patient Retention"
              value="95%"
              change="+8"
              icon="users"
              variant="gold"
              isGlowing={true}
            />
            <StatsCard 
              title="Chair Utilization"
              value="87%"
              change="+23"
              icon="calendar"
              variant="tropical"
              isGlowing={true}
            />
            <StatsCard 
              title="Avg. Treatment Value"
              value="$2,450"
              change="+19"
              icon="dollar-sign"
              variant="royal"
              isGlowing={true}
            />
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-navy mb-2">
              What Professionals Are Saying
            </h2>
            <p className="text-gray-darker max-w-3xl mx-auto">
              Dental professionals around the country are experiencing remarkable results with DentalHub
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <TestimonialCard 
              quote="DentalHub has transformed our practice workflow. The AI scheduling alone has increased our chair utilization by 23% and dramatically reduced no-shows."
              author="Dr. Sarah Johnson"
              role="Dentist, Johnson Family Dental"
              image="/images/testimonials/dentist1.jpg"
            />
            <TestimonialCard 
              quote="The financial analytics have given us insights we never had before. We've been able to optimize our procedure mix and increase profitability by over 30%."
              author="Dr. Michael Chen"
              role="Practice Owner, Bright Smile Dentistry"
              image="/images/testimonials/dentist2.jpg"
            />
            <TestimonialCard 
              quote="Patient communication has never been easier. The automated recall system has brought back dozens of dormant patients, and our reviews have improved significantly."
              author="Melissa Rodriguez"
              role="Office Manager, Coastal Dental"
              image="/images/testimonials/manager1.jpg"
            />
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 px-4 bg-gray-smoke">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-navy mb-2">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-darker max-w-3xl mx-auto">
              Everything you need to know about DentalHub
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <FaqItem 
              question="How does DentalHub integrate with my existing practice management software?"
              answer="DentalHub offers seamless integration with all major practice management systems including Dentrix, Eaglesoft, Open Dental, and many more. Our team handles the entire integration process, typically taking 2-3 business days with minimal disruption to your practice."
            />
            <FaqItem 
              question="Is DentalHub HIPAA compliant?"
              answer="Absolutely. DentalHub is fully HIPAA compliant with end-to-end encryption, secure cloud storage, and role-based access controls. We conduct regular security audits and provide a Business Associate Agreement (BAA) to all practices."
            />
            <FaqItem 
              question="How long does implementation take?"
              answer="Most practices are up and running with DentalHub in less than a week. Our implementation team handles data migration, staff training, and system configuration. We offer both in-person and virtual training sessions to ensure your team is comfortable with the platform."
            />
            <FaqItem 
              question="Can I customize the system to fit my practice's specific needs?"
              answer="Yes, DentalHub is highly customizable. From treatment plan templates to patient communication flows, you can tailor the system to match your practice's unique workflow and requirements. Our team will work with you to configure the system to your specifications."
            />
            <FaqItem 
              question="What kind of support does DentalHub provide?"
              answer="We offer comprehensive support including 24/7 technical assistance, regular training webinars, and a dedicated success manager for every practice. Our average response time is under 10 minutes, and we maintain a 98% satisfaction rating for our support services."
            />
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="relative py-32 px-4 overflow-hidden">
        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
              Ready to Transform Your Dental Practice?
            </h2>
            <p className="text-white/80 text-lg max-w-3xl mx-auto mb-8">
              Join thousands of dental professionals who are elevating patient care and
              practice performance with DentalHub's AI-powered platform.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button
                size="lg"
                className="bg-white text-navy hover:bg-gray-lighter font-semibold"
                asChild
              >
                <Link to="/signup">
                  Get Started for Free
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10"
                asChild
              >
                <Link to="/contact">
                  Schedule a Demo
                </Link>
              </Button>
            </div>
          </div>
          
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-white">
            <div className="flex items-center">
              <LucideCheck className="mr-2 h-5 w-5 text-turquoise" />
              <span>14-day free trial</span>
            </div>
            <div className="flex items-center">
              <LucideCheck className="mr-2 h-5 w-5 text-turquoise" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center">
              <LucideCheck className="mr-2 h-5 w-5 text-turquoise" />
              <span>Cancel anytime</span>
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
            <h3 className="text-xl font-bold mb-4">DentalHub</h3>
            <p className="text-white/70">
              The next generation dental practice management platform
              powered by AI and designed for modern dental practices.
            </p>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">Contact</h3>
            <ul className="space-y-2 text-white/70">
              <li>Email: contact@dentalhub.com</li>
              <li>Phone: (800) 123-4567</li>
              <li>Address: 123 Dental Ave, San Francisco, CA</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">Legal</h3>
            <ul className="space-y-2 text-white/70">
              <li>Privacy Policy</li>
              <li>Terms of Service</li>
              <li>Cookie Policy</li>
            </ul>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-white/20 text-center text-white/50">
          &copy; {new Date().getFullYear()} DentalHub. All rights reserved.
        </div>
      </footer>
    </div>
  );
}