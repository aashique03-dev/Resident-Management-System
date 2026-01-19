import { useEffect, useState } from "react";
import { Plus, Edit2, Trash2, Search, User, Tag } from "lucide-react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import Modal from "../../components/common/Modal";
import toast from "react-hot-toast";

/* =========================
   Notice Card
========================= */
const NoticeCard = ({ notice, onDelete }) => {
  return (
    <div className="resident-card">
      <div className="resident-card-header">
        <div className="resident-avatar">
          {notice.title.charAt(0).toUpperCase()}
        </div>
        <div className="resident-card-info">
          <h3 className="resident-name">{notice.title}</h3>
          <span className={`role-badge role-${notice.category}`}>
            {notice.category}
          </span>
        </div>
      </div>

      <div className="resident-card-body">
        <div className="info-row">
          <User size={16} />
          <span>{notice.PostedBy} ({notice.role})</span>
        </div>

        <div className="info-row">
          <Tag size={16} />
          <span>{new Date(notice.datePosted).toLocaleDateString()}</span>
        </div>

        <div className="info-row">
          <span className="text-muted" style={{ fontSize: "0.9rem" }}>
            {notice.description}
          </span>
        </div>
      </div>

      <div className="resident-card-actions">
        <Link
          to={`/admin/notices/edit/${notice.id}`}
          className="card-btn card-btn-edit"
          title="Edit"
        >
          <Edit2 size={16} />
        </Link>

        <button
          className="card-btn card-btn-delete"
          onClick={() => onDelete(notice.id)}
          title="Delete"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};

/* =========================
   Notices List
========================= */
function NoticesList() {
  const [notices, setNotices] = useState([]);
  const [filteredNotices, setFilteredNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null });

  useEffect(() => {
    fetchNotices();
  }, []);

  useEffect(() => {
    filterNotices();
  }, [searchTerm, notices]);

  const fetchNotices = async () => {
    try {
      setLoading(true);
      const res = await api.get("/notics"); // âœ… Fixed
      setNotices(res.data.data);
    } catch {
      toast.error("Failed to fetch notices");
    } finally {
      setLoading(false);
    }
  };

  const filterNotices = () => {
    let filtered = notices;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(n =>
        n.title.toLowerCase().includes(term) ||
        n.description.toLowerCase().includes(term) ||
        n.category.toLowerCase().includes(term) ||
        n.PostedBy.toLowerCase().includes(term)
      );
    }

    setFilteredNotices(filtered);
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/notice/${deleteModal.id}`); // âœ… Fixed
      toast.success("Notice deleted");
      setDeleteModal({ isOpen: false, id: null });
      fetchNotices();
    } catch {
      toast.error("Delete failed");
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Notices</h1>
          <p className="page-subtitle">Society announcements</p>
        </div>

        <Link to="/admin/notices/add" className="btn btn-primary">
          <Plus size={18} />
          Add Notice
        </Link>
      </div>

      {/* Search */}
      <div className="search-bar-large">
        <Search size={20} className="search-icon" />
        <input
          type="text"
          placeholder="Search by Notice..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      {/* Grid */}
      {filteredNotices.length === 0 ? (
        <EmptyState message="No notices found" />
      ) : (
        <div className="residents-grid">
          {filteredNotices.map((notice) => (
            <NoticeCard
              key={notice.id}
              notice={notice}
              onDelete={(id) =>
                setDeleteModal({ isOpen: true, id })
              }
            />
          ))}
        </div>
      )}

      {/* Delete Modal */}
      <Modal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, id: null })}
        title="Confirm Delete"
      >
        <p className="modal-text">Are you sure you want to delete this notice?</p>
        <div className="modal-actions">
          <button
            className="btn btn-secondary"
            onClick={() => setDeleteModal({ isOpen: false, id: null })}
          >
            Cancel
          </button>
          <button className="btn btn-danger" onClick={handleDelete}>
            Delete
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default NoticesList;