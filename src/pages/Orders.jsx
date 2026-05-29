import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { useApp } from '../context/AppContext';

export default function Orders() {
  const { orders, setLastOrder } = useApp();
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const q = search.toLowerCase();
  const filtered = orders.filter(o =>
    o.orderNumber.toLowerCase().includes(q) ||
    o.patient.toLowerCase().includes(q) ||
    o.product.toLowerCase().includes(q) ||
    o.payer.toLowerCase().includes(q)
  );

  function viewOrder(order) {
    setLastOrder({ ...order });
    navigate('/order-result', { state: order });
  }

  return (
    <div style={styles.page}>
      <Header />

      <div style={styles.hero}>
        <div style={styles.heroInner}>
          <div>
            <h1 style={styles.title}>Order History</h1>
            <p style={styles.subtitle}>All generated orders — click any row to view documents.</p>
          </div>
          <span className="hide-mobile"><HeroIllustration /></span>
        </div>
      </div>

      <main style={styles.main} className="page-main">
        {orders.length === 0 ? (
          <div style={styles.emptyState}>
            <EmptyIllustration />
            <h2 style={styles.emptyTitle}>No orders yet</h2>
            <p style={styles.emptyText}>Generate your first order from the Order Calculator.</p>
            <NewOrderButton onClick={() => navigate('/order-calculator')} />
          </div>
        ) : (
          <>
            <div style={styles.toolbar}>
              <div style={styles.searchWrap}>
                <SearchIcon />
                <input
                  type="text"
                  placeholder="Search by order, patient, product..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  style={styles.searchInput}
                />
              </div>
              <NewOrderButton onClick={() => navigate('/order-calculator')} />
            </div>

            <div style={styles.tableCard}>
              {filtered.length === 0 ? (
                <p style={styles.noResults}>No orders match your search.</p>
              ) : (
                <table style={styles.table}>
                  <thead>
                    <tr style={{ background: '#F8FAFC' }}>
                      {['Order', 'Patient', 'Product', 'Payer', 'State', 'Patient Owes', 'Date', ''].map(h => (
                        <th key={h} style={styles.th}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((order, i) => (
                      <OrderRow key={order.orderNumber + i} order={order} alt={i % 2 !== 0} onView={() => viewOrder(order)} />
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}

function OrderRow({ order, alt, onView }) {
  const [hovered, setHovered] = useState(false);
  const date = new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  return (
    <tr
      style={{ background: hovered ? '#EFF6FF' : alt ? '#F8FAFC' : '#FFFFFF', cursor: 'pointer', transition: 'background 0.15s' }}
      onClick={onView}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <td style={styles.td}><span style={styles.orderBadge}>{order.orderNumber}</span></td>
      <td style={styles.td}>{order.patient}</td>
      <td style={styles.td}>{order.product}</td>
      <td style={styles.td}>{order.payer}</td>
      <td style={styles.td}>{order.state}</td>
      <td style={styles.td}><span style={{ color: '#DC2626', fontWeight: '600' }}>${order.calc.patientOwes.toFixed(2)}</span></td>
      <td style={{ ...styles.td, color: '#64748B', fontSize: '13px' }}>{date}</td>
      <td style={styles.td}><span style={styles.viewLink}>View →</span></td>
    </tr>
  );
}

function NewOrderButton({ onClick }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button onClick={onClick} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ ...styles.newBtn, background: hovered ? '#1D4ED8' : '#2563EB' }}>
      + New Order
    </button>
  );
}

const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0 }}>
    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const HeroIllustration = () => (
  <svg width="180" height="110" viewBox="0 0 180 110" fill="none">
    <ellipse cx="90" cy="60" rx="80" ry="45" fill="#EFF6FF" />
    <rect x="30" y="22" width="90" height="70" rx="7" fill="white" stroke="#BFDBFE" strokeWidth="1.5" />
    <rect x="42" y="34" width="40" height="5" rx="2.5" fill="#BFDBFE" />
    <rect x="42" y="44" width="28" height="4" rx="2" fill="#E2E8F0" />
    <rect x="42" y="54" width="66" height="1.5" rx="1" fill="#E2E8F0" />
    <rect x="42" y="62" width="66" height="1.5" rx="1" fill="#E2E8F0" />
    <rect x="42" y="70" width="66" height="1.5" rx="1" fill="#E2E8F0" />
    <rect x="42" y="78" width="44" height="1.5" rx="1" fill="#E2E8F0" />
    <circle cx="148" cy="38" r="16" fill="#2563EB" />
    <path d="M141 38l5 5 7-8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="32" cy="28" r="4" fill="#BFDBFE" />
    <circle cx="158" cy="72" r="3" fill="#93C5FD" />
  </svg>
);

const EmptyIllustration = () => (
  <svg width="120" height="100" viewBox="0 0 120 100" fill="none">
    <ellipse cx="60" cy="65" rx="52" ry="28" fill="#EFF6FF" />
    <rect x="22" y="16" width="76" height="68" rx="8" fill="white" stroke="#BFDBFE" strokeWidth="1.5" />
    <rect x="34" y="30" width="52" height="6" rx="3" fill="#E2E8F0" />
    <rect x="34" y="42" width="36" height="4" rx="2" fill="#E2E8F0" />
    <rect x="34" y="54" width="52" height="2" rx="1" fill="#F1F5F9" />
    <rect x="34" y="62" width="52" height="2" rx="1" fill="#F1F5F9" />
    <circle cx="88" cy="30" r="14" fill="#EFF6FF" stroke="#BFDBFE" strokeWidth="1.5" />
    <line x1="88" y1="25" x2="88" y2="35" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
    <line x1="83" y1="30" x2="93" y2="30" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const styles = {
  page: { minHeight: '100vh', background: '#F8FAFC' },
  hero: { background: '#FFFFFF', borderBottom: '1px solid #E2E8F0' },
  heroInner: { maxWidth: '1100px', margin: '0 auto', padding: '36px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  title: { fontSize: '24px', fontWeight: '600', color: '#0F172A', marginBottom: '8px' },
  subtitle: { fontSize: '14px', color: '#64748B' },
  main: { maxWidth: '1100px', margin: '0 auto', padding: '32px' },
  toolbar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', gap: '12px', flexWrap: 'wrap' },
  searchWrap: { display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '10px 14px', background: '#FFFFFF', width: '300px' },
  searchInput: { border: 'none', outline: 'none', fontSize: '14px', color: '#0F172A', width: '100%', background: 'transparent' },
  tableCard: { background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '8px', overflow: 'auto', boxShadow: '0 0 0 3px rgba(37,99,235,0.05)' },
  table: { width: '100%', borderCollapse: 'collapse', minWidth: '640px' },
  th: { textAlign: 'left', padding: '12px 16px', fontSize: '11px', fontWeight: '600', color: '#64748B', letterSpacing: '0.06em', textTransform: 'uppercase', borderBottom: '1px solid #E2E8F0' },
  td: { padding: '14px 16px', fontSize: '14px', color: '#0F172A', borderBottom: '1px solid #E2E8F0' },
  orderBadge: { fontFamily: 'monospace', fontSize: '12px', background: '#EFF6FF', color: '#2563EB', padding: '3px 8px', borderRadius: '4px', fontWeight: '600' },
  viewLink: { color: '#2563EB', fontWeight: '600', fontSize: '13px' },
  noResults: { padding: '32px', textAlign: 'center', color: '#64748B' },
  emptyState: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', padding: '64px 32px', textAlign: 'center' },
  emptyTitle: { fontSize: '18px', fontWeight: '600', color: '#0F172A' },
  emptyText: { fontSize: '14px', color: '#64748B', maxWidth: '280px' },
  newBtn: { border: 'none', borderRadius: '6px', padding: '10px 20px', fontSize: '14px', fontWeight: '600', color: '#FFFFFF', cursor: 'pointer', transition: 'background 0.15s' },
};
