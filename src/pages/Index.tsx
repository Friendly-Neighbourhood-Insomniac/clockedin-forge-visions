
import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import HeroBackground from '../components/HeroBackground';
import Logo from '../components/Logo';
import PorcelainPanel from '../components/PorcelainPanel';
import KineticText from '../components/KineticText';
import GlassmorphicButton from '../components/GlassmorphicButton';
import ScrollReveal from '../components/ScrollReveal';

const Index = () => {
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 800], [0, 200]);
  const heroOpacity = useTransform(scrollY, [0, 600], [1, 0]);

  return (
    <div className="min-h-screen bg-slate-900 overflow-x-hidden">
      {/* Hero Section */}
      <motion.section 
        style={{ y: heroY, opacity: heroOpacity }}
        className="relative h-screen flex items-center justify-center"
      >
        <HeroBackground />
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <Logo />
          </motion.div>

          <KineticText
            text="Create books and workbooks like never before."
            className="text-2xl md:text-4xl font-playfair text-white mb-6 leading-relaxed"
            delay={0.5}
          />

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
          >
            <p className="text-xl md:text-2xl font-inter text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-amber-300 bg-400% animate-gradient mb-12">
              Gamified • Interactive • Revolutionary
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
          >
            <GlassmorphicButton variant="primary">
              Get Started
            </GlassmorphicButton>
            <GlassmorphicButton variant="secondary">
              Already a member?
            </GlassmorphicButton>
          </motion.div>
        </div>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-6 h-10 border-2 border-cyan-400/50 rounded-full flex justify-center"
          >
            <div className="w-1 h-3 bg-cyan-400 rounded-full mt-2 animate-pulse" />
          </motion.div>
        </div>
      </motion.section>

      {/* Feature Panels */}
      <section className="py-32 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(6,182,212,0.05),transparent_70%)]" />
        
        <div className="relative z-10 max-w-7xl mx-auto">
          <ScrollReveal>
            <h2 className="text-4xl md:text-6xl font-playfair text-center mb-20 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-amber-300">
              Revolutionary Features
            </h2>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-8">
            <ScrollReveal delay={0.2}>
              <PorcelainPanel className="h-80">
                <motion.h3 
                  className="text-2xl font-cinzel font-bold text-cyan-100 mb-4"
                  whileHover={{ rotateX: 5, rotateY: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  Textbook Builder
                </motion.h3>
                <motion.p 
                  className="text-slate-300 font-inter leading-relaxed"
                  initial={{ opacity: 0.7 }}
                  whileHover={{ opacity: 1, y: -2 }}
                >
                  Design structured books with drag-and-drop tools. Create professional educational content with intuitive interfaces and advanced formatting options.
                </motion.p>
              </PorcelainPanel>
            </ScrollReveal>

            <ScrollReveal delay={0.4}>
              <PorcelainPanel className="h-80">
                <motion.h3 
                  className="text-2xl font-cinzel font-bold text-cyan-100 mb-4"
                  whileHover={{ rotateX: 5, rotateY: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  Gamified Tools
                </motion.h3>
                <motion.p 
                  className="text-slate-300 font-inter leading-relaxed"
                  initial={{ opacity: 0.7 }}
                  whileHover={{ opacity: 1, y: -2 }}
                >
                  Embed simulations, videos, mini-games. Transform traditional learning into engaging interactive experiences that captivate and educate.
                </motion.p>
              </PorcelainPanel>
            </ScrollReveal>

            <ScrollReveal delay={0.6}>
              <PorcelainPanel className="h-80 opacity-60 blur-[0.5px]">
                <div className="absolute top-4 right-4 px-3 py-1 bg-gradient-to-r from-cyan-400 to-amber-400 text-slate-900 text-xs font-inter font-bold rounded-full">
                  Coming Soon
                </div>
                <motion.h3 
                  className="text-2xl font-cinzel font-bold text-cyan-100 mb-4"
                  whileHover={{ rotateX: 5, rotateY: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  Storybook
                </motion.h3>
                <motion.p 
                  className="text-slate-300 font-inter leading-relaxed"
                  initial={{ opacity: 0.7 }}
                  whileHover={{ opacity: 1, y: -2 }}
                >
                  Create immersive narrative experiences with branching storylines, character development, and interactive plot elements.
                </motion.p>
              </PorcelainPanel>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Scroll Callout */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 via-purple-900/20 to-pink-900/20" />
        <div className="absolute inset-0 bg-[conic-gradient(from_180deg_at_50%_50%,rgba(6,182,212,0.1)_0deg,rgba(147,51,234,0.1)_120deg,rgba(236,72,153,0.1)_240deg,rgba(6,182,212,0.1)_360deg)] blur-3xl" />
        
        <ScrollReveal>
          <div className="relative z-10 text-center px-4">
            <motion.h2 
              className="text-4xl md:text-7xl font-playfair font-bold text-white leading-tight max-w-4xl mx-auto"
              style={{
                fontVariationSettings: '"wght" 400',
              }}
              whileInView={{
                fontVariationSettings: '"wght" 900',
              }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              viewport={{ once: true }}
            >
              Your learning tools deserve more than{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600">
                Google Docs
              </span>
            </motion.h2>
          </div>
        </ScrollReveal>
      </section>

      {/* Final CTA */}
      <section className="relative py-32 px-4">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-900/30 via-slate-900 to-slate-900" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(251,191,36,0.1),transparent_50%)]" />
        
        <ScrollReveal>
          <div className="relative z-10 text-center max-w-4xl mx-auto">
            <h2 className="text-5xl md:text-7xl font-playfair font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-cyan-400 mb-12 leading-tight">
              Start building your educational universe.
            </h2>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block"
            >
              <button className="relative group px-12 py-6 text-xl font-inter font-semibold text-slate-900 bg-gradient-to-r from-amber-400 via-amber-300 to-cyan-400 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-amber-400/25">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-300 via-amber-200 to-cyan-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className="absolute -top-2 -left-2 w-4 h-4 bg-cyan-400 rounded-full blur-sm animate-particle" />
                <div className="absolute -bottom-2 -right-2 w-3 h-3 bg-amber-400 rounded-full blur-sm animate-particle" style={{ animationDelay: '1s' }} />
                <div className="absolute top-1/2 -left-3 w-2 h-2 bg-cyan-300 rounded-full blur-sm animate-particle" style={{ animationDelay: '2s' }} />
                <div className="absolute bottom-1/4 -right-3 w-2 h-2 bg-amber-300 rounded-full blur-sm animate-particle" style={{ animationDelay: '3s' }} />
                
                <span className="relative z-10">Launch BookForge</span>
              </button>
            </motion.div>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
};

export default Index;
