import { Link } from 'react-router-dom';
import { ArrowRight, CalendarDays, CircleAlert, Search, UsersRound } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

export function Wordmark({ linkToHome = true }) {
  const content = (
    <>
      <span className="brand-mark" aria-hidden="true">
        <img src="/logo-kawan-kampus.png" width="922" height="727" alt="" />
      </span>
      <span className="wordmark-text">Kawan<span className="wordmark-second">Kampus</span></span>
    </>
  );

  return linkToHome
    ? <Link className="wordmark" to="/" aria-label="Kawan Kampus, beranda">{content}</Link>
    : <span className="wordmark">{content}</span>;
}

export function PublicHeader({ children, linkToHome = true }) {
  return (
    <header className="public-header glass-nav wrap">
      <Wordmark linkToHome={linkToHome} />
      <nav aria-label="Navigasi utama">
        <ThemeToggle />
        {children}
      </nav>
    </header>
  );
}

export function SearchField({ id, label, value, onChange, placeholder }) {
  return (
    <label className="search-box" htmlFor={id}>
      <Search size={18} aria-hidden="true" />
      <span className="sr-only">{label}</span>
      <input id={id} type="search" value={value} placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

export function EmptyState({ title, children, action, onAction, type = 'circle' }) {
  const Icon = { circle: UsersRound, event: CalendarDays, search: Search }[type];
  return (
    <div className="empty-state">
      <Icon size={23} aria-hidden="true" />
      <div><h3>{title}</h3><p>{children}</p></div>
      {action && <button type="button" className="text-link" onClick={onAction}>
        {action} <ArrowRight size={16} aria-hidden="true" />
      </button>}
    </div>
  );
}

export function InlineError({ id, children, onRetry }) {
  return (
    <div className="inline-error">
      <p id={id} role="alert"><CircleAlert size={18} aria-hidden="true" /> {children}</p>
      {onRetry && <button type="button" className="btn btn-outline btn-small" onClick={onRetry}>Coba lagi</button>}
    </div>
  );
}

export function SkeletonList({ type, label }) {
  return (
    <div className={`skeleton-list skeleton-${type}`} role="status" aria-label={label}>
      {[0, 1].map((item) => (
        <div className="skeleton-item" aria-hidden="true" key={item}>
          <i /><div><i /><i /><i /></div>
        </div>
      ))}
    </div>
  );
}
