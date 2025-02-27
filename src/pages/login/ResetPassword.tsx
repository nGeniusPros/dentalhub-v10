import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { supabase } from '../../config/auth';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' | null }>({
    text: '',
    type: null
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setMessage({ text: "Passwords do not match.", type: 'error' });
      return;
    }
    
    if (formData.password.length < 6) {
      setMessage({ text: "Password must be at least 6 characters long.", type: 'error' });
      return;
    }
    
    setMessage({ text: '', type: null });
    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: formData.password,
      });

      if (error) throw error;

      setMessage({ 
        text: "Password has been reset successfully!", 
        type: 'success' 
      });
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setMessage({ 
        text: err instanceof Error ? err.message : 'An error occurred', 
        type: 'error' 
      });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-lighter">
      <div className="flex w-full max-w-4xl bg-white rounded-xl shadow-glow overflow-hidden">
        {/* Illustration Section */}
        <div className="hidden md:flex md:w-1/2 bg-green items-center justify-center p-8">
          <img 
            src="/illustrations/auth/v2-reset-password-light.png" 
            alt="Reset Password" 
            className="max-w-full max-h-80 object-contain"
          />
        </div>
        
        {/* Form Section */}
        <div className="w-full md:w-1/2 p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-navy mb-2">Reset Password</h1>
            <p className="text-gray-darker">Enter your new password</p>
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
              <label htmlFor="password" className="block text-sm font-medium text-gray-darker mb-1">
                New Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Icons.Lock size={18} className="text-gray-dark" />
                </div>
                <input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter new password"
                  className="w-full pl-10 p-3 border border-gray-light rounded-lg focus:ring-2 focus:ring-green focus:border-transparent"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-darker mb-1">
                Confirm New Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Icons.Lock size={18} className="text-gray-dark" />
                </div>
                <input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm new password"
                  className="w-full pl-10 p-3 border border-gray-light rounded-lg focus:ring-2 focus:ring-green focus:border-transparent"
                />
              </div>
            </div>
            
            <motion.button 
              type="submit" 
              className="mt-4 p-3 bg-green text-white rounded-lg hover:bg-green-light transition-colors"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? 'Resetting Password...' : 'Reset Password'}
            </motion.button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
