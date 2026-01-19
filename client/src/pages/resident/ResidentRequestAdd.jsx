import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ClipboardList, FileText } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

function ResidentRequestAdd() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    type: '',
    description: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post('/resident/request', formData);
      toast.success('Request submitted successfully!');
      navigate('/resident/requests');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="page-header-form">
        <button className="btn-back" onClick={() => navigate('/resident/requests')}>
          <ArrowLeft size={20} />
        </button>
        <div className="page-header-text">
          <h1 className="page-title">New Service Request</h1>
          <p className="page-subtitle">Submit a maintenance or service request</p>
        </div>
      </div>

      <div className="form-container">
        <form onSubmit={handleSubmit} className="modern-form">
          {/* Request Details Section */}
          <div className="form-section">
            <h3 className="form-section-title">Request Details</h3>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">
                  <ClipboardList size={16} />
                  Request Type *
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="form-select"
                  required
                >
                  <option value="">Select Type</option>
                  <option value="Plumbing">Plumbing</option>
                  <option value="Electrical">Electrical</option>
                  <option value="Cleaning">Cleaning</option>
                  <option value="Maintenance">General Maintenance</option>
                  <option value="Security">Security</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="form-label">
                  <FileText size={16} />
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Please describe the issue in detail..."
                  rows="6"
                  required
                />
              </div>
            </div>
          </div>

          {/* Info Message */}
          <div className="form-section">
            <div style={{
              padding: '1rem',
              background: 'rgba(59, 130, 246, 0.1)',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              borderRadius: '8px',
              color: 'var(--text-secondary)'
            }}>
              <p style={{ fontSize: '0.9rem', margin: 0 }}>
                📋 Your request will be reviewed by the admin who will assign it to the appropriate staff member.
              </p>
            </div>
          </div>

          {/* Form Actions */}
          <div className="form-actions-sticky">
            <button
              type="button"
              className="btn btn-secondary btn-large"
              onClick={() => navigate('/resident/requests')}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary btn-large"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="btn-spinner"></div>
                  Submitting...
                </>
              ) : (
                'Submit Request'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ResidentRequestAdd;