import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, User, Mail, Phone, Briefcase, ClipboardList } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import Loader from '../../components/common/Loader';

function StaffEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    contact: '',
    assignedRequests: 0
  });

  useEffect(() => {
    fetchStaff();
  }, [id]);

  const fetchStaff = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/staff/${id}`);
      const data = response.data.data;

      setFormData({
        name: data.name || '',
        email: data.email || '',
        role: data.role || '',
        contact: data.contact || '',
        assignedRequests: data.assignedRequests || 0
      });
    } catch (error) {
      console.error('Fetch staff error:', error);
      toast.error('Failed to fetch staff details');
      navigate('/admin/staff');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.name === 'assignedRequests' 
        ? parseInt(e.target.value) || 0
        : e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const dataToSend = {
        name: formData.name,
        email: formData.email,
        role: formData.role,
        contact: formData.contact,
        assignedRequests: formData.assignedRequests
      };

      await api.patch(`/staff/${id}`, dataToSend);
      toast.success('Staff member updated successfully!');
      navigate('/admin/staff');
    } catch (error) {
      console.error('Update staff error:', error);
      toast.error(error.response?.data?.message || 'Failed to update staff member');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="page">
      <div className="page-header-form">
        <button className="btn-back" onClick={() => navigate('/admin/staff')}>
          <ArrowLeft size={20} />
        </button>
        <div className="page-header-text">
          <h1 className="page-title">Edit Staff Member</h1>
          <p className="page-subtitle">Update staff member information</p>
        </div>
      </div>

      <div className="form-container">
        <form onSubmit={handleSubmit} className="modern-form">
          {/* Personal Information Section */}
          <div className="form-section">
            <h3 className="form-section-title">Personal Information</h3>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">
                  <User size={16} />
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <Mail size={16} />
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <Phone size={16} />
                  Contact Number *
                </label>
                <input
                  type="text"
                  name="contact"
                  value={formData.contact}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>
            </div>
          </div>

          {/* Job Information Section */}
          <div className="form-section">
            <h3 className="form-section-title">Job Information</h3>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">
                  <Briefcase size={16} />
                  Role *
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="form-select"
                  required
                >
                  <option value="Electrician">Electrician</option>
                  <option value="Plumber">Plumber</option>
                  <option value="Cleaner">Cleaner</option>
                  <option value="Security Guard">Security Guard</option>
                  <option value="Gardener">Gardener</option>
                  <option value="Technician">Technician</option>
                  <option value="Carpenter">Carpenter</option>
                  <option value="Manager">Manager</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">
                  <ClipboardList size={16} />
                  Assigned Requests
                </label>
                <input
                  type="number"
                  name="assignedRequests"
                  value={formData.assignedRequests}
                  onChange={handleChange}
                  className="form-input"
                  min="0"
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="form-actions-sticky">
            <button
              type="button"
              className="btn btn-secondary btn-large"
              onClick={() => navigate('/admin/staff')}
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
                  Updating...
                </>
              ) : (
                'Update Staff Member'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default StaffEdit;