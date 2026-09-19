import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import { useToast } from '../context/ToastContext';
import { useConfirm } from '../context/ConfirmContext';

interface BuildingSummary {
  id: string;
  name: string;
  createdAt: string;
  floorCount: number;
  apartmentCount: number;
  roomCount: number;
  totalBeds: number;
  occupiedBeds: number;
}

function formatDate(isoString: string) {
  const date = new Date(isoString);
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

function BuildingsPage() {
  const { showToast } = useToast();
  const confirm = useConfirm();
  const [buildings, setBuildings] = useState<BuildingSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadBuildings();
  }, []);

  async function loadBuildings() {
    setIsLoading(true);
    try {
      const data = await api.get<BuildingSummary[]>('/buildings');
      setBuildings(data);
    } catch (err) {
      showToast('Failed to load buildings.', 'error');
    } finally {
      setIsLoading(false);
    }
  }

   async function handleDeleteClick(id: string, name: string) {
    const confirmed = await confirm({ message: `Are you sure you want to delete "${name}"?` });
    if (!confirmed) return;

    try {
      await api.delete(`/buildings/${id}`);
      showToast('Building deleted.', 'success');
      loadBuildings();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete building.';
      showToast(message, 'error');
    }
  }

  if (isLoading) {
    return <p style={{ padding: '24px', color: '#6B7280', fontSize: '14px' }}>Loading buildings...</p>;
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#111827', margin: 0 }}>Buildings</h1>
          <p style={{ fontSize: '14px', color: '#6B7280', margin: '4px 0 0' }}>Manage your properties and track occupancy</p>
        </div>
        <Link to="/buildings/new">
          <button style={{ padding: '10px 20px', fontSize: '14px', fontWeight: 600, color: '#fff', backgroundColor: '#4F46E5', border: 'none', borderRadius: '10px', cursor: 'pointer', boxShadow: '0 4px 10px rgba(79, 70, 229, 0.25)' }}>
            + Add Building
          </button>
        </Link>
      </div>

      {buildings.length === 0 ? (
        <div style={{ backgroundColor: '#fff', border: '1px solid #F0F0F2', borderRadius: '14px', padding: '40px', textAlign: 'center', color: '#6B7280', fontSize: '14px' }}>
          No buildings yet. Click "Add Building" to get started.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {buildings.map((building) => (
            <div key={building.id} style={{ display: 'flex', alignItems: 'stretch', gap: '10px' }}>
              <Link to={`/buildings/${building.id}`} style={{ textDecoration: 'none', color: 'inherit', flex: 1 }}>
                <div style={{ backgroundColor: '#fff', border: '1px solid #F0F0F2', borderRadius: '14px', padding: '22px 24px', cursor: 'pointer', boxShadow: '0 1px 3px rgba(16, 24, 40, 0.04)', transition: 'box-shadow 0.15s ease' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <h2 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#111827' }}>{building.name}</h2>
                    <span style={{ fontSize: '12px', color: '#9CA3AF' }}>Created {formatDate(building.createdAt)}</span>
                  </div>
                  <p style={{ margin: '10px 0', color: '#4F46E5', fontWeight: 700, fontSize: '14px' }}>
                    {building.occupiedBeds} / {building.totalBeds} beds occupied
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: '#6B7280' }}>
                    <span>{building.floorCount} floor{building.floorCount !== 1 ? 's' : ''}</span>
                    <span style={{ color: '#E5E7EB' }}>|</span>
                    <span>{building.apartmentCount} apartment{building.apartmentCount !== 1 ? 's' : ''}</span>
                    <span style={{ color: '#E5E7EB' }}>|</span>
                    <span>{building.roomCount} room{building.roomCount !== 1 ? 's' : ''}</span>
                  </div>
                </div>
              </Link>
              <button
                onClick={() => handleDeleteClick(building.id, building.name)}
                style={{ padding: '0 18px', fontSize: '13px', fontWeight: 600, color: '#DC2626', backgroundColor: '#fff', border: '1px solid #F0F0F2', borderRadius: '14px', cursor: 'pointer' }}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default BuildingsPage;