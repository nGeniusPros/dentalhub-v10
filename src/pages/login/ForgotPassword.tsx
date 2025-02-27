import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { supabase } from '../../config/auth';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' | null }>({
    text: '',
    type: null
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setMessage({ text: "Email is required.", type: 'error' });
      return;
    }
    
    setMessage({ text: '', type: null });
    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/reset-password',
      });

      if (error) throw error;

      setMessage({ 
        text: "Password reset instructions sent to your email.", 
        type: 'success' 
      });
      setEmail('');
    } catch (err) {
      setMessage({ 
        text: err instanceof Error ? err.message : 'An error occurred', 
        type: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-lighter">
      <div className="flex w-full max-w-4xl bg-white rounded-xl shadow-glow overflow-hidden">
        {/* Illustration Section */}
        <div className="hidden md:flex md:w-1/2 bg-gold items-center justify-center p-8">
          <img 
            src="/illustrations/auth/v2-forgot-password-light.png" 
            alt="Forgot Password" 
            className="max-w-full max-h-80 object-contain"
          />
        </div>
        
        {/* Form Section */}
        <div className="w-full md:w-1/2 p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-navy mb-2">Forgot Password</h1>
            <p className="text-gray-darker">Enter your email to receive password reset instructions</p>
          </div>
          
          {message.text && (
            <div className={`mb-4 p-3 rounded-lg ${
              message.type === 'error' 
                ? 'bg-red-100 border border-red-200 text-red-500' 
                : 'bg-green-100 border border-green-200 text-green-600'
            }`}>
              {message.text}
            </div>
          )}
          
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-darker mb-1">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Icons.Mail size={18} className="text-gray-dark" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="w-full pl-10 p-3 border border-gray-light rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent"
                />
              </div>
            </div>
            
            <motion.button 
              type="submit" 
              className="mt-4 p-3 bg-gold text-white rounded-lg hover:bg-gold-light transition-colors"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? 'Sending...' : 'Send Reset Instructions'}
            </motion.button>
            
            <div className="mt-4 text-center">
              <Link to="/login" className="text-navy hover:underline text-sm">
                Back to Login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
