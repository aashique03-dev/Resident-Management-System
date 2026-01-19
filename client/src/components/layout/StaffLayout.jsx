import { useState } from 'react';
import StaffSidebar from './StaffSidebar';
import { Toaster } from 'react-hot-toast';
import { Menu, Bell, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

function StaffLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();

  return (
    <div className="app-container">
      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="sidebar-overlay active" 
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <StaffSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="main-container">
        {/* Mobile Header */}
        <div className="mobile-header">
          <button 
            className="hamburger"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={24} />
          </button>
          <div className="logo">
            <span className="logo-text">RSMS</span>
          </div>
          <div style={{ width: '40px' }} />
        </div>

        {/* Desktop Navbar */}
        <div className="navbar">
          <div className="navbar-search">
            <span style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              Staff Portal
            </span>
          </div>

          <div className="navbar-actions">
            <button className="icon-btn">
              <Bell size={20} />
              <span className="badge">2</span>
            </button>

            <div className="user-menu">
              <div className="user-avatar">
                <User size={20} />
              </div>
              <div className="user-info">
                <span className="user-name">{user?.name || 'Staff'}</span>
                <span className="user-role">{user?.role || 'staff'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="content">
          {children}
        </div>
      </div>

      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: '#1e293b',
            color: '#e2e8f0',
            border: '1px solid #334155',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </div>
  );
}

export default StaffLayout;