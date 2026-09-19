import { Link, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';

interface AppLayoutProps {
  children: ReactNode;
}

function AppLayout({ children }: AppLayoutProps) {
  const location = useLocation();

  const isBuildingsSection = location.pathname === '/' || location.pathname.startsWith('/buildings');
  const isResidentsSection = location.pathname.startsWith('/residents');

  const linkStyle = (active: boolean): React.CSSProperties => ({
    display: 'block',
    padding: '10px 14px',
    borderRadius: '10px',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: 600,
    color: active ? '#fff' : '#4B5563',
    backgroundColor: active ? '#4F46E5' : 'transparent',
    boxShadow: active ? '0 4px 10px rgba(79, 70, 229, 0.25)' : 'none',
    marginBottom: '4px',
    textAlign: 'left',
    transition: 'background-color 0.15s ease, color 0.15s ease',
  });

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#FAFAFA', fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
      <div style={{ width: '240px', backgroundColor: '#fff', borderRight: '1px solid #F0F0F2', padding: '28px 0', position: 'sticky', top: 0, height: '100vh', boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '32px', paddingLeft: '20px' }}>
          <div style={{ width: '30px', height: '30px', borderRadius: '9px', backgroundColor: '#111827', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '15px', fontWeight: 700 }}>T</div>
          <h2 style={{ fontSize: '17px', fontWeight: 700, color: '#111827', margin: 0 }}>Taskeen</h2>
        </div>
        <nav style={{ paddingLeft: '12px', paddingRight: '12px' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#9CA3AF', letterSpacing: '0.06em', textTransform: 'uppercase', padding: '0 14px 8px' }}>Menu</div>
          <Link to="/" style={linkStyle(isBuildingsSection)}>Buildings</Link>
          <Link to="/residents" style={linkStyle(isResidentsSection)}>Residents</Link>
        </nav>
      </div>
      <div style={{ flex: 1, padding: '32px 36px', boxSizing: 'border-box' }}>{children}</div>
    </div>
  );
}

export default AppLayout;