import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import { useToast } from '../context/ToastContext';
import { useConfirm } from '../context/ConfirmContext';
import Breadcrumb from '../components/Breadcrumb';
import BulkAddForm from '../components/BulkAddForm';
import EmptyState from '../components/EmptyState';
import { BuildingIcon, DoorIcon, BedIcon, TrashIcon } from '../components/icons';
import './BuildingGridPage.css';

interface BedDetail {
  id: string;
  bedNumber: number;
  residentId: string | null;
  residentName: string | null;
}
interface RoomDetail {
  id: string;
  roomNumber: number;
  beds: BedDetail[];
}
interface ApartmentDetail {
  id: string;
  apartmentNumber: number;
  rooms: RoomDetail[];
}
interface FloorDetail {
  id: string;
  floorNumber: number;
  apartments: ApartmentDetail[];
}
interface BuildingDetail {
  id: string;
  name: string;
  floors: FloorDetail[];
}

function getRoomStatus(occupied: number, total: number) {
  if (occupied === 0) return 'empty';
  if (occupied === total) return 'full';
  return 'partial';
}

function ColorLegend() {
  return (
    <div className="card legend">
      <div className="legend-item"><div className="legend-swatch legend-swatch-empty" /><span>Empty</span></div>
      <div className="legend-item"><div className="legend-swatch legend-swatch-partial" /><span>Partially Full</span></div>
      <div className="legend-item"><div className="legend-swatch legend-swatch-full" /><span>Full</span></div>
    </div>
  );
}

