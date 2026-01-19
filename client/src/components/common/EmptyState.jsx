import { Inbox } from 'lucide-react';

function EmptyState({ message = "No data found" }) {
  return (
    <div className="empty-state">
      <Inbox size={64} className="empty-icon" />
      <p className="empty-text">{message}</p>
    </div>
  );
}

export default EmptyState;