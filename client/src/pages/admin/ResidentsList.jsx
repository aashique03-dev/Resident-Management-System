import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit2, Trash2, Search, Filter, Home, Phone, Mail, Eye } from 'lucide-react';
import api from '../../services/api';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import Modal from '../../components/common/Modal';
import toast from 'react-hot-toast';

// Resident Card Component - Updated for JOIN data
const ResidentCard = ({ resident, onEdit, onDelete, onView }) => {
  return (
    <div className="resident-card">
      <div className="resident-card-header">
        <div className="resident-avatar">
          {resident.name.charAt(0).toUpperCase()}
        </div>
        <div className="resident-card-info">
          <h3 className="resident-name">{resident.name}</h3>
          <span className={`role-badge role-${resident.role}`}>
            {resident.role}
          </span>
        </div>
      </div>
      
      <div className="resident-card-body">
        {/* Updated: Now shows house details from JOIN */}
        <div className="info-row">
          <Home size={16} />
          <span>House {resident.houseNumber} ({resident.houseType})</span>
        </div>
        <div className="info-row">
          <Phone size={16} />
          <span>{resident.contact}</span>
        </div>
        <div className="info-row">
          <Mail size={16} />
          <span className="truncate">{resident.email}</span>
        </div>
        <div className="info-row">
          <span className="text-muted" style={{ fontSize: '0.85rem' }}>
            CNIC: {resident.cnic}
          </span>
        </div>
        {/* Added: Parking slots info */}
        <div className="info-row">
          <span className="text-muted" style={{ fontSize: '0.85rem' }}>
            Parking: {resident.parkingSlotCount} slot{resident.parkingSlotCount !== 1 ? 's' : ''}
          </span>
        </div>
      </div>
      
      <div className="resident-card-actions">
        <button className="card-btn card-btn-view" onClick={onView} title="View">
          <Eye size={16} />
        </button>
        <Link 
          to={`/admin/residents/edit/${resident.id}`}
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

function ResidentsList() {
  const [residents, setResidents] = useState([]);
  const [filteredResidents, setFilteredResidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null });

  useEffect(() => {
    fetchResidents();
  }, []);

  useEffect(() => {
    filterResidents();
  }, [searchTerm, activeFilter, residents]);

  const fetchResidents = async () => {
    try {
      setLoading(true);
      const response = await api.get('/residents');
      setResidents(response.data.data);
    } catch (error) {
      toast.error('Failed to fetch residents');
    } finally {
      setLoading(false);
    }
  };

  const filterResidents = () => {
    let filtered = residents;

    // Filter by role
    if (activeFilter !== 'all') {
      filtered = filtered.filter(r => r.role === activeFilter);
    }

    // Filter by search - Updated to include house info
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(resident =>
        resident.name.toLowerCase().includes(term) ||
        resident.email.toLowerCase().includes(term) ||
        resident.cnic.includes(term) ||
        resident.contact.includes(term) ||
        resident.houseNumber?.toString().includes(term) ||
        resident.houseType?.toLowerCase().includes(term)
      );
    }

    setFilteredResidents(filtered);
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/residents/${deleteModal.id}`);
      toast.success('Resident deleted successfully');
      setDeleteModal({ isOpen: false, id: null });
      fetchResidents();
    } catch (error) {
      toast.error('Failed to delete resident');
    }
  };

  const getRoleCounts = () => {
    return {
      all: residents.length,
      resident: residents.filter(r => r.role === 'resident').length,
      admin: residents.filter(r => r.role === 'admin').length,
      owner: residents.filter(r => r.role === 'owner').length,
    };
  };

  if (loading) return <Loader />;

  const counts = getRoleCounts();

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Residents Management</h1>
          <p className="page-subtitle">Manage all society residents</p>
        </div>
        <Link to="/admin/residents/add" className="btn btn-primary">
          <Plus size={20} />
          <span className="btn-text">Add Resident</span>
        </Link>
      </div>

      {/* Search & Filters */}
      <div className="controls-section">
        <div className="search-bar-large">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            placeholder="Search by name, email, CNIC, contact, house number or type..."
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
              label="rental" 
              active={activeFilter === 'rental'}
              onClick={() => setActiveFilter('rental')}
              count={residents.filter(r => r.role === 'rental').length}
            />
            <FilterChip 
              label="Admins" 
              active={activeFilter === 'admin'}
              onClick={() => setActiveFilter('admin')}
              count={counts.admin}
            />
            <FilterChip 
              label="Owners" 
              active={activeFilter === 'owner'}
              onClick={() => setActiveFilter('owner')}
              count={counts.owner}
            />
          </div>
        </div>

        <div className="results-info">
          <span className="results-count">
            Showing <strong>{filteredResidents.length}</strong> of <strong>{residents.length}</strong> residents
          </span>
        </div>
      </div>

      {/* Residents Grid */}
      {filteredResidents.length === 0 ? (
        <EmptyState message={searchTerm ? "No residents match your search" : "No residents found"} />
      ) : (
        <div className="residents-grid">
          {filteredResidents.map((resident) => (
            <ResidentCard
              key={resident.id}
              resident={resident}
              onView={() => toast.info(`Viewing ${resident.name}`)}
              onDelete={() => setDeleteModal({ isOpen: true, id: resident.id })}
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
          Are you sure you want to delete this resident? This action cannot be undone.
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

export default ResidentsList;