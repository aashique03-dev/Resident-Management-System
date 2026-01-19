import { useState, useEffect } from 'react';
import { User, Car, DollarSign, ClipboardList, Bell, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import Loader from '../../components/common/Loader';
import toast from 'react-hot-toast';

function ResidentDashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    residentName: '',
    parkingCount: 0,
    pendingBills: 0,
    activeRequests: 0,
    recentNotices: [],
    upcomingBills: [],
    myRequests: []
  });

  useEffect(() => {
    if (user?.id) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // ✅ Get profile (includes house info and parking count)
      const residentRes = await api.get(`/profile`);
      const resident = residentRes.data.data;

      // ✅ Get bills using resident endpoint
      const billsRes = await api.get(`/my/bills`);
      const myBills = billsRes.data.data || [];
      const pending = myBills.filter(b => b.status === 'pending' || b.status === 'unpaid');

      // ✅ Get notices using RESIDENT endpoint (not admin!)
      const noticesRes = await api.get(`/my/notice`);
      const noticesData = noticesRes.data.data;
      // Handle both single object and array
      const notices = Array.isArray(noticesData) ? noticesData : (noticesData ? [noticesData] : []);

      // ✅ Get requests using resident endpoint
      const requestsRes = await api.get(`/my/request`);
      const requestsData = requestsRes.data.data;
      // Handle both single object and array
      const myRequests = Array.isArray(requestsData) ? requestsData : (requestsData ? [requestsData] : []);
      const activeRequests = myRequests.filter(r => r.status !== 'completed');

      setDashboardData({
        residentName: resident.name || user.name,
        parkingCount: resident.parkingSlotCount || 0,
        pendingBills: pending.length,
        activeRequests: activeRequests.length,
        recentNotices: notices.slice(0, 3),
        upcomingBills: pending.slice(0, 3),
        myRequests: myRequests.slice(0, 3)
      });

    } catch (error) {
      console.error('Error fetching dashboard:', error);
      toast.error('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  if (!user) {
    return (
      <div className="page">
        <div className="empty-state">
          <p className="empty-text">Please log in to view dashboard</p>
        </div>
      </div>
    );
  }

  if (loading) return <Loader />;

  return (
    <div className="page">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">My Dashboard</h1>
          <p className="page-subtitle">Welcome back, {dashboardData.residentName || user.name}</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <Link to="/resident/profile" className="stat-card stat-blue" style={{ textDecoration: 'none', cursor: 'pointer' }}>
          <div className="stat-icon">
            <User size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-value" style={{ fontSize: '1.2rem' }}>{dashboardData.residentName || user.name}</div>
            <div className="stat-label">My Profile</div>
          </div>
        </Link>

        <div className="stat-card stat-green">
          <div className="stat-icon">
            <Car size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{dashboardData.parkingCount}</div>
            <div className="stat-label">Parking Slots</div>
          </div>
        </div>

        <div className="stat-card stat-yellow">
          <div className="stat-icon">
            <DollarSign size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{dashboardData.pendingBills}</div>
            <div className="stat-label">Pending Bills</div>
          </div>
        </div>

        <div className="stat-card stat-red">
          <div className="stat-icon">
            <ClipboardList size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{dashboardData.activeRequests}</div>
            <div className="stat-label">Active Requests</div>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="dashboard-content">
        {/* Recent Notices */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">
              <Bell size={20} />
              Recent Notices
            </h2>
            <Link to="/resident/notices" className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
              View All
              <ArrowRight size={16} />
            </Link>
          </div>
          <div style={{ padding: '1rem' }}>
            {dashboardData.recentNotices.length === 0 ? (
              <p className="text-muted">No recent notices</p>
            ) : (
              <div className="notices-list">
                {dashboardData.recentNotices.map((notice) => (
                  <div key={notice.id} className="notice-item">
                    <div className="notice-header">
                      <span className={`badge badge-${notice.category || 'blue'}`}>
                        {notice.category || 'General'}
                      </span>
                      <span className="text-muted" style={{ fontSize: '0.85rem' }}>
                        {formatDate(notice.datePosted)}
                      </span>
                    </div>
                    <h4 style={{ margin: '0.5rem 0', fontSize: '1rem' }}>
                      {notice.title}
                    </h4>
                    <p className="text-muted" style={{ fontSize: '0.9rem' }}>
                      {notice.description && notice.description.length > 100 
                        ? notice.description.substring(0, 100) + '...' 
                        : notice.description}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Upcoming Bills */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">
              <DollarSign size={20} />
              Upcoming Bills
            </h2>
            <Link to="/resident/bills" className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
              View All
              <ArrowRight size={16} />
            </Link>
          </div>
          <div style={{ padding: '1rem' }}>
            {dashboardData.upcomingBills.length === 0 ? (
              <p className="text-muted">No pending bills</p>
            ) : (
              <div className="bills-list">
                {dashboardData.upcomingBills.map((bill) => (
                  <div key={bill.id} className="bill-item">
                    <div>
                      <h4 style={{ margin: 0, fontSize: '1rem' }}>
                        {bill.billType}
                      </h4>
                      <p className="text-muted" style={{ fontSize: '0.85rem', marginTop: '0.25rem' }}>
                        Due: {formatDate(bill.dueDate)}
                      </p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '1.2rem', fontWeight: '600', color: 'var(--text-primary)' }}>
                        Rs. {bill.amount?.toLocaleString()}
                      </div>
                      <span className={`badge badge-${bill.status === 'paid' ? 'green' : 'yellow'}`}>
                        {bill.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* My Recent Requests */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">
              <ClipboardList size={20} />
              My Recent Requests
            </h2>
            <Link to="/resident/requests" className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
              View All
              <ArrowRight size={16} />
            </Link>
          </div>
          <div style={{ padding: '1rem' }}>
            {dashboardData.myRequests.length === 0 ? (
              <p className="text-muted">No recent requests</p>
            ) : (
              <div className="requests-list">
                {dashboardData.myRequests.map((request) => (
                  <div key={request.id} className="request-item">
                    <div>
                      <h4 style={{ margin: 0, fontSize: '1rem' }}>
                        {request.type}
                      </h4>
                      <p className="text-muted" style={{ fontSize: '0.85rem', marginTop: '0.25rem' }}>
                        Staff: {request.RequestedTo || 'Not assigned'}
                      </p>
                      <span className={`badge badge-${request.priority === 'high' ? 'red' : request.priority === 'medium' ? 'yellow' : 'blue'}`} style={{ marginTop: '0.5rem' }}>
                        {request.priority || 'Medium'}
                      </span>
                    </div>
                    <span className={`badge badge-${
                      request.status === 'completed' ? 'green' : 
                      request.status === 'in-progress' ? 'blue' : 'gray'
                    }`}>
                      {request.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResidentDashboard;