import React from 'react';
import ExternalLayout from '@/components/external/ExternalLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link } from 'react-router-dom';
import { LucideCheck, FileText, BookOpen, Video, Settings2, BarChart3, ChevronRight } from 'lucide-react'; // Added ChevronRight

const sidebarCategories = [
  { name: 'AI & Technology in Dentistry', slug: 'ai-technology-dentistry' },
  { name: 'Enhancing Practice Well-being & Efficiency', slug: 'practice-well-being-efficiency' },
  { name: 'Optimizing Financial Health & KPIs', slug: 'financial-health-kpis' },
  { name: 'Elevating Patient Relationships & Communication', slug: 'patient-relationships-communication' },
  { name: 'Ensuring Compliance & Peace of Mind', slug: 'compliance-peace-of-mind' },
  { name: 'Getting Started with nGenius Pros', slug: 'getting-started-ngenius-pros' },
];

const contentTypes = [
  { name: 'White Paper', slug: 'white-paper' },
  { name: 'Ebook', slug: 'ebook' },
  { name: 'Guide', slug: 'guide' },
  { name: 'Checklist', slug: 'checklist' },
  { name: 'Worksheet', slug: 'worksheet' },
  { name: 'Case Study', slug: 'case-study' },
  { name: 'Interactive Quiz', slug: 'interactive-quiz' },
];

const sampleResources = [
  {
    slug: 'decoding-dental-ai-guide',
    title: "Decoding Dental AI: A Practice Owner's Guide to Separating Transformative Technology from Trends",
    excerpt: 'A comprehensive guide to understanding which AI technologies actually deliver value for dental practices.',
    category: 'AI & Technology in Dentistry',
    categorySlug: 'ai-technology-dentistry',
    contentType: 'White Paper',
    imagePlaceholder: true,
    link: '/resources/decoding-dental-ai-guide.pdf',
    isFeatured: true,
  },
  {
    slug: 'burnout-epidemic-dentistry',
    title: 'The Burnout Epidemic in Dentistry: AI-Driven Strategies for a Healthier, More Productive Practice',
    excerpt: 'Discover how AI can help reduce staff burnout while improving practice productivity and patient care.',
    category: 'Enhancing Practice Well-being & Efficiency',
    categorySlug: 'practice-well-being-efficiency',
    contentType: 'Ebook',
    imagePlaceholder: true, // Assuming this one also has a placeholder
    link: '/resources/burnout-epidemic-dentistry.pdf',
    isFeatured: true,
  },
  {
    slug: 'rethinking-dental-practice-kpis',
    title: 'Rethinking Dental Practice KPIs: How AI Uncovers Hidden Opportunities for Growth and Well-being',
    excerpt: 'Learn which KPIs actually matter and how AI can help you focus on metrics that drive real growth.',
    category: 'Optimizing Financial Health & KPIs',
    categorySlug: 'financial-health-kpis',
    contentType: 'White Paper',
    imagePlaceholder: true,
    link: '/resources/rethinking-dental-kpis.pdf',
    isFeatured: false,
  },
  {
    slug: 'future-is-empathetic-ai-patient-relationships',
    title: 'The Future Is Empathetic: Leveraging AI to Build Stronger Patient Relationships',
    excerpt: 'Explore how AI can enhance patient communication while maintaining the human touch.',
    category: 'Elevating Patient Relationships & Communication',
    categorySlug: 'patient-relationships-communication',
    contentType: 'Ebook',
    imagePlaceholder: true,
    link: '/resources/ai-patient-relationships.pdf',
    isFeatured: false,
  },
  {
    slug: 'beyond-checklist-ai-compliance',
    title: 'Beyond the Checklist: Achieving True Peace of Mind with AI-Powered Compliance',
    excerpt: 'Discover how AI is transforming compliance from a burden to a competitive advantage.',
    category: 'Ensuring Compliance & Peace of Mind',
    categorySlug: 'compliance-peace-of-mind',
    contentType: 'White Paper',
    imagePlaceholder: true,
    link: '/resources/ai-compliance-peace-of-mind.pdf',
    isFeatured: false,
  },
  {
    slug: 'practical-guide-ai-workflows',
    title: 'A Practical Guide to Implementing AI-Driven Workflows in Your Dental Office',
    excerpt: 'Step-by-step guidance for successfully implementing AI solutions in your dental practice.',
    category: 'Getting Started with nGenius Pros',
    categorySlug: 'getting-started-ngenius-pros',
    contentType: 'Guide',
    imagePlaceholder: true,
    link: '/resources/practical-guide-ai-workflows.pdf',
    isFeatured: false,
  },
  {
    slug: '10-questions-ai-investment',
    title: '10 Questions to Ask Before Investing in AI for Your Dental Practice',
    excerpt: 'Essential questions to help you evaluate AI solutions and make informed decisions.',
    category: 'AI & Technology in Dentistry',
    categorySlug: 'ai-technology-dentistry',
    contentType: 'Checklist',
    imagePlaceholder: true,
    link: '/resources/10-questions-ai-investment.pdf',
    isFeatured: false,
  },
  {
    slug: 'pms-assessment-practice-stress',
    title: 'Self-Assessment: Is Your Current PMS Contributing to Practice Stress?',
    excerpt: 'Evaluate whether your current practice management system is helping or hurting your team’s wellbeing.',
    category: 'Enhancing Practice Well-being & Efficiency',
    categorySlug: 'practice-well-being-efficiency',
    contentType: 'Worksheet',
    imagePlaceholder: true,
    link: '/resources/pms-stress-assessment.pdf',
    isFeatured: false,
  },
];

