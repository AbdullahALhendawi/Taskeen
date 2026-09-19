import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import { useToast } from '../context/ToastContext';
import ResidentForm from '../components/ResidentForm';
import { CheckCircleIcon, UsersIcon, MapPinIcon } from '../components/icons';
import './AddResidentPage.css';

interface CreateResidentValues {
  employeeId: string;
  fullName: string;
  phone: string;
  nationality: string;
  jobTitle: string;
}

interface NearestBed {
  bedId: string;
  buildingId: string;
  roomId: string;
  buildingName: string;
  floorNumber: number;
  apartmentNumber: number;
  roomNumber: number;
}

function AddResidentPage() {
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [savedResidentId, setSavedResidentId] = useState<string | null>(null);
  const [suggestion, setSuggestion] = useState<NearestBed | null>(null);

  async function handleSubmit(values: CreateResidentValues) {
    try {
      const newId = await api.post<string>('/residents', values);

      try {
        const nearestBed = await api.get<NearestBed>('/beds/nearest-empty');
        setSavedResidentId(newId);
        setSuggestion(nearestBed);
      } catch {
        navigate('/residents');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create resident.';
      showToast(message, 'error');
    }
  }

  async function handleAssignNow() {
    if (!savedResidentId || !suggestion) return;
    try {
      await api.post(`/beds/${suggestion.bedId}/assign`, { residentId: savedResidentId });
      navigate(`/buildings/${suggestion.buildingId}/rooms/${suggestion.roomId}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to assign resident.';
      showToast(message, 'error');
    }
  }

  function handleSkip() {
    navigate('/residents');
  }

  if (suggestion) {
    return (
      <div className="form-page">
        <div className="form-card suggestion-card">
          <div className="icon-tile icon-tile-md" style={{ background: 'linear-gradient(135deg, #34d399, #059669)', margin: '0 auto 14px' }}>
            <CheckCircleIcon size={24} />
          </div>
          <h2 className="suggestion-title">Resident Added</h2>
          <p className="suggestion-subtitle">Nearest available bed found:</p>
          <p className="suggestion-location">
            <MapPinIcon size={14} className="icon-inline" style={{ marginRight: '6px' }} />
            {suggestion.buildingName} · Floor {suggestion.floorNumber} · Apt {suggestion.apartmentNumber} · Room {suggestion.roomNumber}
          </p>

          <div className="suggestion-actions">
            <button onClick={handleAssignNow} className="btn btn-primary">
              Assign & Go There
            </button>
            <button onClick={handleSkip} className="btn btn-secondary">
              I'll assign later
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="page-title-row" style={{ justifyContent: 'center', marginBottom: '24px' }}>
        <div className="icon-tile icon-tile-md icon-tile-primary">
          <UsersIcon size={22} />
        </div>
        <h1 className="page-title">Add Resident</h1>
      </div>
      <ResidentForm onSubmit={handleSubmit} />
    </div>
  );
}

export default AddResidentPage;
