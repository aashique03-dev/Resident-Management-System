import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit2, Search, Filter, ClipboardList, Eye, Clock } from 'lucide-react';
import api from '../../services/api';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import toast from 'react-hot-toast';

// Request Card Component for Resident
const RequestCard = ({ request, onView, onEdit }) => {
  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'role-rental';
      case 'in-progress': return 'role-owner';
      case 'completed': return 'role-admin';
      default: return 'role-resident';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <div className="resident-card">
      <div className="resident-card-header">
        <div className="resident-avatar">
          <ClipboardList size={18} />
        </div>
        <div className="resident-card-info">
          <h3 className="resident-name">{request.type}</h3>
          <span className={`role-badge ${getStatusColor(request.status)}`}>
            {request.status}
          </span>
        </div>
      </div>

      <div className="resident-card-body">
        <div className="info-row">
          <Clock size={16} />
          <span>Created: {formatDate(request.createdAt)}</span>
        </div>
        
        <div className="info-row">
          <strong>Assigned To:</strong> 
          <span className={!request.RequestedTo ? 'text-muted' : ''}>
            {request.RequestedTo || 'Not Assigned'}
          </span>
        </div>
        
        <div className="info-row">
          <strong>Priority:</strong> 
          <span className="role-badge role-rental">
            {request.priority || 'normal'}
          </span>
        </div>
        
        <div className="info-row text-muted truncate">{request.description}</div>
      </div>

      <div className="resident-card-actions">
        <button className="card-btn card-btn-view" onClick={onView} title="View Details">
          <Eye size={16} />
        </button>
        <button className="card-btn card-btn-edit" onClick={onEdit} title="Edit Request">
          <Edit2 size={16} />
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

function ResidentRequestList() {
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    fetchRequests();
  }, []);

  useEffect(() => {
    filterRequests();
  }, [searchTerm, activeFilter, requests]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await api.get('/my/request');
      setRequests(response.data.data || []);
    } catch (error) {
      toast.error('Failed to fetch requests');
      console.error('Error:', error);
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
        r.description.toLowerCase().includes(term) ||
        (r.RequestedTo && r.RequestedTo.toLowerCase().includes(term))
      );
    }

    setFilteredRequests(filtered);
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
          <h1 className="page-title">My Requests</h1>
          <p className="page-subtitle">View and manage your service requests</p>
        </div>
        <Link to="/resident/requests/add" className="btn btn-primary">
          <Plus size={20} />
          <span className="btn-text">New Request</span>
        </Link>
      </div>

      <div className="controls-section">
        <div className="search-bar-large">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            placeholder="Search by type, description, or assigned staff..."
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
        <EmptyState message={searchTerm ? "No requests match your search" : "No requests found. Create your first request!"} />
      ) : (
        <div className="residents-grid">
          {filteredRequests.map((request) => (
            <RequestCard
              key={request.id}
              request={request}
              onView={() => toast.info(`Request: ${request.type} - ${request.status}`)}
              onEdit={() => window.location.href = `/resident/requests/edit/${request.id}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default ResidentRequestList;