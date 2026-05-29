import { useState } from 'react';
import Header from '../components/Header';
import { useApp } from '../context/AppContext';
import useWindowWidth from '../hooks/useWindowWidth';

const TABS = ['Products', 'Fee Schedules', 'Vendors'];

export default function FeeManagement() {
  const isMobile = useWindowWidth() < 768;
  const { products, setProducts, schedules, setSchedules, vendors, setVendors, changeLog, logChange } = useApp();
  const [activeTab, setActiveTab] = useState('Products');
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null);

  function openModal(type, id, value) {
    setModal({ type, id, value, oldValue: value });
  }

  function saveModal() {
    if (modal.type === 'product') {
      const product = products.find(x => x.id === modal.id);
      logChange({ tab: 'Products', field: product ? product.name + ' — Cost' : modal.id, oldValue: '$' + parseFloat(modal.oldValue).toFixed(2), newValue: '$' + parseFloat(modal.value).toFixed(2) });
      setProducts(p => p.map(x => x.id === modal.id ? { ...x, cost: parseFloat(modal.value) } : x));
    } else if (modal.type === 'schedule') {
      const schedule = schedules.find(x => x.id === modal.id);
      logChange({ tab: 'Fee Schedules', field: schedule ? schedule.payer + ' — Rate' : modal.id, oldValue: parseFloat(modal.oldValue).toFixed(2) + 'x', newValue: parseFloat(modal.value).toFixed(2) + 'x' });
      setSchedules(s => s.map(x => x.id === modal.id ? { ...x, multiplier: parseFloat(modal.value) } : x));
    } else if (modal.type === 'vendor') {
      const vendor = vendors.find(x => x.id === modal.id);
      logChange({ tab: 'Vendors', field: vendor ? vendor.name + ' — Status' : modal.id, oldValue: modal.oldValue, newValue: modal.value });
      setVendors(v => v.map(x => x.id === modal.id ? { ...x, status: modal.value } : x));
    }
    setModal(null);
  }

  const q = search.toLowerCase();

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(q) || p.id.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q)
  );
  const filteredSchedules = schedules.filter(s =>
    s.payer.toLowerCase().includes(q) || s.id.toLowerCase().includes(q)
  );
  const filteredVendors = vendors.filter(v =>
    v.name.toLowerCase().includes(q) || v.id.toLowerCase().includes(q)
  );

  return (
    <div style={styles.page}>
      <Header />

      {/* Page hero */}
      <div style={styles.hero}>
        <div style={{ ...styles.heroInner, padding: isMobile ? '24px 16px' : '36px 32px' }}>
          <div style={styles.heroText}>
            <h1 style={styles.title}>Edit Rates</h1>
            <p style={styles.subtitle}>Update product pricing, payer fee schedules, and vendor terms.</p>
          </div>
          {!isMobile && <HeroIllustration />}
        </div>
      </div>

      <main style={{ ...styles.main, padding: isMobile ? '24px 16px' : '32px' }}>
        {/* Search + tabs */}
        <div style={styles.toolbar}>
          <div style={styles.searchWrap}>
            <SearchIcon />
            <input
              type="text"
              placeholder="Search by name, ID or SKU..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={styles.search}
            />
          </div>
        </div>

        <div style={styles.tabs}>
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                ...styles.tab,
                color: activeTab === tab ? '#2563EB' : '#64748B',
                fontWeight: activeTab === tab ? '600' : '400',
                borderBottom: activeTab === tab ? '2px solid #2563EB' : '2px solid transparent',
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        <div style={{ ...styles.tableCard, overflowX: 'auto' }}>
          {activeTab === 'Products' && (
            <Table
              headers={['ID', 'Product', 'SKU', 'Category', 'Cost', '']}
              rows={filteredProducts.map((p, i) => ({
                cells: [
                  <span style={styles.idBadge}>{p.id}</span>,
                  p.name,
                  <span style={styles.mono}>{p.sku}</span>,
                  <span style={styles.categoryBadge}>{p.category}</span>,
                  <span style={styles.amount}>${p.cost.toFixed(2)}</span>,
                ],
                alt: i % 2 !== 0,
                onEdit: () => openModal('product', p.id, p.cost),
              }))}
            />
          )}
          {activeTab === 'Fee Schedules' && (
            <Table
              headers={['ID', 'Payer', 'Region', 'Effective Date', 'Rate', '']}
              rows={filteredSchedules.map((s, i) => ({
                cells: [
                  <span style={styles.idBadge}>{s.id}</span>,
                  s.payer,
                  s.region,
                  'Jan 1, 2026',
                  <span style={styles.amount}>{s.multiplier.toFixed(2)}x</span>,
                ],
                alt: i % 2 !== 0,
                onEdit: () => openModal('schedule', s.id, s.multiplier),
              }))}
            />
          )}
          {activeTab === 'Vendors' && (
            <Table
              headers={['ID', 'Vendor', 'Contact Email', 'Status', '']}
              rows={filteredVendors.map((v, i) => ({
                cells: [
                  <span style={styles.idBadge}>{v.id}</span>,
                  v.name,
                  <span style={styles.email}>{v.email}</span>,
                  <StatusBadge status={v.status} />,
                ],
                alt: i % 2 !== 0,
                onEdit: () => openModal('vendor', v.id, v.status),
              }))}
            />
          )}
        </div>

        <ChangeHistory entries={changeLog.filter(e => e.tab === activeTab).slice(0, 10)} />
      </main>

      {modal && (
        <EditModal
          modal={modal}
          onChange={val => setModal(m => ({ ...m, value: val }))}
          onSave={saveModal}
          onCancel={() => setModal(null)}
        />
      )}
    </div>
  );
}

