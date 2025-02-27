import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Icon } from '../ui/icon-strategy';
import { useAuthContext } from '../../contexts/AuthContext';
import { DentalHubAvatar } from '../ui/DentalHubAvatar';

export const UserProfile = () => {
  const { user } = useAuthContext();
  const navigate = useNavigate();

  const handleProfileClick = () => {
    if (!user) return;
    
    switch (user.role) {
      case 'admin':
        navigate('/admin-dashboard/settings');
        break;
      case 'staff':
        navigate('/staff-dashboard/settings');
        break;
      case 'patient':
        navigate('/patient-dashboard/settings');
        break;
    }
  };

  return (
    <motion.div 
      whileHover={{ scale: 1.02 }}
      onClick={handleProfileClick}
      className="flex items-center gap-3 cursor-pointer"
    >
      <div className="text-right">
        <p className="text-sm font-medium text-gray-900 dark:text-white">
          {user?.name}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {user?.title} - {user?.department}
        </p>
      </div>
      <DentalHubAvatar 
        userId={user?.id}
        name={user?.name}
        size="md"
        theme="gradient"
      />
    </motion.div>
  );
};