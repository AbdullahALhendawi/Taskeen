import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../api/client';
import { useToast } from '../context/ToastContext';
import Breadcrumb from '../components/Breadcrumb';
import { BedIcon, PlusIcon, ArrowLeftIcon } from '../components/icons';
import { getInitials, getAvatarGradient } from '../utils/avatar';
import './RoomPage.css';

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

  if (isLoading) return <p className="loading-text">Loading room...</p>;
  if (!room) return <p className="loading-text">Room not found.</p>;

  return (
    <div>
      <Breadcrumb items={[
        { label: 'Buildings', path: '/' },
        { label: buildingName, path: `/buildings/${buildingId}` },
      ]} />

      <div className="room-page-header">
        <div className="page-title-row">
          <div className="icon-tile icon-tile-md icon-tile-primary">
            <BedIcon size={22} />
          </div>
          <h1 className="page-title">Room {room.roomNumber}</h1>
        </div>
        <Link to={`/buildings/${buildingId}`} className="btn-link">
          <ArrowLeftIcon size={15} />
          Back to {buildingName} (pick another room)
        </Link>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <button onClick={handleAddBed} className="btn btn-primary">
          <PlusIcon size={16} />
          Add Bed to this Room
        </button>
      </div>

      <div className="bed-grid fade-in-stagger">
        {room.beds.map((bed) => {
          const isOccupied = bed.residentId !== null;
          return (
            <div key={bed.id} className={isOccupied ? 'bed-card bed-card-occupied' : 'bed-card'}>
              <div className="bed-card-stripe" />
              <div className="bed-card-body">
                {isOccupied ? (
                  <div className="avatar avatar-sm bed-card-icon" style={{ background: getAvatarGradient(bed.residentName ?? '') }}>
                    {getInitials(bed.residentName ?? '?')}
                  </div>
                ) : (
                  <div className="bed-card-icon">
                    <BedIcon size={16} />
                  </div>
                )}
                <p className="bed-card-label">Bed {bed.bedNumber}</p>
                {isOccupied ? (
                  <>
                    <strong className="bed-card-resident">{bed.residentName}</strong>
                    <div className="bed-card-action">
                      <button onClick={() => handleUnassign(bed.id)} className="btn btn-outline btn-xs">
                        Unassign
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <span className="bed-card-vacant">Vacant</span>
                    <div className="bed-card-action">
                      <select
                        value=""
                        onChange={(e) => { if (e.target.value) handleAssign(bed.id, e.target.value); }}
                        className="input input-sm"
                      >
                        <option value="">Select resident</option>
                        {availableResidents.map((r) => (
                          <option key={r.id} value={r.id}>{r.fullName}</option>
                        ))}
                      </select>
                    </div>
                    <div className="bed-card-remove">
                      <button onClick={() => handleRemoveBed(bed.id)} className="btn-ghost">Remove Bed</button>
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
