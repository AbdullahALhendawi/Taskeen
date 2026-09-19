import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import { useToast } from '../context/ToastContext';

const COUNT_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const BED_OPTIONS = [1, 2, 3, 4, 5, 6];

function CreateBuildingPage() {
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [floorCount, setFloorCount] = useState('1');
  const [apartmentsPerFloor, setApartmentsPerFloor] = useState('1');
  const [roomsPerApartment, setRoomsPerApartment] = useState('1');
  const [bedsPerRoom, setBedsPerRoom] = useState('2');

  async function handleCreate() {
    if (!name.trim()) {
      showToast('Building name is required.', 'error');
      return;
    }

    try {
      const newId = await api.post<string>('/buildings', {
        name: name.trim(),
        floorCount: Number(floorCount),
        apartmentsPerFloor: Number(apartmentsPerFloor),
        roomsPerApartment: Number(roomsPerApartment),
        bedsPerRoom: Number(bedsPerRoom),
      });
      navigate(`/buildings/${newId}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create building.';
      showToast(message, 'error');
    }
  }

  const fieldStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  };

  const labelStyle: React.CSSProperties = {
    fontSize: '13px',
    fontWeight: 600,
    color: '#374151',
  };

  const inputStyle: React.CSSProperties = {
    padding: '10px 14px',
    fontSize: '14px',
    color: '#111827',
    border: '1px solid #E5E7EB',
    borderRadius: '10px',
    width: '100%',
    boxSizing: 'border-box',
    outline: 'none',
    backgroundColor: '#fff',
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '12px' }}>
      <div
        style={{
          width: '100%',
          maxWidth: '440px',
          backgroundColor: '#fff',
          border: '1px solid #F0F0F2',
          borderRadius: '14px',
          padding: '36px',
          boxShadow: '0 1px 3px rgba(16, 24, 40, 0.04)',
        }}
      >
        <h1 style={{ marginTop: 0, marginBottom: '28px', fontSize: '22px', fontWeight: 700, color: '#111827', textAlign: 'center' }}>Create Building</h1>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div style={fieldStyle}>
            <label style={labelStyle}>Building name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Building A"
              style={inputStyle}
            />
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Number of floors</label>
            <select value={floorCount} onChange={(e) => setFloorCount(e.target.value)} style={inputStyle}>
              {COUNT_OPTIONS.map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Apartments per floor</label>
            <select value={apartmentsPerFloor} onChange={(e) => setApartmentsPerFloor(e.target.value)} style={inputStyle}>
              {COUNT_OPTIONS.map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Rooms per apartment</label>
            <select value={roomsPerApartment} onChange={(e) => setRoomsPerApartment(e.target.value)} style={inputStyle}>
              {COUNT_OPTIONS.map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Beds per room</label>
            <select value={bedsPerRoom} onChange={(e) => setBedsPerRoom(e.target.value)} style={inputStyle}>
              {BED_OPTIONS.map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>

          <button
            onClick={handleCreate}
            style={{
              marginTop: '8px',
              padding: '12px',
              fontSize: '15px',
              fontWeight: 600,
              color: '#fff',
              backgroundColor: '#4F46E5',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              boxShadow: '0 4px 10px rgba(79, 70, 229, 0.25)',
            }}
          >
            Create Building
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateBuildingPage;