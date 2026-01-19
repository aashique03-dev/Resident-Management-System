function StatCard({ icon: Icon, label, value, color = 'blue' }) {
  return (
    <div className={`stat-card stat-${color}`}>
      <div className="stat-icon">
        <Icon size={24} />
      </div>
      <div className="stat-content">
        <h3 className="stat-value">{value}</h3>
        <p className="stat-label">{label}</p>
      </div>
    </div>
  );
}

export default StatCard;