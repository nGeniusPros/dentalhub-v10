import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../config/auth';
import { useAuth } from '../../contexts/AuthContext';
import { motion } from 'framer-motion';

const AdminLogin = () => {
  const { isLoading: authLoading } = useAuth();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError("Email and password are required.");
      return;
    }
    setError(null);
    setLoading(true);

    try {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (authError) throw authError;

      navigate('/admin-dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during sign in');
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1B2B85]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-navy/5 via-white to-gray-lighter">
      <motion.div 
        className="flex w-full max-w-4xl bg-white rounded-xl shadow-glow overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Illustration Section */}
        <div className="hidden md:flex md:w-1/2 bg-gradient-corporate items-center justify-center p-8 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-navy via-navy-light to-navy-lighter opacity-80"></div>
          <div className="absolute inset-0 opacity-20">
            {[...Array(5)].map((_, i) => (
              <div 
                key={i} 
                className="absolute rounded-full bg-white/10"
                style={{
                  width: `${Math.random() * 100 + 50}px`,
                  height: `${Math.random() * 100 + 50}px`,
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  animation: `pulse ${Math.random() * 10 + 10}s infinite`,
                }}
              />
            ))}
          </div>
          <img 
            src="/illustrations/auth/v2-login-dark.png" 
            alt="Admin Login" 
            className="max-w-full max-h-80 object-contain relative z-10"
          />
        </div>
        
        {/* Form Section */}
        <div className="w-full md:w-1/2 p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-navy mb-2">Admin Login</h1>
            <p className="text-gray-darker">Welcome back! Please sign in to continue.</p>
          </div>
          
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-200 text-red-500 rounded-lg">
              {error}
            </div>
          )}
          
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-darker mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="w-full p-3 border border-gray-light rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-darker mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="w-full p-3 border border-gray-light rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent"
              />
            </div>
            
            <motion.button 
              type="submit" 
              className="mt-4 p-3 bg-gradient-corporate text-white rounded-lg transition-all shadow hover:shadow-lg"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? 'Logging in...' : 'Login'}
            </motion.button>
            
            <div className="mt-4 text-center">
              <a href="#" className="text-navy hover:underline text-sm">
                Forgot password?
              </a>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;