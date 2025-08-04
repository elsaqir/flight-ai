import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Settings, HelpCircle, Moon, Sun } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { theme, toggleTheme } = useTheme();

  const menuItems = [
    { icon: User, label: 'Profile', action: () => {} },
    { icon: Settings, label: 'Settings', action: () => {} },
    { icon: HelpCircle, label: 'Help & Support', action: () => {} },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: -320 }}
            animate={{ x: 0 }}
            exit={{ x: -320 }}
            className="fixed left-0 top-0 bottom-0 w-80 sm:w-80 max-w-[85vw] bg-primary-bg border-r border-border-primary z-50 flex flex-col mobile-safe-area"
          >
            <div className="p-4 sm:p-6 border-b border-border-primary">
              <div className="flex items-center justify-between">
                <h2 className="text-lg sm:text-xl font-semibold text-text-primary">Menu</h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-primary-secondary rounded-lg transition-colors touch-target"
                >
                  <X size={20} className="text-text-primary" />
                </button>
              </div>
            </div>

            <div className="flex-1 p-4 sm:p-6 mobile-scroll">
              <div className="space-y-2">
                {menuItems.map((item, index) => (
                  <motion.button
                    key={item.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={item.action}
                    className="w-full flex items-center gap-3 p-3 hover:bg-primary-secondary rounded-lg transition-colors text-left touch-target"
                  >
                    <item.icon size={20} className="text-text-secondary" />
                    <span className="text-sm sm:text-base text-text-primary">{item.label}</span>
                  </motion.button>
                ))}
              </div>
            </div>

            <div className="p-4 sm:p-6 border-t border-border-primary">
              <button
                onClick={toggleTheme}
                className="w-full flex items-center gap-3 p-3 hover:bg-primary-secondary rounded-lg transition-colors touch-target"
              >
                {theme === 'light' ? (
                  <Moon size={20} className="text-text-secondary" />
                ) : (
                  <Sun size={20} className="text-text-secondary" />
                )}
                <span className="text-sm sm:text-base text-text-primary">
                  {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
                </span>
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};