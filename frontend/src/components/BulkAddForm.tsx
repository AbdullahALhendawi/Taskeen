import { useState } from 'react';

interface BulkAddFormProps {
  label: string;
  onAdd: (count: number) => void;
  extraField?: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    options?: number[];
  };
}

const PRESET_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const MAX_CUSTOM_VALUE = 50;

function BulkAddForm({ label, onAdd, extraField }: BulkAddFormProps) {
  const [selected, setSelected] = useState('1');
  const [customValue, setCustomValue] = useState('');
  const [error, setError] = useState('');

  const isCustom = selected === 'custom';

  function handleClick() {
    const num = isCustom ? Number(customValue) : Number(selected);

    if (!num || num <= 0) return;

    if (num > MAX_CUSTOM_VALUE) {
      setError(`Maximum ${MAX_CUSTOM_VALUE} at a time. Add in multiple batches for larger numbers.`);
      return;
    }

    setError('');
    onAdd(num);
    setSelected('1');
    setCustomValue('');
  }

  const fieldStyle: React.CSSProperties = {
    padding: '8px 12px',
    fontSize: '14px',
    color: '#111827',
    backgroundColor: '#fff',
    border: '1px solid #E5E7EB',
    borderRadius: '10px',
    outline: 'none',
  };

  return (
    <div style={{ marginBottom: '24px' }}>
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        <select value={selected} onChange={(e) => { setSelected(e.target.value); setError(''); }} style={fieldStyle}>
          {PRESET_OPTIONS.map((n) => (
            <option key={n} value={n}>{n}</option>
          ))}
          <option value="custom">Custom...</option>
        </select>

        {isCustom && (
          <input
            type="number"
            min="1"
            max={MAX_CUSTOM_VALUE}
            placeholder="Enter number"
            value={customValue}
            onChange={(e) => { setCustomValue(e.target.value); setError(''); }}
            style={{ ...fieldStyle, width: '90px' }}
          />
        )}

        {extraField && (
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#374151' }}>
            {extraField.label}:
            {extraField.options ? (
              <select value={extraField.value} onChange={(e) => extraField.onChange(e.target.value)} style={fieldStyle}>
                {extraField.options.map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            ) : (
              <input type="number" min="1" value={extraField.value} onChange={(e) => extraField.onChange(e.target.value)} style={{ ...fieldStyle, width: '60px' }} />
            )}
          </label>
        )}

        <button
          onClick={handleClick}
          disabled={isCustom && !customValue}
          style={{
            padding: '9px 20px',
            fontSize: '14px',
            fontWeight: 600,
            color: '#fff',
            backgroundColor: isCustom && !customValue ? '#A5A6F6' : '#4F46E5',
            border: 'none',
            borderRadius: '10px',
            cursor: isCustom && !customValue ? 'not-allowed' : 'pointer',
          }}
        >
          {label}
        </button>
      </div>

      {error && (
        <p style={{ color: '#DC2626', fontSize: '13px', marginTop: '8px', marginBottom: 0 }}>{error}</p>
      )}
    </div>
  );
}

export default BulkAddForm;