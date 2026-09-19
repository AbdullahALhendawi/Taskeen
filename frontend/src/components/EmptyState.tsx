import { InboxIcon } from './icons';

interface EmptyStateProps {
  message: string;
  large?: boolean;
}

function EmptyState({ message, large }: EmptyStateProps) {
  return (
    <div className={large ? 'empty-state empty-state-lg' : 'empty-state'}>
      <div className="empty-state-icon"><InboxIcon size={large ? 26 : 20} /></div>
      <p>{message}</p>
    </div>
  );
}

export default EmptyState;
