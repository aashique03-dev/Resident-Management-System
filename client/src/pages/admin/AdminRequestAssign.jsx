import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, User, ClipboardList, AlertCircle, Clock } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import Loader from '../../components/common/Loader';

function AdminRequestAssign() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [staff, setStaff] = useState([]);
  const [requestData, setRequestData] = useState(null);
  const [formData, setFormData] = useState({
    staffId: '',
    status: 'pending',
    priority: 'normal'
  });

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [requestRes, staffRes] = await Promise.all([
        api.get(`/request/${id}`),
        api.get('/staff')
      ]);

      setRequestData(requestRes.data.data);
      setStaff(staffRes.data.data || []);

      // Pre-fill form if already assigned
      if (requestRes.data.data.staffId) {
        setFormData({
          staffId: requestRes.data.data.staffId,
          status: requestRes.data.data.status || 'pending',
          priority: requestRes.data.data.priority || 'normal'
        });
      }
    } catch (error) {
      toast.error('Failed to load request details');
      navigate('/admin/requests');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await api.patch(`/request/${id}`, formData);
      toast.success('Request assigned successfully!');
      navigate('/admin/requests');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to assign request');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="page">
      <div className="page-header-form">
        <button className="btn-back" onClick={() => navigate('/admin/requests')}>
          <ArrowLeft size={20} />
        </button>
        <div className="page-header-text">
          <h1 className="page-title">Assign Request</h1>
          <p className="page-subtitle">Assign staff and set priority</p>
        </div>
      </div>

      <div className="form-container">
        <form onSubmit={handleSubmit} className="modern-form">
          {/* Request Information */}
          <div className="form-section">
            <h3 className="form-section-title">Request Information</h3>
            <div style={{
              padding: '1rem',
              background: 'var(--bg-primary)',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              marginBottom: '1rem'
            }}>
              <div style={{ display: 'grid', gap: '0.75rem' }}>
                <div>
                  <strong>Type:</strong> {requestData.type}
                </div>
                <div>
                  <strong>Description:</strong> {requestData.description}
                </div>
                <div>
                  <strong>Current Status:</strong> 
                  <span className={`role-badge role-${requestData.status}`} style={{ marginLeft: '0.5rem' }}>
                    {requestData.status}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Assignment Section */}
          <div className="form-section">
            <h3 className="form-section-title">Assignment Details</h3>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">
                  <User size={16} />
                  Assign to Staff *
                </label>
                <select
                  name="staffId"
                  value={formData.staffId}
                  onChange={handleChange}
                  className="form-select"
                  required
                >
                  <option value="">Select Staff Member</option>
                  {staff.map(member => (
                    <option key={member.id} value={member.id}>
                      {member.name} - {member.role}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">
                  <AlertCircle size={16} />
                  Priority *
                </label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="form-select"
                  required
                >
                  <option value="low">Low</option>
                  <option value="normal">Normal</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">
                  <Clock size={16} />
                  Status *
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="form-select"
                  required
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In-Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="form-actions-sticky">
            <button
              type="button"
              className="btn btn-secondary btn-large"
              onClick={() => navigate('/admin/requests')}
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary btn-large"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <div className="btn-spinner"></div>
                  Assigning...
                </>
              ) : (
                'Assign Request'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AdminRequestAssign;