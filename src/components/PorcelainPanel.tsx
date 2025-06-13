
import React, { useState, useRef } from 'react';

interface PorcelainPanelProps {
  children: React.ReactNode;
  className?: string;
}

const PorcelainPanel: React.FC<PorcelainPanelProps> = ({ children, className = '' }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const panelRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (panelRef.current) {
      const rect = panelRef.current.getBoundingClientRect();
      setMousePosition({
        x: ((e.clientX - rect.left) / rect.width) * 100,
        y: ((e.clientY - rect.top) / rect.height) * 100,
      });
    }
  };

  return (
    <div
      ref={panelRef}
      onMouseMove={handleMouseMove}
      className={`relative group overflow-hidden rounded-lg backdrop-blur-sm border border-cyan-400/20 transition-all duration-500 hover:scale-105 hover:rotate-x-2 hover:rotate-y-2 ${className}`}
      style={{
        background: `
          radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(6,182,212,0.1) 0%, transparent 50%),
          linear-gradient(135deg, rgba(71,85,105,0.8) 0%, rgba(30,41,59,0.9) 100%)
        `,
        transformStyle: 'preserve-3d',
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='rgba(255,255,255,0.03)' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E")`
        }}
      />
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(251,191,36,0.1) 0%, transparent 50%)`
        }}
      />
      <div className="relative z-10 p-8">
        {children}
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent" />
    </div>
  );
};

export default PorcelainPanel;