const ResourceCard = ({ resource, isFeaturedCard = false }) => (
  <div
    className={`bg-white rounded-lg shadow-lg overflow-hidden flex flex-col ${isFeaturedCard ? 'hover:shadow-xl' : 'hover:shadow-md'} transition-shadow duration-300`}
  >
    <div className="relative aspect-video bg-gray-200 flex items-center justify-center">
      {/* Image Placeholder */}
      <FileText className="h-16 w-16 text-gray-400" /> {/* Generic placeholder icon */}
      {resource.contentType && (
        <span className="absolute top-2 right-2 bg-blue-600 text-white text-xs font-semibold px-2 py-1 rounded">
          {resource.contentType}
        </span>
      )}
    </div>
    <div className="p-4 md:p-6 flex-grow flex flex-col">
      <Link 
        to={`/resources/category/${resource.categorySlug}`}
        className="text-xs text-blue-600 hover:text-blue-800 font-semibold uppercase tracking-wide mb-1 inline-block"
      >
        {resource.category}
      </Link>
      <h3 className={`text-navy ${isFeaturedCard ? 'text-xl md:text-2xl' : 'text-lg md:text-xl'} font-semibold mb-2 leading-tight`}>
        <Link to={resource.link} target="_blank" rel="noopener noreferrer" className="hover:text-blue-700 transition-colors">
          {resource.title}
        </Link>
      </h3>
      <p className={`text-gray-600 ${isFeaturedCard ? 'text-sm md:text-base' : 'text-sm'} mb-4 line-clamp-3 flex-grow`}>
        {resource.excerpt}
      </p>
      <Button asChild variant="outline" className="w-full mt-auto border-blue-600 text-blue-600 hover:bg-blue-50 hover:text-blue-700 font-medium">
        <Link to={resource.link} target="_blank" rel="noopener noreferrer">
          {resource.contentType === 'Interactive Quiz' || resource.contentType === 'Worksheet' ? 'Start Now' : 'Download'}
        </Link>
      </Button>
    </div>
  </div>
);

