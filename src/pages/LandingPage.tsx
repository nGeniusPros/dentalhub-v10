import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import * as Icons from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy/10 via-white to-turquoise/5 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Animated atoms */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-96 h-96"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
              opacity: [0.1, 0.2, 0.1],
              scale: [0.8, 1, 0.8],
              rotate: 360,
            }}
            transition={{
              duration: 20 + i * 2,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            <div className="w-full h-full bg-navy rounded-full opacity-[0.03]" />
          </motion.div>
        ))}

        {/* Gradient orbs */}
        <motion.div
          className="absolute w-[80rem] h-[80rem] bg-gradient-radial from-navy/10 to-transparent rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.2, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{
            top: '-30%',
            right: '-20%',
          }}
        />
        <motion.div
          className="absolute w-[60rem] h-[60rem] bg-gradient-radial from-turquoise/10 to-transparent rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{
            bottom: '-20%',
            left: '-10%',
          }}
        />
      </div>

      {/* Top Navigation */}
      <nav className="relative z-10 border-b border-navy/10 bg-white/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative w-12 h-12"
              >
                <motion.div
                  className="absolute inset-0"
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                >
                  <Icons.Atom className="w-full h-full text-navy" />
                </motion.div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-2xl font-bold bg-gradient-to-r from-navy via-purple to-turquoise text-transparent bg-clip-text"
              >
                NGenius Dental Dashboard
              </motion.div>
            </div>
            <div className="flex items-center gap-6">
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="#contact"
                className="text-navy hover:text-purple transition-colors font-medium"
              >
                Contact Us
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="tel:+1234567890"
                className="text-navy hover:text-navy/80 transition-colors"
              >
                Call Office
              </motion.a>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/login/patient')}
                className="px-6 py-3 bg-gradient-to-r from-navy via-purple to-turquoise text-white rounded-lg shadow-lg hover:shadow-xl transition-all font-semibold"
              >
                Request Appointment
              </motion.button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-4xl mx-auto mb-20 relative"
        >
          {/* Hero character illustration */}
          <motion.img 
            src="/illustrations/characters/charater style 2/5.png" 
            alt="Dental professional" 
            className="absolute -right-64 -top-20 h-96 -z-10 opacity-90 hidden lg:block"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 0.9, x: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          />
          
          <h1 className="text-7xl font-bold mb-8 bg-gradient-to-r from-navy via-purple to-turquoise text-transparent bg-clip-text leading-tight">
            Welcome to Your Dental Hub
          </h1>
          <p className="text-2xl text-gray-600 max-w-2xl mx-auto">
            Access your comprehensive dental care platform
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto"
        >
          {[
            {
              title: "Patient Portal",
              description: "Access your appointments, records, and treatment plans",
              icon: "User",
              path: "/login/patient",
              features: ["View Appointments", "Medical Records", "Billing History"],
              illustration: "/illustrations/auth/v2-login-light-border.png",
            },
            {
              title: "Staff Portal",
              description: "Manage patient care and daily operations",
              icon: "Users",
              path: "/login/staff",
              features: ["Patient Management", "Schedule Control", "Treatment Plans"],
              illustration: "/illustrations/auth/v2-register-light-border.png",
            },
            {
              title: "Admin Portal",
              description: "Complete practice management and oversight",
              icon: "Shield",
              path: "/login/admin",
              features: ["Practice Analytics", "Staff Management", "Financial Reports"],
              illustration: "/illustrations/auth/v2-two-steps-light-border.png",
            }
          ].map((portal, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -5, scale: 1.02 }}
              className="relative bg-white/90 backdrop-blur-xl p-8 rounded-2xl shadow-lg border border-gray-light hover:border-turquoise/30 cursor-pointer group overflow-hidden transition-all duration-300"
              onClick={() => navigate(portal.path)}
            >
              {/* Background gradient effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-navy/5 via-purple/5 to-turquoise/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Illustration */}
              <motion.img 
                src={portal.illustration}
                alt={`${portal.title} illustration`}
                className="w-32 h-auto mx-auto mb-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              />
              
              <motion.div 
                className="relative w-16 h-16 mx-auto mb-4"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-navy via-purple to-turquoise rounded-xl opacity-80 group-hover:opacity-100 transition-opacity" />
                <div className="absolute inset-[1px] bg-white rounded-[11px] flex items-center justify-center">
                  {React.createElement(Icons[portal.icon as keyof typeof Icons], {
                    className: "w-8 h-8 text-navy"
                  })}
                </div>
              </motion.div>

              <h3 className="relative text-2xl font-bold mb-3 bg-gradient-to-r from-navy to-purple text-transparent bg-clip-text text-center">{portal.title}</h3>
              <p className="relative text-gray-600 mb-8 text-center">{portal.description}</p>

              <ul className="relative space-y-2 mb-6">
                {portal.features.map((feature, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + (i * 0.1) }}
                    className="flex items-center text-gray-600"
                  >
                    <Icons.CheckCircle className="w-4 h-4 mr-2 text-turquoise" />
                    {feature}
                  </motion.li>
                ))}
              </ul>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="relative w-full py-3 px-6 bg-gradient-to-r from-navy via-purple to-turquoise text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                Login
              </motion.button>
            </motion.div>
          ))}
        </motion.div>
        
        {/* Features section with illustrations */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-24 pt-16 border-t border-navy/10"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="relative">
              <motion.img 
                src="/illustrations/characters-with-objects/charaters w objects style 2/17.png" 
                alt="Dental professional with equipment" 
                className="w-full max-w-md mx-auto"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8, duration: 0.5 }}
              />
              <motion.img 
                src="/illustrations/objects/tree-2.png" 
                alt="Decorative element" 
                className="absolute -bottom-10 -left-10 w-32 opacity-70"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 0.7, y: 0 }}
                transition={{ delay: 1, duration: 0.5 }}
              />
            </div>
            
            <div>
              <motion.h2 
                className="text-4xl font-bold mb-6 bg-gradient-to-r from-navy to-purple text-transparent bg-clip-text"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9 }}
              >
                Experience Modern Dental Care
              </motion.h2>
              
              <motion.div 
                className="space-y-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
              >
                {[
                  { title: "Advanced Technology", icon: "Layers", description: "State-of-the-art equipment and digital innovations" },
                  { title: "Patient-Centered Care", icon: "Heart", description: "Personalized treatment plans tailored to your needs" },
                  { title: "Streamlined Processes", icon: "CheckCircle", description: "Easy scheduling and paperless workflows" },
                ].map((feature, index) => (
                  <div key={index} className="flex items-start p-4 bg-white/50 backdrop-blur-sm rounded-xl">
                    <div className="flex-shrink-0 mr-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-navy to-turquoise rounded-full flex items-center justify-center">
                        {React.createElement(Icons[feature.icon as keyof typeof Icons], {
                          className: "w-5 h-5 text-white"
                        })}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-navy">{feature.title}</h3>
                      <p className="text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </motion.div>
              
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="mt-8 px-8 py-3 bg-gradient-to-r from-navy to-purple text-white rounded-lg shadow-lg"
                onClick={() => navigate('/login/patient')}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
              >
                Request An Appointment
              </motion.button>
            </div>
          </div>
        </motion.div>
        
        {/* Testimonial section with hand illustration */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3 }}
          className="mt-24 text-center relative"
        >
          <motion.img 
            src="/images/hand-with-bulb-light.png" 
            alt="Innovation in dental care" 
            className="absolute -left-10 bottom-0 w-24 opacity-80 hidden lg:block"
            initial={{ opacity: 0, rotate: -20 }}
            animate={{ opacity: 0.8, rotate: 0 }}
            transition={{ delay: 1.5, duration: 0.6 }}
          />
          
          <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-navy via-purple to-turquoise text-transparent bg-clip-text">
            Trusted by Thousands of Patients
          </h2>
          
          <div className="max-w-4xl mx-auto p-8 bg-white/70 backdrop-blur-md rounded-2xl shadow-sm border border-gray-light">
            <p className="text-xl text-gray-600 italic mb-6">
              "The NGenius Dental Dashboard has completely transformed our experience at the dentist. 
              From booking appointments to viewing my records, everything is intuitive and seamless."
            </p>
            <div className="flex items-center justify-center space-x-2">
              <img 
                src="/illustrations/characters/charater style 2/13.png" 
                alt="Patient testimonial" 
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="text-left">
                <p className="font-semibold text-navy">Sarah Johnson</p>
                <p className="text-sm text-gray-dark">Patient since 2023</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Additional decorative elements */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white/50 to-transparent pointer-events-none" />
      <div className="absolute top-1/4 right-0 w-64 h-64 bg-gradient-radial from-gold/10 to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-1/3 left-0 w-96 h-96 bg-gradient-radial from-purple/10 to-transparent rounded-full blur-3xl" />
    </div>
  );
};

export default LandingPage;