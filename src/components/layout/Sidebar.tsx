import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, Activity, Brain, Map, Zap, ChevronLeft, ChevronRight, Globe, TrendingUp, Settings as SettingsIcon, ShieldAlert,
} from 'lucide-react';

import { useRealtimeData } from '@/hooks/useRealtimeData';
import { Progress } from '../ui/progress';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/monitoring', label: 'Live Monitoring', icon: Activity },
  { path: '/forecasting', label: 'AI Forecasting', icon: TrendingUp },
  { path: '/smart-map', label: 'Smart Live Map', icon: Globe },
  { path: '/insights', label: 'AI Insights', icon: Brain },
  { path: '/settings', label: 'Settings', icon: SettingsIcon },
  { path: '/admin', label: 'Admin Panel', icon: ShieldAlert },
];


interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}


export default function Sidebar({ collapsed, setCollapsed }: SidebarProps) {
  const location = useLocation();
  const { metrics } = useRealtimeData();


  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 72 : 240 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      onMouseEnter={() => setCollapsed(false)}
      onMouseLeave={() => setCollapsed(true)}
      className="fixed left-0 top-0 h-screen z-40 flex flex-col border-r border-sidebar-border backdrop-blur-xl bg-sidebar/80"
    >


      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-sidebar-border">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
          <Zap className="w-5 h-5 text-primary-foreground" />
        </div>
        {!collapsed && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-foreground font-bold text-sm tracking-tight whitespace-nowrap"
          >
            AI Smart Grid
          </motion.span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-2 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                ${isActive
                  ? 'bg-primary/15 text-primary glow-primary'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-foreground'
                }
              `}
            >
              <item.icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-primary' : ''}`} />
              {!collapsed && <span className="whitespace-nowrap">{item.label}</span>}
              {isActive && !collapsed && (
                <motion.div
                  layoutId="activeIndicator"
                  className="ml-auto w-1.5 h-1.5 rounded-full bg-primary"
                />
              )}
            </NavLink>
          );
        })}

        {/* AI Prediction Widget (Sidebar Expanded) */}
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mx-2 mt-8 pt-6 border-t border-sidebar-border"
          >
            <div className="glass-card-sm border-primary/20 bg-primary/5 p-3">
              <div className="flex items-center gap-2 mb-3">
                <Brain className="w-3.5 h-3.5 text-primary" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-primary">AI Neural Status</span>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-[9px] font-black text-muted-foreground mb-1 uppercase tracking-tighter">
                    <span>Confidence</span>
                    <span className="text-primary">{metrics.confidencePercent}%</span>
                  </div>
                  <Progress
                    value={metrics.confidencePercent}
                    className="h-1 bg-white/5"
                    indicatorClassName="bg-primary shadow-[0_0_8px_rgba(var(--primary),0.5)]"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-energy animate-pulse shadow-[0_0_4px_rgba(var(--energy),0.5)]" />
                    <span className="text-[9px] font-bold text-muted-foreground uppercase">Stable</span>
                  </div>
                  <span className="text-[8px] font-mono text-primary/60">v4.2-α</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* AI Prediction Indicator (Sidebar Collapsed) */}
        {collapsed && (
          <div className="flex flex-col items-center gap-4 mt-8 pt-6 border-t border-sidebar-border">
            <div className="w-8 h-8 rounded-full border border-primary/20 bg-primary/5 flex items-center justify-center relative">
              <Brain className="w-4 h-4 text-primary" />
              <div className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-energy animate-pulse border border-background" />
            </div>
          </div>
        )}
      </nav>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="mx-2 mb-4 p-2 rounded-xl text-sidebar-foreground hover:bg-sidebar-accent hover:text-foreground transition-colors flex items-center justify-center"
      >
        {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>
    </motion.aside>
  );
}
