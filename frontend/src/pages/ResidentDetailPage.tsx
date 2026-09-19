import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../api/client';
import { useToast } from '../context/ToastContext';
import { useConfirm } from '../context/ConfirmContext';
import { HashIcon, PhoneIcon, GlobeIcon, BriefcaseIcon, MapPinIcon, TrashIcon } from '../components/icons';
import { getInitials, getAvatarGradient } from '../utils/avatar';
import './ResidentDetailPage.css';

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

  if (isLoading) return <p className="loading-text">Loading...</p>;
  if (!resident) return <p className="loading-text">Resident not found.</p>;

  const locationText = resident.buildingName
    ? `${resident.buildingName} · Floor ${resident.floorNumber} · Apt ${resident.apartmentNumber} · Room ${resident.roomNumber} · Bed ${resident.bedNumber}`
    : 'Not accommodated';

  const gradient = getAvatarGradient(resident.fullName);

  return (
    <div className="form-page">
      <div className="badge-wrap fade-in">
        <div className="badge-clip"><span className="badge-clip-hole" /></div>
        <div className="card badge-card">
          <div className="badge-band" style={{ background: gradient }}>
            <span className={resident.isAccommodated ? 'badge badge-active' : 'badge badge-muted'} style={{ background: 'rgba(255,255,255,0.9)' }}>
              {resident.isAccommodated ? 'Accommodated' : 'Not Accommodated'}
            </span>
          </div>

          <div className="badge-avatar-wrap">
            <div className="avatar avatar-lg" style={{ background: gradient }}>
              {getInitials(resident.fullName)}
            </div>
          </div>

          <div className="badge-body">
            <h1 className="badge-name">{resident.fullName}</h1>
            <p className="badge-role">{resident.jobTitle || 'Resident'}</p>

            <div className="badge-divider" />

            <div className="badge-details">
              <div className="badge-detail-row">
                <div className="badge-detail-icon"><HashIcon size={16} /></div>
                <div className="badge-detail-text">
                  <p className="badge-detail-label">Employee ID</p>
                  <p className="badge-detail-value">{resident.employeeId}</p>
                </div>
              </div>
              <div className="badge-detail-row">
                <div className="badge-detail-icon"><PhoneIcon size={16} /></div>
                <div className="badge-detail-text">
                  <p className="badge-detail-label">Phone</p>
                  <p className="badge-detail-value">{resident.phone || '—'}</p>
                </div>
              </div>
              <div className="badge-detail-row">
                <div className="badge-detail-icon"><GlobeIcon size={16} /></div>
                <div className="badge-detail-text">
                  <p className="badge-detail-label">Nationality</p>
                  <p className="badge-detail-value">{resident.nationality || '—'}</p>
                </div>
              </div>
              <div className="badge-detail-row">
                <div className="badge-detail-icon"><BriefcaseIcon size={16} /></div>
                <div className="badge-detail-text">
                  <p className="badge-detail-label">Job Title</p>
                  <p className="badge-detail-value">{resident.jobTitle || '—'}</p>
                </div>
              </div>
              <div className="badge-detail-row">
                <div className="badge-detail-icon"><MapPinIcon size={16} /></div>
                <div className="badge-detail-text">
                  <p className="badge-detail-label">Location</p>
                  <p className="badge-detail-value">{locationText}</p>
                </div>
              </div>
            </div>

            <div className="detail-actions">
              <Link to={`/residents/${resident.id}/edit`}>
                <button className="btn btn-primary">Edit</button>
              </Link>
              <button onClick={handleDeleteClick} className="btn btn-danger-subtle">
                <TrashIcon size={15} />
                Delete
              </button>
              <Link to="/residents">
                <button className="btn btn-secondary">Back to List</button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResidentDetailPage;
