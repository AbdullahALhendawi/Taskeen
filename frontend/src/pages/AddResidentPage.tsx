import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import { useToast } from '../context/ToastContext';
import ResidentForm from '../components/ResidentForm';

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
      <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '12px' }}>
        <div style={{ width: '100%', maxWidth: '440px', backgroundColor: '#fff', border: '1px solid #F0F0F2', borderRadius: '14px', padding: '36px', boxShadow: '0 1px 3px rgba(16, 24, 40, 0.04)', textAlign: 'center' }}>
          <h2 style={{ marginTop: 0, fontSize: '19px', fontWeight: 700, color: '#111827' }}>✅ Resident Added</h2>
          <p style={{ color: '#6B7280', fontSize: '14px' }}>Nearest available bed found:</p>
          <p style={{ fontWeight: 600, fontSize: '14px', color: '#4338CA', backgroundColor: '#EEF2FF', padding: '14px', borderRadius: '10px' }}>
            {suggestion.buildingName} · Floor {suggestion.floorNumber} · Apt {suggestion.apartmentNumber} · Room {suggestion.roomNumber}
          </p>

          <div style={{ display: 'flex', gap: '10px', marginTop: '24px' }}>
            <button
              onClick={handleAssignNow}
              style={{ flex: 1, padding: '12px', fontSize: '14px', fontWeight: 600, color: '#fff', backgroundColor: '#4F46E5', border: 'none', borderRadius: '10px', cursor: 'pointer', boxShadow: '0 4px 10px rgba(79, 70, 229, 0.25)' }}
            >
              Assign & Go There
            </button>
            <button
              onClick={handleSkip}
              style={{ flex: 1, padding: '12px', fontSize: '14px', fontWeight: 600, color: '#374151', backgroundColor: '#F3F4F6', border: 'none', borderRadius: '10px', cursor: 'pointer' }}
            >
              I'll assign later
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 style={{ textAlign: 'center', fontSize: '24px', fontWeight: 700, color: '#111827', marginBottom: '24px' }}>Add Resident</h1>
      <ResidentForm onSubmit={handleSubmit} />
    </div>
  );
}

export default AddResidentPage;