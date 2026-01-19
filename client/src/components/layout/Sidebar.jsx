import { Home, Users, Building2, ClipboardList, DollarSign, Car, Bell, Briefcase, LogOut } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function Sidebar() {
  const location = useLocation();
  const { logout } = useAuth();

  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/admin' },
    { icon: Users, label: 'Residents', path: '/admin/residents' },
    { icon: Building2, label: 'Houses', path: '/admin/houses' },
    { icon: ClipboardList, label: 'Requests', path: '/admin/requests' },
    { icon: DollarSign, label: 'Bills', path: '/admin/bills' },
    { icon: Car, label: 'Parking', path: '/admin/parking' },
    { icon: Bell, label: 'Notices', path: '/admin/notices' },
    { icon: Briefcase, label: 'Staff', path: '/admin/staff' },
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="logo">
          <Building2 size={32} className="logo-icon" />
          <span className="logo-text">RSMS</span>
        </div>
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
  );
}

export default Sidebar;