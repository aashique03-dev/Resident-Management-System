import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import Loader from '../../components/common/Loader';

function HouseEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    block: '',
    houseNumber: '',
    houseType: '',
    parkingSlotCount: '',
    status: 'available',
  });

  // Fetch house details on mount
  useEffect(() => {
    const fetchHouse = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/house/${id}`);
        const data = res.data.data;

        setFormData({
          block: data.block || '',
          houseNumber: data.houseNumber || '',
          houseType: data.houseType || '',
          parkingSlotCount: data.parkingSlotCount || '',
          status: data.status || 'available',
        });
      } catch (err) {
        toast.error('Failed to fetch house details');
        navigate('/admin/houses');
      } finally {
        setLoading(false);
      }
    };

    fetchHouse();
  }, [id, navigate]);

  // Update form state on input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Submit updated house data
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await api.patch(`/house/${id}`, formData);
      toast.success('House updated successfully!');
      navigate('/admin/houses');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update house');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="page">
      <div className="page-header">
        <button
          className="btn-back"
          onClick={() => navigate('/admin/houses')}
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="page-title">Edit House</h1>
          <p className="page-subtitle">Update house information</p>
        </div>
      </div>

      <div className="card form-card">
        <form onSubmit={handleSubmit}>
          <div className="form-grid">

            <div className="form-group">
              <label className="form-label">Block *</label>
              <input
                type="text"
                name="block"
                value={formData.block}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">House Number *</label>
              <input
                type="text"
                name="houseNumber"
                value={formData.houseNumber}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">House Type *</label>
              <input
                type="text"
                name="houseType"
                value={formData.houseType}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Parking Slots *</label>
              <input
                type="number"
                name="parkingSlotCount"
                value={formData.parkingSlotCount}
                onChange={handleChange}
                className="form-input"
                min="0"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Status *</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="form-input"
                required
              >
                <option value="available">Available</option>
                <option value="occupied">Occupied</option>
              </select>
            </div>

          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate('/admin/houses')}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
            >
              {submitting ? 'Updating...' : 'Update House'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default HouseEdit;
