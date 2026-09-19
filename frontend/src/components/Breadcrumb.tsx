import { Link } from 'react-router-dom';

interface BreadcrumbItem {
  label: string;
  path: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginBottom: '22px',
        padding: 0,
        fontSize: '13px',
        width: 'fit-content',
      }}
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <span key={item.path} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {isLast ? (
              <span style={{ fontWeight: 600, color: '#111827' }}>{item.label}</span>
            ) : (
              <Link to={item.path} style={{ color: '#6B7280', textDecoration: 'none', fontWeight: 500 }}>
                {item.label}
              </Link>
            )}
            {!isLast && <span style={{ color: '#D1D5DB' }}>›</span>}
          </span>
        );
      })}
    </nav>
  );
}

export default Breadcrumb;