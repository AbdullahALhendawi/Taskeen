import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../api/client';
import { useToast } from '../context/ToastContext';
import { useConfirm } from '../context/ConfirmContext';

interface ResidentDetail {
  id: string;
  employeeId: string;
  fullName: string;
  phone: string;
  nationality: string;
  jobTitle: string;
  isAccommodated: boolean;
  buildingName: string | null;
  floorNumber: number | null;
  apartmentNumber: number | null;
  roomNumber: number | null;
  bedNumber: number | null;
}

function ResidentDetailPage() {
  const { residentId } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const confirm = useConfirm();
  const [resident, setResident] = useState<ResidentDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadResident();
  }, [residentId]);

  async function loadResident() {
    if (!residentId) return;
    try {
      const data = await api.get<ResidentDetail>(`/residents/${residentId}`);
      setResident(data);
    } catch (err) {
      showToast('Failed to load resident.', 'error');
    } finally {
      setIsLoading(false);
    }
  }

     async function handleDeleteClick() {
    if (!resident) return;
    const confirmed = await confirm({ message: `Are you sure you want to delete ${resident.fullName}?` });
    if (!confirmed) return;
    try {
      await api.delete(`/residents/${resident.id}`);
      navigate('/residents');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete resident.';
      showToast(message, 'error');
    }
  }

  if (isLoading) return <p style={{ padding: '24px', color: '#6B7280', fontSize: '14px' }}>Loading...</p>;
  if (!resident) return <p style={{ padding: '24px', color: '#6B7280', fontSize: '14px' }}>Resident not found.</p>;

  const rowStyle: React.CSSProperties = { display: 'flex', gap: '10px', padding: '12px 0', borderBottom: '1px solid #F3F4F6' };
  const labelStyle: React.CSSProperties = { fontWeight: 600, color: '#6B7280', fontSize: '14px', width: '140px' };
  const valueStyle: React.CSSProperties = { fontSize: '14px', color: '#111827' };

  const locationText = resident.buildingName
    ? `${resident.buildingName} · Floor ${resident.floorNumber} · Apt ${resident.apartmentNumber} · Room ${resident.roomNumber} · Bed ${resident.bedNumber}`
    : 'Not accommodated';

  return (
    <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '12px' }}>
      <div style={{ width: '100%', maxWidth: '500px', backgroundColor: '#fff', border: '1px solid #F0F0F2', borderRadius: '14px', padding: '36px', boxShadow: '0 1px 3px rgba(16, 24, 40, 0.04)' }}>
        <h1 style={{ marginTop: 0, marginBottom: '24px', fontSize: '22px', fontWeight: 700, color: '#111827', textAlign: 'center', wordBreak: 'break-word', overflowWrap: 'break-word' }}>{resident.fullName}</h1>

        <div style={rowStyle}><span style={labelStyle}>Employee ID</span><span style={valueStyle}>{resident.employeeId}</span></div>
        <div style={rowStyle}><span style={labelStyle}>Phone</span><span style={valueStyle}>{resident.phone || '—'}</span></div>
        <div style={rowStyle}><span style={labelStyle}>Nationality</span><span style={valueStyle}>{resident.nationality || '—'}</span></div>
        <div style={rowStyle}><span style={labelStyle}>Job Title</span><span style={valueStyle}>{resident.jobTitle || '—'}</span></div>
        <div style={{ ...rowStyle, borderBottom: 'none' }}><span style={labelStyle}>Location</span><span style={valueStyle}>{locationText}</span></div>

        <div style={{ display: 'flex', gap: '12px', marginTop: '28px', justifyContent: 'center' }}>
          <Link to={`/residents/${resident.id}/edit`}>
            <button style={{ padding: '10px 20px', fontSize: '14px', fontWeight: 600, color: '#fff', backgroundColor: '#4F46E5', border: 'none', borderRadius: '10px', cursor: 'pointer', boxShadow: '0 4px 10px rgba(79, 70, 229, 0.25)' }}>
              Edit
            </button>
          </Link>
          <button onClick={handleDeleteClick} style={{ padding: '10px 20px', fontSize: '14px', fontWeight: 600, color: '#DC2626', backgroundColor: '#FEF2F2', border: 'none', borderRadius: '10px', cursor: 'pointer' }}>
            Delete
          </button>
          <Link to="/residents">
            <button style={{ padding: '10px 20px', fontSize: '14px', fontWeight: 600, color: '#374151', backgroundColor: '#F3F4F6', border: 'none', borderRadius: '10px', cursor: 'pointer' }}>
              Back to List
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ResidentDetailPage;