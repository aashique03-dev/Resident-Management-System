import { useEffect, useState } from 'react';
import { User, Home, Phone, Mail, IdCard, Car, MapPin, Building2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import Loader from '../../components/common/Loader';
import toast from 'react-hot-toast';

function ResidentProfile() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (user?.id) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/profile`);
      setProfile(res.data.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="page">
        <div className="empty-state">
          <p className="empty-text">Please log in to view your profile</p>
        </div>
      </div>
    );
  }

  if (loading) return <Loader />;

  if (!profile) {
    return (
      <div className="page">
        <div className="empty-state">
          <p className="empty-text">Failed to load profile data</p>
          <button className="btn btn-primary" onClick={fetchProfile}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">My Profile</h1>
          <p className="page-subtitle">View and manage your information</p>
        </div>
      </div>

      {/* Profile Grid */}
      <div className="profile-grid">
        
        {/* Profile Summary Card */}
        <div className="card">
          <div className="profile-center">
            {/* Avatar */}
            <div className="profile-avatar">
              {profile.name.charAt(0).toUpperCase()}
            </div>
            
            {/* Name */}
            <h2 className="profile-name">{profile.name}</h2>
            
            {/* Role */}
            <span className="badge badge-blue" style={{ 
              fontSize: '0.9rem',
              padding: '0.5rem 1rem',
              textTransform: 'capitalize'
            }}>
              {profile.role}
            </span>

            {/* Divider */}
            <div className="divider"></div>

            {/* Quick Stats */}
            <div className="stats-mini-grid">
              <div className="stat-mini">
                <div className="stat-mini-value" style={{ color: 'var(--primary)' }}>
                  {profile.block}
                </div>
                <div className="stat-mini-label">Block</div>
              </div>

              <div className="stat-mini">
                <div className="stat-mini-value" style={{ color: 'var(--success)' }}>
                  {profile.houseNumber}
                </div>
                <div className="stat-mini-label">House</div>
              </div>

              <div className="stat-mini">
                <div className="stat-mini-value" style={{ color: 'var(--warning)' }}>
                  {profile.parkingSlotCount}
                </div>
                <div className="stat-mini-label">Parking</div>
              </div>
            </div>
          </div>
        </div>

        {/* Personal Information Card */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">
              <User size={20} />
              Personal Information
            </h2>
          </div>
          <div className="detail-items-list">
            
            <div className="detail-item-row">
              <div className="detail-icon-box blue">
                <IdCard size={20} />
              </div>
              <div className="detail-content">
                <div className="detail-label">CNIC Number</div>
                <div className="detail-value">{profile.cnic}</div>
              </div>
            </div>

            <div className="detail-item-row">
              <div className="detail-icon-box green">
                <Phone size={20} />
              </div>
              <div className="detail-content">
                <div className="detail-label">Contact Number</div>
                <div className="detail-value">{profile.contact}</div>
              </div>
            </div>

            <div className="detail-item-row">
              <div className="detail-icon-box purple">
                <Mail size={20} />
              </div>
              <div className="detail-content">
                <div className="detail-label">Email Address</div>
                <div className="detail-value">{profile.email}</div>
              </div>
            </div>

          </div>
        </div>

        {/* Residence Details Card */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">
              <Home size={20} />
              Residence Details
            </h2>
          </div>
          <div className="detail-items-list">
            
            <div className="detail-item-row">
              <div className="detail-icon-box blue">
                <MapPin size={20} />
              </div>
              <div className="detail-content">
                <div className="detail-label">House Location</div>
                <div className="detail-value">Block {profile.block} - House {profile.houseNumber}</div>
              </div>
            </div>

            <div className="detail-item-row">
              <div className="detail-icon-box yellow">
                <Building2 size={20} />
              </div>
              <div className="detail-content">
                <div className="detail-label">House Type</div>
                <div className="detail-value">{profile.houseType}</div>
              </div>
            </div>

            <div className="detail-item-row">
              <div className="detail-icon-box green">
                <Car size={20} />
              </div>
              <div className="detail-content">
                <div className="detail-label">Parking Allocation</div>
                <div className="detail-value">
                  {profile.parkingSlotCount} Slot{profile.parkingSlotCount !== 1 ? 's' : ''}
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

export default ResidentProfile;