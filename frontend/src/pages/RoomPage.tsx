import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../api/client';
import { useToast } from '../context/ToastContext';
import Breadcrumb from '../components/Breadcrumb';

interface Bed {
  id: string;
  bedNumber: number;
  residentId: string | null;
  residentName: string | null;
}
interface RoomDetail {
  id: string;
  roomNumber: number;
  beds: Bed[];
}
interface Resident {
  id: string;
  fullName: string;
}
interface BuildingSummary {
  id: string;
  name: string;
}

function RoomPage() {
  const { buildingId, roomId } = useParams();
  const { showToast } = useToast();

  const [room, setRoom] = useState<RoomDetail | null>(null);
  const [buildingName, setBuildingName] = useState('Building');
  const [availableResidents, setAvailableResidents] = useState<Resident[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [roomId]);

  async function loadData() {
    if (!roomId || !buildingId) return;
    setIsLoading(true);
    try {
      const roomData = await api.get<RoomDetail>(`/rooms/${roomId}`);
      setRoom(roomData);

      const allBuildings = await api.get<BuildingSummary[]>('/buildings');
      const currentBuilding = allBuildings.find((b) => b.id === buildingId);
      if (currentBuilding) setBuildingName(currentBuilding.name);

      const allResidents = await api.get<{ id: string; fullName: string; isAccommodated: boolean }[]>('/residents');
      setAvailableResidents(allResidents.filter((r) => !r.isAccommodated));
    } catch (err) {
      showToast('Failed to load room.', 'error');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleAssign(bedId: string, residentId: string) {
    try {
      await api.post(`/beds/${bedId}/assign`, { residentId });
      loadData();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to assign resident.';
      showToast(message, 'error');
    }
  }

  async function handleUnassign(bedId: string) {
    try {
      await api.post(`/beds/${bedId}/unassign`);
      loadData();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to unassign bed.';
      showToast(message, 'error');
    }
  }

  async function handleAddBed() {
    try {
      await api.post(`/rooms/${roomId}/beds`);
      loadData();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to add bed.';
      showToast(message, 'error');
    }
  }

  async function handleRemoveBed(bedId: string) {
    try {
      await api.delete(`/beds/${bedId}`);
      loadData();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to remove bed.';
      showToast(message, 'error');
    }
  }

  if (isLoading) return <p style={{ padding: '24px', color: '#6B7280', fontSize: '14px' }}>Loading room...</p>;
  if (!room) return <p style={{ padding: '24px', color: '#6B7280', fontSize: '14px' }}>Room not found.</p>;

  return (
    <div>
      <Breadcrumb items={[
        { label: 'Buildings', path: '/' },
        { label: buildingName, path: `/buildings/${buildingId}` },
      ]} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 700, color: '#111827' }}>Room {room.roomNumber}</h1>
        <Link
          to={`/buildings/${buildingId}`}
          style={{
            fontSize: '14px', fontWeight: 600, color: '#4F46E5', textDecoration: 'none',
            border: '1px solid #E0E1FA', backgroundColor: '#F5F5FF', padding: '9px 16px', borderRadius: '10px',
          }}
        >
          ← Back to {buildingName} (pick another room)
        </Link>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={handleAddBed}
          style={{ padding: '10px 18px', fontSize: '14px', fontWeight: 600, color: '#fff', backgroundColor: '#4F46E5', border: 'none', borderRadius: '10px', cursor: 'pointer', boxShadow: '0 4px 10px rgba(79, 70, 229, 0.25)' }}
        >
          + Add Bed to this Room
        </button>
      </div>

      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
        {room.beds.map((bed) => {
          const isOccupied = bed.residentId !== null;
          return (
            <div key={bed.id} style={{
              width: '190px', border: '1px solid', borderColor: isOccupied ? '#C7D2FE' : '#F0F0F2',
              borderRadius: '14px', backgroundColor: isOccupied ? '#EEF2FF' : '#fff', overflow: 'hidden',
              boxShadow: '0 1px 3px rgba(16, 24, 40, 0.04)',
            }}>
              <div style={{ height: '6px', backgroundColor: isOccupied ? '#4F46E5' : '#E5E7EB' }} />
              <div style={{ padding: '16px', textAlign: 'center' }}>
                <p style={{ fontSize: '12px', fontWeight: 600, color: '#9CA3AF', margin: 0, letterSpacing: '0.03em', textTransform: 'uppercase' }}>Bed {bed.bedNumber}</p>
                {isOccupied ? (
                  <>
                    <strong style={{ display: 'block', marginTop: '8px', fontSize: '15px', color: '#111827' }}>{bed.residentName}</strong>
                    <div style={{ marginTop: '12px' }}>
                      <button
                        onClick={() => handleUnassign(bed.id)}
                        style={{ padding: '7px 14px', fontSize: '12px', fontWeight: 600, color: '#4F46E5', backgroundColor: '#fff', border: '1px solid #C7D2FE', borderRadius: '8px', cursor: 'pointer' }}
                      >
                        Unassign
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <span style={{ display: 'block', marginTop: '8px', fontSize: '14px', color: '#9CA3AF', fontWeight: 500 }}>Vacant</span>
                    <div style={{ marginTop: '12px' }}>
                      <select
                        value=""
                        onChange={(e) => { if (e.target.value) handleAssign(bed.id, e.target.value); }}
                        style={{ width: '100%', padding: '7px 8px', fontSize: '13px', color: '#111827', backgroundColor: '#fff', border: '1px solid #E5E7EB', borderRadius: '8px', outline: 'none' }}
                      >
                        <option value="">Select resident</option>
                        {availableResidents.map((r) => (
                          <option key={r.id} value={r.id}>{r.fullName}</option>
                        ))}
                      </select>
                    </div>
                    <div style={{ marginTop: '8px' }}>
                      <button onClick={() => handleRemoveBed(bed.id)} style={{ fontSize: '11px', fontWeight: 600, color: '#DC2626', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}>Remove Bed</button>
                    </div>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default RoomPage;