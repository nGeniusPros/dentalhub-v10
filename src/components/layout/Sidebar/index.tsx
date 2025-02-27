import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Icon } from '../../ui/icon-strategy';
import { Button } from '../../ui/button';
import { useTheme } from '../../../hooks/use-theme';
import { cn } from '../../../lib/utils';
import { adminNavItems, staffNavItems, patientNavItems } from './navigation-items';
import { DentalHubAvatar } from '../../ui/DentalHubAvatar';

interface SidebarProps {
  role?: "admin" | "staff" | "patient";
}

export const Sidebar = ({ role = "staff" }: SidebarProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = role === "admin" 
    ? adminNavItems 
    : role === "staff" 
    ? staffNavItems 
    : patientNavItems;

  return (
    <motion.div
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className={cn(
        "h-screen flex flex-col transition-all duration-300 relative",
        "bg-gradient-to-b from-white via-gray-50/50 to-gray-50",
        "dark:from-gray-800 dark:via-gray-800/95 dark:to-gray-800/90",
        "border-r border-gray-200/50 dark:border-gray-700/30",
        "backdrop-blur-xl shadow-lg shadow-gray-200/50 dark:shadow-none",
        collapsed ? "w-[60px]" : "w-[240px]"
      )}
    >
      {/* Logo Section */}
      <div className="p-4 border-b border-gray-200/20 flex justify-between items-center">
        {!collapsed && (
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ 
                rotate: 360,
              }}
              transition={{ 
                duration: 20,
                repeat: Infinity,
                ease: "linear"
              }}
              className="w-8 h-8"
            >
              <Icon name="Atom" className="w-full h-full text-primary" />
            </motion.div>
            <span className="font-bold text-lg bg-gradient-primary bg-clip-text text-transparent">
              nGenius
            </span>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="text-primary hover:text-primary/80"
        >
          {collapsed ? (
            <Icon name="ChevronRight" className="h-4 w-4" />
          ) : (
            <Icon name="ChevronLeft" className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Navigation Items */}
      <div className="flex-1 overflow-y-auto py-4">
        {navItems.map((section) => (
          <div key={section.category} className="px-3 py-2">
            {!collapsed && (
              <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-3 mb-2">
                {section.category}
              </h3>
            )}
            <div className="space-y-1">
              {section.items.map((item) => {
                const IconComponent = Icon;
                const isActive = location.pathname === item.path;

                return (
                  <Button
                    key={item.path}
                    variant={isActive ? "default" : "ghost"}
                    className={cn(
                      "w-full justify-start gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                      isActive
                        ? "bg-primary/10 text-primary hover:bg-primary/15"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50",
                      "hover:translate-x-1"
                    )}
                    onClick={() => { console.log("Navigating to", item.path); navigate(item.path); }}
                  >
                    <IconComponent name={item.icon} className={cn(
                      "h-4 w-4 transition-colors",
                      isActive ? "text-primary" : "text-gray-500 dark:text-gray-400"
                    )} />
                    {!collapsed && <span>{item.label}</span>}
                  </Button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* User Section */}
      <div className="mt-auto p-3 border-t border-gray-200/50 dark:border-gray-700/30">
        <div className="p-4 border-t border-gray-200/20">
          <div className={cn(
            "flex items-center gap-3",
            collapsed ? "justify-center" : "justify-start"
          )}>
            <DentalHubAvatar
              index={role === 'admin' ? 0 : role === 'staff' ? 5 : 12}
              alt={`${role} user`}
              size="sm"
              status="online"
            />
            {!collapsed && (
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Dr. John Smith</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{role}</p>
              </div>
            )}
          </div>
        </div>

        {/* Theme Toggle */}
        <div className="p-4 border-t border-gray-200/20">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="w-full h-9"
          >
            {theme === "light" ? (
              <Icon name="Moon" className="h-4 w-4" />
            ) : (
              <Icon name="Sun" className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </motion.div>
  );
};