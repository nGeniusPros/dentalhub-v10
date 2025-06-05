import ExternalLayout from '@/components/external/ExternalLayout';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Check as LucideCheck, Users, Search, Briefcase, Award, TrendingUp, Clock } from 'lucide-react'; // Added more icons

const DentalRecruiting = () => (
  <ExternalLayout>
    {/* Hero Section */}
    <section className="bg-gradient-to-r from-teal-500 via-cyan-500 to-sky-600 text-white">
      <div className="container mx-auto px-4 py-16 md:py-24 space-y-6 text-center">
        <h1 className="text-4xl md:text-5xl font-bold">Strategic Dental Recruiting</h1>
        <p className="text-lg md:text-xl text-gray-100">Find and Retain Top Dental Talent</p>
        <p className="text-gray-200 md:w-2/3 mx-auto">Our specialized dental recruiting services help you build a skilled, reliable team that elevates your practice and enhances patient care, ensuring long-term success and growth.</p>
        <Button className="bg-navy text-white shadow-md hover:bg-navy-light px-8 py-3 text-lg font-semibold rounded-lg transition-colors duration-300">Discover Our Recruiting Process</Button>
      </div>
    </section>

    {/* Dental Staffing Challenges Section */}
    <section className="bg-slate-100">
      <div className="container mx-auto px-4 py-16 md:py-20">
        <h2 className="text-3xl md:text-4xl font-bold text-navy text-center mb-16">The Modern Dental Staffing Challenge</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl shadow-xl p-8 space-y-4 hover:shadow-glow transition-shadow duration-300 flex flex-col items-center text-center">
            <Users className="w-12 h-12 text-teal-500 mb-4" />
            <h3 className="text-xl font-semibold text-navy">Talent Shortage & Competition</h3>
            <p className="text-gray-600">The dental industry faces a critical shortage of qualified hygienists, assistants, and administrative staff, making it increasingly difficult to find and attract skilled professionals amid high competition.</p>
          </div>
          <div className="bg-white rounded-xl shadow-xl p-8 space-y-4 hover:shadow-glow transition-shadow duration-300 flex flex-col items-center text-center">
            <TrendingUp className="w-12 h-12 text-teal-500 mb-4" />
            <h3 className="text-xl font-semibold text-navy">High Turnover & Retention Issues</h3>
            <p className="text-gray-600">Dental practices often struggle with staff retention due to burnout or lack of growth opportunities, leading to constant recruitment cycles, training costs, and disruption to patient care.</p>
          </div>
          <div className="bg-white rounded-xl shadow-xl p-8 space-y-4 hover:shadow-glow transition-shadow duration-300 flex flex-col items-center text-center">
            <Clock className="w-12 h-12 text-teal-500 mb-4" />
            <h3 className="text-xl font-semibold text-navy">Time-Consuming Hiring Process</h3>
            <p className="text-gray-600">Practice owners and office managers spend countless hours on job postings, resume screening, and interviews, diverting valuable time from patient care and core practice management.</p>
          </div>
        </div>
      </div>
    </section>

    {/* Our Dental Recruiting Solution Section */}
    <section className="bg-white">
      <div className="container mx-auto px-4 py-16 md:py-20">
        <h2 className="text-3xl md:text-4xl font-bold text-navy text-center mb-16">Our Strategic Recruiting Solution</h2>
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <p className="text-lg text-gray-700 leading-relaxed">nGenius Pros offers a comprehensive recruiting service designed specifically for dental practices. Our team of specialized recruiters understands the unique staffing needs of dental offices and has built an extensive network of qualified candidates.</p>
            <p className="text-lg text-gray-700 leading-relaxed">We handle every aspect of the recruiting process, from creating compelling job descriptions and strategic sourcing to rigorous candidate screening, initial interviews, and facilitating final hiring decisions. Our data-driven approach is both thorough and efficient, ensuring you find the right fit for your practice culture and long-term goals.</p>
            <p className="text-lg text-gray-700 leading-relaxed">By partnering with nGenius Pros, you gain a dedicated ally in building a high-performing team that contributes to practice growth, operational excellence, and superior patient satisfaction.</p>
          </div>
          <div>
            {/* Placeholder for a relevant graphic or image */}
            <div className="bg-slate-100 rounded-lg shadow-lg p-8 h-full flex flex-col items-center justify-center text-center">
              <Search className="w-24 h-24 text-navy mb-6" />
              <h3 className="text-2xl font-semibold text-navy mb-3">Connecting You With Dental Excellence</h3>
              <p className="text-gray-600">Our targeted approach ensures we find candidates who not only have the skills but also align with your practice's values and vision.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* Our Comprehensive Recruiting Services Section */}
    <section className="bg-slate-100">
      <div className="container mx-auto px-4 py-16 md:py-20">
        <h2 className="text-3xl md:text-4xl font-bold text-navy text-center mb-16">Our Comprehensive Recruiting Services</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[ 
            { title: 'In-Depth Needs Assessment', description: 'We start by understanding your specific staffing requirements, practice culture, and long-term goals.', icon: <Briefcase className="w-10 h-10 text-teal-600 mb-3" /> },
            { title: 'Strategic Candidate Sourcing', description: 'Utilizing our extensive network and advanced sourcing techniques to find active and passive job seekers.', icon: <Search className="w-10 h-10 text-teal-600 mb-3" /> },
            { title: 'Thorough Screening & Vetting', description: 'Comprehensive evaluation of skills, experience, credentials, and cultural fit for every candidate.', icon: <Users className="w-10 h-10 text-teal-600 mb-3" /> },
            { title: 'Qualified Candidate Presentation', description: 'Presenting you with a shortlist of highly qualified candidates who meet your criteria.', icon: <Award className="w-10 h-10 text-teal-600 mb-3" /> },
            { title: 'Interview Coordination & Support', description: 'Managing interview schedules and providing guidance to ensure a smooth and effective interview process.', icon: <Clock className="w-10 h-10 text-teal-600 mb-3" /> },
            { title: 'Offer Negotiation & Onboarding Guidance', description: 'Assisting with offer negotiation and providing support for a successful onboarding experience.', icon: <TrendingUp className="w-10 h-10 text-teal-600 mb-3" /> },
          ].map((service, index) => (
            <div key={index} className="bg-white rounded-xl shadow-xl p-8 space-y-3 hover:shadow-glow transition-shadow duration-300 flex flex-col items-center text-center">
              {service.icon}
              <h3 className="text-xl font-semibold text-navy">{service.title}</h3>
              <p className="text-gray-600 text-sm">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Benefits of Our Dental Recruiting Services Section */}
    <section className="bg-white">
      <div className="container mx-auto px-4 py-16 md:py-20">
        <h2 className="text-3xl md:text-4xl font-bold text-navy text-center mb-16">Unlock the Benefits of Expert Recruiting</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[ 
            { title: 'Access to Top Talent Pools', description: 'Tap into our exclusive network of skilled dental professionals actively seeking new opportunities.', icon: <Users className="w-10 h-10 text-gold-500 mb-3" /> },
            { title: 'Significant Time Savings', description: 'We handle the labor-intensive recruiting tasks, freeing you to focus on patient care and practice growth.', icon: <Clock className="w-10 h-10 text-gold-500 mb-3" /> },
            { title: 'Improved Staff Retention', description: 'Our focus on cultural fit and long-term compatibility leads to more stable and committed teams.', icon: <Award className="w-10 h-10 text-gold-500 mb-3" /> },
            { title: 'Reduced Hiring Costs', description: 'Minimize expenses associated with prolonged vacancies, bad hires, and inefficient recruitment processes.', icon: <TrendingUp className="w-10 h-10 text-gold-500 mb-3" /> },
          ].map((benefit, index) => (
            <div key={index} className="bg-slate-50 rounded-xl shadow-lg p-6 space-y-3 hover:shadow-glow transition-shadow duration-300 flex flex-col items-center text-center">
              {benefit.icon}
              <h3 className="text-lg font-semibold text-navy">{benefit.title}</h3>
              <p className="text-gray-600 text-sm">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Enhanced CTA Section */}
    <section className="relative py-32 px-4 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-navy via-purple to-turquoise z-0"></div>
      <div className="relative z-10 max-w-5xl mx-auto text-center">
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
            Ready to Build Your Dream Dental Team?
          </h2>
          <p className="text-white/80 text-lg max-w-3xl mx-auto mb-8">
            Partner with nGenius Pros and let our expert recruiters find the perfect candidates to elevate your practice. Stop searching, start building.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              size="lg"
              className="bg-white text-navy hover:bg-gray-lighter font-semibold"
              asChild
            >
              <Link to="/contact-recruiting"> {/* Changed link for recruiting */}
                Get Started with Recruiting
              </Link>
            </Button>
          </div>
        </div>
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-white">
          <div className="flex items-center">
            <LucideCheck className="mr-2 h-5 w-5 text-turquoise" />
            <span>Expert Dental Recruiters</span>
          </div>
          <div className="flex items-center">
            <LucideCheck className="mr-2 h-5 w-5 text-turquoise" />
            <span>Tailored Search Strategy</span>
          </div>
          <div className="flex items-center">
            <LucideCheck className="mr-2 h-5 w-5 text-turquoise" />
            <span>Guaranteed Satisfaction</span>
          </div>
          <div className="flex items-center">
            <LucideCheck className="mr-2 h-5 w-5 text-turquoise" />
            <span>Focus on Cultural Fit</span>
          </div>
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
  </ExternalLayout>
);

export default DentalRecruiting;
