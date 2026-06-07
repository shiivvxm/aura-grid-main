import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { AuraBackground } from '@/components/layout/AuraBackground';
import { Zap, Mail, Lock, User, Github, Chrome, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

const Auth = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Check for existing session
  React.useEffect(() => {
    const currentUser = localStorage.getItem('aura-current-user');
    if (currentUser) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Get stored users or initialize empty array
    const storedUsers = JSON.parse(localStorage.getItem('aura-users') || '[]');

    if (isLogin) {
      // Login Logic
      const user = storedUsers.find((u: any) => u.email === email && u.password === password);
      if (user) {
        localStorage.setItem('aura-current-user', JSON.stringify(user));
        toast.success(`Welcome back, ${user.name}!`);
        navigate('/dashboard');
      } else {
        toast.error('Invalid email or password. Please create an account if you haven\'t already.');
      }
    } else {
      // Registration Logic
      const userExists = storedUsers.some((u: any) => u.email === email);
      if (userExists) {
        toast.error('An account with this email already exists.');
      } else {
        const newUser = { name, email, password };
        const updatedUsers = [...storedUsers, newUser];
        localStorage.setItem('aura-users', JSON.stringify(updatedUsers));
        localStorage.setItem('aura-current-user', JSON.stringify(newUser));
        toast.success('Account created successfully!');
        navigate('/dashboard');
      }
    }
  };

  return (
    <div className="min-h-screen bg-background overflow-hidden selection:bg-primary/30">
      <AuraBackground>
        {/* Back to Landing */}
        <button
          onClick={() => navigate('/')}
          className="relative z-20 flex items-center gap-2 p-6 text-muted-foreground hover:text-foreground transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Back to Home</span>
        </button>

        <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-80px)] px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md"
          >
            {/* Logo area */}
            <div className="text-center mb-8">
              <div className="inline-flex p-3 rounded-2xl bg-primary/20 border border-primary/30 mb-4 glow-primary">
                <Zap className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground uppercase italic">
                {isLogin ? 'Welcome Back' : 'Create Account'}
              </h1>
              <p className="text-muted-foreground mt-2 font-medium opacity-70">
                Join the future of smart energy management.
              </p>
            </div>

            {/* Glass Card */}
            <div className="glass-card !p-8 border-primary/20 relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />

              {/* Tabs */}
              <div className="flex bg-white/5 rounded-xl p-1 mb-8 border border-white/10">
                <button
                  type="button"
                  onClick={() => setIsLogin(true)}
                  className={`flex-1 py-3 px-4 rounded-xl text-xs font-black tracking-widest uppercase transition-all ${isLogin ? 'bg-primary text-primary-foreground shadow-lg scale-105' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  Login
                </button>
                <button
                  type="button"
                  onClick={() => setIsLogin(false)}
                  className={`flex-1 py-3 px-4 rounded-xl text-xs font-black tracking-widest uppercase transition-all ${!isLogin ? 'bg-primary text-primary-foreground shadow-lg scale-105' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  Register
                </button>
              </div>

              <form className="space-y-5" onSubmit={handleSubmit}>
                <AnimatePresence mode="wait">
                  {!isLogin && (
                    <motion.div
                      key="name-input"
                      initial={{ opacity: 0, height: 0, y: -10 }}
                      animate={{ opacity: 1, height: 'auto', y: 0 }}
                      exit={{ opacity: 0, height: 0, y: -10 }}
                      className="relative"
                    >
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input
                        type="text"
                        placeholder="Full Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required={!isLogin}
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-xs font-bold tracking-widest focus:outline-none focus:border-primary/50 transition-colors placeholder:text-muted-foreground/30"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-xs font-bold tracking-widest focus:outline-none focus:border-primary/50 transition-colors placeholder:text-muted-foreground/30"
                  />
                </div>

                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-xs font-bold tracking-widest focus:outline-none focus:border-primary/50 transition-colors placeholder:text-muted-foreground/30"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-xl bg-primary text-primary-foreground font-black tracking-[0.2em] uppercase hover:opacity-90 active:scale-95 transition-all glow-primary mt-6 text-xs"
                >
                  {isLogin ? 'Initialize Session' : 'Create Protocol'}
                </button>
              </form>

              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
                <div className="relative flex justify-center text-[10px] font-bold tracking-[0.3em] uppercase"><span className="bg-[#0a0a0b] px-3 text-muted-foreground/50">Connectivity Bridge</span></div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button className="flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-[10px] font-black uppercase tracking-widest opacity-60 hover:opacity-100">
                  <Chrome className="w-3 h-3" /> Google
                </button>
                <button className="flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-[10px] font-black uppercase tracking-widest opacity-60 hover:opacity-100">
                  <Github className="w-3 h-3" /> GitHub
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </AuraBackground>
    </div>
  );
};

export default Auth;
