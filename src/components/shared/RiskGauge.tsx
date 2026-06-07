import { motion } from 'framer-motion';

interface RiskGaugeProps {
  value: number;
  label: string;
  color: 'primary' | 'energy' | 'warning' | 'destructive';
}

const colorHSL = {
  primary: '199 89% 48%',
  energy: '142 71% 45%',
  warning: '38 92% 50%',
  destructive: '0 84% 60%',
};

export default function RiskGauge({ value, label, color }: RiskGaugeProps) {
  const circumference = 2 * Math.PI * 40;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-24 h-24">
        <svg className="w-24 h-24 -rotate-90" viewBox="0 0 96 96">
          <circle cx="48" cy="48" r="40" fill="none" stroke="hsl(217 33% 20%)" strokeWidth="6" />
          <motion.circle
            cx="48"
            cy="48"
            r="40"
            fill="none"
            stroke={`hsl(${colorHSL[color]})`}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-bold text-foreground">{Math.round(value)}%</span>
        </div>
      </div>
      <span className="text-xs text-muted-foreground font-medium">{label}</span>
    </div>
  );
}
