import React from 'react';
import ExternalLayout from '@/components/external/ExternalLayout';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Check as LucideCheck } from 'lucide-react';

const DentalBilling = () => (
  <ExternalLayout>
    <section className="bg-gradient-to-r from-teal-500 via-cyan-500 to-sky-600 text-white">
      <div className="container mx-auto px-4 py-16 md:py-24 space-y-6 text-center">
        <h1 className="text-4xl md:text-5xl font-bold">Expert Dental Billing Services</h1>
        <p className="text-lg md:text-xl text-gray-100">Maximize Revenue, Minimize Hassle</p>
        <p className="text-gray-200 md:w-2/3 mx-auto">Our specialized dental billing services help you increase collections, reduce claim denials, and streamline your revenue cycle so you can focus on what matters most - your patients.</p>
        <Button className="bg-navy text-white shadow-md hover:bg-navy-light px-8 py-3 text-lg font-semibold rounded-lg transition-colors duration-300">Schedule a Free Consultation</Button>
      </div>
    </section>

    <section className="bg-slate-100">
      <div class="container mx-auto px-4 py-12">
        <h2 class="text-2xl md:text-3xl font-bold text-navy text-center mb-12">Common Dental Billing Challenges</h2>
        <div class="grid md:grid-cols-3 gap-8">
          <div class="bg-white rounded-xl shadow-xl p-8 space-y-4 hover:shadow-glow transition-shadow duration-300 flex flex-col items-center text-center">
            <div class="text-4xl text-navy mb-3">{/* Placeholder Icon 1 */}</div>
            <h3 class="text-xl font-semibold text-navy">High Claim Denial Rates</h3>
            <p class="text-gray-600">Dental practices often face claim denials due to coding errors, missing information, or insurance policy changes, resulting in delayed or lost revenue.</p>
          </div>
          <div class="bg-white rounded-xl shadow-xl p-8 space-y-4 hover:shadow-glow transition-shadow duration-300 flex flex-col items-center text-center">
            <div class="text-4xl text-navy mb-3">{/* Placeholder Icon 2 */}</div>
            <h3 class="text-xl font-semibold text-navy">Staff Overwhelm</h3>
            <p class="text-gray-600">In-house billing teams often struggle to keep up with the volume of claims, insurance follow-ups, and patient billing inquiries, leading to burnout and errors.</p>
          </div>
          <div class="bg-white rounded-xl shadow-xl p-8 space-y-4 hover:shadow-glow transition-shadow duration-300 flex flex-col items-center text-center">
            <div class="text-4xl text-navy mb-3">{/* Placeholder Icon 3 */}</div>
            <h3 class="text-xl font-semibold text-navy">Cash Flow Issues</h3>
            <p class="text-gray-600">Delayed claim submissions, slow insurance payments, and inefficient collection processes can create serious cash flow problems for dental practices.</p>
          </div>
        </div>
      </div>
    </section>

    <section className="bg-white">
      <div class="container mx-auto px-4 py-16 md:py-20 space-y-6">
        <h2 class="text-2xl md:text-3xl font-bold text-navy text-center mb-10">Our Dental Billing Solution</h2>
        <p className="text-lg text-gray-700 leading-relaxed md:w-3/4 lg:w-2/3 mx-auto text-center mb-6">nGenius Pros offers comprehensive dental billing services designed specifically for dental practices. Our team of experienced billing specialists handles every aspect of your revenue cycle, from claim submission to payment posting and everything in between.</p>
        <p className="text-lg text-gray-700 leading-relaxed md:w-3/4 lg:w-2/3 mx-auto text-center mb-6">We leverage advanced technology and industry best practices to maximize your collections, reduce denials, and accelerate your cash flow. Our approach is both proactive and responsive, ensuring that nothing falls through the cracks.</p>
        <p className="text-lg text-gray-700 leading-relaxed md:w-3/4 lg:w-2/3 mx-auto text-center">By outsourcing your dental billing to nGenius Pros, you can reduce overhead costs, improve cash flow, and free up your team to focus on providing exceptional patient care.</p>
        {/* Consider adding an image/illustration here in a two-column layout for larger screens */}
      </div>
    </section>

    <section class="bg-slate-100">
      <div class="container mx-auto px-4 py-12">
        <h2 class="text-2xl md:text-3xl font-bold text-navy text-center mb-12">Our Comprehensive Billing Services</h2>
        <div class="grid md:grid-cols-3 gap-8">
          {[ 'Insurance Verification', 'Claim Preparation & Submission', 'Denial Management', 'Insurance Follow-Up', 'Patient Billing & Collections', 'Reporting & Analytics', ].map((service) => (
            <div key={service} class="bg-white rounded-xl shadow-xl p-8 space-y-4 hover:shadow-glow transition-shadow duration-300 flex flex-col items-center text-center">
              <div class="text-4xl text-navy mb-3">{/* Placeholder Icon */}</div>
              <h3 class="text-xl font-semibold text-navy">{service}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section className="bg-slate-100">
      <div class="container mx-auto px-4 py-16 md:py-20">
        <h2 class="text-2xl md:text-3xl font-bold text-navy text-center mb-12">Benefits of Our Dental Billing Services</h2>
        <div class="grid md:grid-cols-3 gap-8">
          {[ { title: 'Increased Revenue', icon: '📈' }, { title: 'Faster Payments', icon: '⏱️' }, { title: 'Reduced Stress', icon: '😌' }, ].map((benefit) => (
            <div key={benefit.title} class="bg-white rounded-xl shadow-xl p-8 space-y-4 hover:shadow-blue-100 transition-shadow duration-300 flex flex-col items-center text-center">
              <div class="text-4xl mb-3">{benefit.icon}</div> {/* Using emoji as placeholder icon */}
              <h3 class="text-xl font-semibold text-navy">{benefit.title}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section class="bg-white">
      <div class="container mx-auto px-4 py-16 md:py-20">
        <h2 class="text-2xl md:text-3xl font-bold text-navy text-center mb-12">What Our Clients Say</h2>
        <div class="grid md:grid-cols-2 gap-8">
          <div class="bg-slate-50 rounded-xl shadow-lg p-8 space-y-4">
            <p class="text-gray-600 italic text-lg">"Since partnering with nGenius Pros for our dental billing, our collections have increased by 22% and our staff is much happier. Their team is responsive, professional, and truly understands the unique challenges of dental billing."</p>
            <div class="mt-4">
              <p class="font-semibold text-navy">Dr. Sarah Johnson</p>
              <p class="text-sm text-gray-500">Johnson Family Dental</p>
            </div>
          </div>
          <div class="bg-slate-50 rounded-xl shadow-lg p-8 space-y-4">
            <p class="text-gray-600 italic text-lg">"Our practice struggled with claim denials and aging accounts receivable for years. Within three months of working with nGenius Pros, our denial rate dropped from 15% to just 2%, and our average days in A/R went from 45 to 28. I only wish we'd found them sooner!"</p>
            <div class="mt-4">
              <p class="font-semibold text-navy">Dr. Michael Chen</p>
              <p class="text-sm text-gray-500">Bright Smile Dental Group</p>
            </div>
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

export default DentalBilling;
