import { useState } from 'react';
import type { Resident } from '../types';

interface ResidentFormProps {
  initialValues?: Omit<Resident, 'id'>;
  onSubmit: (values: Omit<Resident, 'id'>) => void;
}

const emptyValues: Omit<Resident, 'id'> = {
  employeeId: '',
  fullName: '',
  phone: '',
  nationality: '',
  jobTitle: '',
};

function ResidentForm({ initialValues, onSubmit }: ResidentFormProps) {
  const [values, setValues] = useState(initialValues ?? emptyValues);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function handleChange(field: keyof typeof values, value: string) {
    setValues((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  }

    function validate(): boolean {
    const newErrors: Record<string, string> = {};
    const MAX_LENGTH = 60;

    if (!values.fullName.trim()) {
      newErrors.fullName = 'Full name is required.';
    } else if (/\d/.test(values.fullName)) {
      newErrors.fullName = 'Full name cannot contain numbers.';
    } else if (values.fullName.length > MAX_LENGTH) {
      newErrors.fullName = `Full name must be under ${MAX_LENGTH} characters.`;
    }

    if (!values.employeeId.trim()) {
      newErrors.employeeId = 'Employee ID is required.';
    } else if (values.employeeId.length > 20) {
      newErrors.employeeId = 'Employee ID must be under 20 characters.';
    }

    if (values.phone) {
      if (!/^[0-9+\s-]+$/.test(values.phone)) {
        newErrors.phone = 'Phone can only contain numbers, spaces, + and -.';
      } else if (values.phone.length > 20) {
        newErrors.phone = 'Phone number is too long.';
      }
    }

    if (values.nationality) {
      if (/\d/.test(values.nationality)) {
        newErrors.nationality = 'Nationality cannot contain numbers.';
      } else if (values.nationality.length > MAX_LENGTH) {
        newErrors.nationality = `Nationality must be under ${MAX_LENGTH} characters.`;
      }
    }

    if (values.jobTitle.length > MAX_LENGTH) {
      newErrors.jobTitle = `Job title must be under ${MAX_LENGTH} characters.`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit() {
    if (!validate()) return;
    onSubmit(values);
  }

  const fieldStyle: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: '6px' };
  const labelStyle: React.CSSProperties = { fontSize: '13px', fontWeight: 600, color: '#374151' };
  const inputStyle: React.CSSProperties = {
    padding: '10px 14px', fontSize: '14px', color: '#111827', border: '1px solid #E5E7EB',
    borderRadius: '10px', width: '100%', boxSizing: 'border-box', outline: 'none', backgroundColor: '#fff',
  };
  const errorStyle: React.CSSProperties = { fontSize: '13px', color: '#DC2626', fontWeight: 500 };

    function renderField(field: keyof typeof values, label: string, placeholder: string, maxLen: number = 60) {
    return (
      <div style={fieldStyle}>
        <label style={labelStyle}>{label}</label>
        <input
          type="text"
          placeholder={placeholder}
          value={values[field]}
          maxLength={maxLen}
          onChange={(e) => handleChange(field, e.target.value)}
          style={{ ...inputStyle, borderColor: errors[field] ? '#DC2626' : '#E5E7EB' }}
        />
        {errors[field] && <span style={errorStyle}>{errors[field]}</span>}
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '12px' }}>
      <div style={{ width: '100%', maxWidth: '440px', backgroundColor: '#fff', border: '1px solid #F0F0F2', borderRadius: '14px', padding: '36px', boxShadow: '0 1px 3px rgba(16, 24, 40, 0.04)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {renderField('employeeId', 'Employee ID', 'e.g. EMP004', 20)}
          {renderField('fullName', 'Full Name', 'e.g. Sara Ahmed', 60)}
          {renderField('phone', 'Phone', 'e.g. 0501234567', 20)}
          {renderField('nationality', 'Nationality', 'e.g. Egyptian', 60)}
          {renderField('jobTitle', 'Job Title', 'e.g. Technician', 60)}

          <button
            onClick={handleSubmit}
            style={{ marginTop: '8px', padding: '12px', fontSize: '15px', fontWeight: 600, color: '#fff', backgroundColor: '#4F46E5', border: 'none', borderRadius: '10px', cursor: 'pointer', boxShadow: '0 4px 10px rgba(79, 70, 229, 0.25)' }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default ResidentForm;