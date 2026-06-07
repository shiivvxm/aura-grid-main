import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { AuraBackground } from '@/components/layout/AuraBackground';
import { Zap, Activity, Leaf, ArrowRight, Play, Layout, Twitter, Github, Linkedin, Mail } from 'lucide-react';

// --- Components ---

const CharacterReveal = ({ text, className }: { text: string, className?: string }) => {
  return (
    <span className={className}>
      {text.split('').map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.5 + i * 0.03,
            duration: 0.8,
            ease: [0.33, 1, 0.68, 1]
          }}
          className="inline-block"
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </span>
  );
};

const TiltCard = ({ children, className }: { children: React.ReactNode, className?: string }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateY,
        rotateX,
        transformStyle: "preserve-3d",
      }}
      className={className}
    >
      <div style={{ transform: "translateZ(50px)", transformStyle: "preserve-3d" }}>
        {children}
      </div>
    </motion.div>
  );
};

const MagneticButton = ({ children, onClick, className }: { children: React.ReactNode, onClick?: () => void, className?: string }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 150, damping: 15 });
  const springY = useSpring(y, { stiffness: 150, damping: 15 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY, currentTarget } = e;
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    x.set((clientX - centerX) * 0.4);
    y.set((clientY - centerY) * 0.4);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.button
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
      className={className}
    >
      {children}
    </motion.button>
  );
};

// --- Main Component ---

