import React from 'react';
import ExternalLayout from '@/components/external/ExternalLayout';
import { Button } from '@/components/ui/button';
import { Briefcase, Users, Smile, TrendingUp, CheckCircle, Award, Clock, UsersRound, FileText, MessageSquare, Handshake, Gift } from 'lucide-react'; // Example icons

const whyWorkWithUsItems = [
  {
    icon: <Award className="w-8 h-8 text-navy" />,
    title: 'Competitive Compensation',
    description: 'We offer competitive salaries, comprehensive benefits, and performance-based bonuses to reward your hard work.',
  },
  {
    icon: <TrendingUp className="w-8 h-8 text-navy" />,
    title: 'Professional Development',
    description: 'Continuous learning opportunities, mentorship programs, and clear career advancement paths.',
  },
  {
    icon: <Clock className="w-8 h-8 text-navy" />,
    title: 'Work-Life Balance',
    description: 'Flexible work arrangements, generous PTO, and a culture that respects your personal time.',
  },
  {
    icon: <UsersRound className="w-8 h-8 text-navy" />,
    title: 'Collaborative Culture',
    description: 'Work with a diverse team of experts in a supportive, innovative environment where your ideas can make an impact.',
  },
];

const jobOpenings = [
  {
    title: 'Orthodontist',
    location: 'Nationwide',
    type: 'Full time',
    experience: 'DDS/DMD + Orthodontic Residency or equivalent',
    description: 'Join our nationwide network as a skilled Orthodontist, providing comprehensive orthodontic treatment and creating beautiful smiles.',
  },
  {
    title: 'Periodontist',
    location: 'Nationwide',
    type: 'Full time',
    experience: 'DDS/DMD + Periodontic Residency or equivalent',
    description: 'Seeking a dedicated Periodontist to deliver specialized gum care and implant dentistry within our expanding nationwide practices.',
  },
  {
    title: 'Oral and Maxillofacial Surgeon',
    location: 'Nationwide',
    type: 'Full time',
    experience: 'DDS/DMD + Surgical Residency or equivalent',
    description: 'Opportunity for an experienced Oral and Maxillofacial Surgeon to perform a wide range of surgical procedures across our national network.',
  },
  {
    title: 'Dental Assistant',
    location: 'Nationwide',
    type: 'Full time',
    experience: 'Dental Assisting Certification or relevant experience',
    description: 'Provide exceptional chairside support to dental professionals, ensuring a smooth patient experience in our nationwide clinics.',
  },
  {
    title: 'Dental Biller',
    location: 'Nationwide',
    type: 'Full time',
    experience: 'Experience in dental billing and coding required',
    description: 'Manage patient accounts, insurance claims, and billing processes efficiently for our dental practices nationwide.',
  },
  {
    title: 'Outside Marketer (Dental Practice)',
    location: 'Nationwide',
    type: 'Full time',
    experience: 'Proven marketing experience, preferably in healthcare',
    description: 'Develop and implement innovative marketing strategies to attract new patients and promote our dental services on a national scale.',
  },
  {
    title: 'Office Manager',
    location: 'Nationwide',
    type: 'Full time',
    experience: 'Experience in dental office management preferred',
    description: 'Oversee the daily operations of our dental offices nationwide, ensuring efficiency, staff coordination, and excellent patient service.',
  },
  {
    title: 'Receptionist/Front Desk',
    location: 'Nationwide',
    type: 'Full time',
    experience: 'Customer service experience, dental office experience a plus',
    description: 'Be the welcoming face of our dental practices nationwide, managing appointments, patient inquiries, and administrative tasks.',
  },
  {
    title: 'Dental Hygienist',
    location: 'Nationwide',
    type: 'Full time',
    experience: 'Registered Dental Hygienist (RDH) license required',
    description: 'Provide comprehensive dental hygiene care, patient education, and preventive services in our modern practices across the nation.',
  },
  {
    title: 'Associate Dentist',
    location: 'Nationwide',
    type: 'Full time',
    experience: 'DDS/DMD from an accredited dental school',
    description: 'Join our team of dental professionals as an Associate Dentist, delivering high-quality general dentistry services to diverse patient populations nationwide.',
  },
  {
    title: 'Registered Dental Assistant',
    location: 'Nationwide',
    type: 'Full time',
    experience: 'Registered Dental Assistant (RDA) certification',
    description: 'Support dental procedures and patient care as a Registered Dental Assistant, contributing to a positive and efficient clinical environment nationwide.',
  },
  {
    title: 'Remote Treatment Plan Coordinator',
    location: 'Nationwide',
    type: 'Full time',
    experience: 'Experience in dental treatment planning and patient communication',
    description: 'Work remotely to coordinate dental treatment plans, communicate with patients, and ensure seamless care progression for our nationwide client base.',
  },
];

