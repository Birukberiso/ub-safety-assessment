import React from 'react';
import UB_LOGO from './ub_logo_b64';
import TPM_LOGO from './tpm_logo_b64';

const styles = {
  header: {
    background: '#0D4A0D',
    padding: '0.65rem 1.5rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    borderBottom: '3px solid #F5A623',
  },
  logos: { display: 'flex', alignItems: 'center', gap: 12 },
  ubLogo: { height: 38, objectFit: 'contain' },
  divider: { width: 1, height: 34, background: 'rgba(255,255,255,0.2)' },
  tpmLogo: { height: 42, objectFit: 'contain', borderRadius: '50%' },
  right: { display: 'flex', alignItems: 'center', gap: 10 },
  title: { color: '#fff', fontSize: 13, fontWeight: 600, letterSpacing: '0.4px' },
  badge: {
    background: '#F5A623', color: '#4A2800',
    borderRadius: 20, padding: '3px 12px',
    fontSize: 11, fontWeight: 700, letterSpacing: 1,
  },
};

export default function Header({ label = 'SAFETY ASSESSMENT' }) {
  return (
    <header style={styles.header}>
      <div style={styles.logos}>
        <img src={UB_LOGO} alt="United Beverages" style={styles.ubLogo} />
        <div style={styles.divider} />
        <img src={TPM_LOGO} alt="TPM United" style={styles.tpmLogo} />
      </div>
      <div style={styles.right}>
        <span style={styles.title}>United Beverages</span>
        <span style={styles.badge}>{label}</span>
      </div>
    </header>
  );
}
