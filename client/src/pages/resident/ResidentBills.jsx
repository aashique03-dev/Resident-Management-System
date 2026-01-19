import { useState, useEffect } from 'react';
import { DollarSign, Calendar, FileText, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import Loader from '../../components/common/Loader';
import toast from 'react-hot-toast';

function ResidentBills() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [bills, setBills] = useState([]);
  const [filter, setFilter] = useState('all'); // all, paid, unpaid, pending

  useEffect(() => {
    if (user?.id) {
      fetchBills();
    }
  }, [user]);

  const fetchBills = async () => {
    try {
      setLoading(true);
      const res = await api.get('/my/bills');
      setBills(res.data.data);
    } catch (error) {
      console.error('Error fetching bills:', error);
      toast.error('Failed to load bills');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'paid': return 'green';
      case 'unpaid': return 'red';
      case 'pending': return 'yellow';
      case 'overdue': return 'red';
      default: return 'gray';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'paid': return <CheckCircle size={20} />;
      case 'unpaid': return <AlertCircle size={20} />;
      case 'pending': return <Clock size={20} />;
      case 'overdue': return <AlertCircle size={20} />;
      default: return <Clock size={20} />;
    }
  };

  const filteredBills = bills.filter(bill => {
    if (filter === 'all') return true;
    return bill.status?.toLowerCase() === filter;
  });

  const getStats = () => {
    const paid = bills.filter(b => b.status === 'paid').length;
    const unpaid = bills.filter(b => b.status === 'unpaid' || b.status === 'overdue').length;
    const pending = bills.filter(b => b.status === 'pending').length;
    const totalAmount = bills.reduce((sum, b) => sum + (b.amount || 0), 0);
    const paidAmount = bills.filter(b => b.status === 'paid').reduce((sum, b) => sum + (b.amount || 0), 0);
    const unpaidAmount = bills.filter(b => b.status !== 'paid').reduce((sum, b) => sum + (b.amount || 0), 0);

    return { paid, unpaid, pending, totalAmount, paidAmount, unpaidAmount };
  };

  if (!user) {
    return (
      <div className="page">
        <div className="empty-state">
          <p className="empty-text">Please log in to view bills</p>
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
          <h1 className="page-title">My Bills</h1>
          <p className="page-subtitle">View and track your payment history</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid" style={{ marginBottom: '2rem' }}>
        <div className="stat-card stat-green">
          <div className="stat-icon">
            <CheckCircle size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats.paid}</div>
            <div className="stat-label">Paid Bills</div>
          </div>
        </div>

        <div className="stat-card stat-red">
          <div className="stat-icon">
            <AlertCircle size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats.unpaid}</div>
            <div className="stat-label">Unpaid Bills</div>
          </div>
        </div>

        <div className="stat-card stat-yellow">
          <div className="stat-icon">
            <Clock size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats.pending}</div>
            <div className="stat-label">Pending Bills</div>
          </div>
        </div>

        <div className="stat-card stat-blue">
          <div className="stat-icon">
            <DollarSign size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-value">Rs. {stats.unpaidAmount.toLocaleString()}</div>
            <div className="stat-label">Amount Due</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ padding: '1rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button 
            className={`filter-chip ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All Bills
            <span className="filter-count">{bills.length}</span>
          </button>
          <button 
            className={`filter-chip ${filter === 'paid' ? 'active' : ''}`}
            onClick={() => setFilter('paid')}
          >
            Paid
            <span className="filter-count">{stats.paid}</span>
          </button>
          <button 
            className={`filter-chip ${filter === 'unpaid' ? 'active' : ''}`}
            onClick={() => setFilter('unpaid')}
          >
            Unpaid
            <span className="filter-count">{stats.unpaid}</span>
          </button>
          <button 
            className={`filter-chip ${filter === 'pending' ? 'active' : ''}`}
            onClick={() => setFilter('pending')}
          >
            Pending
            <span className="filter-count">{stats.pending}</span>
          </button>
        </div>
      </div>

      {/* Bills List */}
      {filteredBills.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <p className="empty-text">No bills found</p>
          </div>
        </div>
      ) : (
        <div className="profile-grid">
          {filteredBills.map((bill) => (
            <div key={bill.id} className="card">
              <div className="card-header">
                <h2 className="card-title">
                  <FileText size={20} />
                  {bill.billType}
                </h2>
                <span className={`badge badge-${getStatusColor(bill.status)}`}>
                  {bill.status}
                </span>
              </div>

              <div className="detail-items-list">
                
                <div className="detail-item-row">
                  <div className={`detail-icon-box ${getStatusColor(bill.status)}`}>
                    {getStatusIcon(bill.status)}
                  </div>
                  <div className="detail-content">
                    <div className="detail-label">Status</div>
                    <div className="detail-value" style={{ textTransform: 'capitalize' }}>
                      {bill.status}
                    </div>
                  </div>
                </div>

                <div className="detail-item-row">
                  <div className="detail-icon-box blue">
                    <DollarSign size={20} />
                  </div>
                  <div className="detail-content">
                    <div className="detail-label">Amount</div>
                    <div className="detail-value" style={{ 
                      fontSize: '1.5rem',
                      color: bill.status === 'paid' ? 'var(--success)' : 'var(--danger)'
                    }}>
                      Rs. {bill.amount?.toLocaleString()}
                    </div>
                  </div>
                </div>

                <div className="detail-item-row">
                  <div className="detail-icon-box purple">
                    <Calendar size={20} />
                  </div>
                  <div className="detail-content">
                    <div className="detail-label">Billing Period</div>
                    <div className="detail-value">{bill.month}</div>
                  </div>
                </div>

                <div className="detail-item-row">
                  <div className="detail-icon-box yellow">
                    <Calendar size={20} />
                  </div>
                  <div className="detail-content">
                    <div className="detail-label">Due Date</div>
                    <div className="detail-value">{formatDate(bill.dueDate)}</div>
                  </div>
                </div>

                {bill.description && (
                  <div style={{ 
                    padding: '0.875rem',
                    background: 'var(--bg-primary)',
                    borderRadius: '8px',
                    border: '1px solid var(--border)'
                  }}>
                    <div className="detail-label" style={{ marginBottom: '0.5rem' }}>
                      Description
                    </div>
                    <div style={{ 
                      fontSize: '0.9rem',
                      color: 'var(--text-secondary)',
                      lineHeight: '1.5'
                    }}>
                      {bill.description}
                    </div>
                  </div>
                )}

              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ResidentBills;