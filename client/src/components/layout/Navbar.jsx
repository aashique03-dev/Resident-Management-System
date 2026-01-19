import { Search, Bell, User } from 'lucide-react';

function Navbar() {
  return (
    <div className="navbar">
      <div className="navbar-search">
        <Search size={20} className="search-icon" />
        <input 
          type="text" 
          placeholder="Search residents, houses..." 
          className="search-input"
        />
      </div>

      <div className="navbar-actions">
        <button className="icon-btn">
          <Bell size={20} />
          <span className="badge">3</span>
        </button>

        <div className="user-menu">
          <div className="user-avatar">
            <User size={20} />
          </div>
          <div className="user-info">
            <span className="user-name">Admin</span>
            <span className="user-role">Administrator</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;