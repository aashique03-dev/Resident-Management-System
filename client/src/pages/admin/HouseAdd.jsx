import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

function HouseAdd() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    block: 'A',
    houseNumber: '',
    houseType: '2BHK',
    parkingSlotCount: 1,
    status: 'available'
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
      // Convert numeric fields to integers before sending
      const dataToSend = {
        block: formData.block,
        houseNumber: parseInt(formData.houseNumber, 10),
        houseType: formData.houseType,
        parkingSlotCount: parseInt(formData.parkingSlotCount, 10),
        status: formData.status
      };

      // Validate that conversions worked
      if (isNaN(dataToSend.houseNumber) || isNaN(dataToSend.parkingSlotCount)) {
        toast.error('Please enter valid numbers for house number and parking slots');
        setLoading(false);
        return;
      }

      console.log('Sending data:', dataToSend); // Debug log
      
      const response = await api.post('/houses', dataToSend);
      console.log('Response:', response.data); // Debug log
      
      toast.success('House added successfully!');
      navigate('/admin/houses');
    } catch (error) {
      console.error('Error details:', error.response || error); // Debug log
      toast.error(error.response?.data?.message || 'Failed to add house');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <button className="btn-back" onClick={() => navigate('/admin/houses')}>
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="page-title">Add New House</h1>
          <p className="page-subtitle">Create a new house entry</p>
        </div>
      </div>

      <div className="card form-card">
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Block *</label>
              <select
                name="block"
                value={formData.block}
                onChange={handleChange}
                className="form-input"
                required
              >
                <option value="A">Block A</option>
                <option value="B">Block B</option>
                <option value="C">Block C</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">House Number *</label>
              <input
                type="number"
                name="houseNumber"
                value={formData.houseNumber}
                onChange={handleChange}
                className="form-input"
                placeholder="101"
                min="1"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">House Type *</label>
              <select
                name="houseType"
                value={formData.houseType}
                onChange={handleChange}
                className="form-input"
                required
              >
                <option value="1BHK">1BHK</option>
                <option value="2BHK">2BHK</option>
                <option value="3BHK">3BHK</option>
              </select>
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
                max="5"
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
              disabled={loading}
            >
              {loading ? 'Adding...' : 'Add House'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default HouseAdd;