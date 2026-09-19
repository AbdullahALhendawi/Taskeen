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
    <nav className="breadcrumb">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <span key={item.path} className="breadcrumb-item">
            {isLast ? (
              <span className="breadcrumb-current">{item.label}</span>
            ) : (
              <Link to={item.path} className="breadcrumb-link">
                {item.label}
              </Link>
            )}
            {!isLast && <span className="breadcrumb-separator">›</span>}
          </span>
        );
      })}
    </nav>
  );
}

export default Breadcrumb;
