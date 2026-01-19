import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Tag, FileText } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import Loader from '../../components/common/Loader';

function NoticeEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    postedBy: 49,
    title: '',
    description: '',
    category: 'general'
  });

  useEffect(() => {
    fetchNotice();
  }, [id]);

  const fetchNotice = async () => {
    try {
      const res = await api.get(`/notice/${id}`); // ✅ Fixed
      const data = res.data.data;
      setFormData({
        postedBy: 49,
        title: data.title,
        description: data.description,
        category: data.category
      });
    } catch {
      toast.error('Failed to fetch notice');
      navigate('/admin/notices');
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
      await api.patch(`/notice/${id}`, formData); // ✅ Already correct
      toast.success('Notice updated successfully!');
      navigate('/admin/notices');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update notice');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="page">
      <div className="page-header-form">
        <button className="btn-back" onClick={() => navigate('/admin/notices')}>
          <ArrowLeft size={20} />
        </button>
        <div className="page-header-text">
          <h1 className="page-title">Edit Notice</h1>
          <p className="page-subtitle">Update notice information</p>
        </div>
      </div>

      <div className="form-container">
        <form onSubmit={handleSubmit} className="modern-form">
          <div className="form-section">
            <h3 className="form-section-title">Notice Information</h3>
            <div className="form-grid">

              <div className="form-group">
                <label className="form-label">
                  <Tag size={16} />
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="form-select"
                  required
                >
                  <option value="general">General</option>
                  <option value="event">Event</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="emergency">Emergency</option>
                </select>
              </div>

              <div className="form-group full-width">
                <label className="form-label">
                  <FileText size={16} />
                  Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group full-width">
                <label className="form-label">
                  <FileText size={16} />
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="form-textarea"
                  rows="4"
                  required
                />
              </div>

            </div>
          </div>

          <div className="form-actions-sticky">
            <button type="button" className="btn btn-secondary btn-large" onClick={() => navigate('/admin/notices')} disabled={submitting}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary btn-large" disabled={submitting}>
              {submitting ? 'Updating...' : 'Update Notice'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NoticeEdit;