interface EmptyStateProps {
  message: string;
}

function EmptyState({ message }: EmptyStateProps) {
  return (
    <div style={{ padding: '28px', textAlign: 'center', color: '#9CA3AF', fontSize: '14px', border: '1px dashed #E5E7EB', borderRadius: '12px', backgroundColor: '#FAFAFA' }}>
      <p style={{ margin: 0 }}>{message}</p>
    </div>
  );
}

export default EmptyState;