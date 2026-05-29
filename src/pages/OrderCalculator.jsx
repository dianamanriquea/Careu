import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { calculate } from '../data/seedData';
import { useApp } from '../context/AppContext';
import useWindowWidth from '../hooks/useWindowWidth';

const STATES = ['CA', 'NY', 'TX', 'FL', 'WA'];

export default function OrderCalculator() {
  const isMobile = useWindowWidth() < 768;
  const { products, schedules: feeSchedules, setLastOrder } = useApp();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    patientName: '',
    feeScheduleId: '',
    productId: '',
    state: '',
  });

  const selectedProduct = products.find(p => p.id === form.productId) || null;
  const selectedSchedule = feeSchedules.find(f => f.id === form.feeScheduleId) || null;

  const calc = useMemo(() => {
    if (!selectedProduct || !selectedSchedule) return null;
    return calculate(selectedProduct, selectedSchedule);
  }, [selectedProduct, selectedSchedule]);

  function set(field, value) {
    setForm(f => ({ ...f, [field]: value }));
  }

  function handleGenerate(e) {
    e.preventDefault();
    if (!form.patientName || !selectedProduct || !selectedSchedule || !form.state) return;
    const order = {
      patient: form.patientName,
      payer: selectedSchedule.payer,
      product: selectedProduct.name,
      vendor: selectedProduct.vendor,
      state: form.state,
      calc,
      orderNumber: `CU-${Math.floor(1000 + Math.random() * 9000)}`,
    };
    setLastOrder(order);
    navigate('/order-result', { state: order });
  }

  const canSubmit = form.patientName && form.productId && form.feeScheduleId && form.state;

  return (
    <div style={styles.page}>
      <Header />

      {/* Hero */}
      <div style={styles.hero}>
        <div style={styles.heroInner}>
          <div style={styles.heroText}>
            <h1 style={styles.title}>Order Calculator</h1>
            <p style={styles.subtitle}>Enter order details to see margin and patient responsibility update live.</p>
          </div>
          <span className="hide-mobile"><HeroIllustration /></span>
        </div>
      </div>

      <main style={styles.main} className="page-main">
        <div style={styles.layout} className="two-col-layout">

          {/* Form */}
          <div style={styles.formCard} className="form-card">
            <h2 style={styles.sectionTitle}>Order Details</h2>

            <div style={styles.fields}>
              <Field label="Patient Name">
                <input
                  type="text"
                  placeholder="Full name"
                  value={form.patientName}
                  onChange={e => set('patientName', e.target.value)}
                  style={styles.input}
                />
              </Field>

              <Field label="Insurance / Payer">
                <select value={form.feeScheduleId} onChange={e => set('feeScheduleId', e.target.value)} style={styles.input}>
                  <option value="">Select payer...</option>
                  {feeSchedules.map(f => (
                    <option key={f.id} value={f.id}>{f.payer} ({f.region})</option>
                  ))}
                </select>
              </Field>

              <Field label="Product">
                <select value={form.productId} onChange={e => set('productId', e.target.value)} style={styles.input}>
                  <option value="">Select product...</option>
                  {products.map(p => (
                    <option key={p.id} value={p.id}>{p.name} — {p.sku}</option>
                  ))}
                </select>
              </Field>

              <Field label="Vendor">
                <input
                  type="text"
                  value={selectedProduct ? selectedProduct.vendor : ''}
                  readOnly
                  placeholder="Auto-populated from product"
                  style={{ ...styles.input, background: '#F8FAFC', color: '#64748B', cursor: 'default' }}
                />
              </Field>

              <Field label="State">
                <select value={form.state} onChange={e => set('state', e.target.value)} style={styles.input}>
                  <option value="">Select state...</option>
                  {STATES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </Field>
            </div>
          </div>

          {/* Calculation panel */}
          <div style={styles.calcCard} className="calc-card">
            <h2 style={styles.sectionTitle}>Live Calculation</h2>

            {calc ? (
              <div style={styles.calcRows}>
                <CalcRow label="Cost per unit" value={`$${calc.costPerUnit.toFixed(2)}`} />
                <CalcRow label="Billable amount" value={`$${calc.billable.toFixed(2)}`} />
                <CalcRow label="Insurance covers (80%)" value={`$${calc.insuranceCovers.toFixed(2)}`} />
                <div style={styles.divider} />
                <CalcRow
                  label="Margin"
                  value={`$${calc.margin.toFixed(2)}`}
                  valueStyle={{ color: '#16A34A', fontWeight: '600' }}
                  highlight="green"
                />
                <CalcRow
                  label="Patient owes"
                  value={`$${calc.patientOwes.toFixed(2)}`}
                  valueStyle={{ color: '#DC2626', fontWeight: '600' }}
                  highlight="red"
                />
                <p style={styles.disclaimer}>
                  Coverage assumes 80% from selected payer. Final amounts may vary based on deductible status.
                </p>
              </div>
            ) : (
              <div style={styles.emptyCalc}>
                <CalcEmptyIllustration />
                <p style={styles.emptyText}>Select a product and payer to see the live calculation.</p>
              </div>
            )}

            <GenerateButton onClick={handleGenerate} disabled={!canSubmit} />
          </div>

        </div>
      </main>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div style={styles.field}>
      <label style={styles.label}>{label}</label>
      {children}
    </div>
  );
}

function CalcRow({ label, value, valueStyle = {}, highlight }) {
  const bg = highlight === 'green' ? '#F0FDF4' : highlight === 'red' ? '#FEF2F2' : 'transparent';
  return (
    <div style={{ ...styles.calcRow, background: bg, borderRadius: highlight ? '6px' : 0, padding: highlight ? '10px 12px' : '6px 0' }}>
      <span style={styles.calcLabel}>{label}</span>
      <span style={{ ...styles.calcValue, ...valueStyle }}>{value}</span>
    </div>
  );
}

