import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { generateEncounterForm, generatePatientInvoice, generatePOD } from '../utils/generateDocuments';
import useWindowWidth from '../hooks/useWindowWidth';

export default function OrderResult() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [toast, setToast] = useState('');
  const isMobile = useWindowWidth() < 768;

  if (!state) {
    navigate('/order-calculator');
    return null;
  }

  const { patient, payer, product, vendor, state: patientState, calc, orderNumber } = state;

  function handleDocument(label, generator) {
    generator(state);
    setToast(`${label} generated successfully`);
    setTimeout(() => setToast(''), 3000);
  }

  return (
    <div style={styles.page}>
      <Header />

      {/* Hero */}
      <div style={styles.hero}>
        <div style={styles.heroInner}>
          <div style={styles.heroText}>
            <div style={styles.orderMeta}>
              <h1 style={styles.orderNumber}>{orderNumber}</h1>
              <span style={styles.readyBadge}>Ready</span>
            </div>
            <p style={styles.subtitle}>Order summary and document generation</p>
          </div>
          <button
            style={styles.backBtn}
            onClick={() => navigate('/order-calculator')}
            onMouseEnter={e => e.currentTarget.style.borderColor = '#2563EB'}
            onMouseLeave={e => e.currentTarget.style.borderColor = '#E2E8F0'}
          >
            ← Back to calculator
          </button>
        </div>
      </div>

      <main style={styles.main} className="page-main">
        <div style={styles.layout} className="two-col-layout">

          {/* Left column */}
          <div style={styles.leftCol} className="left-col">

            {/* Order details */}
            <div style={styles.card}>
              <h2 style={styles.cardTitle}>Order Details</h2>
              <div style={styles.detailRows}>
                <DetailRow label="Patient" value={patient} />
                <DetailRow label="Payer" value={payer} />
                <DetailRow label="Product" value={product} />
                <DetailRow label="Vendor" value={vendor} />
                <DetailRow label="State" value={patientState} />
              </div>
            </div>

            {/* Calculation */}
            <div style={styles.card}>
              <h2 style={styles.cardTitle}>Calculation</h2>
              <div style={styles.detailRows}>
                <DetailRow label="Cost per unit" value={`$${calc.costPerUnit.toFixed(2)}`} />
                <DetailRow label="Billable amount" value={`$${calc.billable.toFixed(2)}`} />
                <DetailRow label="Insurance covers (80%)" value={`$${calc.insuranceCovers.toFixed(2)}`} />
                <div style={styles.divider} />
                <DetailRow
                  label="Margin"
                  value={`$${calc.margin.toFixed(2)}`}
                  valueStyle={{ color: '#16A34A', fontWeight: '600' }}
                  highlight="green"
                />
                <DetailRow
                  label="Patient owes"
                  value={`$${calc.patientOwes.toFixed(2)}`}
                  valueStyle={{ color: '#DC2626', fontWeight: '600' }}
                  highlight="red"
                />
              </div>
            </div>

          </div>

          {/* Right column — documents */}
          <div style={styles.rightCol} className="right-col">
            <div style={styles.card}>
              <h2 style={styles.cardTitle}>Generate Documents</h2>
              <p style={styles.docsSubtitle}>Select a document to generate for this order.</p>

              <div style={styles.docButtons}>
                <DocButton
                  icon={<EncounterIcon />}
                  label="Generate Encounter Form"
                  onClick={() => handleDocument('Encounter Form', generateEncounterForm)}
                />
                <DocButton
                  icon={<InvoiceIcon />}
                  label="Generate Patient Invoice"
                  onClick={() => handleDocument('Patient Invoice', generatePatientInvoice)}
                />
                <DocButton
                  icon={<PodIcon />}
                  label="Generate POD"
                  onClick={() => handleDocument('POD', generatePOD)}
                />
              </div>
            </div>

            {/* Summary illustration */}
            <div style={styles.illustrationCard}>
              <ResultIllustration />
              <p style={styles.illustrationText}>All documents are generated locally for this prototype.</p>
            </div>
          </div>

        </div>
      </main>

      {/* Toast */}
      {toast && (
        <div style={styles.toast}>
          <CheckIcon />
          {toast}
        </div>
      )}
    </div>
  );
}

function DetailRow({ label, value, valueStyle = {}, highlight }) {
  const bg = highlight === 'green' ? '#F0FDF4' : highlight === 'red' ? '#FEF2F2' : 'transparent';
  return (
    <div style={{ ...styles.detailRow, background: bg, borderRadius: highlight ? '6px' : 0, padding: highlight ? '10px 12px' : '10px 0' }}>
      <span style={styles.detailLabel}>{label}</span>
      <span style={{ ...styles.detailValue, ...valueStyle }}>{value}</span>
    </div>
  );
}

