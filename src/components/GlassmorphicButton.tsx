
import React from 'react';
import { motion } from 'framer-motion';

interface GlassmorphicButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  onClick?: () => void;
  className?: string;
}

const GlassmorphicButton: React.FC<GlassmorphicButtonProps> = ({ 
  children, 
  variant = 'primary', 
  onClick,
  className = ''
}) => {
  const isPrimary = variant === 'primary';

  return (
    <motion.button
      whileHover={{ 
        scale: 1.05,
        y: -2,
      }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`
        relative group px-8 py-4 rounded-lg font-inter font-medium
        transition-all duration-300 overflow-hidden
        ${isPrimary 
          ? 'bg-gradient-to-r from-amber-400/20 via-cyan-400/20 to-amber-400/20 backdrop-blur-md border border-amber-400/40 text-amber-100 hover:border-amber-400/80' 
          : 'bg-slate-800/40 backdrop-blur-md border border-cyan-400/30 text-cyan-100 hover:border-cyan-400/60'
        }
        ${className}
      `}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {isPrimary && (
        <>
          <div className="absolute -top-1 -left-1 w-3 h-3 bg-amber-400/60 rounded-full blur-sm animate-particle" />
          <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-cyan-400/60 rounded-full blur-sm animate-particle" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 -left-2 w-1 h-1 bg-amber-300/80 rounded-full blur-sm animate-particle" style={{ animationDelay: '2s' }} />
        </>
      )}
      
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
      
      <div className="absolute inset-0 bg-gradient-to-r from-amber-400/0 via-amber-400/10 to-amber-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </motion.button>
  );
};

export default GlassmorphicButton;
