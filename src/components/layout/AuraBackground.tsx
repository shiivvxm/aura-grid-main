import React, { useState, useEffect } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

export const AuraBackground: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for mouse-following glow
  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-background">
      {/* Interactive Mouse Glow */}
      <motion.div
        style={{
          left: springX,
          top: springY,
          translateX: '-50%',
          translateY: '-50%',
          background: 'radial-gradient(circle, hsl(var(--primary-h) 80% 50% / 0.1) 0%, transparent 60%)'
        }}
        className="fixed w-[1000px] h-[1000px] rounded-full blur-[150px] pointer-events-none z-0 opacity-50"
      />

      {/* Central Aura Glow */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full blur-[120px] pointer-events-none z-0"
        style={{
          background: 'radial-gradient(circle, hsl(var(--primary-h) 80% 50% / 0.15) 0%, transparent 70%)'
        }}
      />
      
      {/* Sub Aura 1 */}
      <motion.div
        animate={{
          x: [0, 100, 0],
          y: [0, -50, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="fixed top-1/4 left-1/4 w-[500px] h-[500px] rounded-full blur-[100px] pointer-events-none z-0 opacity-20"
        style={{
          background: 'radial-gradient(circle, hsl(var(--primary-h) 60% 40% / 0.2) 0%, transparent 70%)'
        }}
      />

      {/* Grid Pattern Integration */}
      <div 
        className="fixed inset-0 pointer-events-none z-0 opacity-[0.05]"
        style={{
          backgroundImage: `linear-gradient(to right, hsl(var(--primary-h) 100% 50% / 0.3) 1px, transparent 1px), linear-gradient(to bottom, hsl(var(--primary-h) 100% 50% / 0.5) 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />

      {/* High-Velocity Particles */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {[...Array(60)].map((_, i) => {
          const depth = Math.random() * 0.5 + 0.5;
          return (
            <motion.div
              key={i}
              initial={{ 
                x: Math.random() * 100 + '%', 
                y: Math.random() * 100 + '%',
                scale: depth
              }}
              animate={{ 
                opacity: [0.1, 0.8, 0.1],
                scale: [depth, depth * 1.5, depth],
                y: [Math.random() * 100 + '%', (Math.random() * 100 - 10) + '%']
              }}
              transition={{ 
                duration: 5 + Math.random() * 10, 
                repeat: Infinity,
                ease: "linear",
              }}
              className="absolute w-0.5 h-0.5 bg-primary/40 rounded-full blur-[0.5px]"
            />
          );
        })}
      </div>

      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};
