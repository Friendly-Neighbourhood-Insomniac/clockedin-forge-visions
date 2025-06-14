
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface GlassmorphicButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  onClick?: () => void;
}

const GlassmorphicButton: React.FC<GlassmorphicButtonProps> = ({ 
  children, 
  variant = 'primary',
  onClick 
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (children === 'Get Started') {
      navigate('/editor');
    }
  };

  const baseClasses = "relative group px-8 py-4 rounded-lg font-inter font-semibold transition-all duration-300 backdrop-blur-sm border overflow-hidden";
  
  const variantClasses = {
    primary: "bg-gradient-to-r from-amber-400/20 to-cyan-400/20 border-amber-400/30 text-white hover:border-amber-400/50 hover:shadow-lg hover:shadow-amber-400/25",
    secondary: "bg-slate-800/40 border-cyan-400/30 text-cyan-100 hover:border-cyan-400/50 hover:bg-slate-800/60"
  };

  return (
    <motion.button
      className={`${baseClasses} ${variantClasses[variant]}`}
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleClick}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {variant === 'primary' && (
        <>
          <div className="absolute -top-1 -left-1 w-3 h-3 bg-cyan-400/60 rounded-full blur-sm animate-pulse" />
          <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-amber-400/60 rounded-full blur-sm animate-pulse" style={{ animationDelay: '1s' }} />
        </>
      )}
      
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
};

export default GlassmorphicButton;
