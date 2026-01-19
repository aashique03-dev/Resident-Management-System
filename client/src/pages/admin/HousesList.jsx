import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit2, Trash2, Search, Filter, Home, Hash, Grid3x3, Car, Eye } from 'lucide-react';
import api from '../../services/api';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import Modal from '../../components/common/Modal';
import toast from 'react-hot-toast';

// House Card Component
const HouseCard = ({ house, onEdit, onDelete, onView }) => {
  return (
    <div className="resident-card">
      <div className="resident-card-header">
        <div className="resident-avatar">
          {house.block?.charAt(0)}
        </div>
        <div className="resident-card-info">
          <h3 className="resident-name">Block {house.block} - {house.houseNumber}</h3>
          <span className={`role-badge ${
            house.status === 'available' ? 'role-owner' : 'role-admin'
          }`}>
            {house.status}
          </span>
        </div>
      </div>
      
      <div className="resident-card-body">
        <div className="info-row">
          <Hash size={16} />
          <span>House #{house.houseNumber}</span>
        </div>
        <div className="info-row">
          <Home size={16} />
          <span>{house.houseType}</span>
        </div>
        <div className="info-row">
          <Car size={16} />
          <span>{house.parkingSlotCount} Parking Slot{house.parkingSlotCount !== 1 ? 's' : ''}</span>
        </div>
        <div className="info-row">
          <span className="text-muted" style={{ fontSize: '0.85rem' }}>ID: {house.id}</span>
        </div>
      </div>
      
      <div className="resident-card-actions">
        <button className="card-btn card-btn-view" onClick={onView} title="View">
          <Eye size={16} />
        </button>
        <Link 
          to={`/admin/house/edit/${house.id}`}
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

function HousesList() {
  const [houses, setHouses] = useState([]);
  const [filteredHouses, setFilteredHouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null });

  useEffect(() => {
    fetchHouses();
  }, []);

  useEffect(() => {
    filterHouses();
  }, [searchTerm, activeFilter, houses]);

  const fetchHouses = async () => {
    try {
      setLoading(true);
      const response = await api.get('/houses');
      const data = response.data?.data || [];
      setHouses(data);
    } catch (error) {
      toast.error('Failed to fetch houses');
    } finally {
      setLoading(false);
    }
  };

  const filterHouses = () => {
    let filtered = houses;

    // Filter by status
    if (activeFilter !== 'all') {
      filtered = filtered.filter(h => h.status?.toLowerCase() === activeFilter.toLowerCase());
    }

    // Filter by search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter((house) =>
        house.block?.toLowerCase().includes(term) ||
        house.houseType?.toLowerCase().includes(term) ||
        house.status?.toLowerCase().includes(term) ||
        house.houseNumber?.toString().toLowerCase().includes(term)
      );
    }

    setFilteredHouses(filtered);
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/house/${deleteModal.id}`);
      toast.success('House deleted successfully');
      setDeleteModal({ isOpen: false, id: null });
      fetchHouses();
    } catch (error) {
      toast.error('Failed to delete house');
    }
  };

  const getStatusCounts = () => {
    return {
      all: houses.length,
      available: houses.filter(h => h.status === 'available').length,
      occupied: houses.filter(h => h.status === 'occupied').length,
    };
  };

  const getBlockCounts = () => {
    return {
      a: houses.filter(h => h.block === 'A').length,
      b: houses.filter(h => h.block === 'B').length,
      c: houses.filter(h => h.block === 'C').length,
    };
  };

  if (loading) return <Loader />;

  const counts = getStatusCounts();
  const blockCounts = getBlockCounts();

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">House Management</h1>
          <p className="page-subtitle">Manage all society houses</p>
        </div>
        <Link to="/admin/houses/add" className="btn btn-primary">
          <Plus size={20} />
          <span className="btn-text">Add House</span>
        </Link>
      </div>

      {/* Stats Summary */}
      <div className="stats-grid" style={{ marginBottom: '1.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
        <div className="stat-card stat-blue">
          <div className="stat-icon">
            <Home size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{houses.length}</div>
            <div className="stat-label">Total Houses</div>
          </div>
        </div>
        <div className="stat-card stat-green">
          <div className="stat-icon">
            <Home size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{counts.available}</div>
            <div className="stat-label">Available</div>
          </div>
        </div>
        <div className="stat-card stat-red">
          <div className="stat-icon">
            <Home size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{counts.occupied}</div>
            <div className="stat-label">Occupied</div>
          </div>
        </div>
        <div className="stat-card stat-purple">
          <div className="stat-icon">
            <Grid3x3 size={24} />
          </div>
          <div className="stat-content">
            <div className="stat-value">3</div>
            <div className="stat-label">Blocks (A, B, C)</div>
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="controls-section">
        <div className="search-bar-large">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            placeholder="Search by block, house number, type, or status..."
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
              label="Available" 
              active={activeFilter === 'available'}
              onClick={() => setActiveFilter('available')}
              count={counts.available}
            />
            <FilterChip 
              label="Occupied" 
              active={activeFilter === 'occupied'}
              onClick={() => setActiveFilter('occupied')}
              count={counts.occupied}
            />
          </div>
        </div>

        <div className="results-info">
          <span className="results-count">
            Showing <strong>{filteredHouses.length}</strong> of <strong>{houses.length}</strong> houses
          </span>
        </div>
      </div>

      {/* Houses Grid */}
      {filteredHouses.length === 0 ? (
        <EmptyState message={searchTerm ? "No houses match your search" : "No houses found"} />
      ) : (
        <div className="residents-grid">
          {filteredHouses.map((house) => (
            <HouseCard
              key={house.id}
              house={house}
              onView={() => toast.info(`House ${house.block}-${house.houseNumber} (${house.houseType})`)}
              onDelete={() => setDeleteModal({ isOpen: true, id: house.id })}
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
          Are you sure you want to delete this house? This action cannot be undone.
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

export default HousesList;