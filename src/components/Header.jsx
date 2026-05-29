import { NavLink } from 'react-router-dom';
import Logo from './Logo';

export default function Header() {
  return (
    <header style={styles.header}>
      <div style={styles.inner}>
        <NavLink to="/dashboard" style={{ textDecoration: 'none' }}>
          <Logo />
        </NavLink>

        <nav style={styles.nav}>
          <NavLink
            to="/fee-management"
            style={({ isActive }) => ({
              ...styles.navLink,
              color: isActive ? '#0F172A' : '#64748B',
              fontWeight: isActive ? '600' : '400',
            })}
          >
            Fee Management
          </NavLink>
          <NavLink
            to="/order-calculator"
            style={({ isActive }) => ({
              ...styles.navLink,
              color: isActive ? '#0F172A' : '#64748B',
              fontWeight: isActive ? '600' : '400',
            })}
          >
            Order Calculator
          </NavLink>
          <div style={styles.divider} />
          <span style={styles.user}>Dr. Sarah Chen</span>
        </nav>
      </div>
      <div style={styles.borderBottom} />
    </header>
  );
}

const styles = {
  header: {
    background: '#FFFFFF',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  inner: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 32px',
    height: '64px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    textDecoration: 'none',
  },
  logoIcon: {
    width: '36px',
    height: '36px',
    background: '#2563EB',
    borderRadius: '8px',
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: '18px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#0F172A',
  },
  nav: {
    display: 'flex',
    alignItems: 'center',
    gap: '32px',
  },
  navLink: {
    textDecoration: 'none',
    fontSize: '14px',
    transition: 'color 0.15s',
  },
  divider: {
    width: '1px',
    height: '20px',
    background: '#E2E8F0',
  },
  user: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#0F172A',
  },
  borderBottom: {
    borderBottom: '1px solid #E2E8F0',
  },
};
