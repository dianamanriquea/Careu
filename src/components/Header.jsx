import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import Logo from './Logo';
import useWindowWidth from '../hooks/useWindowWidth';

export default function Header() {
  const width = useWindowWidth();
  const isMobile = width < 768;
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header style={styles.header}>
      <div style={styles.inner}>
        <NavLink to="/dashboard" style={{ textDecoration: 'none' }}>
          <Logo />
        </NavLink>

        {isMobile ? (
          <>
            <button style={styles.hamburger} onClick={() => setMenuOpen(o => !o)}>
              {menuOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
            {menuOpen && (
              <div style={styles.mobileMenu}>
                <MobileNavLink to="/fee-management" onClick={() => setMenuOpen(false)}>Fee Management</MobileNavLink>
                <MobileNavLink to="/order-calculator" onClick={() => setMenuOpen(false)}>Order Calculator</MobileNavLink>
                <div style={styles.mobileDivider} />
                <span style={styles.mobileUser}>Dr. Sarah Chen</span>
              </div>
            )}
          </>
        ) : (
          <nav style={styles.nav}>
            <NavLink to="/fee-management" style={({ isActive }) => ({ ...styles.navLink, color: isActive ? '#0F172A' : '#64748B', fontWeight: isActive ? '600' : '400' })}>
              Fee Management
            </NavLink>
            <NavLink to="/order-calculator" style={({ isActive }) => ({ ...styles.navLink, color: isActive ? '#0F172A' : '#64748B', fontWeight: isActive ? '600' : '400' })}>
              Order Calculator
            </NavLink>
            <div style={styles.divider} />
            <span style={styles.user}>Dr. Sarah Chen</span>
          </nav>
        )}
      </div>
      <div style={styles.borderBottom} />
    </header>
  );
}

function MobileNavLink({ to, onClick, children }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      style={({ isActive }) => ({
        display: 'block',
        padding: '14px 24px',
        fontSize: '15px',
        fontWeight: isActive ? '600' : '400',
        color: isActive ? '#2563EB' : '#0F172A',
        textDecoration: 'none',
        borderBottom: '1px solid #F1F5F9',
      })}
    >
      {children}
    </NavLink>
  );
}

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
    maxWidth: '1200px', margin: '0 auto', padding: '0 24px',
    height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    position: 'relative',
  },
  nav: { display: 'flex', alignItems: 'center', gap: '32px' },
  navLink: { textDecoration: 'none', fontSize: '14px', transition: 'color 0.15s' },
  divider: { width: '1px', height: '20px', background: '#E2E8F0' },
  user: { fontSize: '14px', fontWeight: '600', color: '#0F172A' },
  hamburger: {
    background: 'none', border: 'none', cursor: 'pointer',
    display: 'flex', alignItems: 'center', padding: '4px',
  },
  mobileMenu: {
    position: 'absolute', top: '64px', left: 0, right: 0,
    background: '#FFFFFF', borderBottom: '1px solid #E2E8F0',
    zIndex: 99, boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
  },
  mobileDivider: { height: '1px', background: '#F1F5F9' },
  mobileUser: {
    display: 'block', padding: '14px 24px',
    fontSize: '14px', fontWeight: '600', color: '#64748B',
  },
  borderBottom: { borderBottom: '1px solid #E2E8F0' },
};
