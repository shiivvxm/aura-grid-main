import { Bell, Wifi, LogOut, AlertTriangle, Battery, Info } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { UserMenu } from './UserMenu';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

const pageTitles: Record<string, string> = {
  '/': 'Dashboard',
  '/dashboard': 'Dashboard',
  '/monitoring': 'Live Monitoring',
  '/insights': 'AI Insights & Risk',
  '/map': 'Map & Sustainability',
};

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const title = pageTitles[location.pathname] || 'Dashboard';

  return (
    <header className="h-16 border-b border-border flex items-center justify-between px-6 glass-card-sm rounded-none border-x-0 border-t-0 sticky top-0 z-[60] bg-background/50 backdrop-blur-lg">
      <h1 className="text-lg font-semibold text-foreground">{title}</h1>

      <div className="flex items-center gap-4">
        {/* System status */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Wifi className="w-4 h-4 text-energy" />
          <span className="hidden sm:inline">System Online</span>
          <span className="status-dot bg-energy" />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="relative p-2 rounded-xl hover:bg-accent transition-colors group"
              title="Notifications"
            >
              <Bell className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-destructive animate-pulse" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel className="flex items-center justify-between">
              Notifications
              <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold">3 NEW</span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="flex gap-3 p-3 cursor-pointer"
              onClick={() => toast("System Alert: High demand in Sector 7", {
                description: "AI balancing is in progress to prevent overload.",
                icon: <AlertTriangle className="w-4 h-4 text-warning" />,
              })}
            >
              <div className="w-8 h-8 rounded-lg bg-warning/10 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-4 h-4 text-warning" />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-sm font-semibold">Critical Demand Spike</span>
                <span className="text-xs text-muted-foreground">Sector 7 reports 15% surge in load.</span>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="flex gap-3 p-3 cursor-pointer"
              onClick={() => toast("Optimization Complete: Battery 3", {
                description: "Storage efficiency improved by 4.2%.",
                icon: <Battery className="w-4 h-4 text-energy" />,
              })}
            >
              <div className="w-8 h-8 rounded-lg bg-energy/10 flex items-center justify-center shrink-0">
                <Battery className="w-4 h-4 text-energy" />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-sm font-semibold">Battery Optimization</span>
                <span className="text-xs text-muted-foreground">Unit 3 storage cycle recalibrated.</span>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="flex gap-3 p-3 cursor-pointer"
              onClick={() => toast("Maintenance Scheduled", {
                description: "Substation B-12 routine check tomorrow at 04:00.",
                icon: <Info className="w-4 h-4 text-blue-500" />,
              })}
            >
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
                <Info className="w-4 h-4 text-blue-500" />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-sm font-semibold">Scheduled Checkup</span>
                <span className="text-xs text-muted-foreground">Routine audit for grid resilience.</span>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <UserMenu />

        <button
          onClick={() => {
            localStorage.removeItem('aura-current-user');
            localStorage.removeItem('aura-user-photo');
            navigate('/auth');
            toast.success("Session Terminated", {
              description: "You have been logged out securely.",
            });
          }}
          className="p-2 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive hover:bg-destructive hover:text-white transition-all group"
          title="Logout"
        >
          <LogOut className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
        </button>
      </div>
    </header>
  );
}



