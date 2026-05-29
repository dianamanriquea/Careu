import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import { useApp } from '../context/AppContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useApp();

  function handleLogin(e) {
    e.preventDefault();
    if (email === 'demo@careu.com' && password === 'careu2025') {
      login();
      navigate('/dashboard');
    } else {
      setError('Invalid credentials. Use the default access below.');
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Logo size="lg" />
        </div>

        <form onSubmit={handleLogin} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              placeholder="you@careu.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={styles.input}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              style={styles.input}
            />
          </div>

          {error && <p style={styles.error}>{error}</p>}

          <button type="submit" style={styles.button}
            onMouseEnter={e => e.target.style.backgroundColor = '#1D4ED8'}
            onMouseLeave={e => e.target.style.backgroundColor = '#2563EB'}
          >
            Login
          </button>
        </form>

        <div style={styles.credentials}>
          <p style={styles.credLabel}>Default access</p>
          <p style={styles.credRow}><span style={styles.credKey}>Email</span> demo@careu.com</p>
          <p style={styles.credRow}><span style={styles.credKey}>Password</span> careu2025</p>
        </div>

        <p style={styles.hint}>
          Internal access only. Contact ops for account requests.
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    background: '#EFF6FF',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '16px',
  },
  card: {
    background: '#FFFFFF',
    border: '1px solid #E2E8F0',
    borderRadius: '8px',
    padding: '40px',
    width: '100%',
    maxWidth: '400px',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  wordmark: {
    fontSize: '28px',
    fontWeight: '600',
    color: '#0F172A',
    textAlign: 'center',
    letterSpacing: '-0.5px',
  },
  u: {
    color: '#2563EB',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#0F172A',
  },
  input: {
    border: '1px solid #E2E8F0',
    borderRadius: '8px',
    padding: '10px 12px',
    fontSize: '14px',
    color: '#0F172A',
    outline: 'none',
    width: '100%',
  },
  button: {
    background: '#2563EB',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '6px',
    padding: '12px',
    fontSize: '14px',
    fontWeight: '600',
    width: '100%',
    transition: 'background-color 0.15s',
    marginTop: '8px',
  },
  hint: {
    fontSize: '12px',
    color: '#64748B',
    textAlign: 'center',
  },
  error: {
    fontSize: '13px',
    color: '#DC2626',
    background: '#FEF2F2',
    border: '1px solid #FECACA',
    borderRadius: '6px',
    padding: '8px 12px',
  },
  credentials: {
    background: '#F8FAFC',
    border: '1px solid #E2E8F0',
    borderRadius: '8px',
    padding: '14px 16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  credLabel: {
    fontSize: '11px',
    fontWeight: '600',
    color: '#64748B',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    marginBottom: '4px',
  },
  credRow: {
    fontSize: '13px',
    color: '#0F172A',
  },
  credKey: {
    fontWeight: '600',
    color: '#64748B',
    marginRight: '8px',
  },
};