const Resources = () => {
  const featuredResources = sampleResources.filter(r => r.isFeatured);
  const allOtherResources = sampleResources.filter(r => !r.isFeatured);

  return (
    <ExternalLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-teal-500 via-cyan-500 to-sky-600 text-white">
        <div className="container mx-auto px-4 py-16 md:py-20 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Unlock Your Practice Potential</h1>
          <p className="text-lg md:text-xl text-gray-100 max-w-3xl mx-auto">
            Insights & Tools from nGenius Pros to Transform Your Dental Practice
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="bg-slate-100">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            {/* Sidebar */}
            <aside className="lg:w-1/4 space-y-6">
              <div className="p-5 bg-white rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-navy mb-3">Categories</h3>
                <ul className="space-y-1.5">
                  {sidebarCategories.map((category) => (
                    <li key={category.slug}>
                      <Link
                        to={`/resources/category/${category.slug}`}
                        className="flex justify-between items-center text-sm text-gray-700 hover:text-blue-600 transition-colors duration-200 group"
                      >
                        {category.name}
                        <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-5 bg-white rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-navy mb-3">Content Types</h3>
                <ul className="space-y-1.5">
                  {contentTypes.map((type) => (
                    <li key={type.slug}>
                      <Link
                        to={`/resources/type/${type.slug}`}
                        className="flex justify-between items-center text-sm text-gray-700 hover:text-blue-600 transition-colors duration-200 group"
                      >
                        {type.name}
                        <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="p-6 bg-navy text-white rounded-lg shadow-md text-center">
                <h3 className="text-xl font-semibold mb-3">Need Custom Resources?</h3>
                <p className="text-sm text-gray-200 mb-4">
                  Contact our team for personalized resources tailored to your practice's specific needs.
                </p>
                <Button asChild className="bg-white text-navy hover:bg-gray-200 font-semibold w-full">
                  <Link to="/contact">Contact Us</Link>
                </Button>
              </div>
            </aside>

            {/* Resource Listing */}
            <main className="lg:w-3/4">
              {featuredResources.length > 0 && (
                <section className="mb-10 md:mb-12">
                  <h2 className="text-2xl md:text-3xl font-bold text-navy mb-6">Featured Resources</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                    {featuredResources.map((resource) => (
                      <ResourceCard key={resource.slug} resource={resource} isFeaturedCard={true} />
                    ))}
                  </div>
                </section>
              )}

              <section>
                <h2 className="text-2xl md:text-3xl font-bold text-navy mb-6">All Resources</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                  {allOtherResources.map((resource) => (
                    <ResourceCard key={resource.slug} resource={resource} />
                  ))}
                </div>
              </section>
              
              {/* Pagination (Optional - Placeholder) */}
              {allOtherResources.length > 6 && ( // Simple condition to show pagination
                <div className="mt-10 md:mt-12 text-center">
                  <Button variant="outline" className="border-navy text-navy hover:bg-navy-light hover:text-white transition-colors duration-200 px-8 py-3">
                    Load More Resources
                  </Button>
                </div>
              )}
            </main>
          </div>
        </div>
      </section>

      {/* Newsletter Opt-in CTA Section (using existing style) */}
      <section className="relative py-20 md:py-28 px-4 overflow-hidden bg-gradient-to-r from-navy via-purple to-turquoise">
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
            Stay Ahead with DentalHub Insights
          </h2>
          <p className="text-white/80 text-lg max-w-2xl mx-auto mb-8">
            Subscribe to our newsletter for the latest resources, expert analysis, and actionable strategies delivered directly to your inbox.
          </p>
          <form className="max-w-lg mx-auto flex flex-col sm:flex-row gap-4 items-center justify-center mb-8">
            <Input 
              type="email" 
              placeholder="Enter your email address"
              className="bg-white/90 text-navy placeholder-gray-500 flex-grow"
              aria-label="Email for newsletter"
            />
            <Button 
              type="submit" 
              size="lg"
              className="bg-white text-navy hover:bg-gray-200 font-semibold w-full sm:w-auto"
            >
              Subscribe Now
            </Button>
          </form>
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-white/90 text-sm">
            <div className="flex items-center">
              <LucideCheck className="h-5 w-5 mr-2 text-sky-300" />
              <span>Exclusive Content & Guides</span>
            </div>
            <div className="flex items-center">
              <LucideCheck className="h-5 w-5 mr-2 text-sky-300" />
              <span>Early Access to New Tools</span>
            </div>
            <div className="flex items-center">
              <LucideCheck className="h-5 w-5 mr-2 text-sky-300" />
              <span>Industry Trend Updates</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer (using existing style) */}
      <footer className="bg-navy text-gray-300 py-12 md:py-16 px-4">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-semibold text-white mb-4">DentalHub</h3>
            <p className="text-sm mb-4">
              Empowering dental practices with AI-driven solutions for unparalleled efficiency and patient care.
            </p>
            <div className="flex space-x-4">
              <a href="#" aria-label="Facebook" className="text-gray-400 hover:text-white"><svg fill="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-6 h-6" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path></svg></a>
              <a href="#" aria-label="Twitter" className="text-gray-400 hover:text-white"><svg fill="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-6 h-6" viewBox="0 0 24 24"><path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path></svg></a>
              <a href="#" aria-label="LinkedIn" className="text-gray-400 hover:text-white"><svg fill="currentColor" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0" className="w-6 h-6" viewBox="0 0 24 24"><path stroke="none" d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"></path><circle cx="4" cy="4" r="2" stroke="none"></circle></svg></a>
            </div>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="hover:text-white">About Us</Link></li>
              <li><Link to="/services" className="hover:text-white">Services</Link></li>
              <li><Link to="/blog" className="hover:text-white">Blog</Link></li>
              <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
              <li><Link to="/pricing" className="hover:text-white">Pricing</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/resources/faq" className="hover:text-white">FAQ</Link></li>
              <li><Link to="/resources/case-studies" className="hover:text-white">Case Studies</Link></li>
              <li><Link to="/resources/whitepapers" className="hover:text-white">Whitepapers</Link></li>
              <li><Link to="/support" className="hover:text-white">Support Center</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Contact Us</h4>
            <address className="text-sm not-italic">
              <p>123 Dental Ave, Suite 400</p>
              <p>Smile City, CA 90210</p>
              <p className="mt-2"><a href="tel:+18005551234" className="hover:text-white">P: (800) 555-1234</a></p>
              <p><a href="mailto:info@dentalhub.ai" className="hover:text-white">E: info@dentalhub.ai</a></p>
            </address>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-700 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} DentalHub.ai. All rights reserved.</p>
          <p className="mt-1">
            <Link to="/privacy-policy" className="hover:text-white">Privacy Policy</Link> | <Link to="/terms-of-service" className="hover:text-white">Terms of Service</Link>
          </p>
        </div>
      </footer>
    </ExternalLayout>
  );
};

export default Resources;
