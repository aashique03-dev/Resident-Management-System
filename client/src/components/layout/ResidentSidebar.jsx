import { Home, User, DollarSign, ClipboardList, Bell, LogOut, Building2, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function ResidentSidebar({ isOpen, onClose }) {
  const location = useLocation();
  const { logout } = useAuth();

  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/resident' },
    { icon: User, label: 'My Profile', path: '/resident/profile' },
    { icon: DollarSign, label: 'Bills', path: '/resident/bills' },
    { icon: ClipboardList, label: 'Requests', path: '/resident/requests' },
    { icon: Bell, label: 'Notices', path: '/resident/notices' },
  ];

  return (
    <>
      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="logo">
            <Building2 size={32} className="logo-icon" />
            <span className="logo-text">RSMS</span>
          </div>
          <button className="sidebar-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-item ${isActive ? 'active' : ''}`}
                onClick={onClose}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={logout}>
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </>
  );
}

export default ResidentSidebar;