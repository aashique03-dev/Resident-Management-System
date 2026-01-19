import { Users, Home, ClipboardList, DollarSign, Briefcase, TrendingUp, AlertCircle } from 'lucide-react';
import StatCard from '../../components/common/StatCard';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import Loader from '../../components/common/Loader';

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalResidents: 0,
    totalHouses: 0,
    totalStaff: 0,
    availableHouses: 0,
    occupiedHouses: 0,
    totalBills: 0,
    paidBills: 0,
    unpaidBills: 0,
    totalRevenue: 0,
    pendingRevenue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [recentBills, setRecentBills] = useState([]);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);

      // Fetch Residents
      const residents = await api.get('/residents');
      const residentsData = residents.data.data || [];

      // Fetch Houses
      const houses = await api.get('/houses');
      const housesData = houses.data.data || [];
      const available = housesData.filter(h => h.status === 'available').length;
      const occupied = housesData.filter(h => h.status === 'occupied').length;

      // Fetch Staff
      const staff = await api.get('/staff');
      const staffData = staff.data.data || [];

      // Fetch Bills
      const bills = await api.get('/bills');
      const billsData = bills.data.data || [];
      const paid = billsData.filter(b => b.status === 'paid').length;
      const unpaid = billsData.filter(b => b.status === 'unpaid' || b.status === 'pending').length;

      // Calculate revenue
      const totalRevenue = billsData
        .filter(b => b.status === 'paid')
        .reduce((sum, bill) => sum + (bill.amount || 0), 0);

      const pendingRevenue = billsData
        .filter(b => b.status === 'unpaid' || b.status === 'pending')
        .reduce((sum, bill) => sum + (bill.amount || 0), 0);

      // Get recent bills (last 5)
      const recent = billsData
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);

      setStats({
        totalResidents: residentsData.length,
        totalHouses: housesData.length,
        totalStaff: staffData.length,
        availableHouses: available,
        occupiedHouses: occupied,
        totalBills: billsData.length,
        paidBills: paid,
        unpaidBills: unpaid,
        totalRevenue: totalRevenue,
        pendingRevenue: pendingRevenue,
      });

      setRecentBills(recent);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  if (loading) return <Loader />;

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Welcome back, Admin</p>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="stats-grid">
        <StatCard
          icon={Users}
          label="Total Residents"
          value={stats.totalResidents}
          color="blue"
        />
        <StatCard
          icon={Home}
          label="Total Houses"
          value={stats.totalHouses}
          color="green"
        />
        <StatCard
          icon={Briefcase}
          label="Total Staff"
          value={stats.totalStaff}
          color="purple"
        />
        <StatCard
          icon={DollarSign}
          label="Total Bills"
          value={stats.totalBills}
          color="yellow"
        />
      </div>

      {/* Secondary Stats */}
      <div className="stats-grid" style={{ marginTop: '1.5rem' }}>
        <div className="stat-card stat-green">
          <div className="stat-icon">
            <Home size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats.availableHouses}</div>
            <div className="stat-label">Available Houses</div>
          </div>
        </div>

        <div className="stat-card stat-red">
          <div className="stat-icon">
            <Home size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{stats.occupiedHouses}</div>
            <div className="stat-label">Occupied Houses</div>
          </div>
        </div>

        <div className="stat-card stat-green">
          <div className="stat-icon">
            <TrendingUp size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-value">Rs. {stats.totalRevenue.toLocaleString()}</div>
            <div className="stat-label">Total Revenue</div>
          </div>
        </div>

        <div className="stat-card stat-yellow">
          <div className="stat-icon">
            <AlertCircle size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-value">Rs. {stats.pendingRevenue.toLocaleString()}</div>
            <div className="stat-label">Pending Revenue</div>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div
        className="dashboard-content"
        style={{
          marginTop: '2rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem'
        }}
      >
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Recent Bills</h2>
            <Link to="/admin/bills" className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
              View All
            </Link>
          </div>

          {recentBills.length === 0 ? (
            <p className="text-muted" style={{ padding: '1rem' }}>No recent bills</p>
          ) : (
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Bill ID</th>
                    <th>House</th>
                    <th>Month</th>
                    <th>Type</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Due Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentBills.map((bill) => (
                    <tr key={bill.id}>
                      <td>#{bill.id}</td>
                      <td>
                        <span className="badge badge-blue">
                          House {bill.houseId}
                        </span>
                      </td>
                      <td>{bill.month}</td>
                      <td>
                        <span className="badge badge-purple">
                          {bill.billType}
                        </span>
                      </td>
                      <td className="text-muted">
                        <strong>Rs. {bill.amount?.toLocaleString()}</strong>
                      </td>
                      <td>
                        <span className={`badge ${bill.status === 'paid' ? 'badge-green' :
                            bill.status === 'pending' ? 'badge-yellow' :
                              'badge-red'
                          }`}>
                          {bill.status}
                        </span>
                      </td>
                      <td className="text-muted">{formatDate(bill.dueDate)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Quick Stats Summary */}
        <div className="card" style={{ marginTop: '1.5rem' }}>
          <div className="card-header">
            <h2 className="card-title">Bills Summary</h2>
          </div>
          <div style={{ padding: '1.5rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
              <div>
                <div className="text-muted" style={{ fontSize: '0.9rem', marginBottom: '0.25rem' }}>Paid Bills</div>
                <div style={{ fontSize: '1.5rem', fontWeight: '600', color: 'var(--success)' }}>
                  {stats.paidBills}
                </div>
              </div>
              <div>
                <div className="text-muted" style={{ fontSize: '0.9rem', marginBottom: '0.25rem' }}>Unpaid Bills</div>
                <div style={{ fontSize: '1.5rem', fontWeight: '600', color: 'var(--danger)' }}>
                  {stats.unpaidBills}
                </div>
              </div>
              <div>
                <div className="text-muted" style={{ fontSize: '0.9rem', marginBottom: '0.25rem' }}>Payment Rate</div>
                <div style={{ fontSize: '1.5rem', fontWeight: '600', color: 'var(--primary)' }}>
                  {stats.totalBills > 0 ? Math.round((stats.paidBills / stats.totalBills) * 100) : 0}%
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;