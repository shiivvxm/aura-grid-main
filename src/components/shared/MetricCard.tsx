import { motion } from 'framer-motion';
import { type LucideIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

interface MetricCardProps {
  title: string;
  value: number;
  unit: string;
  icon: LucideIcon;
  color: 'primary' | 'energy' | 'warning' | 'destructive';
  trend?: 'up' | 'down';
  delay?: number;
}

const colorMap = {
  primary: { icon: 'text-primary', glow: 'glow-primary', bg: 'bg-primary/10' },
  energy: { icon: 'text-energy', glow: 'glow-energy', bg: 'bg-energy/10' },
  warning: { icon: 'text-warning', glow: 'glow-warning', bg: 'bg-warning/10' },
  destructive: { icon: 'text-destructive', glow: 'glow-danger', bg: 'bg-destructive/10' },
};

export default function MetricCard({ title, value, unit, icon: Icon, color, trend, delay = 0 }: MetricCardProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const c = colorMap[color];

  useEffect(() => {
    const duration = 600;
    const start = displayValue;
    const diff = value - start;
    const startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(start + diff * eased);
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [value]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay * 0.1, duration: 0.5 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="glass-card group cursor-default"
    >
      <div className="flex items-start justify-between mb-4">
        <span className="text-sm text-muted-foreground font-medium">{title}</span>
        <div className={`p-2 rounded-xl ${c.bg} group-hover:${c.glow} transition-shadow`}>
          <Icon className={`w-5 h-5 ${c.icon}`} />
        </div>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-bold text-foreground tabular-nums">
          {displayValue.toFixed(value >= 100 ? 0 : 1)}
        </span>
        <span className="text-sm text-muted-foreground">{unit}</span>
        {trend && (
          <span className={`text-xs font-medium ml-auto ${trend === 'up' ? 'text-energy' : 'text-destructive'}`}>
            {trend === 'up' ? '↑ 3.2%' : '↓ 1.8%'}
          </span>
        )}
      </div>
    </motion.div>
  );
}
