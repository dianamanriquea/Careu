import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import useWindowWidth from '../hooks/useWindowWidth';

const IllustrationRates = () => (
  <svg viewBox="0 0 280 180" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
    {/* Background blob */}
    <ellipse cx="140" cy="100" rx="110" ry="75" fill="#EFF6FF" />
    {/* Document */}
    <rect x="80" y="30" width="90" height="115" rx="8" fill="#FFFFFF" stroke="#BFDBFE" strokeWidth="1.5" />
    <rect x="95" y="50" width="60" height="6" rx="3" fill="#BFDBFE" />
    <rect x="95" y="65" width="45" height="5" rx="2.5" fill="#E2E8F0" />
    {/* Lines */}
    <rect x="95" y="82" width="60" height="1.5" rx="1" fill="#E2E8F0" />
    <rect x="95" y="92" width="60" height="1.5" rx="1" fill="#E2E8F0" />
    <rect x="95" y="102" width="60" height="1.5" rx="1" fill="#E2E8F0" />
    <rect x="95" y="112" width="40" height="1.5" rx="1" fill="#E2E8F0" />
    {/* Dollar badge */}
    <circle cx="158" cy="115" r="22" fill="#2563EB" />
    <text x="158" y="122" textAnchor="middle" fill="white" fontSize="22" fontWeight="700" fontFamily="DM Sans, sans-serif">$</text>
    {/* Small sparkle */}
    <circle cx="82" cy="42" r="5" fill="#BFDBFE" />
    <circle cx="195" cy="55" r="3.5" fill="#93C5FD" />
  </svg>
);

const IllustrationCalculator = () => (
  <svg viewBox="0 0 280 180" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
    {/* Background blob */}
    <ellipse cx="140" cy="100" rx="110" ry="75" fill="#EFF6FF" />
    {/* Calculator body */}
    <rect x="90" y="28" width="75" height="110" rx="10" fill="#FFFFFF" stroke="#BFDBFE" strokeWidth="1.5" />
    {/* Screen */}
    <rect x="100" y="40" width="55" height="28" rx="5" fill="#EFF6FF" stroke="#BFDBFE" strokeWidth="1" />
    <text x="147" y="59" textAnchor="end" fill="#2563EB" fontSize="14" fontWeight="600" fontFamily="DM Sans, sans-serif">248.50</text>
    {/* Buttons row 1 */}
    <rect x="100" y="76" width="14" height="12" rx="3" fill="#BFDBFE" />
    <rect x="118" y="76" width="14" height="12" rx="3" fill="#BFDBFE" />
    <rect x="136" y="76" width="14" height="12" rx="3" fill="#93C5FD" />
    {/* Buttons row 2 */}
    <rect x="100" y="93" width="14" height="12" rx="3" fill="#E2E8F0" />
    <rect x="118" y="93" width="14" height="12" rx="3" fill="#E2E8F0" />
    <rect x="136" y="93" width="14" height="12" rx="3" fill="#E2E8F0" />
    {/* Buttons row 3 */}
    <rect x="100" y="110" width="14" height="12" rx="3" fill="#E2E8F0" />
    <rect x="118" y="110" width="14" height="12" rx="3" fill="#E2E8F0" />
    <rect x="136" y="110" width="14" height="24" rx="3" fill="#2563EB" />
    {/* Equals sign */}
    <rect x="140" y="117" width="6" height="1.5" rx="1" fill="white" />
    <rect x="140" y="121" width="6" height="1.5" rx="1" fill="white" />
    {/* Pulse ring */}
    <circle cx="195" cy="50" r="14" fill="none" stroke="#BFDBFE" strokeWidth="2" />
    <circle cx="195" cy="50" r="8" fill="#EFF6FF" stroke="#93C5FD" strokeWidth="1.5" />
    <circle cx="195" cy="50" r="3.5" fill="#2563EB" />
    {/* Small dot */}
    <circle cx="82" cy="130" r="5" fill="#BFDBFE" />
  </svg>
);

const cards = [
  {
    route: '/fee-management',
    Illustration: IllustrationRates,
    title: 'Edit Rates',
    description: 'Update product pricing, payer fee schedules, and vendor terms.',
  },
  {
    route: '/order-calculator',
    Illustration: IllustrationCalculator,
    title: 'Order Calculator',
    description: 'Calculate margins and patient billing in real time.',
  },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const isMobile = useWindowWidth() < 768;

  return (
    <div style={styles.page}>
      <Header />
      <main style={{ ...styles.main, padding: isMobile ? '32px 16px' : '56px 32px' }}>
        <h1 style={{ ...styles.welcome, fontSize: isMobile ? '22px' : '28px' }}>Welcome back, Sarah</h1>
        <p style={styles.subtitle}>Choose a workspace to get started.</p>

        <div style={{ ...styles.cards, flexDirection: isMobile ? 'column' : 'row' }}>
          {cards.map(card => (
            <CardItem key={card.route} card={card} onClick={() => navigate(card.route)} />
          ))}
        </div>
      </main>
    </div>
  );
}

function CardItem({ card, onClick }) {
  const { Illustration, title, description } = card;
  return (
    <div
      style={styles.card}
      onClick={onClick}
      onMouseEnter={e => {
        e.currentTarget.style.boxShadow = '0 0 0 3px rgba(37,99,235,0.18), 0 8px 24px rgba(37,99,235,0.13)';
        e.currentTarget.style.borderColor = '#93C5FD';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.boxShadow = '0 0 0 3px rgba(37,99,235,0.08), 0 1px 4px rgba(37,99,235,0.06)';
        e.currentTarget.style.borderColor = '#BFDBFE';
      }}
    >
      <div style={styles.illustration}>
        <Illustration />
      </div>
      <div style={styles.cardBody}>
        <h2 style={styles.cardTitle}>{title}</h2>
        <p style={styles.cardDesc}>{description}</p>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', background: '#F8FAFC' },
  main: {
    maxWidth: '900px',
    margin: '0 auto',
    padding: '56px 32px',
  },
  welcome: {
    fontSize: '28px',
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: '8px',
  },
  subtitle: {
    fontSize: '14px',
    color: '#64748B',
    marginBottom: '48px',
  },
  cards: {
    display: 'flex',
    flexDirection: 'row',
    gap: '24px',
    alignItems: 'stretch',
  },
  card: {
    flex: 1,
    background: '#FFFFFF',
    border: '1px solid #BFDBFE',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'box-shadow 0.2s, border-color 0.2s',
    boxShadow: '0 0 0 3px rgba(37,99,235,0.08), 0 1px 4px rgba(37,99,235,0.06)',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  },
  illustration: {
    width: '100%',
    height: '200px',
    background: '#F8FAFC',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '16px',
  },
  cardBody: {
    padding: '24px 28px 32px',
  },
  cardTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: '8px',
  },
  cardDesc: {
    fontSize: '14px',
    color: '#64748B',
    lineHeight: '1.6',
  },
};
