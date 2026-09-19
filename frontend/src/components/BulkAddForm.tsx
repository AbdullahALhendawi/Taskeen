import { useState } from 'react';
import { PlusIcon } from './icons';
import './BulkAddForm.css';

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

  return (
    <div className="bulk-add">
      <div className="bulk-add-row">
        <select
          className="input bulk-add-select"
          value={selected}
          onChange={(e) => { setSelected(e.target.value); setError(''); }}
        >
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
            className="input bulk-add-custom"
          />
        )}

        {extraField && (
          <label className="bulk-add-extra">
            {extraField.label}:
            {extraField.options ? (
              <select className="input" value={extraField.value} onChange={(e) => extraField.onChange(e.target.value)}>
                {extraField.options.map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            ) : (
              <input
                type="number"
                min="1"
                value={extraField.value}
                onChange={(e) => extraField.onChange(e.target.value)}
                className="input bulk-add-extra-number"
              />
            )}
          </label>
        )}

        <button onClick={handleClick} disabled={isCustom && !customValue} className="btn btn-primary">
          <PlusIcon size={14} />
          {label}
        </button>
      </div>

      {error && <p className="bulk-add-error">{error}</p>}
    </div>
  );
}

export default BulkAddForm;
