import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import { useToast } from '../context/ToastContext';
import { UsersIcon, PlusIcon, SearchIcon } from '../components/icons';
import { getInitials, getAvatarGradient } from '../utils/avatar';
import EmptyState from '../components/EmptyState';
import './ResidentsPage.css';

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
    <div className="residents-page">
      <div className="page-header">
        <div className="page-title-row">
          <div className="icon-tile icon-tile-md icon-tile-primary">
            <UsersIcon size={22} />
          </div>
          <div>
            <h1 className="page-title">Residents</h1>
            <p className="page-subtitle">View and manage everyone assigned to housing</p>
          </div>
        </div>
        <Link to="/residents/new" style={{ textDecoration: 'none' }}>
          <button className="btn btn-primary">
            <PlusIcon size={16} />
            Add Resident
          </button>
        </Link>
      </div>

      <div className="residents-search-wrap">
        <SearchIcon size={17} className="residents-search-icon" />
        <input
          type="text"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input residents-search"
        />
      </div>

      {isLoading ? (
        <p className="loading-text" style={{ padding: 0 }}>Loading...</p>
      ) : residents.length === 0 ? (
        <EmptyState large message={searchTerm ? `No residents found matching "${searchTerm}".` : 'No residents yet. Click "Add Resident" to get started.'} />
      ) : (
        <div className="resident-list fade-in-stagger">
          {residents.map((resident) => (
            <div key={resident.id} className="card resident-row">
              <div className="resident-row-left">
                <div className="avatar avatar-md resident-row-avatar" style={{ background: getAvatarGradient(resident.fullName) }}>
                  {getInitials(resident.fullName)}
                </div>
                <div className="resident-row-info">
                  <Link to={`/residents/${resident.id}`} className="resident-row-name">
                    {resident.fullName}
                  </Link>
                  <span className="resident-row-job">{resident.jobTitle}</span>
                </div>
              </div>

              <span className={resident.isAccommodated ? 'badge badge-active' : 'badge badge-muted'}>
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
