import { Building2, Users, ClipboardList, DollarSign, Car, Bell, Briefcase, ArrowRight, CheckCircle, Shield, BarChart3, Home } from 'lucide-react';
import { Link } from 'react-router-dom';


function LandingPage() {
  return (
    <div className="landing-page">
      {/* Navbar */}
      <nav className="landing-navbar">
        <div className="landing-nav-container">
          <div className="landing-logo">
            <Building2 size={32} />
            <span>RSMS</span>
          </div>

          <Link to="/login" className="landing-btn-login">
            Login
            <ArrowRight size={18} />
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="landing-hero">
        <div className="landing-hero-content">
          <div className="landing-badge">
            <Shield size={16} />
            <span>Residential Society Management</span>
          </div>
          <h1 className="landing-hero-title">
            Manage Your Society <br />
            <span className="landing-gradient-text">Digitally & Efficiently</span>
          </h1>
          <p className="landing-hero-subtitle">
            Complete management solution for residential societies with 60 houses across 3 blocks.
            Handle residents, maintenance, bills, parking, and more in one powerful platform.
          </p>
          <Link to="/admin" className="landing-btn-primary">
            Go to Dashboard
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>


      {/* Features Section */}
      <section className="landing-features">
        <div className="landing-section-header">
          <h2>Complete Management Features</h2>
          <p>Everything you need to run your society efficiently</p>
        </div>

        <div className="landing-features-grid">
          {/* Feature 1: Residents */}
          <div className="landing-feature-card">
            <div className="landing-feature-icon blue">
              <Users size={28} />
            </div>
            <h3>Residents Management</h3>
            <p>Complete database of all 60 houses residents with house assignments, contact info, and role management.</p>
            <ul className="landing-feature-list">
              <li><CheckCircle size={16} /> Add/Edit/Delete residents</li>
              <li><CheckCircle size={16} /> Assign to houses (A, B, C blocks)</li>
              <li><CheckCircle size={16} /> Role-based access (Admin/Resident)</li>
              <li><CheckCircle size={16} /> Search & filter residents</li>
            </ul>
          </div>

          {/* Feature 2: Houses */}
          <div className="landing-feature-card">
            <div className="landing-feature-icon green">
              <Home size={28} />
            </div>
            <h3>Houses Management</h3>
            <p>Manage all 60 houses across 3 blocks (A, B, C) with complete details and occupancy tracking.</p>
            <ul className="landing-feature-list">
              <li><CheckCircle size={16} /> 60 houses in 3 blocks</li>
              <li><CheckCircle size={16} /> House types (1BHK, 2BHK, 3BHK)</li>
              <li><CheckCircle size={16} /> Parking slot allocation</li>
              <li><CheckCircle size={16} /> Occupancy status</li>
            </ul>
          </div>

          {/* Feature 3: Requests */}
          <div className="landing-feature-card">
            <div className="landing-feature-icon purple">
              <ClipboardList size={28} />
            </div>
            <h3>Maintenance Requests</h3>
            <p>Track all maintenance requests from residents with staff assignment and status updates.</p>
            <ul className="landing-feature-list">
              <li><CheckCircle size={16} /> Submit maintenance requests</li>
              <li><CheckCircle size={16} /> Assign to 10 staff members</li>
              <li><CheckCircle size={16} /> Priority levels (Low/Medium/High)</li>
              <li><CheckCircle size={16} /> Status tracking (Pending/In-Progress/Completed)</li>
            </ul>
          </div>

          {/* Feature 4: Bills */}
          <div className="landing-feature-card">
            <div className="landing-feature-icon yellow">
              <DollarSign size={28} />
            </div>
            <h3>Bill Management</h3>
            <p>Generate and track monthly bills for all houses with payment status monitoring.</p>
            <ul className="landing-feature-list">
              <li><CheckCircle size={16} /> Monthly bill generation</li>
              <li><CheckCircle size={16} /> Payment status tracking</li>
              <li><CheckCircle size={16} /> Overdue bill alerts</li>
              <li><CheckCircle size={16} /> Billing history</li>
            </ul>
          </div>

          {/* Feature 5: Parking */}
          <div className="landing-feature-card">
            <div className="landing-feature-icon red">
              <Car size={28} />
            </div>
            <h3>Parking Management</h3>
            <p>Allocate and manage parking slots for all houses with vehicle type tracking.</p>
            <ul className="landing-feature-list">
              <li><CheckCircle size={16} /> Parking slot allocation</li>
              <li><CheckCircle size={16} /> Vehicle type & number</li>
              <li><CheckCircle size={16} /> Available/Occupied status</li>
              <li><CheckCircle size={16} /> House-wise parking</li>
            </ul>
          </div>

          {/* Feature 6: Notices */}
          <div className="landing-feature-card">
            <div className="landing-feature-icon orange">
              <Bell size={28} />
            </div>
            <h3>Notices & Announcements</h3>
            <p>Post important announcements and notices for all society residents.</p>
            <ul className="landing-feature-list">
              <li><CheckCircle size={16} /> Society-wide announcements</li>
              <li><CheckCircle size={16} /> Category-based notices</li>
              <li><CheckCircle size={16} /> Emergency alerts</li>
              <li><CheckCircle size={16} /> Notice history</li>
            </ul>
          </div>

          {/* Feature 7: Staff */}
          <div className="landing-feature-card">
            <div className="landing-feature-icon teal">
              <Briefcase size={28} />
            </div>
            <h3>Staff Management</h3>
            <p>Manage 10 staff members including electricians, plumbers, cleaners, and security.</p>
            <ul className="landing-feature-list">
              <li><CheckCircle size={16} /> 10 staff members</li>
              <li><CheckCircle size={16} /> Role assignment</li>
              <li><CheckCircle size={16} /> Request assignment</li>
              <li><CheckCircle size={16} /> Workload tracking</li>
            </ul>
          </div>

          {/* Feature 8: Dashboard */}
          <div className="landing-feature-card">
            <div className="landing-feature-icon blue">
              <BarChart3 size={28} />
            </div>
            <h3>Analytics Dashboard</h3>
            <p>Real-time statistics and insights about your society operations.</p>
            <ul className="landing-feature-list">
              <li><CheckCircle size={16} /> Total residents count</li>
              <li><CheckCircle size={16} /> Pending requests stats</li>
              <li><CheckCircle size={16} /> Billing overview</li>
              <li><CheckCircle size={16} /> Occupancy rates</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="landing-stats">
        <div className="landing-stat-card">
          <div className="landing-stat-number">60</div>
          <div className="landing-stat-label">Houses Managed</div>
        </div>
        <div className="landing-stat-card">
          <div className="landing-stat-number">3</div>
          <div className="landing-stat-label">Blocks (A, B, C)</div>
        </div>
        <div className="landing-stat-card">
          <div className="landing-stat-number">10</div>
          <div className="landing-stat-label">Staff Members</div>
        </div>
        <div className="landing-stat-card">
          <div className="landing-stat-number">100%</div>
          <div className="landing-stat-label">Digital System</div>
        </div>
      </section>

      <section className="landing-cta">
        <h2>Ready to Get Started?</h2>
        <p>Access your dashboard to manage tasks, track updates, and stay connected.</p>
        <Link to="/admin" className="landing-btn-cta">
          Go to Dashboard
          <ArrowRight size={20} />
        </Link>
      </section>


      {/* Footer */}
      <footer className="landing-footer">
        <div className="landing-footer-content">
          <div className="landing-footer-logo">
            <Building2 size={28} />
            <span>RSMS</span>
          </div>
          <p>Residential Society Management System</p>
        </div>
        <div className="landing-footer-bottom">
          <p>&copy; 2025 RSMS. University Database Project.</p>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;