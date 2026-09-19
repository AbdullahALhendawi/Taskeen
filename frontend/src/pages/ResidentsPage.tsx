import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import { useToast } from '../context/ToastContext';

interface Resident {
  id: string;
  fullName: string;
  jobTitle: string;
  isAccommodated: boolean;
}

function ResidentsPage() {
  const { showToast } = useToast();
  const [residents, setResidents] = useState<Resident[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadResidents();
  }, [searchTerm]);

  async function loadResidents() {
    setIsLoading(true);
    try {
      const query = searchTerm ? `?search=${encodeURIComponent(searchTerm)}` : '';
      const data = await api.get<Resident[]>(`/residents${query}`);
      setResidents(data);
    } catch (err) {
      showToast('Failed to load residents.', 'error');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 700, color: '#111827' }}>Residents</h1>
          <p style={{ fontSize: '14px', color: '#6B7280', margin: '4px 0 0' }}>View and manage everyone assigned to housing</p>
        </div>
        <Link to="/residents/new" style={{ textDecoration: 'none' }}>
          <button style={{ padding: '10px 20px', fontSize: '14px', fontWeight: 600, color: '#fff', backgroundColor: '#4F46E5', border: 'none', borderRadius: '10px', cursor: 'pointer', boxShadow: '0 4px 10px rgba(79, 70, 229, 0.25)' }}>
            + Add Resident
          </button>
        </Link>
      </div>

      <input
        type="text"
        placeholder="Search by name..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ width: '100%', padding: '11px 16px', fontSize: '14px', color: '#111827', border: '1px solid #E5E7EB', borderRadius: '10px', marginBottom: '20px', boxSizing: 'border-box', outline: 'none', backgroundColor: '#fff' }}
      />

      {isLoading ? (
        <p style={{ color: '#6B7280', fontSize: '14px' }}>Loading...</p>
      ) : residents.length === 0 ? (
        <div style={{ backgroundColor: '#fff', border: '1px solid #F0F0F2', borderRadius: '14px', padding: '40px', textAlign: 'center', color: '#6B7280', fontSize: '14px' }}>
          {searchTerm ? `No residents found matching "${searchTerm}".` : 'No residents yet. Click "Add Resident" to get started.'}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {residents.map((resident) => (
            <div
              key={resident.id}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px solid #F0F0F2', borderRadius: '14px', padding: '16px 20px', backgroundColor: '#fff', boxShadow: '0 1px 3px rgba(16, 24, 40, 0.04)' }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <Link to={`/residents/${resident.id}`} style={{ fontWeight: 700, fontSize: '15px', color: '#111827', textDecoration: 'none' }}>
                  {resident.fullName}
                </Link>
                <span style={{ fontSize: '13px', color: '#6B7280' }}>{resident.jobTitle}</span>
              </div>

              <span style={{
                fontSize: '12px', fontWeight: 600, padding: '5px 12px', borderRadius: '20px',
                backgroundColor: resident.isAccommodated ? '#EEF2FF' : '#F3F4F6',
                color: resident.isAccommodated ? '#4F46E5' : '#6B7280',
              }}>
                {resident.isAccommodated ? 'Accommodated' : 'Not Accommodated'}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ResidentsPage;