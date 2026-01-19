import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Home, Car, Hash, Shield } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

function ParkingAdd() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    houseId: '',
    slotNumber: '',
    vehicleType: '',
    vehicleNumber: '',
    status: 'vacant'
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post('/parking', formData);
      toast.success('Parking added successfully');
      navigate('/admin/parking');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add parking');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="page-header-form">
        <button className="btn-back" onClick={() => navigate('/admin/parking')}>
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="page-title">Add Parking</h1>
          <p className="page-subtitle">Create new parking slot</p>
        </div>
      </div>

      <div className="form-container">
        <form onSubmit={handleSubmit} className="modern-form">

          <div className="form-section">
            <h3 className="form-section-title">Parking Information</h3>

            <div className="form-grid">
              <div className="form-group">
                <label className="form-label"><Home size={16}/> House ID *</label>
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
                <label className="form-label"><Hash size={16}/> Slot Number *</label>
                <input
                  type="text"
                  name="slotNumber"
                  value={formData.slotNumber}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label"><Car size={16}/> Vehicle Type</label>
                <input
                  type="text"
                  name="vehicleType"
                  value={formData.vehicleType}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label"><Hash size={16}/> Vehicle Number</label>
                <input
                  type="text"
                  name="vehicleNumber"
                  value={formData.vehicleNumber}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label"><Shield size={16}/> Status *</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="vacant">Vacant</option>
                  <option value="occupied">Occupied</option>
                </select>
              </div>
            </div>
          </div>

          <div className="form-actions-sticky">
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/admin/parking')}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Adding...' : 'Add Parking'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default ParkingAdd;