function ChangeHistory({ entries }) {
  if (entries.length === 0) return null;
  return (
    <div style={styles.historyCard}>
      <h3 style={styles.historyTitle}>Change History</h3>
      <div style={{ overflowX: 'auto' }}>
        <table style={styles.table}>
          <thead>
            <tr style={{ background: '#F8FAFC' }}>
              {['Date / Time', 'User', 'Field', 'Old Value', 'New Value'].map(h => (
                <th key={h} style={styles.th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {entries.map((e, i) => {
              const date = new Date(e.timestamp).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
              return (
                <tr key={i} style={{ background: i % 2 !== 0 ? '#F8FAFC' : '#FFFFFF' }}>
                  <td style={{ ...styles.td, color: '#64748B', fontSize: '13px' }}>{date}</td>
                  <td style={styles.td}>{e.user}</td>
                  <td style={styles.td}>{e.field}</td>
                  <td style={{ ...styles.td, color: '#DC2626' }}>{e.oldValue}</td>
                  <td style={{ ...styles.td, color: '#16A34A', fontWeight: '600' }}>{e.newValue}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Table({ headers, rows }) {
  return (
    <table style={styles.table}>
      <thead>
        <tr style={{ background: '#F8FAFC' }}>
          {headers.map(h => (
            <th key={h} style={styles.th}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i} style={{ background: row.alt ? '#F8FAFC' : '#FFFFFF' }}>
            {row.cells.map((cell, j) => (
              <td key={j} style={styles.td}>{cell}</td>
            ))}
            <td style={{ ...styles.td, textAlign: 'right', paddingRight: '20px' }}>
              <EditButton onClick={row.onEdit} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function EditButton({ onClick }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      style={{
        ...styles.editBtn,
        borderColor: hovered ? '#2563EB' : '#E2E8F0',
        color: hovered ? '#2563EB' : '#0F172A',
      }}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      Edit
    </button>
  );
}

function StatusBadge({ status }) {
  const isActive = status === 'Active';
  return (
    <span style={{
      display: 'inline-block',
      padding: '3px 10px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: '600',
      background: isActive ? '#DCFCE7' : '#FEF9C3',
      color: isActive ? '#16A34A' : '#A16207',
    }}>
      {status}
    </span>
  );
}

function EditModal({ modal, onChange, onSave, onCancel }) {
  const isVendor = modal.type === 'vendor';
  const titles = { product: 'Edit Cost', schedule: 'Edit Rate', vendor: 'Edit Status' };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h3 style={styles.modalTitle}>{titles[modal.type]}</h3>
        <p style={styles.modalSub}>ID: <strong>{modal.id}</strong></p>
        {isVendor ? (
          <select value={modal.value} onChange={e => onChange(e.target.value)} style={styles.modalInput}>
            <option>Active</option>
            <option>Inactive</option>
            <option>Review</option>
          </select>
        ) : (
          <input
            type="number"
            step="0.01"
            value={modal.value}
            onChange={e => onChange(e.target.value)}
            style={styles.modalInput}
          />
        )}
        <div style={styles.modalActions}>
          <CancelButton onClick={onCancel} />
          <SaveButton onClick={onSave} />
        </div>
      </div>
    </div>
  );
}

function CancelButton({ onClick }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      style={{ ...styles.cancelBtn, background: hovered ? '#F1F5F9' : '#FFFFFF' }}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      Cancel
    </button>
  );
}

function SaveButton({ onClick }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      style={{ ...styles.saveBtn, background: hovered ? '#1D4ED8' : '#2563EB' }}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      Save changes
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
    <rect x="40" y="20" width="60" height="75" rx="6" fill="white" stroke="#BFDBFE" strokeWidth="1.5" />
    <rect x="52" y="34" width="36" height="5" rx="2.5" fill="#BFDBFE" />
    <rect x="52" y="44" width="26" height="4" rx="2" fill="#E2E8F0" />
    <rect x="52" y="56" width="36" height="1.2" rx="1" fill="#E2E8F0" />
    <rect x="52" y="63" width="36" height="1.2" rx="1" fill="#E2E8F0" />
    <rect x="52" y="70" width="36" height="1.2" rx="1" fill="#E2E8F0" />
    <rect x="52" y="77" width="24" height="1.2" rx="1" fill="#E2E8F0" />
    <circle cx="128" cy="62" r="20" fill="#2563EB" />
    <text x="128" y="70" textAnchor="middle" fill="white" fontSize="20" fontWeight="700" fontFamily="DM Sans,sans-serif">$</text>
    <circle cx="42" cy="28" r="5" fill="#BFDBFE" />
    <circle cx="158" cy="42" r="3" fill="#93C5FD" />
  </svg>
);

const styles = {
  page: { minHeight: '100vh', background: '#F8FAFC' },
  hero: {
    background: '#FFFFFF',
    borderBottom: '1px solid #E2E8F0',
  },
  heroInner: {
    maxWidth: '1100px',
    margin: '0 auto',
    padding: '36px 32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  heroText: { flex: 1 },
  title: { fontSize: '24px', fontWeight: '600', color: '#0F172A', marginBottom: '8px' },
  subtitle: { fontSize: '14px', color: '#64748B', maxWidth: '420px' },
  main: { maxWidth: '1100px', margin: '0 auto', padding: '32px' },
  toolbar: { marginBottom: '20px' },
  searchWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    border: '1px solid #E2E8F0',
    borderRadius: '8px',
    padding: '10px 14px',
    background: '#FFFFFF',
    width: '300px',
  },
  search: {
    border: 'none',
    outline: 'none',
    fontSize: '14px',
    color: '#0F172A',
    width: '100%',
    background: 'transparent',
  },
  tabs: {
    display: 'flex',
    borderBottom: '1px solid #E2E8F0',
    marginBottom: '24px',
  },
  tab: {
    background: 'none',
    border: 'none',
    borderBottom: '2px solid transparent',
    padding: '10px 20px',
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'color 0.15s',
    marginBottom: '-1px',
  },
  tableCard: {
    background: '#FFFFFF',
    border: '1px solid #E2E8F0',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 0 0 3px rgba(37,99,235,0.05)',
  },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: {
    textAlign: 'left',
    padding: '12px 16px',
    fontSize: '11px',
    fontWeight: '600',
    color: '#64748B',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    borderBottom: '1px solid #E2E8F0',
  },
  td: {
    padding: '14px 16px',
    fontSize: '14px',
    color: '#0F172A',
    borderBottom: '1px solid #E2E8F0',
    verticalAlign: 'middle',
  },
  idBadge: {
    fontFamily: 'monospace',
    fontSize: '12px',
    background: '#F1F5F9',
    color: '#475569',
    padding: '2px 7px',
    borderRadius: '4px',
  },
  mono: { fontFamily: 'monospace', fontSize: '13px', color: '#475569' },
  amount: { fontWeight: '600', color: '#0F172A' },
  email: { color: '#2563EB', fontSize: '13px' },
  categoryBadge: {
    display: 'inline-block',
    padding: '2px 10px',
    borderRadius: '20px',
    fontSize: '12px',
    background: '#EFF6FF',
    color: '#2563EB',
    fontWeight: '600',
  },
  editBtn: {
    background: '#FFFFFF',
    border: '1px solid #E2E8F0',
    borderRadius: '6px',
    padding: '6px 14px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'border-color 0.15s, color 0.15s',
  },
  overlay: {
    position: 'fixed', inset: 0,
    background: 'rgba(15,23,42,0.35)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 200,
  },
  modal: {
    background: '#FFFFFF',
    border: '1px solid #E2E8F0',
    borderRadius: '12px',
    padding: '32px',
    width: '340px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    boxShadow: '0 0 0 4px rgba(37,99,235,0.08)',
  },
  modalTitle: { fontSize: '16px', fontWeight: '600', color: '#0F172A' },
  modalSub: { fontSize: '13px', color: '#64748B', marginTop: '-8px' },
  modalInput: {
    border: '1px solid #E2E8F0',
    borderRadius: '8px',
    padding: '10px 12px',
    fontSize: '14px',
    color: '#0F172A',
    outline: 'none',
    width: '100%',
  },
  modalActions: { display: 'flex', gap: '8px', justifyContent: 'flex-end' },
  cancelBtn: {
    border: '1px solid #E2E8F0',
    borderRadius: '6px',
    padding: '8px 16px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#0F172A',
    cursor: 'pointer',
    transition: 'background 0.15s',
  },
  historyCard: {
    marginTop: '32px',
    background: '#FFFFFF',
    border: '1px solid #E2E8F0',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 0 0 3px rgba(37,99,235,0.05)',
  },
  historyTitle: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#64748B',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    padding: '14px 16px',
    borderBottom: '1px solid #E2E8F0',
    margin: 0,
  },
  saveBtn: {
    background: '#2563EB',
    border: 'none',
    borderRadius: '6px',
    padding: '8px 18px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#FFFFFF',
    cursor: 'pointer',
    transition: 'background 0.15s',
  },
};
