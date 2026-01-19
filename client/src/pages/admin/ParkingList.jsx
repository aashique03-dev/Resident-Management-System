import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit2, Trash2, Search, Filter, Home, Car, Hash, Eye } from 'lucide-react';
import api from '../../services/api';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import Modal from '../../components/common/Modal';
import toast from 'react-hot-toast';


const ParkingCard = ({ parking, onDelete, onView }) => {
  return (
    <div className="resident-card">
      <div className="resident-card-header">
        <div className="resident-avatar">
          {parking.slotNumber.charAt(0).toUpperCase()}
        </div>
        <div className="resident-card-info">
          <h3 className="resident-name">{parking.slotNumber}</h3>
          <span className={`role-badge role-${parking.status.toLowerCase()}`}>
            {parking.status}
          </span>
        </div>
      </div>

      <div className="resident-card-body">
        <div className="info-row">
          <Home size={16} />
          <span>House {parking.houseNumber}</span>
        </div>

        <div className="info-row">
          <Car size={16} />
          <span>{parking.vehicleType}</span>
        </div>

        <div className="info-row">
          <Hash size={16} />
          <span className="truncate">{parking.vehicleNumber}</span>
        </div>

        <div className="info-row">
          <span className="text-muted" style={{ fontSize: '0.85rem' }}>
            Parking ID: {parking.id}
          </span>
        </div>
      </div>

      <div className="resident-card-actions">
        <button className="card-btn card-btn-view" onClick={onView}>
          <Eye size={16} />
        </button>

        <Link
          to={`/admin/parking/edit/${parking.id}`}
          className="card-btn card-btn-edit"
        >
          <Edit2 size={16} />
        </Link>

        <button
          className="card-btn card-btn-delete"
          onClick={onDelete}
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};

const FilterChip = ({ label, active, onClick, count }) => (
  <button
    className={`filter-chip ${active ? 'active' : ''}`}
    onClick={onClick}
  >
    {label}
    {count !== undefined && <span className="filter-count">{count}</span>}
  </button>
);


function ParkingList() {
  const [parkings, setParkings] = useState([]);
  const [filteredParkings, setFilteredParkings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null });

  useEffect(() => {
    fetchParkings();
  }, []);

  useEffect(() => {
    filterParkings();
  }, [searchTerm, activeFilter, parkings]);

  const fetchParkings = async () => {
    try {
      setLoading(true);
      const res = await api.get('/parking');
      setParkings(res.data.data);
    } catch {
      toast.error('Failed to fetch parking slots');
    } finally {
      setLoading(false);
    }
  };

  const filterParkings = () => {
    let data = parkings;

    if (activeFilter !== 'all') {
      data = data.filter(p => p.status.toLowerCase() === activeFilter);
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      data = data.filter(p =>
        p.slotNumber.toLowerCase().includes(term) ||
        p.houseNumber?.toString().includes(term) ||
        p.vehicleType?.toLowerCase().includes(term) ||
        p.vehicleNumber?.toLowerCase().includes(term)
      );
    }

    setFilteredParkings(data);
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/parking/${deleteModal.id}`);
      toast.success('Parking deleted successfully');
      setDeleteModal({ isOpen: false, id: null });
      fetchParkings();
    } catch {
      toast.error('Failed to delete parking');
    }
  };

  const counts = {
    all: parkings.length,
    occupied: parkings.filter(p => p.status === 'occupied').length,
    vacant: parkings.filter(p => p.status === 'vacant').length,
  };

  if (loading) return <Loader />;

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Parking Management</h1>
          <p className="page-subtitle">Manage all society parking slots</p>
        </div>

        <Link to="/admin/parking/add" className="btn btn-primary">
          <Plus size={20} />
          <span className="btn-text">Add Parking</span>
        </Link>
      </div>

      {/* Search & Filters */}
      <div className="controls-section">
        <div className="search-bar-large">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            placeholder="Search by slot, house, vehicle type or number..."
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
            <FilterChip label="All" active={activeFilter === 'all'} onClick={() => setActiveFilter('all')} count={counts.all} />
            <FilterChip label="Occupied" active={activeFilter === 'occupied'} onClick={() => setActiveFilter('occupied')} count={counts.occupied} />
            <FilterChip label="available" active={activeFilter === 'available'} onClick={() => setActiveFilter('available')} count={counts.all - counts.occupied} />
          </div>
        </div>
      </div>

      {/* Grid */}
      {filteredParkings.length === 0 ? (
        <EmptyState message="No parking slots found" />
      ) : (
        <div className="residents-grid">
          {filteredParkings.map(p => (
            <ParkingCard
              key={p.id}
              parking={p}
              onView={() => toast.info(`Viewing ${p.slotNumber}`)}
              onDelete={() => setDeleteModal({ isOpen: true, id: p.id })}
            />
          ))}
        </div>
      )}

      <Modal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, id: null })}
        title="Confirm Delete"
      >
        <p>Are you sure you want to delete this parking slot?</p>
        <div className="modal-actions">
          <button className="btn btn-secondary" onClick={() => setDeleteModal({ isOpen: false, id: null })}>
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

export default ParkingList;
