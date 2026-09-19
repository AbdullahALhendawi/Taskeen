import { Link, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import { BuildingIcon, UsersIcon } from './icons';
import './AppLayout.css';

interface AppLayoutProps {
  children: ReactNode;
}

function AppLayout({ children }: AppLayoutProps) {
  const location = useLocation();

  const isBuildingsSection = location.pathname === '/' || location.pathname.startsWith('/buildings');
  const isResidentsSection = location.pathname.startsWith('/residents');

  function navLinkClass(active: boolean) {
    return active ? 'app-nav-link app-nav-link-active' : 'app-nav-link';
  }

  return (
    <div className="app-shell">
      <div className="app-sidebar">
        <div className="app-brand">
          <div className="app-brand-mark">T</div>
          <h2 className="app-brand-name">Taskeen</h2>
        </div>
        <nav className="app-nav">
          <div className="app-nav-heading">Menu</div>
          <Link to="/" className={navLinkClass(isBuildingsSection)}>
            <BuildingIcon size={18} />
            Buildings
          </Link>
          <Link to="/residents" className={navLinkClass(isResidentsSection)}>
            <UsersIcon size={18} />
            Residents
          </Link>
        </nav>
      </div>
      <div className="app-content">{children}</div>
    </div>
  );
}

export default AppLayout;
