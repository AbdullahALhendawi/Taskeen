import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import { useToast } from '../context/ToastContext';
import { useConfirm } from '../context/ConfirmContext';
import Breadcrumb from '../components/Breadcrumb';
import BulkAddForm from '../components/BulkAddForm';
import EmptyState from '../components/EmptyState';

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

function getRoomColor(occupied: number, total: number) {
  if (occupied === 0) return { bg: '#F9FAFB', border: '#D1D5DB', text: '#6B7280' };
  if (occupied === total) return { bg: '#EEF2FF', border: '#4F46E5', text: '#4338CA' };
  return { bg: '#FFFBEB', border: '#F59E0B', text: '#B45309' };
}

function ColorLegend() {
  const legendItemStyle: React.CSSProperties = {
    display: 'flex', alignItems: 'center', gap: '7px', fontSize: '13px', color: '#4B5563', fontWeight: 500,
  };
  const swatchStyle = (bg: string, border: string): React.CSSProperties => ({
    width: '12px', height: '12px', borderRadius: '4px', backgroundColor: bg, border: `2px solid ${border}`,
  });

  return (
    <div style={{ display: 'flex', gap: '20px', marginBottom: '24px', padding: '12px 18px', backgroundColor: '#fff', border: '1px solid #F0F0F2', borderRadius: '12px', boxShadow: '0 1px 3px rgba(16, 24, 40, 0.04)', width: 'fit-content' }}>
      <div style={legendItemStyle}><div style={swatchStyle('#F9FAFB', '#D1D5DB')} /><span>Empty</span></div>
      <div style={legendItemStyle}><div style={swatchStyle('#FFFBEB', '#F59E0B')} /><span>Partially Full</span></div>
      <div style={legendItemStyle}><div style={swatchStyle('#EEF2FF', '#4F46E5')} /><span>Full</span></div>
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
    return <p style={{ padding: '24px', color: '#6B7280', fontSize: '14px' }}>Loading building...</p>;
  }

  if (!building) {
    return <p style={{ padding: '24px', color: '#6B7280', fontSize: '14px' }}>Building not found.</p>;
  }

  const sortedFloors = [...building.floors].sort((a, b) => a.floorNumber - b.floorNumber);

  const dangerButtonStyle: React.CSSProperties = {
    padding: '6px 14px', fontSize: '12px', fontWeight: 600, color: '#DC2626',
    backgroundColor: '#fff', border: '1px solid #FCA5A5', borderRadius: '8px', cursor: 'pointer',
  };

  return (
    <div>
      <Breadcrumb items={[
        { label: 'Buildings', path: '/' },
        { label: building.name, path: `/buildings/${buildingId}` },
      ]} />
      <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#111827', marginBottom: '20px' }}>{building.name}</h1>

      <ColorLegend />

      <BulkAddForm label="Add Floor(s)" onAdd={handleAddFloors} />

      {sortedFloors.length === 0 ? (
        <EmptyState message="No floors yet. Add one above." />
      ) : (
        sortedFloors.map((floor) => {
          const sortedApartments = [...floor.apartments].sort((a, b) => a.apartmentNumber - b.apartmentNumber);

          return (
            <div key={floor.id} style={{ backgroundColor: '#fff', border: '1px solid #F0F0F2', borderRadius: '14px', padding: '20px', marginBottom: '18px', boxShadow: '0 1px 3px rgba(16, 24, 40, 0.04)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  width: '46px', height: '46px', backgroundColor: '#312E81', color: '#fff',
                  fontWeight: 700, fontSize: '16px', borderRadius: '14px', letterSpacing: '-0.02em',
                  boxShadow: '0 4px 10px rgba(49, 46, 129, 0.3)',
                }}>
                  F{floor.floorNumber}
                </span>
                <button onClick={() => handleDeleteFloor(floor.id, floor.floorNumber)} style={dangerButtonStyle}>Delete Floor</button>
              </div>

              <div style={{ marginTop: '14px' }}>
                <BulkAddForm label="Add Apt(s)" onAdd={(count) => handleAddApartments(floor.id, count)} />
              </div>

              {sortedApartments.length === 0 ? (
                <EmptyState message="No apartments yet on this floor." />
              ) : (
                sortedApartments.map((apartment) => {
                  const sortedRooms = [...apartment.rooms].sort((a, b) => a.roomNumber - b.roomNumber);

                  return (
                    <div key={apartment.id} style={{ backgroundColor: '#FAFAFA', border: '1px solid #F0F0F2', borderRadius: '12px', padding: '16px', marginTop: '12px', marginLeft: '16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{
                          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                          width: '40px', height: '40px', backgroundColor: '#EEF2FF', color: '#4338CA',
                          border: '1px solid #C7D2FE', fontWeight: 700, fontSize: '14px', borderRadius: '12px', letterSpacing: '-0.02em',
                        }}>
                          A{apartment.apartmentNumber}
                        </span>
                        <button onClick={() => handleDeleteApartment(apartment.id, apartment.apartmentNumber)} style={{ ...dangerButtonStyle, fontSize: '11px', padding: '5px 12px' }}>Delete Apt</button>
                      </div>

                      <div style={{ marginTop: '12px' }}>
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
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '10px' }}>
                          {sortedRooms.map((room) => {
                            const totalBeds = room.beds.length;
                            const occupiedBeds = room.beds.filter((b) => b.residentId !== null).length;
                            const color = getRoomColor(occupiedBeds, totalBeds);

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
                                style={{
                                  width: '66px', height: '66px',
                                  border: `2px solid ${color.border}`, backgroundColor: color.bg,
                                  borderRadius: '12px', display: 'flex', flexDirection: 'column',
                                  alignItems: 'center', justifyContent: 'center',
                                  cursor: 'pointer', position: 'relative',
                                  boxShadow: '0 1px 2px rgba(16, 24, 40, 0.05)',
                                  transition: 'transform 0.1s ease, box-shadow 0.1s ease',
                                }}
                              >
                                <span style={{ fontWeight: 700, fontSize: '15px', color: color.text }}>{room.roomNumber}</span>
                                <span style={{ fontSize: '11px', fontWeight: 500, color: color.text, opacity: 0.85 }}>{occupiedBeds}/{totalBeds}</span>
                                <button
                                  onClick={(e) => { e.stopPropagation(); handleDeleteRoom(room.id, room.roomNumber); }}
                                  style={{
                                    position: 'absolute', top: '-7px', right: '-7px', fontSize: '11px', width: '18px', height: '18px',
                                    lineHeight: '1', padding: 0, borderRadius: '50%', border: '1px solid #F0F0F2',
                                    backgroundColor: '#fff', color: '#9CA3AF', boxShadow: '0 1px 2px rgba(16, 24, 40, 0.08)', cursor: 'pointer',
                                  }}
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