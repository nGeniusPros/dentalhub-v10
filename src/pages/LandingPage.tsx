import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Mockup } from "@/components/ui/mockup";
import { Glow } from "@/components/ui/glow";
import { 
  LucideMessageSquare, 
  LucideArrowRight, 
  LucideCheck, 
  LucideCheckCircle, 
  LucideChevronDown, 
  LucideChevronRight, 
  LucideDollarSign, 
  LucideBrain, 
  LucideUsers, 
  LucideCalendar,
  LucideLineChart,
  LucideClipboard,
  LucideActivity,
  LucideZap,
  LucideShield,
  LucideClock
} from "lucide-react";
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

// AI Feature Card Component
const AIFeatureCard = ({ title, description, icon }: { title: string; description: string; icon: React.ReactNode }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-glow transition-shadow p-6 border-l-4 border-turquoise">
      <div className="w-12 h-12 bg-turquoise/10 text-turquoise rounded-lg flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-navy mb-2">{title}</h3>
      <p className="text-gray-darker">{description}</p>
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

// Benefit Card Component
const BenefitCard = ({ title, items, icon, color }: { title: string; items: string[]; icon: React.ReactNode; color: string }) => {
  return (
    <div className={`bg-white rounded-xl shadow-sm hover:shadow-glow transition-shadow p-6 border-t-4 ${color}`}>
      <div className={`w-12 h-12 ${color.replace('border-', 'text-')} rounded-lg flex items-center justify-center mb-4`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold text-navy mb-4">{title}</h3>
      <ul className="space-y-2">
        {items.map((item, index) => (
          <li key={index} className="flex items-start">
            <LucideCheck className={`h-5 w-5 mr-2 mt-0.5 ${color.replace('border-', 'text-')}`} />
            <span className="text-gray-darker">{item}</span>
          </li>
        ))}
      </ul>
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
              Transform your dental practice with our AI-powered platform:
              designed to enhance patient care, optimize operations, and maximize profitability.
            </p>

            {/* CTAs */}
            <div className="relative z-10 flex flex-wrap justify-center gap-4 mb-16
                animate-appear opacity-0 [animation-delay:300ms]">
              <Button
                size="lg"
                className={cn(
                  "bg-gradient-to-r from-turquoise to-navy hover:from-navy hover:to-turquoise",
                  "text-white font-medium shadow-lg",
                  "transition-all duration-300",
                )}
                asChild
              >
                <Link to="/signup">
                Join our exclusive waitlist today!
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
              powered by advanced AI that optimizes operations, boosts treatment acceptance, 
              and keeps patients coming back effortlessly.
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

      {/* AI Features Section */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">
              AI-Powered Intelligence
            </h2>
            <p className="text-gray-darker max-w-3xl mx-auto text-lg">
              Our cutting-edge artificial intelligence transforms every aspect of your practice
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <AIFeatureCard 
              title="Recall Genius"
              description="AI-driven patient recall system that identifies and prioritizes patients for follow-up, maximizing appointment scheduling and revenue."
              icon={<LucideCalendar className="h-6 w-6" />}
            />
            <AIFeatureCard 
              title="Smart Scheduling"
              description="Intelligent appointment booking that considers staff availability, patient preferences, and treatment requirements."
              icon={<LucideClock className="h-6 w-6" />}
            />
            <AIFeatureCard 
              title="AI Diagnostics"
              description="AI algorithms analyze patient data, including X-rays and dental records, to assist in early detection and treatment planning."
              icon={<LucideBrain className="h-6 w-6" />}
            />
            <AIFeatureCard 
              title="Personalized Comms"
              description="AI-powered chatbots and communication tools that provide personalized support and tailored oral health recommendations."
              icon={<LucideMessageSquare className="h-6 w-6" />}
            />
          </div>
        </div>
      </section>

      {/* Feature Grid Section */}
      <section className="py-24 px-4 bg-gray-smoke">
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

      {/* Benefits Section */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-navy mb-2">
              Benefits for Your Entire Practice
            </h2>
            <p className="text-gray-darker max-w-3xl mx-auto">
              DentalHub delivers value to every stakeholder in your practice
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <BenefitCard 
              title="For Dental Practices"
              items={[
                "Increased operational efficiency",
                "Improved revenue generation",
                "Enhanced patient satisfaction",
                "Data-driven business insights"
              ]}
              icon={<LucideLineChart className="h-6 w-6" />}
              color="border-navy"
            />
            <BenefitCard 
              title="For Staff Members"
              items={[
                "Streamlined daily workflows",
                "Enhanced team collaboration",
                "Improved job satisfaction",
                "Access to advanced AI tools"
              ]}
              icon={<LucideUsers className="h-6 w-6" />}
              color="border-turquoise"
            />
            <BenefitCard 
              title="For Patients"
              items={[
                "Personalized dental care",
                "Convenient communication",
                "Improved treatment outcomes",
                "Enhanced overall experience"
              ]}
              icon={<LucideShield className="h-6 w-6" />}
              color="border-purple"
            />
          </div>
        </div>
      </section>

{/* Waitlist Sign-up Section */}
<section className="py-20 px-4 bg-gray-smoke">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm p-8 md:p-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-navy mb-4">Join Our Waitlist</h2>
                <p className="text-gray-darker mb-6">
                  Be among the first to experience the future of dental practice management.
                  Early adopters receive exclusive benefits and priority onboarding.
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center">
                    <LucideCheck className="h-5 w-5 text-turquoise mr-2" />
                    <span className="text-gray-darker">Early access to new features</span>
                  </li>
                  <li className="flex items-center">
                    <LucideCheck className="h-5 w-5 text-turquoise mr-2" />
                    <span className="text-gray-darker">Founding member pricing</span>
                  </li>
                  <li className="flex items-center">
                    <LucideCheck className="h-5 w-5 text-turquoise mr-2" />
                    <span className="text-gray-darker">Priority support and setup</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-gray-smoke p-6 rounded-xl">
                <form className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-navy mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      className="w-full px-4 py-2 border border-gray-light rounded-lg focus:outline-none focus:ring-2 focus:ring-turquoise"
                      placeholder="Dr. Jane Smith"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-navy mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      className="w-full px-4 py-2 border border-gray-light rounded-lg focus:outline-none focus:ring-2 focus:ring-turquoise"
                      placeholder="jane@example.com"
                    />
                  </div>
                  <div>
                    <label htmlFor="practice" className="block text-sm font-medium text-navy mb-1">
                      Practice Name
                    </label>
                    <input
                      type="text"
                      id="practice"
                      className="w-full px-4 py-2 border border-gray-light rounded-lg focus:outline-none focus:ring-2 focus:ring-turquoise"
                      placeholder="Smith Family Dental"
                    />
                  </div>
                  <Button
                    className="w-full bg-gradient-to-r from-turquoise to-navy text-white font-medium"
                  >
                    Join Waitlist
                  </Button>
                </form>
              </div>
            </div>
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

      {/* How It Works Section */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-navy mb-2">
              How DentalHub Works
            </h2>
            <p className="text-gray-darker max-w-3xl mx-auto">
              Our seamless integration ensures minimal disruption with maximum impact
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="flex flex-col items-center text-center p-6">
              <div className="w-16 h-16 bg-navy text-white rounded-full flex items-center justify-center mb-4 text-xl font-bold">1</div>
              <h3 className="text-xl font-bold text-navy mb-2">Integration</h3>
              <p className="text-gray-darker">Quick integration with your existing practice management software</p>
            </div>
            <div className="flex flex-col items-center text-center p-6">
              <div className="w-16 h-16 bg-turquoise text-white rounded-full flex items-center justify-center mb-4 text-xl font-bold">2</div>
              <h3 className="text-xl font-bold text-navy mb-2">Data Analysis</h3>
              <p className="text-gray-darker">Our AI analyzes your practice data to identify optimization opportunities</p>
            </div>
            <div className="flex flex-col items-center text-center p-6">
              <div className="w-16 h-16 bg-purple text-white rounded-full flex items-center justify-center mb-4 text-xl font-bold">3</div>
              <h3 className="text-xl font-bold text-navy mb-2">Implementation</h3>
              <p className="text-gray-darker">Implement AI-powered workflows and patient communication systems</p>
            </div>
            <div className="flex flex-col items-center text-center p-6">
              <div className="w-16 h-16 bg-gold text-white rounded-full flex items-center justify-center mb-4 text-xl font-bold">4</div>
              <h3 className="text-xl font-bold text-navy mb-2">Growth</h3>
              <p className="text-gray-darker">Watch your practice thrive with continued optimization and support</p>
            </div>
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
              Dental professionals around the country are experiencing remarkable results with DentalHub
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <TestimonialCard 
              quote="DentalHub's AI has transformed our practice workflow. The Recall Genius alone has increased our chair utilization by 23% and dramatically reduced no-shows."
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
      <section className="py-24 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-navy mb-2">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-darker max-w-3xl mx-auto">
              Everything you need to know about DentalHub
            </p>
          </div>

          <div className="bg-gray-smoke rounded-xl shadow-sm p-6">
            <FaqItem 
              question="How does DentalHub integrate with my existing practice management software?"
              answer="DentalHub offers seamless integration with all major practice management systems including Dentrix, Eaglesoft, Open Dental, and many more. Our team handles the entire integration process, typically taking 2-3 business days with minimal disruption to your practice."
            />
            <FaqItem 
              question="Is DentalHub HIPAA compliant?"
              answer="Absolutely. DentalHub is fully HIPAA compliant with end-to-end encryption, secure cloud storage, and role-based access controls. We conduct regular security audits and provide a Business Associate Agreement (BAA) to all practices."
            />
            <FaqItem 
              question="How does the AI-powered patient recall system work?"
              answer="Our Recall Genius leverages advanced AI to analyze patient histories, appointment patterns, and treatment needs to automatically identify and prioritize patients for follow-up. It then creates personalized communication campaigns across multiple channels (email, SMS, voice) to maximize patient reactivation and retention."
            />
            <FaqItem 
              question="How long does implementation take?"
              answer="Most practices are up and running with DentalHub in less than a week. Our implementation team handles data migration, staff training, and system configuration. We offer both in-person and virtual training sessions to ensure your team is comfortable with the platform."
            />
            <FaqItem 
              question="Can I customize the system to fit my practice's specific needs?"
              answer="Yes, DentalHub is highly customizable. From treatment plan templates to patient communication flows, you can tailor the system to match your practice's unique workflow and requirements. Our team will work with you to configure the system to your specifications."
            />
          </div>
        </div>
      </section>

      {/* Features Grid Section */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-navy mb-2">
              Complete Platform for Modern Dentistry
            </h2>
            <p className="text-gray-darker max-w-3xl mx-auto">
              DentalHub combines powerful tools in one integrated platform
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <div className="bg-gray-smoke rounded-xl p-4 text-center hover:shadow-sm transition-shadow">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3">
                <LucideUsers className="h-6 w-6 text-navy" />
              </div>
              <h3 className="font-semibold text-navy">Patient Management</h3>
            </div>
            
            <div className="bg-gray-smoke rounded-xl p-4 text-center hover:shadow-sm transition-shadow">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3">
                <LucideCalendar className="h-6 w-6 text-navy" />
              </div>
              <h3 className="font-semibold text-navy">Smart Scheduling</h3>
            </div>
            
            <div className="bg-gray-smoke rounded-xl p-4 text-center hover:shadow-sm transition-shadow">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3">
                <LucideMessageSquare className="h-6 w-6 text-navy" />
              </div>
              <h3 className="font-semibold text-navy">Patient Communication</h3>
            </div>
            
            <div className="bg-gray-smoke rounded-xl p-4 text-center hover:shadow-sm transition-shadow">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3">
                <LucideDollarSign className="h-6 w-6 text-navy" />
              </div>
              <h3 className="font-semibold text-navy">Financial Analytics</h3>
            </div>
            
            <div className="bg-gray-smoke rounded-xl p-4 text-center hover:shadow-sm transition-shadow">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3">
                <LucideBrain className="h-6 w-6 text-navy" />
              </div>
              <h3 className="font-semibold text-navy">AI Treatment Planning</h3>
            </div>
            
            <div className="bg-gray-smoke rounded-xl p-4 text-center hover:shadow-sm transition-shadow">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3">
                <LucideClipboard className="h-6 w-6 text-navy" />
              </div>
              <h3 className="font-semibold text-navy">Treatment Tracking</h3>
            </div>
            
            <div className="bg-gray-smoke rounded-xl p-4 text-center hover:shadow-sm transition-shadow">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3">
                <LucideActivity className="h-6 w-6 text-navy" />
              </div>
              <h3 className="font-semibold text-navy">Practice Analytics</h3>
            </div>
            
            <div className="bg-gray-smoke rounded-xl p-4 text-center hover:shadow-sm transition-shadow">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3">
                <LucideZap className="h-6 w-6 text-navy" />
              </div>
              <h3 className="font-semibold text-navy">Recall Genius</h3>
            </div>
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
            Join our exclusive waitlist today and be among the first to transform your dental practice with DentalHub's comprehensive AI-powered platform. Our early adopters have increased productivity by up to 32% and reclaimed over $50,000 in annual revenue through optimized scheduling, automated patient engagement, and intelligent practice analytics.

            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button
                size="lg"
                className="bg-white text-navy hover:bg-gray-lighter font-semibold"
                asChild
              >
                <Link to="/signup">
                Join our exclusive waitlist today!
                </Link>
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
              <span>Full-featured access</span>
            </div>
            <div className="flex items-center">
              <LucideCheck className="mr-2 h-5 w-5 text-turquoise" />
              <span>No Obligation</span>
            </div>
            <div className="flex items-center">
              <LucideCheck className="mr-2 h-5 w-5 text-turquoise" />
              <span>Cancel anytime</span>
            </div>
          </div>
        </div>
        
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-navy via-purple to-turquoise z-0"></div>
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
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-turquoise" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              }
              features={[
                "Schedule appointments",
                "View treatment plans",
                "Access health records",
                "Secure messaging"
              ]}
              buttonText="Patient Login"
            />
            
            <PortalCard
              title="Staff Portal"
              description="Manage patient care and daily operations"
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-purple" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              }
              features={[
                "Treatment scheduling",
                "Patient management",
                "Team collaboration",
                "Clinical records"
              ]}
              buttonText="Staff Login"
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
                "Practice analytics",
                "Staff management",
                "Financial reports",
                "AI consultant access"
              ]}
              buttonText="Admin Login"
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-navy py-12 px-4 text-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-xl font-bold mb-4">DentalHub</h3>
            <p className="text-white/70 mb-6 max-w-md">
              The next generation dental practice management platform
              powered by AI and designed for modern dental practices.
              Transform patient care and practice efficiency with our
              comprehensive solution.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-white hover:text-turquoise transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path>
                </svg>
              </a>
              <a href="#" className="text-white hover:text-turquoise transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"></path>
                </svg>
              </a>
              <a href="#" className="text-white hover:text-turquoise transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"></path>
                </svg>
              </a>
            </div>
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
            <ul className="space-y-2">
              <li><a href="#" className="text-white/70 hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-white/70 hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="text-white/70 hover:text-white transition-colors">HIPAA Compliance</a></li>
              <li><a href="#" className="text-white/70 hover:text-white transition-colors">Cookie Policy</a></li>
            </ul>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-white/20 text-center text-white/50">
          &copy; {new Date().getFullYear()} nGenius Pros DentalHub. All rights reserved.
        </div>
      </footer>
    </div>
  );
}