function DocButton({ icon, label, onClick }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        ...styles.docBtn,
        background: hovered ? '#1D4ED8' : '#2563EB',
      }}
    >
      <span style={styles.docBtnIcon}>{icon}</span>
      {label}
    </button>
  );
}

const EncounterIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14,2 14,8 20,8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <line x1="10" y1="9" x2="8" y2="9" />
  </svg>
);

const InvoiceIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
    <line x1="1" y1="10" x2="23" y2="10" />
  </svg>
);

const PodIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const ResultIllustration = () => (
  <svg width="140" height="90" viewBox="0 0 140 90" fill="none">
    <ellipse cx="70" cy="55" rx="60" ry="30" fill="#EFF6FF" />
    <rect x="28" y="16" width="50" height="62" rx="6" fill="white" stroke="#BFDBFE" strokeWidth="1.5" />
    <rect x="36" y="26" width="34" height="4" rx="2" fill="#BFDBFE" />
    <rect x="36" y="34" width="24" height="3" rx="1.5" fill="#E2E8F0" />
    <rect x="36" y="43" width="34" height="1.5" rx="1" fill="#E2E8F0" />
    <rect x="36" y="50" width="34" height="1.5" rx="1" fill="#E2E8F0" />
    <rect x="36" y="57" width="22" height="1.5" rx="1" fill="#E2E8F0" />
    <circle cx="103" cy="42" r="18" fill="#2563EB" />
    <path d="M96 42l5 5 8-8" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const styles = {
  page: { minHeight: '100vh', background: '#F8FAFC', position: 'relative' },
  hero: { background: '#FFFFFF', borderBottom: '1px solid #E2E8F0' },
  heroInner: {
    maxWidth: '1100px', margin: '0 auto', padding: '28px 32px',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  },
  heroText: { flex: 1 },
  orderMeta: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' },
  orderNumber: { fontSize: '24px', fontWeight: '600', color: '#0F172A' },
  readyBadge: {
    background: '#DCFCE7', color: '#16A34A',
    fontSize: '12px', fontWeight: '600',
    padding: '3px 10px', borderRadius: '20px',
  },
  subtitle: { fontSize: '14px', color: '#64748B' },
  backBtn: {
    background: '#FFFFFF',
    border: '1px solid #E2E8F0',
    borderRadius: '6px',
    padding: '8px 16px',
    fontSize: '13px',
    fontWeight: '600',
    color: '#0F172A',
    cursor: 'pointer',
    transition: 'border-color 0.15s',
  },
  main: { maxWidth: '1100px', margin: '0 auto', padding: '32px' },
  layout: {},
  leftCol: {},
  rightCol: {},
  card: {
    background: '#FFFFFF',
    border: '1px solid #E2E8F0',
    borderRadius: '12px',
    padding: '28px',
    boxShadow: '0 0 0 3px rgba(37,99,235,0.05)',
  },
  cardTitle: { fontSize: '15px', fontWeight: '600', color: '#0F172A', marginBottom: '20px' },
  detailRows: { display: 'flex', flexDirection: 'column', gap: '2px' },
  detailRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  detailLabel: { fontSize: '13px', color: '#64748B' },
  detailValue: { fontSize: '14px', color: '#0F172A', fontWeight: '500' },
  divider: { borderTop: '1px solid #E2E8F0', margin: '8px 0' },
  docsSubtitle: { fontSize: '13px', color: '#64748B', marginBottom: '20px', marginTop: '-12px' },
  docButtons: { display: 'flex', flexDirection: 'column', gap: '10px' },
  docBtn: {
    display: 'flex', alignItems: 'center', gap: '10px',
    width: '100%', border: 'none', borderRadius: '6px',
    padding: '13px 18px',
    fontSize: '14px', fontWeight: '600', color: '#FFFFFF',
    cursor: 'pointer', transition: 'background 0.15s',
    textAlign: 'left',
  },
  docBtnIcon: { display: 'flex', alignItems: 'center', flexShrink: 0 },
  illustrationCard: {
    background: '#FFFFFF',
    border: '1px solid #BFDBFE',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 0 0 3px rgba(37,99,235,0.06)',
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px',
  },
  illustrationText: { fontSize: '12px', color: '#94A3B8', textAlign: 'center' },
  toast: {
    position: 'fixed', bottom: '32px', left: '50%',
    transform: 'translateX(-50%)',
    background: '#16A34A', color: 'white',
    padding: '12px 20px', borderRadius: '8px',
    fontSize: '14px', fontWeight: '600',
    display: 'flex', alignItems: 'center', gap: '8px',
    boxShadow: '0 4px 16px rgba(22,163,74,0.3)',
    zIndex: 999,
    animation: 'fadeIn 0.2s ease',
  },
};
