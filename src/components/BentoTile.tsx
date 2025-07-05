import React from 'react';
import { motion } from 'framer-motion';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface BentoTileProps {
  title: string;
  subtitle: string;
  icon: LucideIcon;
  gradient: string;
  size: 'small' | 'medium' | 'large';
  onClick: () => void;
  isExpanded?: boolean;
  children?: React.ReactNode;
}

export const BentoTile: React.FC<BentoTileProps> = ({
  title,
  subtitle,
  icon: Icon,
  gradient,
  size,
  onClick,
  isExpanded = false,
  children,
}) => {
  const sizeClasses = {
    small: 'col-span-1 row-span-1 min-h-[200px]',
    medium: 'col-span-1 row-span-2 min-h-[400px]',
    large: 'col-span-2 row-span-1 min-h-[200px]',
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`${sizeClasses[size]} ${gradient} rounded-2xl p-6 cursor-pointer relative overflow-hidden neumorphic transition-all duration-300 hover:shadow-xl`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between h-full">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <Icon size={24} className="text-white" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white">{title}</h3>
              <p className="text-white/80 text-sm">{subtitle}</p>
            </div>
          </div>
          
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4"
            >
              {children}
            </motion.div>
          )}
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12" />
    </motion.div>
  );
};