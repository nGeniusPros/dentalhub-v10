import { Link } from 'react-router-dom';
import { Button } from '../ui/button';
import { useState } from 'react'; // Import useState

// Type definitions for Navbar links
interface StandardLink {
  label: string;
  to: string;
  isDropdown?: false;
}

interface DropdownMenu {
  label: string;
  isDropdown: true;
  subLinks: Array<{ to: string; label: string }>;
  to?: undefined;
}

type LinkEntry = StandardLink | DropdownMenu;

// Updated links structure
const links: LinkEntry[] = [
  { to: '/#how-it-works', label: 'How It Works' },
  { to: '/#features', label: 'Features' },
  {
    label: 'Services',
    isDropdown: true,
    subLinks: [
      { to: '/services/dental-billing', label: 'Dental Billing' },
      { to: '/services/dental-consulting', label: 'Dental Consulting' },
      { to: '/services/dental-recruiting', label: 'Dental Recruiting' },
    ],
  },
  { to: '/resources', label: 'Resources' },
  { to: '/blog', label: 'Blog' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
  { to: '/careers', label: 'Careers' },
];

export const NavBar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Function to render links in mobile menu, handling dropdowns
  const renderMobileLink = (linkItem: LinkEntry, index: number) => {
    if (linkItem.isDropdown) {
      return (
        <div key={`${linkItem.label}-${index}`}>
          <span className="block px-3 py-2 rounded-md text-base font-medium text-gray-700">
            {linkItem.label}
          </span>
          {linkItem.subLinks.map(subLink => (
            <Link
              key={subLink.to}
              to={subLink.to}
              className="block pl-6 pr-3 py-2 rounded-md text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              onClick={toggleMobileMenu} // Close menu on link click
            >
              {subLink.label}
            </Link>
          ))}
        </div>
      );
    } else {
      // Handle hash links for mobile as well
      if (linkItem.label === 'How It Works' || linkItem.label === 'Features') {
        return (
            <a 
              key={`${linkItem.label}-${index}`} 
              href={linkItem.to} 
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900"
              onClick={toggleMobileMenu} // Close menu on link click
            >
              {linkItem.label}
            </a>
        );
      }
      return (
        <Link
          key={`${linkItem.label}-${index}`}
          to={linkItem.to}
          className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900"
          onClick={toggleMobileMenu} // Close menu on link click
        >
          {linkItem.label}
        </Link>
      );
    }
  };

  return (
    <nav className="bg-white shadow">
      <div className="container mx-auto px-4"> {/* Adjusted padding for h-16 consistency */}
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
        <Link to="/" className="flex items-center">
          <img src="/logos/ngeniuslogo.png" alt="nGenius Pros Logo" className="h-10" /> {/* Adjust height as needed */}
        </Link>

        {/* Navigation Links - Centered */}
        <div className="hidden md:flex flex-grow justify-center items-center space-x-6">
          {links.map((linkItem: LinkEntry) => {
            if (linkItem.isDropdown) {
              // This is DropdownMenu, linkItem.subLinks is available
              return (
                <div key={linkItem.label} className="relative group">
                  <span className="text-gray-darker hover:text-navy cursor-pointer flex items-center py-2">
                    {linkItem.label}
                    <svg className="ml-1 h-4 w-4 fill-current text-gray-darker group-hover:text-navy" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                  </span>
                  <div className="absolute left-0 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 hidden group-hover:block z-20">
                    <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                      {linkItem.subLinks.map(subLink => (
                        <Link
                          key={subLink.to}
                          to={subLink.to}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full text-left"
                          role="menuitem"
                        >
                          {subLink.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              );
            } else {
              // This is StandardLink, linkItem.to is a string
              if (linkItem.label === 'How It Works' || linkItem.label === 'Features') {
                return (
                  <a key={linkItem.label} href={linkItem.to} className="text-gray-darker hover:text-navy">
                    {linkItem.label}
                  </a>
                );
              }
              return (
                <Link key={linkItem.label} to={linkItem.to} className="text-gray-darker hover:text-navy">
                  {linkItem.label}
                </Link>
              );
            }
          })}
        </div>

        {/* Consultation Button */}
        <div className="hidden md:flex items-center">
          <Button 
            className="bg-gradient-to-r from-turquoise to-navy text-white px-6 py-2 rounded-lg shadow hover:opacity-90 transition-opacity" // Added some padding, rounding, and hover effect
            asChild
          >
            <Link to="/consultation">Schedule a Free Consultation</Link>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <button
            onClick={toggleMobileMenu}
            type="button"
            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-navy"
            aria-controls="mobile-menu"
            aria-expanded={isMobileMenuOpen}
          >
            <span className="sr-only">Open main menu</span>
            {/* Hamburger Icon */}
            {!isMobileMenuOpen ? (
              <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            ) : (
              // Close Icon
              <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {links.map(renderMobileLink)}
            {/* Mobile Consultation Button */}
            <div className="mt-3">
                <Button
                    className="w-full bg-gradient-to-r from-turquoise to-navy text-white px-6 py-2 rounded-lg shadow hover:opacity-90 transition-opacity"
                    asChild
                    onClick={toggleMobileMenu} // Close menu on click
                >
                    <Link to="/consultation">Schedule a Free Consultation</Link>
                </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
