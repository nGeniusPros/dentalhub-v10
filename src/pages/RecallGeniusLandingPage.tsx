import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Mockup } from "@/components/ui/mockup";
import { Glow } from "@/components/ui/glow";
import { 
  LucideCalendar, 
  LucideArrowRight, 
  LucideCheck, 
  LucideCheckCircle, 
  LucideChevronDown,
  LucideChevronRight, 
  LucideDollarSign, 
  LucideBarChart, 
  LucideClock,
  LucideMessageSquare
} from "lucide-react";
import { Link } from "react-router-dom";

// Image Carousel Component
const ImageCarousel = ({ images, alt }: { images: string[]; alt: string }) => {
  const [currentIndex, setCurrentIndex] = React.useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
  };

  React.useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full" style={{ height: "500px" }}>
      <div className="relative w-full h-full rounded-md overflow-hidden bg-white/5">
        {images.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentIndex ? "opacity-100" : "opacity-0"
            }`}
          >
            <img
              src={image}
              alt={`${alt} ${index + 1}`}
              className="w-full h-full object-contain"
              onError={(e) => {
                // If image fails to load, show fallback
                const target = e.currentTarget;
                target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'/%3E%3C/svg%3E";
                target.style.padding = "2rem";
                target.parentElement?.classList.add("bg-gray-200");
              }}
            />
          </div>
        ))}
      </div>
      
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full ${
              index === currentIndex ? "bg-white" : "bg-white/50"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
      
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 rounded-full p-2 text-white z-10"
        aria-label="Previous slide"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 rounded-full p-2 text-white z-10"
        aria-label="Next slide"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
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
        <h3 className="text-lg font-medium text-[--brand]">{question}</h3>
        <div>
          {isOpen ? (
            <LucideChevronDown className="h-5 w-5 text-[--brand]" />
          ) : (
            <LucideChevronRight className="h-5 w-5 text-[--brand]" />
          )}
        </div>
      </button>
      {isOpen && (
        <div className="pb-5">
          <p className="text-[--muted-foreground]">{answer}</p>
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
      <p className="text-muted mb-6 italic">{quote}</p>
      <div className="flex items-center">
        <img src={image} alt={author} className="w-12 h-12 rounded-full mr-4 object-cover" />
        <div>
          <h4 className="font-bold text-[--brand]">{author}</h4>
          <p className="text-muted text-sm">{role}</p>
        </div>
      </div>
    </div>
  );
};

// Feature Card Component
const FeatureCard = ({ title, description, icon }: { title: string; description: string; icon: React.ReactNode }) => {
  return (
    <div className="bg-background rounded-xl shadow-sm hover:shadow-glow transition-shadow p-6">
      <div className="w-12 h-12 bg-[--brand]/10 text-[--brand] rounded-lg flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-[--brand] mb-2">{title}</h3>
      <p className="text-muted">{description}</p>
    </div>
  );
};

// Stat Card Component
const StatCard = ({ number, label }: { number: string; label: string }) => {
  return (
    <div className="bg-background rounded-xl shadow-sm p-6 text-center">
      <div className="text-4xl font-bold text-blue-600 mb-2">{number}</div>
      <p className="text-muted">{label}</p>
    </div>
  );
};

export default function RecallGeniusLandingPage() {
  return (
    <div className="min-h-screen bg-[--muted]">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-[--brand] to-[--brand-foreground] py-16 md:py-24 lg:py-32">
        <div className="relative mx-auto max-w-[1280px] px-4">
          <div className="relative z-10 flex flex-col items-center text-center">
            {/* Heading */}
            <h1 className={cn(
              "inline-block animate-appear",
              "text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl",
              "leading-[1.1] text-[--brand]",
              "mb-6",
            )}>
              Automate Patient Recall<br />& Increase Revenue
            </h1>

            {/* Description */}
            <p className={cn(
              "max-w-[650px] animate-appear opacity-0 [animation-delay:150ms]",
              "text-base sm:text-lg md:text-xl",
              "text-gray-darker",
              "font-medium mb-8",
            )}>
              RecallGenius uses advanced AI to identify, contact, and 
              recall overdue patients without tying up your front desk
            </p>

            {/* CTAs */}
            <div className="relative z-10 flex flex-wrap justify-center gap-4 mb-16
                animate-appear opacity-0 [animation-delay:300ms]">
              <Button
                size="lg"
                className={cn(
                  "bg-gradient-to-r from-[--brand] to-[--brand-foreground] hover:from-[--brand-foreground] hover:to-[--brand]",
                  "text-white font-medium shadow-lg",
                  "transition-all duration-300",
                )}
                asChild
              >
                <Link to="/signup">
                  Join Waitlist
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
                <Link to="/contact">
                  Request Demo
                  <LucideArrowRight className="ml-2 h-4 w-4" />
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
                <ImageCarousel
                  images={[
                    "/front-pages/landing-page/RecallGenius Dashboard.png",
                    "/front-pages/landing-page/RecallGenius Dashboard2.png"
                  ]}
                  alt="RecallGenius Dashboard"
                />
              </Mockup>
            </div>
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

      {/* Stats Section */}
      <section className="py-24 px-4 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-navy mb-2">
              Proven Results For Dental Practices
            </h2>
            <p className="text-muted-foreground max-w-3xl mx-auto">
              RecallGenius delivers measurable impact on your practice's bottom line
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard 
              number="87%"
              label="Average Reactivation Rate"
            />
            <StatCard 
              number="42%"
              label="Increased Hygiene Production"
            />
            <StatCard 
              number="$143K"
              label="Average Annual ROI"
            />
            <StatCard 
              number="3.5hrs"
              label="Weekly Staff Time Saved"
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 px-4 bg-gray-smoke">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-navy mb-2">
              How RecallGenius Works
            </h2>
            <p className="text-muted-foreground max-w-3xl mx-auto">
              Our AI-powered system automates every step of the patient recall process
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-background rounded-xl shadow-sm p-8 text-center">
              <div className="w-16 h-16 bg-[--brand]/10 text-[--brand] rounded-full flex items-center justify-center mx-auto mb-6">
                <LucideBarChart className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-[--brand] mb-4">1. Identify Overdue Patients</h3>
              <p className="text-muted-foreground">
                Our AI analyzes your practice management data to identify patients overdue for recall, 
                prioritizing those most likely to schedule.
              </p>
            </div>
            
            <div className="bg-background rounded-xl shadow-sm p-8 text-center">
              <div className="w-16 h-16 bg-[--brand]/10 text-[--brand] rounded-full flex items-center justify-center mx-auto mb-6">
                <LucideMessageSquare className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-[--brand] mb-4">2. Personalized Communication</h3>
              <p className="text-muted-foreground">
                Send personalized texts, emails, and even voicemails to patients with optimal timing 
                and messaging that gets responses.
              </p>
            </div>
            
            <div className="bg-background rounded-xl shadow-sm p-8 text-center">
              <div className="w-16 h-16 bg-[--brand]/10 text-[--brand] rounded-full flex items-center justify-center mx-auto mb-6">
                <LucideCalendar className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-[--brand] mb-4">3. Automated Scheduling</h3>
              <p className="text-muted-foreground">
                Patients can schedule directly through our platform, which syncs with your practice management 
                system in real-time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid Section */}
      <section className="py-24 px-4 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[--brand] mb-2">
              Key Features
            </h2>
            <p className="text-gray-700 max-w-3xl mx-auto">
              Everything you need to maximize your hygiene department's efficiency
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              title="Multi-Channel Outreach"
              description="Text, email, voice, and direct mail - all automated and personalized for each patient."
              icon={<LucideMessageSquare className="h-6 w-6" />}
            />
            <FeatureCard 
              title="Smart Scheduling"
              description="AI optimizes scheduling to maximize chair utilization and minimize gaps."
              icon={<LucideCalendar className="h-6 w-6" />}
            />
            <FeatureCard 
              title="Real-Time ROI Dashboard"
              description="See exactly how many appointments were recovered and revenue generated."
              icon={<LucideDollarSign className="h-6 w-6" />}
            />
            <FeatureCard 
              title="Seamless Integration"
              description="Works with all major practice management systems with no disruption."
              icon={<LucideCheckCircle className="h-6 w-6" />}
            />
            <FeatureCard 
              title="Family Bundling"
              description="Intelligent scheduling of family members together to maximize convenience."
              icon={<LucideBarChart className="h-6 w-6" />}
            />
            <FeatureCard 
              title="Time-Optimized Messaging"
              description="Messages sent at the optimal time when patients are most likely to respond."
              icon={<LucideClock className="h-6 w-6" />}
            />
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-24 px-4 bg-gray-smoke">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[--brand] mb-2">
              What Our Customers Say
            </h2>
            <p className="text-gray-700 max-w-3xl mx-auto">
              Join hundreds of practices already using RecallGenius
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <TestimonialCard 
              quote="RecallGenius has completely transformed our recall system. We've seen a 42% increase in hygiene production without adding any staff time. It pays for itself many times over."
              author="Dr. Emily Chen"
              role="Practice Owner, Smile Design Dental"
              image="https://via.placeholder.com/100"
            />
            <TestimonialCard 
              quote="The most impressive part is how many patients respond to the messages. The AI seems to know exactly what to say and when to send it. Our schedule is consistently full now."
              author="Jessica Miller"
              role="Office Manager, Parkside Dental"
              image="https://via.placeholder.com/100"
            />
            <TestimonialCard 
              quote="We recovered over 200 patients in the first three months who hadn't been in for years. The ROI is incredible - it's our highest-value technology investment by far."
              author="Dr. James Wilson"
              role="Owner, Family Dental Care"
              image="https://via.placeholder.com/100"
            />
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[--brand] mb-2">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-700 max-w-3xl mx-auto">
              Everything you need to know about RecallGenius
            </p>
          </div>

          <div className="bg-gray-50 rounded-xl shadow-sm p-6">
            <FaqItem 
              question="How does RecallGenius integrate with my practice management software?"
              answer="RecallGenius connects seamlessly with all major practice management systems including Dentrix, Eaglesoft, Open Dental, and Curve. The setup process is simple and typically takes less than an hour with no disruption to your practice."
            />
            <FaqItem 
              question="Is RecallGenius HIPAA compliant?"
              answer="Absolutely. RecallGenius is fully HIPAA compliant with bank-level encryption, secure cloud storage, and comprehensive access controls. We provide a signed BAA and maintain the highest security standards."
            />
            <FaqItem 
              question="How much time will my team need to spend managing the system?"
              answer="Almost none! The system is fully automated. Most practices spend about 15 minutes per week reviewing the dashboard and results. We handle all the messaging, follow-ups, and scheduling."
            />
            <FaqItem 
              question="How quickly will I see results?"
              answer="Most practices begin seeing recovered appointments within the first week. On average, our customers see significant recall increases within the first month and achieve full ROI within 60 days."
            />
            <FaqItem 
              question="Can I customize the messaging sent to patients?"
              answer="Yes, you have full control over messaging templates, though our AI-optimized templates typically yield the best results. You can customize tone, messaging details, and your practice's unique selling points."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-ocean z-0"></div>
        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
              Ready to Revolutionize Your Recall System?
            </h2>
            <p className="text-white/80 text-lg max-w-3xl mx-auto mb-8">
              Join practices across the country that are filling their hygiene schedules
              and increasing production with RecallGenius.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button
                size="lg"
                className="bg-background text-[--brand] hover:bg-gray-lighter font-semibold"
                asChild
              >
                <Link to="/signup">
                  Join Waitlist
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-background/10"
                asChild
              >
                <Link to="/contact">
                  Request Demo
                </Link>
              </Button>
            </div>
          </div>
          
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-white">
            <div className="flex items-center">
              <LucideCheck className="mr-2 h-5 w-5 text-[--brand-foreground]" />
              <span>30-day money-back guarantee</span>
            </div>
            <div className="flex items-center">
              <LucideCheck className="mr-2 h-5 w-5 text-turquoise" />
              <span>No long-term contracts</span>
            </div>
            <div className="flex items-center">
              <LucideCheck className="mr-2 h-5 w-5 text-turquoise" />
              <span>Free implementation</span>
            </div>
            <div className="flex items-center">
              <LucideCheck className="mr-2 h-5 w-5 text-turquoise" />
              <span>Unlimited support</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-navy py-12 px-4 text-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">RecallGenius</h3>
            <p className="text-white/70">
              The smartest way to automate patient recall
              and increase hygiene production.
            </p>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">Contact</h3>
            <ul className="space-y-2 text-white/70">
              <li>Email: hello@recallgenius.com</li>
              <li>Phone: (800) 456-7890</li>
              <li>Address: 456 Tech Plaza, San Francisco, CA</li>
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
          &copy; {new Date().getFullYear()} RecallGenius. All rights reserved.
        </div>
      </footer>
    </div>
  );
}