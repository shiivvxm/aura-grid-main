import React, { useState } from 'react';
import { useTheme } from './ThemeProvider';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette, X } from 'lucide-react';

export const ColorPicker = () => {
  const { hue, setHue } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  // Predefined vibrant hues
  const colors = [199, 280, 340, 15, 45, 142];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative group p-2.5 rounded-2xl bg-white/5 border border-white/10 hover:border-primary/50 transition-all duration-300 box-content"
      >
        <Palette className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
        <div className="absolute inset-0 rounded-2xl bg-primary/10 opacity-0 group-hover:opacity-100 blur-md transition-opacity" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div 
              className="fixed inset-0 z-40 outline-none" 
              onClick={() => setIsOpen(false)} 
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              className="absolute right-0 mt-3 p-4 glass-card min-w-[200px] z-50 border-primary/20"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Aura Hue</span>
                <button onClick={() => setIsOpen(false)}>
                  <X className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                </button>
              </div>

              {/* Slider */}
              <input
                type="range"
                min="0"
                max="360"
                value={hue}
                onChange={(e) => setHue(parseInt(e.target.value))}
                className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer mb-6 accent-primary"
                style={{
                    background: `linear-gradient(to right, 
                        hsl(0, 80%, 50%), 
                        hsl(60, 80%, 50%), 
                        hsl(120, 80%, 50%), 
                        hsl(180, 80%, 50%), 
                        hsl(240, 80%, 50%), 
                        hsl(300, 80%, 50%), 
                        hsl(360, 80%, 50%)
                    )`
                }}
              />

              {/* Quick Picks */}
              <div className="flex justify-between gap-2">
                {colors.map((c) => (
                  <button
                    key={c}
                    onClick={() => setHue(c)}
                    className={`w-6 h-6 rounded-full border-2 transition-all duration-300 ${hue === c ? 'border-white scale-125' : 'border-transparent opacity-60 hover:opacity-100'}`}
                    style={{ backgroundColor: `hsl(${c}, 80%, 50%)` }}
                  />
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
