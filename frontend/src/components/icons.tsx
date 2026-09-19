import type { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  size?: number;
}

function base(size: number | undefined, props: SVGProps<SVGSVGElement>) {
  return {
    width: size ?? 20,
    height: size ?? 20,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    ...props,
  };
}

export function BuildingIcon({ size, ...props }: IconProps) {
  return (
    <svg {...base(size, props)}>
      <rect x="4" y="3" width="12" height="18" rx="1.5" />
      <path d="M16 21h4V9l-4-2" />
      <path d="M7.5 7h1M11.5 7h1M7.5 10.5h1M11.5 10.5h1M7.5 14h1M11.5 14h1M7.5 17.5h1M11.5 17.5h1" />
    </svg>
  );
}

export function UsersIcon({ size, ...props }: IconProps) {
  return (
    <svg {...base(size, props)}>
      <circle cx="9" cy="8" r="3.25" />
      <path d="M2.5 20c0-3.5 2.9-6 6.5-6s6.5 2.5 6.5 6" />
      <path d="M16 4.3c1.5.4 2.5 1.7 2.5 3.2s-1 2.8-2.5 3.2" />
      <path d="M21.5 20c0-2.9-1.9-5.1-4.5-5.8" />
    </svg>
  );
}

export function LayersIcon({ size, ...props }: IconProps) {
  return (
    <svg {...base(size, props)}>
      <path d="M12 3.5 3.5 8 12 12.5 20.5 8 12 3.5Z" />
      <path d="m3.5 12 8.5 4.5L20.5 12" />
      <path d="m3.5 16 8.5 4.5L20.5 16" />
    </svg>
  );
}

export function DoorIcon({ size, ...props }: IconProps) {
  return (
    <svg {...base(size, props)}>
      <rect x="6" y="2.5" width="12" height="19" rx="1" />
      <circle cx="14.5" cy="12" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function BedIcon({ size, ...props }: IconProps) {
  return (
    <svg {...base(size, props)}>
      <path d="M2.5 19v-8a2 2 0 0 1 2-2H12a2 2 0 0 1 2 2v2" />
      <path d="M2.5 19v-3.5h19V19" />
      <path d="M21.5 15.5V11a2 2 0 0 0-2-2h-5.6" />
      <circle cx="6" cy="11.2" r="1.4" />
    </svg>
  );
}

export function PlusIcon({ size, ...props }: IconProps) {
  return (
    <svg {...base(size, props)}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function TrashIcon({ size, ...props }: IconProps) {
  return (
    <svg {...base(size, props)}>
      <path d="M4 7h16" />
      <path d="M9.5 7V4.8c0-.4.4-.8.9-.8h3.2c.5 0 .9.4.9.8V7" />
      <path d="M6 7l.8 12.2c0 .7.6 1.3 1.4 1.3h7.6c.8 0 1.4-.6 1.4-1.3L18 7" />
      <path d="M10 11v6M14 11v6" />
    </svg>
  );
}

export function SearchIcon({ size, ...props }: IconProps) {
  return (
    <svg {...base(size, props)}>
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="m20 20-4.3-4.3" />
    </svg>
  );
}

export function ArrowLeftIcon({ size, ...props }: IconProps) {
  return (
    <svg {...base(size, props)}>
      <path d="M19 12H5" />
      <path d="m11 6-6 6 6 6" />
    </svg>
  );
}

export function IdCardIcon({ size, ...props }: IconProps) {
  return (
    <svg {...base(size, props)}>
      <rect x="2.5" y="4.5" width="19" height="15" rx="2" />
      <circle cx="8.3" cy="11" r="2" />
      <path d="M5 16c.4-1.6 1.7-2.5 3.3-2.5s2.9.9 3.3 2.5" />
      <path d="M14.5 9.5h4M14.5 12.5h4M14.5 15.5h2.5" />
    </svg>
  );
}

export function PhoneIcon({ size, ...props }: IconProps) {
  return (
    <svg {...base(size, props)}>
      <path d="M5.3 3.5h3l1.4 4.4-2.1 1.6a11.5 11.5 0 0 0 5.4 5.4l1.6-2.1 4.4 1.4v3c0 .9-.8 1.6-1.7 1.5-6.7-.6-12-5.9-12.6-12.6-.1-.9.6-1.7 1.5-1.7Z" />
    </svg>
  );
}

export function GlobeIcon({ size, ...props }: IconProps) {
  return (
    <svg {...base(size, props)}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M3.5 12h17" />
      <path d="M12 3.5c2.2 2.3 3.4 5.2 3.4 8.5s-1.2 6.2-3.4 8.5c-2.2-2.3-3.4-5.2-3.4-8.5S9.8 5.8 12 3.5Z" />
    </svg>
  );
}

export function BriefcaseIcon({ size, ...props }: IconProps) {
  return (
    <svg {...base(size, props)}>
      <rect x="2.5" y="7.5" width="19" height="12" rx="1.8" />
      <path d="M8.5 7.5V5.8c0-.7.6-1.3 1.3-1.3h4.4c.7 0 1.3.6 1.3 1.3V7.5" />
      <path d="M2.5 13h19" />
      <path d="M10.5 13v1.2h3V13" />
    </svg>
  );
}

export function MapPinIcon({ size, ...props }: IconProps) {
  return (
    <svg {...base(size, props)}>
      <path d="M12 21.5s7-6.3 7-12A7 7 0 0 0 5 9.5c0 5.7 7 12 7 12Z" />
      <circle cx="12" cy="9.5" r="2.4" />
    </svg>
  );
}

export function CheckCircleIcon({ size, ...props }: IconProps) {
  return (
    <svg {...base(size, props)}>
      <circle cx="12" cy="12" r="9" />
      <path d="m8 12.3 2.7 2.7 5.3-6" />
    </svg>
  );
}

export function InboxIcon({ size, ...props }: IconProps) {
  return (
    <svg {...base(size, props)}>
      <path d="M3.5 13 6 5.3c.3-.8 1-1.3 1.9-1.3h8.2c.9 0 1.6.5 1.9 1.3L20.5 13" />
      <path d="M3.5 13v5c0 1.1.9 2 2 2h13c1.1 0 2-.9 2-2v-5h-5.3c-.3 1.4-1.5 2.4-3.2 2.4s-2.9-1-3.2-2.4H3.5Z" />
    </svg>
  );
}

export function BadgeCheckIcon({ size, ...props }: IconProps) {
  return (
    <svg {...base(size, props)}>
      <path d="M12 2.7 14 4.5l2.7-.3 1 2.6 2.5 1.2-.5 2.7 1.5 2.3-1.5 2.3.5 2.7-2.5 1.2-1 2.6-2.7-.3L12 23.3l-2-1.8-2.7.3-1-2.6-2.5-1.2.5-2.7L2.8 12l1.5-2.3-.5-2.7 2.5-1.2 1-2.6 2.7.3L12 2.7Z" />
      <path d="m8.2 12.3 2.6 2.6 5-5.6" />
    </svg>
  );
}

export function HashIcon({ size, ...props }: IconProps) {
  return (
    <svg {...base(size, props)}>
      <path d="M9 3.5 6.5 20.5M17.5 3.5 15 20.5M4 9h17M3 15.5h17" />
    </svg>
  );
}
