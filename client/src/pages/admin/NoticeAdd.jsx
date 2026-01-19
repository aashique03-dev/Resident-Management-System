import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Tag, FileText } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

function NoticeAdd() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    postedBy: 49,  // admin ID
    title: '',
    description: '',
    category: 'general'
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
      await api.post('/notice', formData);
      toast.success('Notice added successfully!');
      navigate('/admin/notices');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add notice');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="page-header-form">
        <button className="btn-back" onClick={() => navigate('/admin/notices')}>
          <ArrowLeft size={20} />
        </button>
        <div className="page-header-text">
          <h1 className="page-title">Add New Notice</h1>
          <p className="page-subtitle">Create a society announcement</p>
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
            <button type="button" className="btn btn-secondary btn-large" onClick={() => navigate('/admin/notices')} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary btn-large" disabled={loading}>
              {loading ? 'Adding...' : 'Add Notice'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NoticeAdd;
