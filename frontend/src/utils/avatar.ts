const PALETTE = [
  { from: '#6366f1', to: '#4338ca' },
  { from: '#f59e0b', to: '#b45309' },
  { from: '#10b981', to: '#047857' },
  { from: '#ec4899', to: '#be185d' },
  { from: '#06b6d4', to: '#0e7490' },
  { from: '#8b5cf6', to: '#6d28d9' },
  { from: '#f43f5e', to: '#be123c' },
  { from: '#84cc16', to: '#4d7c0f' },
];

function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function getInitials(fullName: string): string {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function getAvatarGradient(seed: string): string {
  const { from, to } = PALETTE[hashString(seed) % PALETTE.length];
  return `linear-gradient(135deg, ${from}, ${to})`;
}
