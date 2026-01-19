import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Search, Filter, ClipboardList, Eye, UserCog } from 'lucide-react';
import api from '../../services/api';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import Modal from '../../components/common/Modal';
import toast from 'react-hot-toast';

// Request Card Component
const RequestCard = ({ request, onAssign, onDelete, onView }) => {
  const getPriorityColor = (priority) => {
    if (!priority || priority === 'normal') return 'role-rental';
    switch(priority.toLowerCase()) {
      case 'high': return 'role-admin';
      case 'medium': return 'role-owner';
      case 'low': return 'role-resident';
      default: return 'role-rental';
    }
  };

  return (
    <div className="resident-card">
      <div className="resident-card-header">
        <div className="resident-avatar">
          <ClipboardList size={18} />
        </div>
        <div className="resident-card-info">
          <h3 className="resident-name">{request.type}</h3>
          <span className={`role-badge role-${request.status}`}>
            {request.status}
          </span>
        </div>
      </div>

      <div className="resident-card-body">
        <div className="info-row"><strong>From:</strong> {request.Requested_By}</div>
        <div className="info-row">
          <strong>Assigned To:</strong> 
          <span className={!request.Requested_To ? 'text-muted' : ''}>
            {request.Requested_To || 'Not Assigned'}
          </span>
        </div>
        <div className="info-row"><strong>House:</strong> {request.House_Number}</div>
        <div className="info-row">
          <strong>Priority:</strong> 
          <span className={`role-badge ${getPriorityColor(request.priority)}`}>
            {request.priority || 'normal'}
          </span>
        </div>
        <div className="info-row text-muted truncate">{request.description}</div>
      </div>

      <div className="resident-card-actions">
        <button className="card-btn card-btn-view" onClick={onView} title="View">
          <Eye size={16} />
        </button>
        <button className="card-btn card-btn-edit" onClick={onAssign} title="Assign Staff">
          <UserCog size={16} />
        </button>
        <button className="card-btn card-btn-delete" onClick={onDelete} title="Delete">
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};

// Filter Chip Component
const FilterChip = ({ label, active, onClick, count }) => (
  <button className={`filter-chip ${active ? 'active' : ''}`} onClick={onClick}>
    {label}
    {count !== undefined && <span className="filter-count">{count}</span>}
  </button>
);

function AdminRequestList() {
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null });

  useEffect(() => {
    fetchRequests();
  }, []);

  useEffect(() => {
    filterRequests();
  }, [searchTerm, activeFilter, requests]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await api.get('/requests');
      setRequests(response.data.data);
    } catch (error) {
      toast.error('Failed to fetch requests');
    } finally {
      setLoading(false);
    }
  };

  const filterRequests = () => {
    let filtered = requests;

    if (activeFilter !== 'all') {
      filtered = filtered.filter(r => r.status === activeFilter);
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(r =>
        r.type.toLowerCase().includes(term) ||
        r.Requested_By.toLowerCase().includes(term) ||
        (r.Requested_To && r.Requested_To.toLowerCase().includes(term)) ||
        r.House_Number.toString().includes(term)
      );
    }

    setFilteredRequests(filtered);
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/request/${deleteModal.id}`);
      toast.success('Request deleted successfully');
      setDeleteModal({ isOpen: false, id: null });
      fetchRequests();
    } catch (error) {
      toast.error('Failed to delete request');
    }
  };

  const getStatusCounts = () => ({
    all: requests.length,
    pending: requests.filter(r => r.status === 'pending').length,
    'in-progress': requests.filter(r => r.status === 'in-progress').length,
    completed: requests.filter(r => r.status === 'completed').length,
  });

  if (loading) return <Loader />;

  const counts = getStatusCounts();

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Service Requests</h1>
          <p className="page-subtitle">Manage and assign maintenance requests</p>
        </div>
      </div>

      <div className="controls-section">
        <div className="search-bar-large">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            placeholder="Search by type, resident, staff, or house..."
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
            <FilterChip label="Pending" active={activeFilter === 'pending'} onClick={() => setActiveFilter('pending')} count={counts.pending} />
            <FilterChip label="In-Progress" active={activeFilter === 'in-progress'} onClick={() => setActiveFilter('in-progress')} count={counts['in-progress']} />
            <FilterChip label="Completed" active={activeFilter === 'completed'} onClick={() => setActiveFilter('completed')} count={counts.completed} />
          </div>
        </div>

        <div className="results-info">
          <span className="results-count">
            Showing <strong>{filteredRequests.length}</strong> of <strong>{requests.length}</strong> requests
          </span>
        </div>
      </div>

      {filteredRequests.length === 0 ? (
        <EmptyState message={searchTerm ? "No requests match your search" : "No requests found"} />
      ) : (
        <div className="residents-grid">
          {filteredRequests.map((request) => (
            <RequestCard
              key={request.id}
              request={request}
              onView={() => toast.info(`Viewing ${request.type}`)}
              onAssign={() => window.location.href = `/admin/requests/assign/${request.id}`}
              onDelete={() => setDeleteModal({ isOpen: true, id: request.id })}
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
          Are you sure you want to delete this request? This action cannot be undone.
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

export default AdminRequestList;