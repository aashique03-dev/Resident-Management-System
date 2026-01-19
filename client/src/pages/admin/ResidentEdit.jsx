import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, User, CreditCard, Phone, Mail, Home, Shield } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import Loader from '../../components/common/Loader';

function ResidentEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    houseId: '',
    name: '',
    cnic: '',
    contact: '',
    email: '',
    role: 'rental'
  });

  useEffect(() => {
    fetchResident();
  }, [id]);

  const fetchResident = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/residents/${id}`);
      const data = response.data.data;
      setFormData({
        houseId: data.houseId,
        name: data.name,
        cnic: data.cnic,
        contact: data.contact,
        email: data.email,
        role: data.role
      });
    } catch (error) {
      toast.error('Failed to fetch resident details');
      navigate('/admin/residents');
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
      await api.patch(`/residents/${id}`, formData);
      toast.success('Resident updated successfully!');
      navigate('/admin/residents');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update resident');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="page">
      <div className="page-header-form">
        <button className="btn-back" onClick={() => navigate('/admin/residents')}>
          <ArrowLeft size={20} />
        </button>
        <div className="page-header-text">
          <h1 className="page-title">Edit Resident</h1>
          <p className="page-subtitle">Update resident information</p>
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
                  <CreditCard size={16} />
                  CNIC *
                </label>
                <input
                  type="text"
                  name="cnic"
                  value={formData.cnic}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>
            </div>
          </div>

          {/* Contact Information Section */}
          <div className="form-section">
            <h3 className="form-section-title">Contact Information</h3>
            <div className="form-grid">
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
            </div>
          </div>

          {/* Account Information Section */}
          <div className="form-section">
            <h3 className="form-section-title">Account Information</h3>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">
                  <Home size={16} />
                  House ID *
                </label>
                <input
                  type="number"
                  name="houseId"
                  value={formData.houseId}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <Shield size={16} />
                  Role *
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="form-select"
                  required
                >
                  <option value="rental">Rental</option>
                  <option value="admin">Admin</option>
                  <option value="owner">Owner</option>
                </select>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="form-actions-sticky">
            <button
              type="button"
              className="btn btn-secondary btn-large"
              onClick={() => navigate('/admin/residents')}
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
                'Update Resident'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ResidentEdit;