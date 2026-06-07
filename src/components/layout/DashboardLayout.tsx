import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { AuraBackground } from './AuraBackground';
import { useState, useEffect } from 'react';

export default function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = localStorage.getItem('aura-current-user');
    if (!currentUser) {
      navigate('/auth');
    }
  }, [navigate]);

  return (
    <div className="flex min-h-screen">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      {/* Main content - dynamically offset by sidebar width */}
      <div 
        className="flex-1 flex flex-col transition-all duration-300 ease-in-out"
        style={{ marginLeft: collapsed ? '72px' : '240px' }}
      >
        <Navbar />
        <AuraBackground>
          <main className="flex-1 p-6 overflow-auto">
            <Outlet />
          </main>
        </AuraBackground>
      </div>
    </div>
  );
}


