import ExternalLayout from '@/components/external/ExternalLayout';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Check as LucideCheck } from 'lucide-react';

const DentalConsulting = () => (
  <ExternalLayout>
    {/* Hero Section */}
    <section className="bg-gradient-to-r from-teal-500 via-cyan-500 to-sky-600 text-white">
      <div className="container mx-auto px-4 py-16 md:py-24 space-y-6 text-center">
        <h1 className="text-4xl md:text-5xl font-bold">Expert Dental Practice Consulting</h1>
        <p className="text-lg md:text-xl text-gray-100">Optimize Operations, Maximize Profitability</p>
        <p className="text-gray-200 md:w-2/3 mx-auto">Our specialized dental consulting services help you streamline workflows, enhance patient experience, and boost your practice's financial performance.</p>
        <Button className="bg-navy text-white shadow-md hover:bg-navy-light px-8 py-3 text-lg font-semibold rounded-lg transition-colors duration-300">Schedule a Free Consultation</Button>
      </div>
    </section>

    {/* Common Practice Management Challenges Section */}
    <section className="bg-slate-100">
      <div className="container mx-auto px-4 py-16 md:py-20">
        <h2 className="text-3xl md:text-4xl font-bold text-navy text-center mb-16">Common Practice Management Challenges</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {/* Challenge Card 1 */}
          <div className="bg-white rounded-xl shadow-xl p-8 space-y-4 hover:shadow-glow transition-shadow duration-300 flex flex-col items-center text-center">
            <div className="text-4xl text-navy mb-3">{/* Placeholder Icon: Operational Inefficiencies */}</div>
            <h3 className="text-xl font-semibold text-navy">Operational Inefficiencies</h3>
            <p className="text-gray-600">Many dental practices struggle with workflow bottlenecks, scheduling issues, and administrative inefficiencies that limit productivity and growth.</p>
          </div>
          {/* Challenge Card 2 */}
          <div className="bg-white rounded-xl shadow-xl p-8 space-y-4 hover:shadow-glow transition-shadow duration-300 flex flex-col items-center text-center">
            <div className="text-4xl text-navy mb-3">{/* Placeholder Icon: Declining Profitability */}</div>
            <h3 className="text-xl font-semibold text-navy">Declining Profitability</h3>
            <p className="text-gray-600">Increasing costs, changing reimbursement models, and competitive pressures can erode practice profitability without strategic management.</p>
          </div>
          {/* Challenge Card 3 */}
          <div className="bg-white rounded-xl shadow-xl p-8 space-y-4 hover:shadow-glow transition-shadow duration-300 flex flex-col items-center text-center">
            <div className="text-4xl text-navy mb-3">{/* Placeholder Icon: Growth Plateaus */}</div>
            <h3 className="text-xl font-semibold text-navy">Growth Plateaus</h3>
            <p className="text-gray-600">Practices often hit growth ceilings due to capacity constraints, marketing limitations, or inability to scale systems and processes effectively.</p>
          </div>
        </div>
      </div>
    </section>

    {/* Our Dental Consulting Solution Section */}
    <section className="bg-white">
      <div className="container mx-auto px-4 py-16 md:py-20">
        <h2 className="text-3xl md:text-4xl font-bold text-navy text-center mb-16">Our Dental Consulting Solution</h2>
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <p className="text-lg text-gray-700 leading-relaxed">nGenius Pros offers comprehensive practice consulting services designed specifically for dental practices. Our team of experienced consultants brings expertise in practice management, operations, finance, and marketing to help you overcome challenges and achieve your goals.</p>
            <p className="text-lg text-gray-700 leading-relaxed">We take a data-driven approach to identify opportunities for improvement and develop customized strategies that align with your practice vision. Our consultants work collaboratively with your team to implement changes and measure results.</p>
            <p className="text-lg text-gray-700 leading-relaxed">By partnering with nGenius Pros for consulting services, you gain access to specialized expertise that can transform your practice operations, enhance patient experience, and drive sustainable growth and profitability.</p>
          </div>
          <div>
            {/* Placeholder for ROI Image */}
            <div className="bg-gray-200 rounded-lg shadow-lg h-80 w-full flex items-center justify-center text-gray-500">
              [Placeholder for ROI Image]
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* Our Comprehensive Consulting Services Section */}
    <section className="bg-slate-100">
      <div className="container mx-auto px-4 py-16 md:py-20">
        <h2 className="text-3xl md:text-4xl font-bold text-navy text-center mb-16">Our Comprehensive Consulting Services</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[ 
            { title: 'Practice Assessment', description: 'We conduct a thorough analysis of your current operations, financials, systems, and team dynamics to identify strengths, weaknesses, and opportunities.' },
            { title: 'Strategic Planning', description: 'Our consultants help you develop a clear vision and actionable roadmap for achieving your practice goals, whether that’s growth, improved efficiency, or transition planning.' },
            { title: 'Operational Optimization', description: 'We streamline workflows, enhance scheduling systems, and implement efficient processes to maximize productivity and patient satisfaction.' },
            { title: 'Financial Management', description: 'Our team helps you optimize fee schedules, improve case acceptance, track overhead, and implement financial controls to boost profitability.' },
            { title: 'Team Development', description: 'We provide leadership coaching, staff training, and team-building strategies to create a high-performing, patient-centered culture.' },
            { title: 'Technology Integration', description: 'We help you select and implement the right practice management systems and digital tools to enhance efficiency and patient experience.' },
          ].map((service, index) => (
            <div key={index} className="bg-white rounded-xl shadow-xl p-8 space-y-3 hover:shadow-glow transition-shadow duration-300">
              <div className="text-3xl text-teal-500 mb-3">{/* Placeholder Icon */}</div>
              <h3 className="text-xl font-semibold text-navy">{service.title}</h3>
              <p className="text-gray-600 text-sm">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Benefits of Our Dental Consulting Services Section */}
    <section className="bg-white">
      <div className="container mx-auto px-4 py-16 md:py-20">
        <h2 className="text-3xl md:text-4xl font-bold text-navy text-center mb-16">Benefits of Our Dental Consulting Services</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[ 
            { title: 'Increased Efficiency', description: 'Our clients typically see a 15-30% improvement in operational efficiency, allowing them to see more patients without sacrificing quality of care.' },
            { title: 'Enhanced Profitability', description: 'Through strategic fee optimization, overhead reduction, and improved case acceptance, we help practices increase net profit by an average of 15%.' },
            { title: 'Sustainable Growth', description: 'Our customized growth strategies help practices expand their patient base, service offerings, and profitability with scalable systems.' },
            { title: 'Improved Team Performance', description: 'We foster a positive work environment and staff development that leads to higher staff retention, better teamwork, and enhanced patient experience.' },
          ].map((benefit, index) => (
            <div key={index} className="bg-slate-50 rounded-xl shadow-lg p-6 space-y-3 hover:shadow-glow transition-shadow duration-300 flex flex-col items-center text-center">
              <div className="text-3xl text-gold-500 mb-3">{/* Placeholder Icon */}</div>
              <h3 className="text-lg font-semibold text-navy">{benefit.title}</h3>
              <p className="text-gray-600 text-sm">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* What Our Clients Say Section */}
    <section className="bg-slate-100">
      <div className="container mx-auto px-4 py-16 md:py-20">
        <h2 className="text-3xl md:text-4xl font-bold text-navy text-center mb-16">What Our Clients Say</h2>
        <div className="grid md:grid-cols-2 gap-12">
          {/* Testimonial 1 */}
          <div className="bg-white rounded-xl shadow-lg p-8 space-y-4">
            <div className="flex items-center mb-2">
              {[...Array(5)].map((_, i) => <span key={i} className="text-gold-400 text-xl">&#9733;</span>)}
            </div>
            <p className="text-gray-700 italic leading-relaxed">"The operational changes recommended by nGenius Pros increased our production by 20% while actually reducing our team's stress levels. Their practical, dental-specific approach made all the difference."</p>
            <p className="text-navy font-semibold text-right">- Dr. Robert Williams</p>
          </div>
          {/* Testimonial 2 */}
          <div className="bg-white rounded-xl shadow-lg p-8 space-y-4">
            <div className="flex items-center mb-2">
              {[...Array(5)].map((_, i) => <span key={i} className="text-gold-400 text-xl">&#9733;</span>)}
            </div>
            <p className="text-gray-700 italic leading-relaxed">"Their consulting team helped us identify and eliminate inefficiencies we didn't even realize were costing us money. Our overhead has decreased by 8% and our collections have improved significantly."</p>
            <p className="text-navy font-semibold text-right">- Dr. Lisa Thompson, Thompson Dental Care</p>
          </div>
        </div>
      </div>
    </section>

    {/* Enhanced CTA Section */}
    <section className="relative py-32 px-4 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-navy via-purple to-turquoise z-0"></div> {/* Background gradient */}
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

export default DentalConsulting;
