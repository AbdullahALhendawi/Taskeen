import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import { useToast } from '../context/ToastContext';
import { useConfirm } from '../context/ConfirmContext';
import { BuildingIcon, PlusIcon, TrashIcon } from '../components/icons';
import EmptyState from '../components/EmptyState';
import './BuildingsPage.css';

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
    return <p className="loading-text">Loading buildings...</p>;
  }

  return (
    <div>
      <div className="page-header">
        <div className="page-title-row">
          <div className="icon-tile icon-tile-md icon-tile-primary">
            <BuildingIcon size={24} />
          </div>
          <div>
            <h1 className="page-title">Buildings</h1>
            <p className="page-subtitle">Manage your properties and track occupancy</p>
          </div>
        </div>
        <Link to="/buildings/new">
          <button className="btn btn-primary">
            <PlusIcon size={16} />
            Add Building
          </button>
        </Link>
      </div>

      {buildings.length === 0 ? (
        <EmptyState large message='No buildings yet. Click "Add Building" to get started.' />
      ) : (
        <div className="building-list fade-in-stagger">
          {buildings.map((building) => {
            const isFull = building.totalBeds > 0 && building.occupiedBeds === building.totalBeds;
            const percent = building.totalBeds > 0 ? Math.round((building.occupiedBeds / building.totalBeds) * 100) : 0;

            return (
              <div key={building.id} className="building-row">
                <Link to={`/buildings/${building.id}`} className="building-card-link">
                  <div className="card building-card">
                    <div className="icon-tile icon-tile-md icon-tile-primary building-card-icon">
                      <BuildingIcon size={22} />
                    </div>
                    <div className="building-card-main">
                      <div className="building-card-top">
                        <h2 className="building-card-name">{building.name}</h2>
                        <span className="building-card-date">Created {formatDate(building.createdAt)}</span>
                      </div>

                      <div className="building-card-occupancy-row">
                        <span className={isFull ? 'building-card-occupancy-label building-card-occupancy-label-full' : 'building-card-occupancy-label'}>
                          {building.occupiedBeds} / {building.totalBeds} beds occupied
                        </span>
                        <div className="progress-track building-card-progress">
                          <div
                            className={isFull ? 'progress-fill progress-fill-full' : 'progress-fill'}
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>

                      <div className="building-card-meta">
                        <span>{building.floorCount} floor{building.floorCount !== 1 ? 's' : ''}</span>
                        <span className="building-card-meta-divider">|</span>
                        <span>{building.apartmentCount} apartment{building.apartmentCount !== 1 ? 's' : ''}</span>
                        <span className="building-card-meta-divider">|</span>
                        <span>{building.roomCount} room{building.roomCount !== 1 ? 's' : ''}</span>
                      </div>
                    </div>
                  </div>
                </Link>
                <button
                  onClick={() => handleDeleteClick(building.id, building.name)}
                  className="btn btn-danger-outline building-delete-btn"
                  title="Delete building"
                >
                  <TrashIcon size={15} />
                  Delete
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default BuildingsPage;