function GenerateButton({ onClick, disabled }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        ...styles.generateBtn,
        background: disabled ? '#E2E8F0' : hovered ? '#1D4ED8' : '#2563EB',
        color: disabled ? '#94A3B8' : '#FFFFFF',
        cursor: disabled ? 'not-allowed' : 'pointer',
      }}
    >
      Generate Order →
    </button>
  );
}

const HeroIllustration = () => (
  <svg width="180" height="110" viewBox="0 0 180 110" fill="none">
    <ellipse cx="90" cy="60" rx="80" ry="45" fill="#EFF6FF" />
    {/* Calculator */}
    <rect x="55" y="18" width="52" height="70" rx="7" fill="white" stroke="#BFDBFE" strokeWidth="1.5" />
    <rect x="63" y="28" width="36" height="18" rx="4" fill="#EFF6FF" stroke="#BFDBFE" strokeWidth="1" />
    <text x="92" y="41" textAnchor="end" fill="#2563EB" fontSize="11" fontWeight="600" fontFamily="DM Sans,sans-serif">$248.50</text>
    <rect x="63" y="52" width="9" height="8" rx="2" fill="#BFDBFE" />
    <rect x="75" y="52" width="9" height="8" rx="2" fill="#BFDBFE" />
    <rect x="87" y="52" width="9" height="8" rx="2" fill="#93C5FD" />
    <rect x="63" y="64" width="9" height="8" rx="2" fill="#E2E8F0" />
    <rect x="75" y="64" width="9" height="8" rx="2" fill="#E2E8F0" />
    <rect x="87" y="64" width="9" height="16" rx="2" fill="#2563EB" />
    {/* Arrow / result */}
    <circle cx="133" cy="55" r="18" fill="#2563EB" opacity="0.12" />
    <circle cx="133" cy="55" r="12" fill="#2563EB" />
    <path d="M128 55h10M134 51l4 4-4 4" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="57" cy="26" r="4" fill="#BFDBFE" />
    <circle cx="152" cy="40" r="3" fill="#93C5FD" />
  </svg>
);

const CalcEmptyIllustration = () => (
  <svg width="100" height="80" viewBox="0 0 100 80" fill="none">
    <ellipse cx="50" cy="50" rx="42" ry="26" fill="#EFF6FF" />
    <rect x="28" y="18" width="44" height="50" rx="6" fill="white" stroke="#BFDBFE" strokeWidth="1.5" />
    <rect x="36" y="28" width="28" height="4" rx="2" fill="#E2E8F0" />
    <rect x="36" y="36" width="20" height="3" rx="1.5" fill="#E2E8F0" />
    <rect x="36" y="44" width="28" height="2" rx="1" fill="#E2E8F0" />
    <rect x="36" y="50" width="28" height="2" rx="1" fill="#E2E8F0" />
    <circle cx="72" cy="32" r="8" fill="#EFF6FF" stroke="#BFDBFE" strokeWidth="1.5" />
    <text x="72" y="36" textAnchor="middle" fill="#94A3B8" fontSize="10" fontFamily="DM Sans,sans-serif">?</text>
  </svg>
);

const styles = {
  page: { minHeight: '100vh', background: '#F8FAFC' },
  hero: { background: '#FFFFFF', borderBottom: '1px solid #E2E8F0' },
  heroInner: {
    maxWidth: '1100px', margin: '0 auto', padding: '36px 32px',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  },
  heroText: { flex: 1 },
  title: { fontSize: '24px', fontWeight: '600', color: '#0F172A', marginBottom: '8px' },
  subtitle: { fontSize: '14px', color: '#64748B', maxWidth: '420px' },
  main: { maxWidth: '1100px', margin: '0 auto', padding: '32px' },
  layout: {},
  formCard: {
    background: '#FFFFFF',
    border: '1px solid #E2E8F0',
    borderRadius: '12px',
    padding: '28px',
    boxShadow: '0 0 0 3px rgba(37,99,235,0.05)',
  },
  calcCard: {
    background: '#FFFFFF',
    border: '1px solid #BFDBFE',
    borderRadius: '12px',
    padding: '28px',
    boxShadow: '0 0 0 3px rgba(37,99,235,0.08)',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  sectionTitle: { fontSize: '15px', fontWeight: '600', color: '#0F172A', marginBottom: '20px' },
  fields: { display: 'flex', flexDirection: 'column', gap: '16px' },
  field: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontSize: '13px', fontWeight: '600', color: '#0F172A' },
  input: {
    border: '1px solid #E2E8F0',
    borderRadius: '8px',
    padding: '10px 12px',
    fontSize: '14px',
    color: '#0F172A',
    outline: 'none',
    width: '100%',
    background: '#FFFFFF',
  },
  calcRows: { display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 },
  calcRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  calcLabel: { fontSize: '13px', color: '#64748B' },
  calcValue: { fontSize: '14px', color: '#0F172A', fontWeight: '400' },
  divider: { borderTop: '1px solid #E2E8F0', margin: '4px 0' },
  disclaimer: {
    fontSize: '11px',
    color: '#94A3B8',
    lineHeight: '1.5',
    marginTop: '8px',
    borderTop: '1px solid #F1F5F9',
    paddingTop: '12px',
  },
  emptyCalc: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    padding: '24px 0',
  },
  emptyText: { fontSize: '13px', color: '#94A3B8', textAlign: 'center', lineHeight: '1.5' },
  generateBtn: {
    width: '100%',
    border: 'none',
    borderRadius: '6px',
    padding: '13px',
    fontSize: '14px',
    fontWeight: '600',
    transition: 'background 0.15s',
    marginTop: '8px',
  },
};