const applicationProcessSteps = [
  { number: 1, title: 'Application', description: 'Submit your resume and complete a brief questionnaire about your experience and interests.', icon: <FileText className="w-10 h-10 text-navy" /> },
  { number: 2, title: 'Initial Interview', description: 'A 20-minute video call with our recruiting team to discuss your background and the role.', icon: <MessageSquare className="w-10 h-10 text-navy" /> },
  { number: 3, title: 'Team Interview', description: 'Meet with potential team members and managers to discuss skills and cultural fit.', icon: <Users className="w-10 h-10 text-navy" /> },
  { number: 4, title: 'Offer', description: 'Successful candidates receive a comprehensive offer and onboarding plan.', icon: <Gift className="w-10 h-10 text-navy" /> },
];

const Careers = () => (
  <ExternalLayout>
    {/* Hero Section */}
    <section className="bg-gradient-to-r from-teal-500 to-blue-600 text-white py-20 px-4 text-center">
      <div className="container mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Join Our Team</h1>
        <p className="text-lg md:text-xl mb-2">Help Transform Dental Practices</p>
        <p className="text-md md:text-lg max-w-2xl mx-auto">At nGenius Pros, we're looking for talented individuals who are passionate about helping dental practices thrive. Join our team and make a real difference in the dental industry.</p>
      </div>
    </section>

    {/* Why Work With Us Section */}
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-navy text-center mb-12">Why Work With Us</h2>
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            {whyWorkWithUsItems.map((item, index) => (
              <div key={index} className="flex items-start space-x-4">
                <div className="flex-shrink-0 p-2 bg-navy-light/10 rounded-full">
                  {item.icon}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-navy mb-1">{item.title}</h3>
                  <p className="text-gray-darker">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="hidden md:block bg-gray-200 h-96 rounded-lg flex items-center justify-center">
            {/* Placeholder for an image or graphic */}
            <Smile className="w-32 h-32 text-gray-400" />
            <p className="text-gray-500 mt-4">Inspiring Work Environment</p>
          </div>
        </div>
      </div>
    </section>

    {/* Current Openings Section */}
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-navy text-center mb-12">Current Openings</h2>
        <p className="text-center text-gray-darker mb-12 max-w-xl mx-auto">Explore our current job opportunities and find a role where your skills and passion can make a difference.</p>
        {jobOpenings.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {jobOpenings.map((job, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-lg hover:shadow-glow transition-shadow flex flex-col">
                <h3 className="text-xl font-semibold text-navy mb-2">{job.title}</h3>
                <div className="text-sm text-gray-600 space-y-1 mb-3">
                  <p><Briefcase className="w-4 h-4 inline mr-2 text-gray-500" />{job.location}</p>
                  <p><Clock className="w-4 h-4 inline mr-2 text-gray-500" />{job.type}</p>
                  <p><CheckCircle className="w-4 h-4 inline mr-2 text-gray-500" />{job.experience}</p>
                </div>
                <p className="text-gray-darker text-sm mb-4 flex-grow">{job.description}</p>
                <Button className="bg-navy text-white hover:bg-navy-light w-full mt-auto">Apply Now</Button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-darker">No current openings. Please check back later.</p>
        )}
        <div className="text-center mt-12">
          <p className="text-gray-darker mb-4">Don't see a position that matches your skills? We're always looking for talented individuals to join our team.</p>
          <Button className="bg-navy text-white hover:bg-navy-light">Submit Your Resume</Button>
        </div>
      </div>
    </section>

    {/* Our Application Process Section */}
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-navy text-center mb-12">Our Application Process</h2>
        <p className="text-center text-gray-darker mb-12 max-w-xl mx-auto">We've designed a straightforward application process to help us find the right candidates while respecting your time.</p>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {applicationProcessSteps.map((step) => (
            <div key={step.number} className="text-center p-6 bg-white rounded-xl shadow-lg">
              <div className="flex justify-center mb-4">
                <div className="bg-navy-light/10 p-3 rounded-full">
                  {step.icon}
                </div>
              </div>
              <p className="text-lg font-semibold text-navy mb-1">Step {step.number}</p>
              <h3 className="text-xl font-bold text-navy mb-2">{step.title}</h3>
              <p className="text-gray-darker text-sm">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Ready to Join CTA Section */}
    <section className="relative py-20 md:py-28 px-4 overflow-hidden bg-gradient-to-r from-navy via-purple to-turquoise">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-4 text-white">Ready to Join Our Team?</h2>
        <p className="text-lg mb-8 max-w-xl mx-auto text-white">Explore our current openings and take the first step toward a rewarding career helping dental practices thrive.</p>
        <Button variant="outline" className="bg-white text-navy hover:bg-gray-100 font-semibold py-3 px-6 text-lg">View All Openings</Button>
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

export default Careers;

