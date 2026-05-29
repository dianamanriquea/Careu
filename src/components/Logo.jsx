export default function Logo({ size = 'md' }) {
  const scale = size === 'lg' ? 1.6 : 1;
  const iconSize = 32 * scale;
  const fontSize = 22 * scale;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 * scale }}>
      <svg width={iconSize} height={iconSize} viewBox="0 0 32 32" fill="none">
        {/* Top arc */}
        <path
          d="M6.5 10 A11 11 0 0 1 25.5 10"
          stroke="#0F172A"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
        {/* Bottom arc */}
        <path
          d="M6.5 22 A11 11 0 0 0 25.5 22"
          stroke="#0F172A"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
        {/* Horizontal line */}
        <line x1="7" y1="16" x2="25" y2="16" stroke="#2563EB" strokeWidth="2.5" strokeLinecap="round" />
        {/* Left dot */}
        <circle cx="7" cy="16" r="3" fill="#2563EB" />
        {/* Right dot */}
        <circle cx="25" cy="16" r="3" fill="#2563EB" />
      </svg>

      <span style={{ fontSize, fontWeight: '600', letterSpacing: '-0.5px', lineHeight: 1 }}>
        <span style={{ color: '#0F172A' }}>Care</span>
        <span style={{ color: '#2563EB' }}>U</span>
      </span>
    </div>
  );
}
