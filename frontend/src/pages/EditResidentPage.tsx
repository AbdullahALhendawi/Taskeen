import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../api/client';
import { useToast } from '../context/ToastContext';
import ResidentForm from '../components/ResidentForm';

interface ResidentDetail {
  id: string;
  employeeId: string;
  fullName: string;
  phone: string;
  nationality: string;
  jobTitle: string;
}

function EditResidentPage() {
  const { residentId } = useParams();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [resident, setResident] = useState<ResidentDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadResident();
  }, [residentId]);

  async function loadResident() {
    if (!residentId) return;
    try {
      const data = await api.get<ResidentDetail>(`/residents/${residentId}`);
      setResident(data);
    } catch (err) {
      showToast('Failed to load resident.', 'error');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSubmit(values: Omit<ResidentDetail, 'id'>) {
    if (!residentId) return;
    try {
      await api.put(`/residents/${residentId}`, values);
      navigate('/residents');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update resident.';
      showToast(message, 'error');
    }
  }

  if (isLoading) return <p style={{ padding: '24px', color: '#6B7280', fontSize: '14px' }}>Loading...</p>;
  if (!resident) return <p style={{ padding: '24px', color: '#6B7280', fontSize: '14px' }}>Resident not found.</p>;

  const { id, ...initialValues } = resident;

  return (
    <div>
      <h1 style={{ textAlign: 'center', fontSize: '24px', fontWeight: 700, color: '#111827', marginBottom: '24px' }}>Edit Resident</h1>
      <ResidentForm initialValues={initialValues} onSubmit={handleSubmit} />
    </div>
  );
}

export default EditResidentPage;