function BuildingGridPage() {
  const { buildingId } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const confirm = useConfirm();

  const [building, setBuilding] = useState<BuildingDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [bedsPerRoomByApartment, setBedsPerRoomByApartment] = useState<Record<string, string>>({});

  useEffect(() => {
    loadBuilding();
  }, [buildingId]);

    async function loadBuilding(preserveScroll = false) {
    if (!buildingId) return;

    const scrollPosition = preserveScroll ? window.scrollY : 0;

    if (!preserveScroll) setIsLoading(true);
    try {
      const data = await api.get<BuildingDetail>(`/buildings/${buildingId}`);
      setBuilding(data);
    } catch (err) {
      showToast('Failed to load building.', 'error');
    } finally {
      if (!preserveScroll) setIsLoading(false);
      if (preserveScroll) {
        requestAnimationFrame(() => window.scrollTo(0, scrollPosition));
      }
    }
  }

  function getBedsPerRoom(apartmentId: string) {
    return bedsPerRoomByApartment[apartmentId] ?? '2';
  }
  function setBedsPerRoom(apartmentId: string, value: string) {
    setBedsPerRoomByApartment((prev) => ({ ...prev, [apartmentId]: value }));
  }

  async function handleAddFloors(count: number) {
    try {
      await api.post(`/buildings/${buildingId}/floors`, { count });
      loadBuilding(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to add floors.';
      showToast(message, 'error');
    }
  }

  async function handleAddApartments(floorId: string, count: number) {
    try {
      await api.post(`/floors/${floorId}/apartments`, { count });
      loadBuilding(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to add apartments.';
      showToast(message, 'error');
    }
  }

  async function handleAddRooms(apartmentId: string, count: number, bedsPerRoom: number) {
    try {
      await api.post(`/apartments/${apartmentId}/rooms`, { count, bedsPerRoom });
      loadBuilding(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to add rooms.';
      showToast(message, 'error');
    }
  }

   async function handleDeleteFloor(id: string, floorNumber: number) {
    const confirmed = await confirm({ message: `Delete Floor ${floorNumber} and everything inside it?` });
    if (!confirmed) return;
    try {
      await api.delete(`/floors/${id}`);
      loadBuilding(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete floor.';
      showToast(message, 'error');
    }
  }

   async function handleDeleteApartment(id: string, apartmentNumber: number) {
    const confirmed = await confirm({ message: `Delete Apt ${apartmentNumber} and everything inside it?` });
    if (!confirmed) return;
    try {
      await api.delete(`/apartments/${id}`);
      loadBuilding(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete apartment.';
      showToast(message, 'error');
    }
  }

   async function handleDeleteRoom(id: string, roomNumber: number) {
    const confirmed = await confirm({ message: `Delete Room ${roomNumber}?` });
    if (!confirmed) return;
    try {
      await api.delete(`/rooms/${id}`);
      loadBuilding(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete room.';
      showToast(message, 'error');
    }
  }

  if (isLoading) {
    return <p className="loading-text">Loading building...</p>;
  }

  if (!building) {
    return <p className="loading-text">Building not found.</p>;
  }

  const sortedFloors = [...building.floors].sort((a, b) => a.floorNumber - b.floorNumber);

  return (
    <div>
      <Breadcrumb items={[
        { label: 'Buildings', path: '/' },
        { label: building.name, path: `/buildings/${buildingId}` },
      ]} />
      <div className="page-title-row" style={{ marginBottom: '20px' }}>
        <div className="icon-tile icon-tile-md icon-tile-primary">
          <BuildingIcon size={22} />
        </div>
        <h1 className="page-title">{building.name}</h1>
      </div>

      <ColorLegend />

      <BulkAddForm label="Add Floor(s)" onAdd={handleAddFloors} />

      {sortedFloors.length === 0 ? (
        <EmptyState message="No floors yet. Add one above." />
      ) : (
        sortedFloors.map((floor) => {
          const sortedApartments = [...floor.apartments].sort((a, b) => a.apartmentNumber - b.apartmentNumber);

          const apartmentTotal = floor.apartments.length;
          const roomTotal = floor.apartments.reduce((sum, a) => sum + a.rooms.length, 0);

          return (
            <div key={floor.id} className="card floor-card fade-in">
              <div className="floor-header">
                <div className="floor-header-left">
                  <span className="floor-badge">F{floor.floorNumber}</span>
                  <div>
                    <div className="floor-title">Floor {floor.floorNumber}</div>
                    <div className="floor-stats">{apartmentTotal} apartment{apartmentTotal !== 1 ? 's' : ''} · {roomTotal} room{roomTotal !== 1 ? 's' : ''}</div>
                  </div>
                </div>
                <button onClick={() => handleDeleteFloor(floor.id, floor.floorNumber)} className="btn btn-danger-outline btn-sm">
                  <TrashIcon size={13} />
                  Delete Floor
                </button>
              </div>

              <div className="floor-body">
                <BulkAddForm label="Add Apt(s)" onAdd={(count) => handleAddApartments(floor.id, count)} />
              </div>

              {sortedApartments.length === 0 ? (
                <EmptyState message="No apartments yet on this floor." />
              ) : (
                sortedApartments.map((apartment) => {
                  const sortedRooms = [...apartment.rooms].sort((a, b) => a.roomNumber - b.roomNumber);

                  return (
                    <div key={apartment.id} className="apartment-card fade-in">
                      <div className="apartment-header">
                        <div className="apartment-header-left">
                          <span className="apartment-badge">A{apartment.apartmentNumber}</span>
                          <span className="apartment-title">
                            <DoorIcon size={14} className="icon-inline" style={{ marginRight: '6px' }} />
                            Apartment {apartment.apartmentNumber}
                          </span>
                        </div>
                        <button onClick={() => handleDeleteApartment(apartment.id, apartment.apartmentNumber)} className="btn btn-danger-outline btn-xs">
                          <TrashIcon size={12} />
                          Delete Apt
                        </button>
                      </div>

                      <div className="apartment-body">
                        <BulkAddForm
                          label="Add Room(s)"
                          onAdd={(count) => handleAddRooms(apartment.id, count, Number(getBedsPerRoom(apartment.id)))}
                          extraField={{
                            label: 'Beds per room',
                            value: getBedsPerRoom(apartment.id),
                            onChange: (v) => setBedsPerRoom(apartment.id, v),
                            options: [1, 2, 3, 4, 5, 6],
                          }}
                        />
                      </div>

                      {sortedRooms.length === 0 ? (
                        <EmptyState message="No rooms yet in this apartment." />
                      ) : (
                        <div className="room-grid">
                          {sortedRooms.map((room) => {
                            const totalBeds = room.beds.length;
                            const occupiedBeds = room.beds.filter((b) => b.residentId !== null).length;
                            const status = getRoomStatus(occupiedBeds, totalBeds);

                            const occupantNames = room.beds
                              .filter((b) => b.residentName !== null)
                              .map((b) => b.residentName)
                              .join(', ');
                            const tooltipText = occupantNames ? `Occupants: ${occupantNames}` : 'Empty room';

                            return (
                              <div
                                key={room.id}
                                onClick={() => navigate(`/buildings/${buildingId}/rooms/${room.id}`)}
                                title={tooltipText}
                                className={`room-tile room-tile-${status}`}
                              >
                                <span className="room-tile-number">{room.roomNumber}</span>
                                <span className="room-tile-beds">
                                  {room.beds.map((bed) => (
                                    <BedIcon
                                      key={bed.id}
                                      size={12}
                                      className={bed.residentId !== null ? 'room-tile-bed-icon room-tile-bed-icon-filled' : 'room-tile-bed-icon'}
                                    />
                                  ))}
                                </span>
                                <span className="room-tile-occupancy">{occupiedBeds}/{totalBeds} beds</span>
                                <button
                                  onClick={(e) => { e.stopPropagation(); handleDeleteRoom(room.id, room.roomNumber); }}
                                  className="room-tile-delete"
                                  title="Delete room"
                                >×</button>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          );
        })
      )}
    </div>
  );
}

export default BuildingGridPage;
