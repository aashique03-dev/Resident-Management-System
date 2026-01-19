import { useEffect, useState } from 'react';
import { Bell, Calendar, User, Tag } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import Loader from '../../components/common/Loader';
import toast from 'react-hot-toast';

function ResidentNotices() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [notices, setNotices] = useState([]);
  const [filter, setFilter] = useState('all'); // all, general, event, maintenance, emergency

  useEffect(() => {
    if (user?.id) fetchNotices();
  }, [user]);

  const fetchNotices = async () => {
    try {
      setLoading(true);
      const res = await api.get('/my/notice');
      setNotices(res.data.data ? (Array.isArray(res.data.data) ? res.data.data : [res.data.data]) : []);
    } catch (error) {
      console.error('Error fetching notices:', error);
      toast.error('Failed to load notices');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const getCategoryIcon = (category) => {
    switch (category?.toLowerCase()) {
      case 'event': return '🎉';
      case 'maintenance': return '🔧';
      case 'emergency': return '🚨';
      default: return '📢';
    }
  };

  const getCategoryColor = (category) => {
    switch (category?.toLowerCase()) {
      case 'event': return 'purple';
      case 'maintenance': return 'yellow';
      case 'emergency': return 'red';
      default: return 'blue';
    }
  };

  const filteredNotices = notices.filter(notice => {
    if (filter === 'all') return true;
    return notice.category?.toLowerCase() === filter;
  });

  const getStats = () => {
    return {
      all: notices.length,
      general: notices.filter(n => n.category === 'general').length,
      event: notices.filter(n => n.category === 'event').length,
      maintenance: notices.filter(n => n.category === 'maintenance').length,
      emergency: notices.filter(n => n.category === 'emergency').length,
    };
  };

  if (!user) {
    return (
      <div className="page">
        <div className="empty-state">
          <Bell size={48} className="empty-icon" />
          <p className="empty-text">Please log in to view notices</p>
        </div>
      </div>
    );
  }

  if (loading) return <Loader />;

  const stats = getStats();

  return (
    <div className="page">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Society Notices</h1>
          <p className="page-subtitle">Stay updated with all announcements and alerts</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid" style={{ marginBottom: '2rem' }}>
        <div className="stat-card stat-blue">
          <div className="stat-icon">
            <Bell size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats.all}</div>
            <div className="stat-label">Total Notices</div>
          </div>
        </div>

        <div className="stat-card stat-purple">
          <div className="stat-icon">
            <Tag size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats.event}</div>
            <div className="stat-label">Events</div>
          </div>
        </div>

        <div className="stat-card stat-yellow">
          <div className="stat-icon">
            <Tag size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats.maintenance}</div>
            <div className="stat-label">Maintenance</div>
          </div>
        </div>

        <div className="stat-card stat-red">
          <div className="stat-icon">
            <Tag size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats.emergency}</div>
            <div className="stat-label">Emergency</div>
          </div>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ padding: '1rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button 
            className={`filter-chip ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All Notices
            <span className="filter-count">{stats.all}</span>
          </button>
          <button 
            className={`filter-chip ${filter === 'general' ? 'active' : ''}`}
            onClick={() => setFilter('general')}
          >
            General
            <span className="filter-count">{stats.general}</span>
          </button>
          <button 
            className={`filter-chip ${filter === 'event' ? 'active' : ''}`}
            onClick={() => setFilter('event')}
          >
            Events
            <span className="filter-count">{stats.event}</span>
          </button>
          <button 
            className={`filter-chip ${filter === 'maintenance' ? 'active' : ''}`}
            onClick={() => setFilter('maintenance')}
          >
            Maintenance
            <span className="filter-count">{stats.maintenance}</span>
          </button>
          <button 
            className={`filter-chip ${filter === 'emergency' ? 'active' : ''}`}
            onClick={() => setFilter('emergency')}
          >
            Emergency
            <span className="filter-count">{stats.emergency}</span>
          </button>
        </div>
      </div>

      {/* Notices Grid */}
      {filteredNotices.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <Bell size={48} className="empty-icon" />
            <p className="empty-text">No notices found</p>
          </div>
        </div>
      ) : (
        <div className="residents-grid">
          {filteredNotices.map((notice) => (
            <div key={notice.id} className="resident-card">
              {/* Card Header */}
              <div className="resident-card-header">
                <div className="resident-avatar">
                  {getCategoryIcon(notice.category)}
                </div>
                <div className="resident-card-info">
                  <h3 className="resident-name">{notice.title}</h3>
                  <span className={`role-badge role-${getCategoryColor(notice.category)}`}>
                    {notice.category || 'General'}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="resident-card-body">
                <div className="info-row">
                  <User size={16} />
                  <span>Posted by {notice.PostedBy}</span>
                </div>

                <div className="info-row">
                  <Tag size={16} />
                  <span className="truncate">{notice.role}</span>
                </div>

                <div className="info-row">
                  <Calendar size={16} />
                  <span>{formatDate(notice.datePosted)}</span>
                </div>

                {/* Description Box */}
                <div style={{ 
                  marginTop: '0.75rem',
                  padding: '0.875rem',
                  background: 'var(--bg-primary)',
                  borderRadius: '8px',
                  border: '1px solid var(--border)'
                }}>
                  <div style={{ 
                    fontSize: '0.9rem',
                    lineHeight: '1.6',
                    color: 'var(--text-secondary)'
                  }}>
                    {notice.description}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ResidentNotices;