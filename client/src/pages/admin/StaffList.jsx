import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit2, Trash2, Search, Filter, Briefcase, Phone, Mail, ClipboardList, Eye } from 'lucide-react';
import api from '../../services/api';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import Modal from '../../components/common/Modal';
import toast from 'react-hot-toast';

// Staff Card Component
const StaffCard = ({ staff, onEdit, onDelete, onView }) => {
  return (
    <div className="resident-card">
      <div className="resident-card-header">
        <div className="resident-avatar">
          {staff.name.charAt(0).toUpperCase()}
        </div>
        <div className="resident-card-info">
          <h3 className="resident-name">{staff.name}</h3>
          <span className={`role-badge role-${staff.role?.toLowerCase().replace(/\s+/g, '-')}`}>
            {staff.role}
          </span>
        </div>
      </div>
      
      <div className="resident-card-body">
        <div className="info-row">
          <Briefcase size={16} />
          <span>{staff.role}</span>
        </div>
        <div className="info-row">
          <Phone size={16} />
          <span>{staff.contact}</span>
        </div>
        <div className="info-row">
          <Mail size={16} />
          <span className="truncate">{staff.email}</span>
        </div>
        <div className="info-row">
          <ClipboardList size={16} />
          <span>{staff.assignedRequests} Assigned Request{staff.assignedRequests !== 1 ? 's' : ''}</span>
        </div>
      </div>
      
      <div className="resident-card-actions">
        <button className="card-btn card-btn-view" onClick={onView} title="View">
          <Eye size={16} />
        </button>
        <Link 
          to={`/admin/staff/edit/${staff.id}`}
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

function StaffList() {
  const [staff, setStaff] = useState([]);
  const [filteredStaff, setFilteredStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null });

  useEffect(() => {
    fetchStaff();
  }, []);

  useEffect(() => {
    filterStaff();
  }, [searchTerm, activeFilter, staff]);

  const fetchStaff = async () => {
    try {
      setLoading(true);
      const response = await api.get('/staff');
      const data = response.data?.data || [];
      setStaff(data);
    } catch (error) {
      toast.error('Failed to fetch staff');
      console.error('Fetch staff error:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterStaff = () => {
    let filtered = staff;

    // Filter by role
    if (activeFilter !== 'all') {
      filtered = filtered.filter(s => s.role?.toLowerCase() === activeFilter.toLowerCase());
    }

    // Filter by search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(member =>
        member.name?.toLowerCase().includes(term) ||
        member.role?.toLowerCase().includes(term) ||
        member.contact?.toLowerCase().includes(term) ||
        member.email?.toLowerCase().includes(term)
      );
    }

    setFilteredStaff(filtered);
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/staff/${deleteModal.id}`);
      toast.success('Staff member deleted successfully');
      setDeleteModal({ isOpen: false, id: null });
      fetchStaff();
    } catch (error) {
      toast.error('Failed to delete staff member');
      console.error('Delete staff error:', error);
    }
  };

  const getRoleCounts = () => {
    const counts = {
      all: staff.length,
      electrician: staff.filter(s => s.role?.toLowerCase() === 'electrician').length,
      plumber: staff.filter(s => s.role?.toLowerCase() === 'plumber').length,
      cleaner: staff.filter(s => s.role?.toLowerCase() === 'cleaner').length,
      'security guard': staff.filter(s => s.role?.toLowerCase() === 'security guard').length,
      gardener: staff.filter(s => s.role?.toLowerCase() === 'gardener').length,
      technician: staff.filter(s => s.role?.toLowerCase() === 'technician').length,
      manager: staff.filter(s => s.role?.toLowerCase() === 'manager').length,
      carpenter: staff.filter(s => s.role?.toLowerCase() === 'carpenter').length,
    };
    return counts;
  };

  if (loading) return <Loader />;

  const counts = getRoleCounts();

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Staff Management</h1>
          <p className="page-subtitle">Manage all society staff members</p>
        </div>
        <Link to="/admin/staff/add" className="btn btn-primary">
          <Plus size={20} />
          <span className="btn-text">Add Staff</span>
        </Link>
      </div>

      {/* Search & Filters */}
      <div className="controls-section">
        <div className="search-bar-large">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            placeholder="Search by name, role, email, or contact..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-section">
          <div className="filter-header">
            <Filter size={16} />
            <span>Filter by Role:</span>
          </div>
          <div className="filter-chips">
            <FilterChip 
              label="All" 
              active={activeFilter === 'all'}
              onClick={() => setActiveFilter('all')}
              count={counts.all}
            />
            <FilterChip 
              label="Electrician" 
              active={activeFilter === 'electrician'}
              onClick={() => setActiveFilter('electrician')}
              count={counts.electrician}
            />
            <FilterChip 
              label="Plumber" 
              active={activeFilter === 'plumber'}
              onClick={() => setActiveFilter('plumber')}
              count={counts.plumber}
            />
            <FilterChip 
              label="Cleaner" 
              active={activeFilter === 'cleaner'}
              onClick={() => setActiveFilter('cleaner')}
              count={counts.cleaner}
            />
            <FilterChip 
              label="Security Guard" 
              active={activeFilter === 'security guard'}
              onClick={() => setActiveFilter('security guard')}
              count={counts['security guard']}
            />
            <FilterChip 
              label="Gardener" 
              active={activeFilter === 'gardener'}
              onClick={() => setActiveFilter('gardener')}
              count={counts.gardener}
            />
            <FilterChip 
              label="Manager" 
              active={activeFilter === 'manager'}
              onClick={() => setActiveFilter('manager')}
              count={counts.manager}
            />
          </div>
        </div>

        <div className="results-info">
          <span className="results-count">
            Showing <strong>{filteredStaff.length}</strong> of <strong>{staff.length}</strong> staff members
          </span>
        </div>
      </div>

      {/* Staff Grid */}
      {filteredStaff.length === 0 ? (
        <EmptyState message={searchTerm ? "No staff members match your search" : "No staff members found"} />
      ) : (
        <div className="residents-grid">
          {filteredStaff.map((member) => (
            <StaffCard
              key={member.id}
              staff={member}
              onView={() => toast.info(`Viewing ${member.name}`)}
              onDelete={() => setDeleteModal({ isOpen: true, id: member.id })}
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
          Are you sure you want to delete this staff member? This action cannot be undone.
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

export default StaffList;