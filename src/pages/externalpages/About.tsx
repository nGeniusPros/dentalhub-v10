import React from 'react';
import ExternalLayout from '@/components/external/ExternalLayout';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Lightbulb, Shield, Award, Users, Image as ImageIcon, Check as LucideCheck } from 'lucide-react';

const About = () => (
  <ExternalLayout>
    <section className="bg-gradient-to-r from-teal-500 via-cyan-500 to-sky-600 text-white">
      <div className="container mx-auto px-4 py-16 md:py-24 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">About nGenius Pros</h1>
        <p className="text-lg md:text-xl text-gray-100 max-w-3xl mx-auto">Transforming Dental Practice Management</p>
        <p className="text-lg md:text-xl text-gray-100 max-w-3xl mx-auto">We're on a mission to help dental practices thrive by streamlining operations, maximizing revenue, and enhancing patient care.</p>
      </div>
    </section>

    {/* Our Story Section */}
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
          <div className="md:w-1/2 space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-navy mb-6">Our Story</h2>
            <p className="text-gray-700 leading-relaxed">
              Founded in 2022, nGenius Pros emerged from a simple observation: dental practices were spending too much time on administrative tasks and not enough time with patients.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Our founder, Dr. Michael Johnson, experienced these challenges firsthand in his own dental practice. After implementing innovative solutions that transformed his practice's efficiency and profitability, he decided to share these systems with other dental professionals.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Today, nGenius Pros offers comprehensive solutions for dental practices of all sizes, from solo practitioners to large DSOs. Our integrated approach to dental billing, recruiting, consulting, and practice management software helps practices streamline operations, maximize revenue, and focus on what matters most: providing exceptional patient care.
            </p>
          </div>
          <div className="md:w-1/2">
            <div className="bg-slate-200 rounded-lg aspect-square w-full max-w-md mx-auto flex items-center justify-center">
              <ImageIcon size={64} className="text-slate-400" />
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* Our Mission & Values Section */}
    <section className="py-16 md:py-24 bg-slate-50">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">Our Mission & Values</h2>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-12 md:mb-16">
          To empower dental practices with innovative solutions that streamline operations, maximize revenue, and enhance patient care, allowing dental professionals to focus on what they do best.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[{
            icon: Lightbulb,
            title: 'Innovation',
            description: 'We continuously seek new and better ways to solve dental practice challenges.',
            bgColor: 'bg-teal-500',
          }, {
            icon: Shield,
            title: 'Integrity',
            description: 'We operate with transparency, honesty, and the highest ethical standards.',
            bgColor: 'bg-sky-500',
          }, {
            icon: Award,
            title: 'Excellence',
            description: 'We strive for exceptional quality in everything we do.',
            bgColor: 'bg-indigo-500',
          }, {
            icon: Users,
            title: 'Partnership',
            description: 'We build lasting relationships with our clients based on mutual success.',
            bgColor: 'bg-purple-500',
          }].map((value, index) => (
            <div key={index} className="bg-white p-6 md:p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col items-center text-center">
              <div className={`p-4 rounded-full ${value.bgColor} text-white mb-4 inline-block`}>
                <value.icon size={32} />
              </div>
              <h3 className="text-xl font-semibold text-navy mb-2">{value.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{value.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Meet Our Leadership Team Section */}
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-navy mb-12 md:mb-16">Meet Our Leadership Team</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
          {[{
            name: 'Natasha Blake',
            title: 'Founder',
            bio: 'With 30 years of experience in frontend and backend dental consulting and practice management, Natasha brings unparalleled expertise to help dental practices thrive.',
            imagePlaceholder: true
          }, {
            name: 'Michael Bady',
            title: 'Co-Founder',
            bio: 'Finance professional with extensive experience in marketing and AI consulting. Michael specializes in AI automation solutions that revolutionize dental practice operations.',
            imagePlaceholder: true
          }, {
            name: 'Jay Kazen',
            title: 'VP of Recruiting',
            bio: 'With 25 years of experience in dental, medical, and governmental recruiting, Jay brings exceptional talent acquisition expertise to help practices build world-class teams.',
            imagePlaceholder: true
          }].map((member, index) => (
            <div key={index} className="bg-slate-50 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col items-center text-center">
              <div className="w-32 h-32 bg-slate-300 rounded-full mb-4 flex items-center justify-center">
                <ImageIcon size={48} className="text-slate-500" />
              </div>
              <h3 className="text-xl font-semibold text-navy mb-1">{member.name}</h3>
              <p className="text-teal-600 font-medium text-sm mb-3">{member.title}</p>
              <p className="text-gray-600 text-sm leading-relaxed">{member.bio}</p>
            </div>
          ))}
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

export default About;

