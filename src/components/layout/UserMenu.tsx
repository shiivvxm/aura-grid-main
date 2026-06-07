import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  User, LogOut, Settings, Shield, ChevronDown,
  Key, Mail, Moon, Globe, BellRing,
  MapPin, Clock, Fingerprint, Lock, ShieldCheck,
  UserPen, CreditCard, Activity, Camera, Loader2
} from 'lucide-react';
import { toast } from "sonner";

export const UserMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Safe localStorage getter
  const getSafeStorage = (key: string, fallback: string | null = null) => {
    try {
      return localStorage.getItem(key) || fallback;
    } catch (e) {
      console.warn("Storage access failed:", e);
      return fallback;
    }
  };

  // Load initial state safely
  const [profilePic, setProfilePic] = useState<string | null>(getSafeStorage('aura-user-photo'));

  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Load user info safely from session
  const currentUser = JSON.parse(getSafeStorage('aura-current-user') || '{}');
  const userName = currentUser.name || 'ishika';
  const userEmail = currentUser.email || 'ishika@auragrid.ai';
  const userRole = 'Grid Admin';
  const userRegion = 'North Sector (Zone A3)';
  const lastLogin = new Date().toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' });

  const handleLogout = async () => {
    setIsLoggingOut(true);
    toast("Security Session Ending", {
      description: "Clearing local encryption keys and session data...",
      icon: <Loader2 className="w-4 h-4 animate-spin" />,
    });

    // Simulate backend sync delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // REAL LOGOUT: Clear local storage
    localStorage.removeItem('aura-current-user');
    localStorage.removeItem('aura-user-photo');

    toast.success("Logged Out Successfully", {
      description: "Session data cleared from this device.",
    });

    setTimeout(() => {
      setIsLoggingOut(false);
      navigate('/auth');
    }, 500);
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Limit to 2.5MB to avoid localStorage quota issues
      if (file.size > 2.5 * 1024 * 1024) {
        toast.error("File Too Large", {
          description: "Please select an image smaller than 2.5MB for persistent storage.",
        });
        return;
      }

      setIsUploading(true);
      toast("Syncing Avatar", {
        description: `Processing ${file.name}...`,
        icon: <Loader2 className="w-4 h-4 animate-spin" />,
      });

      const reader = new FileReader();
      reader.onloadend = () => {
        try {
          const base64String = reader.result as string;
          // PERSISt: Save to localStorage
          localStorage.setItem('aura-user-photo', base64String);
          setProfilePic(base64String);

          setIsUploading(false);
          toast.success("Profile Photo Persisted", {
            description: "Your avatar will now survive page reloads.",
            icon: <User className="w-4 h-4 text-primary" />,
          });
        } catch (error) {
          setIsUploading(false);
          toast.error("Storage Error", {
            description: "Failed to persist image. It might be too large for local browser storage.",
          });
          console.error("Storage error:", error);
        }
      };
      reader.onerror = () => {
        setIsUploading(false);
        toast.error("Upload Failed", {
          description: "Could not read the selected file.",
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const MenuItem = ({ icon: Icon, label, onClick, badge, variant = 'default', disabled = false }: any) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-all group ${variant === 'destructive'
        ? 'text-destructive hover:bg-destructive/10'
        : 'text-sidebar-foreground hover:text-foreground hover:bg-white/5'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <div className="flex items-center gap-2.5">
        <Icon className={`w-3.5 h-3.5 ${variant === 'destructive' ? '' : 'group-hover:text-primary'} transition-colors`} />
        <span className="font-medium">{label}</span>
      </div>
      {badge && (
        <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary font-bold border border-primary/20">
          {badge}
        </span>
      )}
    </button>
  );

  const SectionHeading = ({ children }: { children: React.ReactNode }) => (
    <div className="px-3 pt-3 pb-1 text-left">
      <span className="text-[10px] font-black text-muted-foreground/50 uppercase tracking-[0.15em]">{children}</span>
    </div>
  );

  return (
    <div className="relative z-50">
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handlePhotoUpload}
        title="Upload profile photo"
      />

      <button
        onClick={() => {
          console.log("UserMenu Toggle Clicked. Current state:", isOpen);
          setIsOpen(!isOpen);
        }}
        className="flex items-center gap-2 p-1 rounded-full bg-primary/10 border border-primary/20 hover:bg-primary/20 transition-all group active:scale-95"
      >
        <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center shrink-0 glow-primary shadow-[0_0_20px_rgba(var(--primary),0.5)] border-2 border-white/10 overflow-hidden relative">
          {profilePic ? (
            <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <User className="w-5 h-5 text-primary-foreground" />
          )}
          {isUploading && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <Loader2 className="w-4 h-4 text-white animate-spin" />
            </div>
          )}
        </div>
        <div className="hidden md:flex flex-col items-start pr-2">
          <span className="text-xs font-bold text-foreground leading-none">{userName}</span>
          <span className="text-[10px] text-muted-foreground leading-none mt-1">{userRole}</span>
        </div>

        <ChevronDown className={`w-4 h-4 text-muted-foreground group-hover:text-foreground transition-transform duration-300 mr-1 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop Dimmer Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-[2px]"
              onClick={() => setIsOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="absolute right-0 mt-3 w-72 glass-card border-primary/30 shadow-[0_25px_60px_rgba(0,0,0,0.8)] z-50 backdrop-blur-3xl overflow-hidden !bg-[#0a0a0b]"
            >
              <div className="absolute top-0 left-0 w-full h-16 bg-gradient-to-br from-primary/10 to-transparent opacity-50" />

              <div className="max-h-[85vh] overflow-y-auto overflow-x-hidden">
                {/* Header */}
                <div className="relative p-5 border-b border-white/5">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center shrink-0 glow-primary cursor-pointer hover:bg-primary/30 transition-colors relative overflow-hidden group"
                      onClick={() => fileInputRef.current?.click()}
                      title="Update profile photo"
                    >
                      {profilePic ? (
                        <img src={profilePic} alt="User" className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-6 h-6 text-primary" />
                      )}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <Camera className="w-4 h-4 text-white" />
                      </div>
                    </div>
                    <div className="text-left">
                      <h3 className="text-sm font-bold text-foreground leading-tight">{userName}</h3>
                      <p className="text-[10px] text-muted-foreground font-medium">{userEmail}</p>
                    </div>
                  </div>
                </div>

                <div className="p-1.5 space-y-0.5">
                  {/* Basic Section */}
                  <SectionHeading>👤 Basic</SectionHeading>
                  <MenuItem
                    icon={User} label="My Profile"
                    onClick={() => { setIsOpen(false); navigate('/settings'); toast("Viewing Personal Profile"); }}
                  />
                  <MenuItem
                    icon={UserPen} label="Edit Profile"
                    onClick={() => { setIsOpen(false); navigate('/settings'); toast("Profile Editor Active"); }}
                  />
                  <MenuItem
                    icon={Key} label="Change Password"
                    onClick={() => { setIsOpen(false); toast.info("Security prompt sent to your email", { description: "Verification link dispatched to " + userEmail }); }}
                  />
                  <MenuItem
                    icon={Mail} label="Email ID" badge="Verified"
                    onClick={() => { setIsOpen(false); toast("Managing primary email identities"); }}
                  />

                  {/* System Section */}
                  <div className="my-2 border-t border-white/5" />
                  <SectionHeading>⚙️ System</SectionHeading>
                  <MenuItem
                    icon={Settings} label="Settings"
                    onClick={() => { setIsOpen(false); navigate('/settings'); }}
                  />
                  <MenuItem
                    icon={Globe} label="Language Select" badge="EN"
                    onClick={() => { setIsOpen(false); toast.success("Locale synchronized", { description: "Current language: English (Alpha Edition)" }); }}
                  />
                  <MenuItem
                    icon={BellRing} label="Notification Settings"
                    onClick={() => { setIsOpen(false); navigate('/settings'); toast("Opening alert hub"); }}
                  />

                  {/* Smart Grid Specific Section */}
                  <div className="my-2 border-t border-white/5" />
                  <SectionHeading>⚡ Smart Grid Specific</SectionHeading>
                  <MenuItem
                    icon={ShieldCheck} label="Role" badge={userRole}
                    onClick={() => { setIsOpen(false); toast("Credentials validated: FULL ADMIN"); }}
                  />
                  <MenuItem
                    icon={MapPin} label="Region / Grid Zone" badge="Zone A3"
                    onClick={() => { setIsOpen(false); toast(`Current Sector: ${userRegion}`); }}
                  />
                  <MenuItem
                    icon={Clock} label="Last Login"
                    onClick={() => { setIsOpen(false); toast.info(`Authentication Timestamp: ${lastLogin}`); }}
                  />
                  <MenuItem
                    icon={Activity} label="System Status" badge="ONLINE"
                    onClick={() => { setIsOpen(false); toast.success("Subsystems: 100% Operational"); }}
                  />

                  {/* Security Section */}
                  <div className="my-2 border-t border-white/5" />
                  <SectionHeading>🔐 Security</SectionHeading>
                  <MenuItem
                    icon={Fingerprint} label="2FA Enable" badge="ON"
                    onClick={() => { setIsOpen(false); toast.success("Biometric security active", { description: "Hardware keys validated via Neural Link" }); }}
                  />
                  <MenuItem
                    icon={Lock} label="Logout All Devices"
                    onClick={() => { setIsOpen(false); toast.warning("Force-terminating remote sessions...", { description: "Clearing 3 active endpoints." }); }}
                  />
                  <MenuItem
                    icon={LogOut} label={isLoggingOut ? "Processing..." : "Logout"} variant="destructive"
                    disabled={isLoggingOut}
                    onClick={handleLogout}
                  />
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