const Landing = () => {
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState('features');
  const containerRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const heroY = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const dashboardY = useTransform(scrollYProgress, [0, 0.5], [0, 80]);
  const dashboardScale = useTransform(scrollYProgress, [0, 0.5], [1, 1.05]);
  const dashboardRotateX = useTransform(scrollYProgress, [0, 0.5], [0, 5]);

  const navLinks = [
    { id: 'features', label: 'FEATURES' },
    { id: 'solution', label: 'SOLUTION' },
    { id: 'process', label: 'PROCESS' }
  ];

  const faults = [
    {
      icon: Zap,
      title: "SUSTAINED OVERLOAD",
      desc: "Legacy infrastructure lacks the elasticity to manage micro-fluctuations in demand.",
      color: "text-blue-400"
    },
    {
      icon: Activity,
      title: "ENTROPY LOSS",
      desc: "Billions in revenue vanish through inefficient distribution and unmonitored leakages.",
      color: "text-blue-500"
    },
    {
      icon: Leaf,
      title: "CARBON STAGNATION",
      desc: "Ineffective integration of renewables keeps fossil fuel dependency at critical highs.",
      color: "text-emerald-500"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: [0.33, 1, 0.68, 1] as any
      }
    }
  };

  const scrollToSection = (id: string) => {
    setActiveNav(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-background overflow-x-hidden selection:bg-primary/30 scroll-smooth">
      <AuraBackground>
        {/* Header */}
        <nav className="fixed top-0 left-0 right-0 z-50 glass-card-sm !rounded-none !bg-background/40 backdrop-blur-xl border-b border-white/5">
          <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-2 group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <div className="p-1.5 rounded-lg bg-primary shadow-[0_0_15px_rgba(var(--primary),0.5)] group-hover:scale-110 transition-transform">
                <Zap className="w-5 h-5 text-primary-foreground fill-current" />
              </div>
              <span className="text-xl font-bold tracking-[0.2em] text-foreground uppercase">Aura Grid</span>
            </div>

            <div className="hidden md:flex items-center gap-12">
              {navLinks.map(link => (
                <button
                  key={link.id}
                  onClick={() => scrollToSection(link.id)}
                  className={`text-xs font-bold tracking-[0.3em] transition-all hover:text-primary relative group ${
                    activeNav === link.id ? 'text-primary' : 'text-muted-foreground'
                  }`}
                >
                  {link.label}
                  <span className={`absolute -bottom-1 left-0 w-full h-0.5 bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform ${activeNav === link.id ? 'scale-x-100' : ''}`} />
                </button>
              ))}
            </div>

            <div className="flex items-center gap-6">
              <button 
                onClick={() => navigate('/auth')}
                className="text-xs font-bold tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors"
              >
                LOGIN
              </button>
              <MagneticButton
                onClick={() => navigate('/auth')}
                className="px-6 py-2 rounded-full bg-primary text-primary-foreground text-xs font-bold tracking-[0.2em] flex items-center gap-2 glow-primary hover:opacity-90 transition-all group"
              >
                INITIALIZE <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </MagneticButton>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="relative z-10 pt-48 pb-32 px-6 flex flex-col items-center justify-center text-center">
          <motion.div
            style={{ y: heroY, opacity: heroOpacity }}
            className="space-y-8 max-w-5xl"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 mb-6"
            >
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-[10px] font-bold tracking-[0.3em] text-primary uppercase">Intelligence Protocol V2.4</span>
            </motion.div>

            <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-foreground leading-[0.95] uppercase text-left w-full">
              <CharacterReveal text="Orchestrating the" /> <br />
              <motion.span 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.2, duration: 0.8 }}
                className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-400 to-primary/50 drop-shadow-[0_0_30px_rgba(var(--primary),0.4)] block"
              >
                Future of Energy
              </motion.span>
            </h1>

            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.8 }}
              transition={{ delay: 1.4, duration: 1 }}
              className="text-base md:text-lg text-muted-foreground font-medium max-w-2xl text-left leading-relaxed mt-8"
            >
              Enterprise-grade autonomous grid management. 
              Deploying AI-driven stability and efficiency across global energy infrastructure.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.6, duration: 0.5 }}
              className="flex flex-col sm:flex-row items-center justify-start gap-6 mt-12 w-full"
            >
              <MagneticButton
                onClick={() => navigate('/dashboard')}
                className="px-10 py-4 rounded-full bg-primary text-primary-foreground font-black text-xs tracking-[0.2em] uppercase glow-primary hover:scale-105 active:scale-95 transition-all w-full sm:w-auto text-center"
              >
                Access Portal
              </MagneticButton>
              <MagneticButton className="px-10 py-4 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-foreground font-black text-xs tracking-[0.2em] uppercase transition-all flex items-center justify-center gap-3 w-full sm:w-auto hover:border-primary/30 group">
                <Play className="w-4 h-4 fill-current group-hover:text-primary transition-colors" />
                Watch System Demo
              </MagneticButton>
            </motion.div>
          </motion.div>

          {/* Hero UI Dashboard Preview */}
          <motion.div
            style={{ y: dashboardY, scale: dashboardScale, rotateX: dashboardRotateX, perspective: "1000px" }}
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 1.2, ease: [0.33, 1, 0.68, 1] as any }}
            className="mt-24 w-full max-w-6xl relative"
          >
            <div className="glass-card aspect-[16/9] border-white/5 shadow-2xl relative overflow-hidden group hover:border-primary/20 transition-colors">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-blue-500/10 opacity-50" />
              <div className="absolute inset-0 grid-pattern opacity-20 group-hover:opacity-30 transition-opacity" />
              
              <div className="absolute p-8 inset-0 flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <div className="flex gap-4">
                    <div className="px-3 py-1 rounded border border-primary/30 bg-primary/10 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                      <span className="text-[10px] font-bold text-primary tracking-widest uppercase">System Operational</span>
                    </div>
                    <div className="px-3 py-1 rounded border border-white/10 bg-white/5">
                      <span className="text-[10px] font-bold text-muted-foreground tracking-widest uppercase">02:44:19 UTC</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="w-2 h-2 rounded-full bg-white/20" />
                    <div className="w-2 h-2 rounded-full bg-white/20" />
                    <div className="w-2 h-2 rounded-full bg-primary/40" />
                  </div>
                </div>

                <div className="flex-1 flex gap-6">
                  {/* Main Analysis Chart */}
                  <div className="flex-[2] rounded-xl bg-white/5 border border-white/5 p-6 flex flex-col gap-4 relative overflow-hidden group/chart">
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent translate-y-20 animate-[scan_3s_linear_infinite]" />
                    
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <span className="text-[8px] font-bold text-muted-foreground tracking-widest uppercase">Load Distribution Analysis</span>
                        <div className="text-xl font-black text-foreground tracking-tighter uppercase italic">842.4 <span className="text-xs text-primary/70 not-italic">GW</span></div>
                      </div>
                      <div className="flex gap-1">
                        {[1, 2, 3].map(i => <div key={i} className="w-1 h-3 rounded-full bg-primary/20" />)}
                      </div>
                    </div>

                    <div className="flex-1 flex items-end gap-1.5 pt-4">
                      {[40, 60, 45, 90, 65, 80, 50, 70, 85, 45, 60, 75, 55, 95].map((h, i) => (
                        <motion.div
                          key={i}
                          initial={{ height: 0 }}
                          animate={{ height: `${h}%` }}
                          transition={{ delay: 1.5 + (i * 0.05), duration: 1, ease: "easeOut" }}
                          className="flex-1 bg-gradient-to-t from-primary/10 via-primary/40 to-primary/60 rounded-t-sm relative group/bar"
                        >
                          <div className="absolute -top-4 left-1/2 -translate-x-1/2 opacity-0 group-hover/bar:opacity-100 transition-opacity whitespace-nowrap">
                            <span className="text-[6px] font-mono text-primary">{h}%</span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Sidebar Stats */}
                  <div className="flex-1 flex flex-col gap-6">
                    <div className="flex-1 rounded-xl bg-white/5 border border-white/5 p-6 space-y-4">
                      <span className="text-[8px] font-bold text-muted-foreground tracking-widest uppercase">Active Nodes</span>
                      <div className="space-y-3">
                        {[
                          { label: 'NORTH_GRID_A1', status: 'Optimal', val: '98.4%' },
                          { label: 'SOUTH_TERMINAL_B2', status: 'Syncing', val: '74.2%' },
                          { label: 'CENTRAL_HUB_X0', status: 'Optimal', val: '99.1%' }
                        ].map((node, i) => (
                          <div key={i} className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <div className="text-[7px] font-bold text-foreground font-mono">{node.label}</div>
                              <div className="text-[6px] font-bold text-primary/60 uppercase">{node.status}</div>
                            </div>
                            <div className="text-[10px] font-black text-foreground font-mono italic">{node.val}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex-1 rounded-xl bg-primary/5 border border-primary/10 p-6 flex flex-col justify-between">
                      <Zap className="w-4 h-4 text-primary" />
                      <div className="space-y-1">
                        <div className="text-2xl font-black text-foreground italic uppercase">2.4 <span className="text-xs not-italic text-muted-foreground">ms</span></div>
                        <div className="text-[8px] font-bold text-primary tracking-widest uppercase">Avg latency</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-background to-transparent" />
            </div>

            {/* Float Floating stats */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-12 -right-8 glass-card p-4 border-primary/20 backdrop-blur-2xl"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                  <Activity className="w-4 h-4 text-emerald-500" />
                </div>
                <div className="text-left">
                  <div className="text-[8px] font-bold text-muted-foreground uppercase">Stable flow</div>
                  <div className="text-sm font-black text-foreground tracking-tighter">99.98%</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </section>

        {/* Features Section */}
        <section id="features" className="relative z-10 max-w-7xl mx-auto px-6 py-32">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="grid grid-cols-1 lg:grid-cols-3 gap-12"
          >
            <div className="lg:col-span-1 space-y-6 text-left">
              <motion.span variants={itemVariants} className="text-[10px] font-bold tracking-[0.5em] text-primary uppercase">Critical Faults</motion.span>
              <motion.h2 variants={itemVariants} className="text-4xl md:text-5xl font-black tracking-tighter uppercase text-foreground leading-[0.9]">
                The Entropy of <br />
                <span className="text-primary italic">Legacy Power</span>
              </motion.h2>
              <motion.p variants={itemVariants} className="text-sm text-muted-foreground font-medium uppercase opacity-60 leading-relaxed max-w-sm">
                Current systems are failing. Aura Grid identifies and resolves critical infrastructure decay before it reaches terminal status.
              </motion.p>
            </div>

            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
              {faults.map((fault, i) => (
                <TiltCard key={i} className="group">
                  <motion.div 
                    variants={itemVariants}
                    className="glass-card p-10 border-white/5 space-y-8 hover:border-primary/30 transition-all h-full flex flex-col justify-between"
                  >
                    <div className="flex justify-between items-start">
                      <div className="p-3 rounded-xl bg-white/5 border border-white/10 group-hover:border-primary/30 group-hover:text-primary transition-all">
                        <fault.icon className="w-6 h-6" />
                      </div>
                      <span className="text-[10px] font-mono text-muted-foreground/30 uppercase tracking-widest">ERROR_CODE: 0x{((i+1)*255).toString(16).toUpperCase()}</span>
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-lg font-black tracking-widest uppercase text-foreground">{fault.title}</h3>
                      <p className="text-xs text-muted-foreground font-medium uppercase opacity-60 leading-relaxed">{fault.desc}</p>
                    </div>
                    
                    <div className="pt-6 border-t border-white/5 space-y-3">
                      <div className="flex justify-between items-end">
                        <span className="text-[8px] font-bold text-muted-foreground/40 uppercase tracking-widest">Severity Status</span>
                        <span className="text-[10px] font-black text-foreground italic uppercase">Critical</span>
                      </div>
                      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          whileInView={{ width: `${70 + (i * 10)}%` }}
                          transition={{ duration: 1.5, delay: 0.5 }}
                          className={`h-full bg-gradient-to-r ${fault.color} to-primary/50 relative overflow-hidden`}
                        >
                          <div className="absolute inset-0 bg-white/20 animate-pulse" />
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                </TiltCard>
              ))}
              
              <motion.div 
                variants={itemVariants}
                className="glass-card p-10 border-white/5 bg-primary/5 border-dashed border-primary/20 flex flex-col items-center justify-center text-center space-y-4 group hover:bg-primary/10 transition-all"
              >
                <div className="w-12 h-12 rounded-full border border-primary/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Activity className="w-5 h-5 text-primary" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-black tracking-widest text-foreground uppercase">System DeepScan</h4>
                  <p className="text-[10px] text-muted-foreground font-medium uppercase opacity-50">Mapping 14.8k failure points...</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* Solution Section */}
        <section id="solution" className="relative z-10 glass-card !rounded-none !bg-white/[0.02] border-y border-white/5">
          <div className="max-w-7xl mx-auto px-6 py-32 flex flex-col lg:flex-row items-center gap-24">
            <div className="flex-1 space-y-12 text-left">
              <div className="space-y-6">
                <motion.span 
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  className="text-[10px] font-bold tracking-[0.5em] text-emerald-400 uppercase"
                >
                  Neural Topology
                </motion.span>
                <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase text-foreground leading-[0.9]">
                  Architecting <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-primary drop-shadow-[0_0_15px_rgba(52,211,153,0.3)]">Resilience</span>
                </h2>
                <p className="text-base text-muted-foreground font-medium uppercase opacity-60 leading-relaxed max-w-md">
                  Aura Grid utilizes a decentralized AI layer that self-corrects based on real-time neural topology, ensuring 100% uptime.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-8">
                {[
                  { label: "AUTONOMOUS ADJUSTMENT", val: "Instant" },
                  { label: "STABILITY RATING", val: "A++" },
                  { label: "ENERGY RECOVERY", val: "32.4%" },
                  { label: "NODE SYNC", val: "0.1ms" }
                ].map((stat, i) => (
                  <div key={i} className="space-y-1 border-l-2 border-emerald-500/20 pl-4">
                    <div className="text-[8px] font-bold text-muted-foreground tracking-widest uppercase">{stat.label}</div>
                    <div className="text-xl font-black text-foreground italic uppercase italic">{stat.val}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex-1 w-full relative">
              <div className="aspect-square relative flex items-center justify-center">
                {/* Visual Representation of Solution - Abstract Neural Grid */}
                <div className="absolute inset-0 bg-emerald-500/5 rounded-full blur-[100px]" />
                <div className="relative w-full h-full border border-white/5 rounded-3xl overflow-hidden glass-card group">
                  <div className="absolute inset-0 grid-pattern opacity-10" />
                  
                  {/* Interactive Performance Nodes */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    {[...Array(6)].map((_, i) => (
                      <motion.div
                        key={i}
                        animate={{ 
                          scale: [1, 1.2, 1],
                          opacity: [0.3, 0.6, 0.3],
                          rotate: [0, 180, 360]
                        }}
                        transition={{ 
                          duration: 10 + (i * 2), 
                          repeat: Infinity, 
                          ease: "linear" 
                        }}
                        className="absolute border border-emerald-500/20 rounded-full"
                        style={{ 
                          width: `${(i + 1) * 15}%`, 
                          height: `${(i + 1) * 15}%`,
                        }}
                      />
                    ))}
                    
                    {/* Active Data Nodes */}
                    {[...Array(8)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ 
                          x: (Math.random() - 0.5) * 400, 
                          y: (Math.random() - 0.5) * 400,
                          scale: 0
                        }}
                        animate={{ 
                          scale: [0, 1, 0],
                          x: (Math.random() - 0.5) * 500,
                          y: (Math.random() - 0.5) * 500
                        }}
                        transition={{ 
                          duration: 4 + Math.random() * 4, 
                          repeat: Infinity,
                          delay: Math.random() * 5
                        }}
                        className="absolute w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]"
                      />
                    ))}
                  </div>

                  <div className="absolute bottom-8 left-8 space-y-2">
                    <div className="text-[10px] font-bold text-white tracking-[0.3em] uppercase">Status: Syncing Nodes</div>
                    <div className="h-1 w-48 bg-white/5 rounded-full overflow-hidden">
                      <motion.div 
                        animate={{ x: [-200, 200] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="w-1/2 h-full bg-emerald-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section id="process" className="relative z-10 max-w-7xl mx-auto px-6 py-32 text-center">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="space-y-24"
          >
            <div className="space-y-4">
              <motion.span variants={itemVariants} className="text-[10px] font-bold tracking-[0.5em] text-blue-400 uppercase">The Grid Protocol</motion.span>
              <motion.h2 variants={itemVariants} className="text-4xl md:text-6xl font-black tracking-tighter uppercase text-foreground">
                How It <br />
                <CharacterReveal text="Synchronizes" className="text-blue-400" />
              </motion.h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
               {[
                 { step: "01", label: "Ingest", desc: "Live data harvesting from sensors", log: "STREAM_OPEN: 1.4GB/s" },
                 { step: "02", label: "Analyze", desc: "Neural trend identification", log: "BIAS_RESOLVED: 99.8%" },
                 { step: "03", label: "Decide", desc: "Optimal routing generation", log: "ROUTE_OPT: READY" },
                 { step: "04", label: "Execute", desc: "Instantaneous grid adjustment", log: "GRID_SYNC: COMPLETED" }
               ].map((p, i) => (
                 <motion.div 
                   key={i} 
                   variants={itemVariants}
                   whileHover={{ y: -10, borderColor: "rgba(56, 189, 248, 0.3)" }}
                   className="glass-card p-10 border-white/5 space-y-6 group transition-all relative overflow-hidden"
                 >
                   <div className="absolute top-0 right-0 p-4">
                     <span className="text-4xl font-black text-white/5 italic group-hover:text-blue-400/20 transition-colors uppercase">{p.step}</span>
                   </div>
                   
                   <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-blue-400/30 group-hover:bg-blue-400/5 transition-all">
                     <Play className="w-5 h-5 text-blue-400 opacity-20 group-hover:opacity-100 transition-opacity" />
                   </div>

                   <div className="space-y-2 text-left">
                     <h4 className="text-sm font-black tracking-widest uppercase text-foreground">{p.label}</h4>
                     <p className="text-xs text-muted-foreground font-medium uppercase opacity-60 leading-relaxed">{p.desc}</p>
                   </div>

                   {/* System Log Hover State */}
                   <div className="pt-4 border-t border-white/5 flex items-center justify-between group-hover:border-blue-400/10 transition-colors">
                     <span className="text-[8px] font-bold text-muted-foreground/30 uppercase tracking-[0.2em] group-hover:text-blue-400/50 transition-colors">System Log</span>
                     <span className="text-[8px] font-mono text-blue-400/40 opacity-0 group-hover:opacity-100 transition-opacity">{p.log}</span>
                   </div>
                 </motion.div>
               ))}
            </div>
          </motion.div>
        </section>

        {/* Footer */}
        <footer className="relative z-10 pt-32 pb-16 px-6 glass-card !rounded-none !bg-background/80 backdrop-blur-xl border-t border-white/5">
          <div className="max-w-7xl mx-auto space-y-16">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
              <div className="col-span-1 md:col-span-2 space-y-6">
                <div className="flex items-center gap-2 group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                  <div className="p-1.5 rounded-lg bg-primary">
                    <Zap className="w-5 h-5 text-primary-foreground fill-current" />
                  </div>
                  <span className="text-xl font-bold tracking-[0.2em] text-foreground uppercase">Aura Grid</span>
                </div>
                <p className="text-sm text-muted-foreground font-medium leading-relaxed max-w-sm uppercase opacity-60">
                  Pioneering autonomous energy orchestration for a sustainable future. 
                  Intelligence driven, efficiency focused.
                </p>
                <div className="flex items-center gap-4">
                  {[Twitter, Github, Linkedin, Mail].map((Icon, i) => (
                    <button key={i} className="p-2 rounded-lg bg-white/5 border border-white/5 hover:border-primary/30 transition-all group">
                      <Icon className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <h4 className="text-xs font-black tracking-[0.3em] text-foreground uppercase">Ecosystem</h4>
                <ul className="space-y-3">
                  {navLinks.map(link => (
                    <li key={link.id}>
                      <button 
                        onClick={() => scrollToSection(link.id)}
                        className="text-[10px] font-bold tracking-[0.2em] text-muted-foreground hover:text-primary transition-colors uppercase"
                      >
                        {link.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-6">
                <h4 className="text-xs font-black tracking-[0.3em] text-foreground uppercase">Portal</h4>
                <ul className="space-y-3">
                  {['Dashboard', 'Forecasting', 'Sustainability', 'Security'].map(item => (
                    <li key={item}>
                      <button onClick={() => navigate('/auth')} className="text-[10px] font-bold tracking-[0.2em] text-muted-foreground hover:text-primary transition-colors uppercase">
                        {item}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
              <span className="text-[8px] font-bold tracking-[0.4em] text-muted-foreground uppercase opacity-40">
                © 2024 Aura Grid Intelligence Protocol. All rights reserved.
              </span>
              <div className="flex gap-8">
                {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map(item => (
                  <button key={item} className="text-[8px] font-bold tracking-[0.3em] text-muted-foreground hover:text-foreground transition-colors uppercase opacity-40">
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </footer>
      </AuraBackground>
    </div>
  );
};

export default Landing;
