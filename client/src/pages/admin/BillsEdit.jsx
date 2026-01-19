import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Home, Calendar, DollarSign, FileText, CreditCard, AlertCircle } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import Loader from '../../components/common/Loader';

function BillsEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    houseId: '',
    month: '',
    billType: 'Maintenance',
    amount: '',
    dueDate: '',
    status: 'pending',
    description: ''
  });

  useEffect(() => {
    fetchBill();
  }, [id]);

  const fetchBill = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/bill/${id}`);
      const data = response.data.data;

      // Format the date for the input field
      const formattedDate = data.dueDate ? new Date(data.dueDate).toISOString().split('T')[0] : '';

      setFormData({
        houseId: data.houseId || '',
        month: data.month || '',
        billType: data.billType || 'Maintenance',
        amount: data.amount || '',
        dueDate: formattedDate,
        status: data.status || 'pending',
        description: data.description || ''
      });
    } catch (error) {
      console.error('Fetch bill error:', error);
      toast.error('Failed to fetch bill details');
      navigate('/admin/bills');
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
      const dataToSend = {
        houseId: parseInt(formData.houseId, 10),
        month: formData.month,
        billType: formData.billType,
        amount: parseFloat(formData.amount),
        dueDate: formData.dueDate,
        status: formData.status,
        description: formData.description
      };

      if (isNaN(dataToSend.houseId) || isNaN(dataToSend.amount)) {
        toast.error('Please enter valid numbers for house ID and amount');
        setSubmitting(false);
        return;
      }

      console.log('Updating bill:', dataToSend);

      await api.put(`/bill/${id}`, dataToSend);
      toast.success('Bill updated successfully!');
      navigate('/admin/bills');
    } catch (error) {
      console.error('Update bill error:', error);
      toast.error(error.response?.data?.message || 'Failed to update bill');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="page">
      <div className="page-header-form">
        <button className="btn-back" onClick={() => navigate('/admin/bills')}>
          <ArrowLeft size={20} />
        </button>
        <div className="page-header-text">
          <h1 className="page-title">Edit Bill</h1>
          <p className="page-subtitle">Update bill information</p>
        </div>
      </div>

      <div className="form-container">
        <form onSubmit={handleSubmit} className="modern-form">
          {/* Basic Information Section */}
          <div className="form-section">
            <h3 className="form-section-title">Basic Information</h3>
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
                  placeholder="Enter house ID"
                  min="1"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <Calendar size={16} />
                  Month *
                </label>
                <input
                  type="text"
                  name="month"
                  value={formData.month}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="January-2025"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <FileText size={16} />
                  Bill Type *
                </label>
                <select
                  name="billType"
                  value={formData.billType}
                  onChange={handleChange}
                  className="form-select"
                  required
                >
                  <option value="Maintenance">Maintenance</option>
                  <option value="Electricity">Electricity</option>
                  <option value="Water">Water</option>
                  <option value="Gas">Gas</option>
                  <option value="Security">Security</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* Payment Details Section */}
          <div className="form-section">
            <h3 className="form-section-title">Payment Details</h3>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">
                  <DollarSign size={16} />
                  Amount (Rs.) *
                </label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="12000"
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <Calendar size={16} />
                  Due Date *
                </label>
                <input
                  type="date"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <CreditCard size={16} />
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
                  <option value="paid">Paid</option>
                  <option value="unpaid">Unpaid</option>
                  <option value="overdue">Overdue</option>
                </select>
              </div>
            </div>
          </div>

          {/* Additional Information Section */}
          <div className="form-section">
            <h3 className="form-section-title">Additional Information</h3>
            <div className="form-group">
              <label className="form-label">
                <AlertCircle size={16} />
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="form-input"
                placeholder="Monthly maintenance fee, electricity bill, etc."
                rows="4"
              ></textarea>
            </div>
          </div>

          {/* Form Actions */}
          <div className="form-actions-sticky">
            <button
              type="button"
              className="btn btn-secondary btn-large"
              onClick={() => navigate('/admin/bills')}
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
                'Update Bill'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default BillsEdit;