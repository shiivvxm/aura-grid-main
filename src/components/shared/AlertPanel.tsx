import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, ShieldAlert, Zap, Info, X } from 'lucide-react';
import type { Alert } from '@/services/mockData';

const iconMap = {
  overload: Zap,
  blackout: AlertTriangle,
  theft: ShieldAlert,
  warning: Info,
};

const severityColors = {
  low: 'border-l-muted-foreground',
  medium: 'border-l-warning',
  high: 'border-l-primary',
  critical: 'border-l-destructive',
};

const severityBg = {
  low: 'bg-muted/30',
  medium: 'bg-warning/5',
  high: 'bg-primary/5',
  critical: 'bg-destructive/5',
};

interface AlertCardProps {
  alerts: Alert[];
  onDismiss?: (id: string) => void;
}

export default function AlertPanel({ alerts, onDismiss }: AlertCardProps) {
  return (
    <div className="glass-card">
      <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
        <AlertTriangle className="w-4 h-4 text-warning" />
        Real-Time Alerts
      </h3>
      <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
        <AnimatePresence initial={false}>
          {alerts.map((alert) => {
            const Icon = iconMap[alert.type];
            return (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40, height: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex items-start gap-3 p-3 rounded-xl border-l-2 ${severityColors[alert.severity]} ${severityBg[alert.severity]}`}
              >
                <Icon className="w-4 h-4 mt-0.5 text-muted-foreground shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{alert.title}</p>
                  <p className="text-xs text-muted-foreground truncate">{alert.message}</p>
                </div>
                {onDismiss && (
                  <button onClick={() => onDismiss(alert.id)} className="text-muted-foreground hover:text-foreground">
                    <X className="w-3 h-3" />
                  </button>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
