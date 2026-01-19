import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit2, Trash2, Search, Filter, Home, Calendar, DollarSign, FileText, Eye, User } from 'lucide-react';
import api from '../../services/api';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import Modal from '../../components/common/Modal';
import toast from 'react-hot-toast';

// Bill Card Component - Updated for JOIN data
const BillCard = ({ bill, onEdit, onDelete, onView }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <div className="resident-card">
      <div className="resident-card-header">
        <div className="resident-avatar">
          {bill.name ? bill.name.charAt(0).toUpperCase() : 'H'}
        </div>
        <div className="resident-card-info">
          <h3 className="resident-name">{bill.name || 'Unknown'}</h3>
          <span className={`role-badge ${
            bill.status === 'paid' ? 'role-owner' : 
            bill.status === 'pending' ? 'role-rental' : 
            bill.status === 'overdue' ? 'role-admin' :
            'role-rental'
          }`}>
            {bill.status}
          </span>
        </div>
      </div>
      
      <div className="resident-card-body">
        {/* Added: Resident name and house info */}
        <div className="info-row">
          <Home size={16} />
          <span>House {bill.houseId}</span>
        </div>
        
        <div className="info-row">
          <Calendar size={16} />
          <span>{bill.month}</span>
        </div>
        
        <div className="info-row">
          <FileText size={16} />
          <span>{bill.billType}</span>
        </div>
        
        <div className="info-row">
          <DollarSign size={16} />
          <span className="truncate"><strong>Rs. {bill.amount?.toLocaleString()}</strong></span>
        </div>
        
        <div className="info-row">
          <span className="text-muted" style={{ fontSize: '0.85rem' }}>
            Due: {formatDate(bill.dueDate)}
          </span>
        </div>
        
        {/* Added: Description if available */}
        {bill.description && (
          <div className="info-row">
            <span className="text-muted" style={{ fontSize: '0.85rem' }}>
              {bill.description.length > 40 
                ? bill.description.substring(0, 40) + '...' 
                : bill.description}
            </span>
          </div>
        )}
      </div>
      
      <div className="resident-card-actions">
        <button className="card-btn card-btn-view" onClick={onView} title="View">
          <Eye size={16} />
        </button>
        <Link 
          to={`/admin/bills/edit/${bill.id}`}
          className="card-btn card-btn-edit"
          title="Edit"
        >
          <Edit2 size={16} />
        </Link>
        <button 
          className="card-btn card-btn-delete" 
          onClick={onDelete}
          title="Delete"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};

// Filter Chip Component
const FilterChip = ({ label, active, onClick, count }) => (
  <button 
    className={`filter-chip ${active ? 'active' : ''}`}
    onClick={onClick}
  >
    {label}
    {count !== undefined && <span className="filter-count">{count}</span>}
  </button>
);

function BillsList() {
  const [bills, setBills] = useState([]);
  const [filteredBills, setFilteredBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null });

  useEffect(() => {
    fetchBills();
  }, []);

  useEffect(() => {
    filterBills();
  }, [searchTerm, activeFilter, bills]);

  const fetchBills = async () => {
    try {
      setLoading(true);
      const response = await api.get('/bills');
      const data = response.data?.data || [];
      // Data now includes: id, name, amount, billType, status, description, month, dueDate, houseId
      setBills(data);
    } catch (error) {
      toast.error('Failed to fetch bills');
      console.error('Fetch bills error:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterBills = () => {
    let filtered = bills;

    // Filter by status
    if (activeFilter !== 'all') {
      filtered = filtered.filter(b => b.status?.toLowerCase() === activeFilter.toLowerCase());
    }

    // Filter by search - Updated to include resident name
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(bill =>
        bill.houseId?.toString().includes(term) ||
        bill.month?.toLowerCase().includes(term) ||
        bill.billType?.toLowerCase().includes(term) ||
        bill.status?.toLowerCase().includes(term) ||
        bill.name?.toLowerCase().includes(term) ||
        bill.description?.toLowerCase().includes(term)
      );
    }

    setFilteredBills(filtered);
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/bill/${deleteModal.id}`);
      toast.success('Bill deleted successfully');
      setDeleteModal({ isOpen: false, id: null });
      fetchBills();
    } catch (error) {
      toast.error('Failed to delete bill');
      console.error('Delete bill error:', error);
    }
  };

  const getStatusCounts = () => {
    return {
      all: bills.length,
      paid: bills.filter(b => b.status === 'paid').length,
      unpaid: bills.filter(b => b.status === 'unpaid').length,
      pending: bills.filter(b => b.status === 'pending').length,
      overdue: bills.filter(b => b.status === 'overdue').length,
    };
  };

  const getTotalStats = () => {
    const paidBills = bills.filter(b => b.status === 'paid');
    const unpaidBills = bills.filter(b => b.status === 'unpaid' || b.status === 'pending' || b.status === 'overdue');
    
    const totalPaid = paidBills.reduce((sum, bill) => sum + (bill.amount || 0), 0);
    const totalUnpaid = unpaidBills.reduce((sum, bill) => sum + (bill.amount || 0), 0);
    
    return { totalPaid, totalUnpaid };
  };

  if (loading) return <Loader />;

  const counts = getStatusCounts();
  const stats = getTotalStats();

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Bills Management</h1>
          <p className="page-subtitle">Manage all society bills and payments</p>
        </div>
        <Link to="/admin/bills/add" className="btn btn-primary">
          <Plus size={20} />
          <span className="btn-text">Add Bill</span>
        </Link>
      </div>

      {/* Stats Summary */}
      <div className="stats-grid" style={{ marginBottom: '1.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
        <div className="stat-card stat-green">
          <div className="stat-icon">
            <DollarSign size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-value">Rs. {stats.totalPaid.toLocaleString()}</div>
            <div className="stat-label">Total Paid</div>
          </div>
        </div>
        <div className="stat-card stat-red">
          <div className="stat-icon">
            <DollarSign size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-value">Rs. {stats.totalUnpaid.toLocaleString()}</div>
            <div className="stat-label">Total Unpaid</div>
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="controls-section">
        <div className="search-bar-large">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            placeholder="Search by resident name, house ID, month, type, or status..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-section">
          <div className="filter-header">
            <Filter size={16} />
            <span>Filter by Status:</span>
          </div>
          <div className="filter-chips">
            <FilterChip 
              label="All" 
              active={activeFilter === 'all'}
              onClick={() => setActiveFilter('all')}
              count={counts.all}
            />
            <FilterChip 
              label="Paid" 
              active={activeFilter === 'paid'}
              onClick={() => setActiveFilter('paid')}
              count={counts.paid}
            />
            <FilterChip 
              label="Unpaid" 
              active={activeFilter === 'unpaid'}
              onClick={() => setActiveFilter('unpaid')}
              count={counts.unpaid}
            />
            <FilterChip 
              label="Pending" 
              active={activeFilter === 'pending'}
              onClick={() => setActiveFilter('pending')}
              count={counts.pending}
            />
            <FilterChip 
              label="Overdue" 
              active={activeFilter === 'overdue'}
              onClick={() => setActiveFilter('overdue')}
              count={counts.overdue}
            />
          </div>
        </div>

        <div className="results-info">
          <span className="results-count">
            Showing <strong>{filteredBills.length}</strong> of <strong>{bills.length}</strong> bills
          </span>
        </div>
      </div>

      {/* Bills Grid */}
      {filteredBills.length === 0 ? (
        <EmptyState message={searchTerm ? "No bills match your search" : "No bills found"} />
      ) : (
        <div className="residents-grid">
          {filteredBills.map((bill) => (
            <BillCard
              key={bill.id}
              bill={bill}
              onView={() => toast.info(`Bill for ${bill.name} - House ${bill.houseId}`)}
              onDelete={() => setDeleteModal({ isOpen: true, id: bill.id })}
            />
          ))}
        </div>
      )}

      <Modal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, id: null })}
        title="Confirm Delete"
      >
        <p className="modal-text">
          Are you sure you want to delete this bill? This action cannot be undone.
        </p>
        <div className="modal-actions">
          <button
            className="btn btn-secondary"
            onClick={() => setDeleteModal({ isOpen: false, id: null })}
          >
            Cancel
          </button>
          <button className="btn btn-danger" onClick={handleDelete}>
            Delete
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default BillsList;