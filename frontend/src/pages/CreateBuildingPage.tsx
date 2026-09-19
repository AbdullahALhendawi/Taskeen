import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import { useToast } from '../context/ToastContext';
import { BuildingIcon } from '../components/icons';

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

  return (
    <div className="form-page">
      <div className="form-card">
        <div className="icon-tile icon-tile-md icon-tile-primary" style={{ margin: '0 auto 16px' }}>
          <BuildingIcon size={24} />
        </div>
        <h1 className="form-card-title">Create Building</h1>

        <div className="form-fields">
          <div className="field">
            <label className="field-label">Building name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Building A"
              className="input"
            />
          </div>

          <div className="field">
            <label className="field-label">Number of floors</label>
            <select value={floorCount} onChange={(e) => setFloorCount(e.target.value)} className="input">
              {COUNT_OPTIONS.map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>

          <div className="field">
            <label className="field-label">Apartments per floor</label>
            <select value={apartmentsPerFloor} onChange={(e) => setApartmentsPerFloor(e.target.value)} className="input">
              {COUNT_OPTIONS.map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>

          <div className="field">
            <label className="field-label">Rooms per apartment</label>
            <select value={roomsPerApartment} onChange={(e) => setRoomsPerApartment(e.target.value)} className="input">
              {COUNT_OPTIONS.map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>

          <div className="field">
            <label className="field-label">Beds per room</label>
            <select value={bedsPerRoom} onChange={(e) => setBedsPerRoom(e.target.value)} className="input">
              {BED_OPTIONS.map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>

          <button onClick={handleCreate} className="btn btn-primary btn-lg">
            Create Building
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateBuildingPage;
