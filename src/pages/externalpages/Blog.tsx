import React from 'react';
import ExternalLayout from '@/components/external/ExternalLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Link, useParams } from 'react-router-dom';
import { Check as LucideCheck, CalendarDays, Tag, ArrowRight } from 'lucide-react';

const categories = [
  { name: 'AI in Dentistry', slug: 'ai-in-dentistry' },
  { name: 'Practice Management', slug: 'practice-management' },
  { name: 'Staff Well-being', slug: 'staff-well-being' },
  { name: 'Patient Communication', slug: 'patient-communication' },
  { name: 'Dental KPIs', slug: 'dental-kpis' },
  { name: 'Compliance', slug: 'compliance' },
  { name: 'Technology', slug: 'technology' },
  { name: 'Financial Health', slug: 'financial-health' },
  { name: 'Practice Growth', slug: 'practice-growth' },
  { name: 'Patient Experience', slug: 'patient-experience' },
];

const samplePosts = [
  {
    slug: 'unspoken-crisis-ai-staff-retention',
    imagePlaceholder: true,
    categorySlugs: ['staff-well-being', 'practice-management'], // Changed from categories to categorySlugs
    title: 'The Unspoken Crisis: Why Dental Practices Are Losing Staff (And What AI Can Do About It)',
    excerpt: 'The dental industry is facing unprecedented staff turnover rates. Discover the counter-intuitive approach that’s helping practices retain talent while improving patient care.',
    date: 'May 5, 2025',
  },
  {
    slug: 'beyond-hype-5-ways-ai-transforming-dentistry',
    imagePlaceholder: true,
    categorySlugs: ['ai-in-dentistry', 'practice-management'], // Changed
    title: 'Beyond the Hype: 5 Ways AI Is Actually Transforming Dental Practices Today',
    excerpt: 'Cut through the noise and discover the practical applications of AI that are delivering real results for dental practices right now.',
    date: 'May 5, 2025',
  },
  {
    slug: 'paradox-dental-kpis-tracking-less',
    imagePlaceholder: true,
    categorySlugs: ['dental-kpis', 'practice-management'], // Changed
    title: 'The Paradox of Dental KPIs: Why Tracking More Metrics Is Making Your Practice Less Efficient',
    excerpt: 'Most practices are drowning in data but starving for insights. Learn which KPIs actually matter and how AI can help you focus on what drives real growth.',
    date: 'April 30, 2025',
  },
  {
    slug: 'communication-blind-spot-patients-not-hearing',
    imagePlaceholder: true,
    categorySlugs: ['patient-communication', 'practice-growth'], // Changed
    title: 'The Communication Blind Spot: Why Your Patients Aren’t Hearing What You Think You’re Saying',
    excerpt: 'Discover the surprising disconnect in dental patient communication and how AI-powered insights are helping practices bridge the gap.',
    date: 'April 25, 2025',
  },
  {
    slug: 'compliance-without-compromise-ai-trade-off',
    imagePlaceholder: true,
    categorySlugs: ['compliance', 'practice-management'], // Changed
    title: 'Compliance Without Compromise: How AI Is Eliminating the Trade-Off Between Regulation and Efficiency',
    excerpt: 'Regulatory compliance doesn’t have to come at the expense of practice efficiency. Learn how AI is helping practices stay compliant while improving workflows.',
    date: 'April 20, 2025',
  },
  {
    slug: 'hidden-cost-dental-software-paying-more-less',
    imagePlaceholder: true,
    categorySlugs: ['practice-management', 'technology'], // Changed
    title: 'The Hidden Cost of Dental Software: Why You’re Paying More for Less (And What to Do About It)',
    excerpt: 'Traditional dental software pricing models are costing practices more than they realize. Discover the transparent alternative that’s disrupting the industry.',
    date: 'April 15, 2025',
  },
];

const Blog = () => {
  const { categorySlug } = useParams<{ categorySlug?: string }>();

  const filteredPosts = categorySlug
    ? samplePosts.filter(post => post.categorySlugs.includes(categorySlug))
    : samplePosts;

  let pageTitle = "Blog | nGenius Pros";
  let articlesTitle = "Latest Articles";
  let metaDescription = "Insights, strategies, and counter-intuitive approaches to help your dental practice thrive.";

  if (categorySlug) {
    const category = categories.find(c => c.slug === categorySlug);
    if (category) {
      articlesTitle = `Articles in: ${category.name}`;
      pageTitle = `${category.name} Blog | nGenius Pros`;
      metaDescription = `Read the latest articles on ${category.name.toLowerCase()} from nGenius Pros.`;
    }
  }

  React.useEffect(() => {
    document.title = pageTitle;
    const metaDescTag = document.querySelector('meta[name="description"]');
    if (metaDescTag) {
      metaDescTag.setAttribute('content', metaDescription);
    }
  }, [pageTitle, metaDescription]);

  return (
  <ExternalLayout>
    {/* Hero Section */}
    <section className="bg-gradient-to-r from-teal-500 via-cyan-500 to-sky-600 text-white">
      <div className="container mx-auto px-4 py-16 md:py-24 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Insights & Perspectives for Modern Dental Practices</h1>
        <p className="text-lg md:text-xl text-gray-100 max-w-3xl mx-auto">Unconventional wisdom to help your practice thrive in a changing industry</p>
      </div>
    </section>

    {/* Main Content Area */}
    <section className="bg-slate-50">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
          {/* Sidebar */}
          <aside className="md:w-1/4 space-y-8">
            <div>
              <h2 className="text-xl font-semibold text-navy mb-4">Categories</h2>
              <ul className="space-y-2">
                {categories.map(category => (
                  <li key={category.slug}>
                    <Link 
                      to={`/blog/category/${category.slug}`}
                      className={`block px-3 py-1.5 rounded-md text-sm transition-colors duration-200 ${
                        categorySlug === category.slug 
                          ? 'bg-teal-100 text-teal-700 font-semibold' 
                          : 'text-gray-700 hover:bg-teal-50 hover:text-teal-600'
                      }`}
                    >
                      {category.name}
                    </Link>
                  </li>
                ))}
                {categorySlug && (
                  <li className="mt-3">
                    <Link 
                      to="/blog"
                      className="block px-3 py-1.5 rounded-md text-sm text-teal-600 hover:bg-teal-50 hover:text-teal-700 font-medium"
                    >
                      View All Articles
                    </Link>
                  </li>
                )}
              </ul>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-navy mb-3">Subscribe to Our Newsletter</h2>
              <p className="text-sm text-gray-600 mb-4">Get the latest insights and updates delivered to your inbox.</p>
              <form className="space-y-3">
                <Input type="email" placeholder="Your email address" className="w-full" />
                <Button type="submit" className="w-full bg-navy text-white hover:bg-navy-light transition-colors duration-200">Subscribe</Button>
              </form>
            </div>
          </aside>

          {/* Articles Grid */}
          <main className="md:w-3/4">
            <h2 className="text-3xl font-bold text-navy mb-2">{articlesTitle}</h2>
            {!categorySlug && <p className="text-gray-600 mb-8">Insights, strategies, and counter-intuitive approaches to help your dental practice thrive.</p>}
            {categorySlug && filteredPosts.length > 0 && <p className="text-gray-600 mb-8">Explore articles related to {categories.find(c=>c.slug === categorySlug)?.name || 'the selected category'}.</p>}
            
            {filteredPosts.length > 0 ? (
              <div className="grid sm:grid-cols-1 lg:grid-cols-2 gap-8">
                {filteredPosts.map(post => (
                <article key={post.slug} className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col hover:shadow-xl transition-shadow duration-300">
                  {post.imagePlaceholder && (
                    <div className="w-full h-48 bg-gray-300 flex items-center justify-center text-gray-500">
                      {/* Placeholder for Blog Post Image */}
                      <span>Blog Post Image</span>
                    </div>
                  )}
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="mb-3">
                      {post.categorySlugs.map(slug => {
                        const category = categories.find(c => c.slug === slug);
                        return category ? (
                          <Link key={slug} to={`/blog/category/${slug}`} className="inline-block bg-teal-100 text-teal-700 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded-full hover:bg-teal-200 transition-colors">
                            {category.name}
                          </Link>
                        ) : null;
                      })}
                    </div>
                    <h3 className="text-xl font-semibold text-navy mb-2 hover:text-teal-600 transition-colors duration-200">
                      <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 flex-grow">{post.excerpt}</p>
                    <div className="flex justify-between items-center text-xs text-gray-500 mt-auto">
                      <span className="flex items-center">
                        <CalendarDays className="w-4 h-4 mr-1.5" />
                        {post.date}
                      </span>
                      <Link to={`/blog/${post.slug}`} className="text-teal-600 hover:text-teal-700 font-semibold flex items-center">
                        Read more <ArrowRight className="w-4 h-4 ml-1" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
            ) : (
              <div className="text-center py-10 px-6 bg-white rounded-lg shadow-md">
                <Tag size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-navy mb-2">No Articles Found</h3>
                <p className="text-gray-600 mb-6">
                  There are no articles matching your current selection. Try a different category or view all articles.
                </p>
                <Button asChild variant="outline">
                  <Link to="/blog">View All Articles</Link>
                </Button>
              </div>
            )}

            {/* Pagination Placeholder - only show if not filtered or if filtered results are many */}
            {(!categorySlug || filteredPosts.length > 4) && filteredPosts.length > 0 && (
              <div className="text-center mt-12">
                <Button variant="outline" className="border-navy text-navy hover:bg-navy-light hover:text-white transition-colors duration-200 px-8 py-3">
                  Load More Articles
                </Button>
              </div>
            )}
          </main>
        </div>
      </div>
    </section>

    {/* Newsletter Opt-in CTA Section */}
    <section className="relative py-20 md:py-28 px-4 overflow-hidden bg-gradient-to-r from-navy via-purple to-turquoise">
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
          Want More In-Depth Insights?
        </h2>
        <p className="text-white/80 text-lg max-w-2xl mx-auto mb-8">
          Subscribe to the DentalHub newsletter and receive exclusive content, expert analysis, and actionable strategies directly to your inbox. Stay ahead of the curve in the ever-evolving dental industry.
        </p>
        <form className="max-w-lg mx-auto flex flex-col sm:flex-row gap-4 items-center justify-center">
          <Input 
            type="email" 
            placeholder="Enter your email address"
            className="flex-grow bg-white/90 text-gray-800 placeholder-gray-500 border-transparent focus:ring-2 focus:ring-white focus:border-transparent"
            aria-label="Email for newsletter"
          />
          <Button 
            type="submit" 
            size="lg" 
            className="bg-white text-blue-700 hover:bg-gray-100 font-semibold w-full sm:w-auto transition-colors duration-200"
          >
            Subscribe Now
          </Button>
        </form>
        <div className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-3 text-white/90 text-sm">
          <div className="flex items-center">
            <LucideCheck className="mr-1.5 h-4 w-4 text-green-400" />
            <span>Exclusive Articles & Guides</span>
          </div>
          <div className="flex items-center">
            <LucideCheck className="mr-1.5 h-4 w-4 text-green-400" />
            <span>Early Access to New Features</span>
          </div>
          <div className="flex items-center">
            <LucideCheck className="mr-1.5 h-4 w-4 text-green-400" />
            <span>Actionable Practice Tips</span>
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
};

export default Blog;
