
import React from 'react';

const Logo = () => {
  return (
    <div className="relative">
      <div className="w-24 h-24 mx-auto mb-6 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 via-amber-300 to-cyan-600 rounded-full animate-glow blur-sm" />
        <div className="relative w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 rounded-full border-2 border-amber-400/30 flex items-center justify-center backdrop-blur-sm">
          <div className="text-2xl font-cinzel font-bold text-transparent bg-clip-text bg-gradient-to-br from-cyan-400 to-amber-300">
            CE
          </div>
          <div className="absolute inset-2 border border-cyan-400/20 rounded-full" />
          <div className="absolute top-1 left-1 w-2 h-2 bg-cyan-400/60 rounded-full blur-sm" />
        </div>
      </div>
      <h1 className="font-playfair text-4xl md:text-6xl font-bold text-center mb-2">
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-amber-300 to-cyan-400 bg-400% animate-gradient">
          ClockEd-In
        </span>
      </h1>
      <h2 className="font-cinzel text-xl md:text-2xl text-center text-amber-300/90 tracking-wider">
        BookForge
      </h2>
    </div>
  );
};

export default Logo;
