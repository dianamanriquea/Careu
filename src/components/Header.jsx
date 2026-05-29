import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import Logo from './Logo';
import { useApp } from '../context/AppContext';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { logout } = useApp();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <header style={styles.header}>
      <div style={styles.inner}>
        <NavLink to="/dashboard" style={{ textDecoration: 'none' }}>
          <Logo />
        </NavLink>

        {/* Desktop nav */}
        <nav style={styles.nav} className="nav-desktop">
          <NavLink to="/fee-management" style={({ isActive }) => ({ ...styles.navLink, color: isActive ? '#0F172A' : '#64748B', fontWeight: isActive ? '600' : '400' })}>
            Edit Rates
          </NavLink>
          <NavLink to="/order-calculator" style={({ isActive }) => ({ ...styles.navLink, color: isActive ? '#0F172A' : '#64748B', fontWeight: isActive ? '600' : '400' })}>
            Order Calculator
          </NavLink>
          <NavLink to="/orders" style={({ isActive }) => ({ ...styles.navLink, color: isActive ? '#0F172A' : '#64748B', fontWeight: isActive ? '600' : '400' })}>
            Orders
          </NavLink>
          <div style={styles.divider} />
          <div style={styles.userArea}>
            <div style={styles.avatar}>SC</div>
            <span style={styles.user}>Dr. Sarah Chen</span>
            <button style={styles.logoutBtn} onClick={handleLogout}
              onMouseEnter={e => e.currentTarget.style.color = '#DC2626'}
              onMouseLeave={e => e.currentTarget.style.color = '#64748B'}
            >
              <LogoutIcon />
            </button>
          </div>
        </nav>

        {/* Hamburger */}
        <button style={styles.hamburger} className="nav-hamburger" onClick={() => setMenuOpen(o => !o)}>
          {menuOpen ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div style={styles.mobileMenu} className="mobile-menu">
          <MobileNavLink to="/fee-management" onClick={() => setMenuOpen(false)}>Edit Rates</MobileNavLink>
          <MobileNavLink to="/order-calculator" onClick={() => setMenuOpen(false)}>Order Calculator</MobileNavLink>
          <MobileNavLink to="/orders" onClick={() => setMenuOpen(false)}>Orders</MobileNavLink>
          <div style={styles.mobileDivider} />
          <div style={styles.mobileUserRow}>
            <div style={styles.avatar}>SC</div>
            <span style={styles.mobileUser}>Dr. Sarah Chen</span>
            <button style={styles.mobileLogoutBtn} onClick={handleLogout}>
              Log out
            </button>
          </div>
        </div>
      )}

      <div style={styles.borderBottom} />
    </header>
  );
}

function MobileNavLink({ to, onClick, children }) {
  return (
    <NavLink to={to} onClick={onClick} style={({ isActive }) => ({
      display: 'block', padding: '14px 20px',
      fontSize: '15px', fontWeight: isActive ? '600' : '400',
      color: isActive ? '#2563EB' : '#0F172A',
      textDecoration: 'none', borderBottom: '1px solid #F1F5F9',
    })}>
      {children}
    </NavLink>
  );
}

const LogoutIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

const MenuIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0F172A" strokeWidth="2" strokeLinecap="round">
    <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

const CloseIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0F172A" strokeWidth="2" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const styles = {
  header: { background: '#FFFFFF', position: 'sticky', top: 0, zIndex: 100 },
  inner: {
    maxWidth: '1200px', margin: '0 auto', padding: '0 20px',
    height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  },
  nav: { alignItems: 'center', gap: '32px' },
  navLink: { textDecoration: 'none', fontSize: '14px', transition: 'color 0.15s' },
  divider: { width: '1px', height: '20px', background: '#E2E8F0' },
  userArea: { display: 'flex', alignItems: 'center', gap: '10px' },
  avatar: {
    width: '30px', height: '30px', borderRadius: '50%',
    background: '#EFF6FF', border: '1px solid #BFDBFE',
    color: '#2563EB', fontSize: '11px', fontWeight: '600',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  user: { fontSize: '14px', fontWeight: '600', color: '#0F172A' },
  logoutBtn: {
    background: 'none', border: 'none', cursor: 'pointer',
    color: '#64748B', display: 'flex', alignItems: 'center',
    padding: '4px', transition: 'color 0.15s',
  },
  hamburger: { background: 'none', border: 'none', cursor: 'pointer', alignItems: 'center', padding: '4px' },
  mobileUserRow: { display: 'flex', alignItems: 'center', gap: '10px', padding: '14px 20px' },
  mobileLogoutBtn: {
    marginLeft: 'auto', background: 'none', border: '1px solid #E2E8F0',
    borderRadius: '6px', padding: '6px 12px', fontSize: '13px',
    fontWeight: '600', color: '#DC2626', cursor: 'pointer',
  },
  mobileMenu: {
    background: '#FFFFFF', borderBottom: '1px solid #E2E8F0',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
  },
  mobileDivider: { height: '1px', background: '#F1F5F9' },
  mobileUser: { fontSize: '14px', fontWeight: '600', color: '#0F172A' },
  borderBottom: { borderBottom: '1px solid #E2E8F0' },
};
