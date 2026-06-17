import React, { useState } from 'react';
import UB_LOGO from './ub_logo_b64';
import TPM_LOGO from './tpm_logo_b64';
import { SECTIONS, QUESTIONS } from './data';

export default function Welcome({ onStart }) {
  const [name, setName] = useState('');

  const s = {
    wrap: { maxWidth: 680, margin: '0 auto', padding: '1.5rem 1rem' },
    hero: {
      background: 'linear-gradient(135deg, #0D4A0D 0%, #1A6B1A 100%)',
      borderRadius: 16, padding: '2rem 1.5rem 1.75rem',
      textAlign: 'center', marginBottom: '1.25rem',
      position: 'relative', overflow: 'hidden',
    },
    heroCircle: {
      position: 'absolute', right: -40, top: -40,
      width: 180, height: 180, borderRadius: '50%',
      background: 'rgba(255,255,255,0.04)',
    },
    logos: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, marginBottom: '1.25rem' },
    ubLogo: { height: 50, objectFit: 'contain', filter: 'brightness(0) invert(1)', opacity: 0.9 },
    divider: { width: 1, height: 44, background: 'rgba(255,255,255,0.2)' },
    tpmLogo: { height: 54, objectFit: 'contain', borderRadius: '50%' },
    heroTitle: { fontSize: 26, fontWeight: 700, color: '#fff', marginBottom: 6 },
    heroSub: { fontSize: 14, color: 'rgba(255,255,255,0.75)', lineHeight: 1.6 },
    card: {
      background: '#fff', border: '1px solid #C8DCC8',
      borderRadius: 12, padding: '1.25rem 1.25rem 1rem',
      marginBottom: '1rem', boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
    },
    metaRow: { display: 'flex', gap: 10, marginBottom: '1.25rem' },
    metaCard: {
      flex: 1, background: '#fff', border: '1px solid #C8DCC8',
      borderRadius: 10, padding: '0.9rem 0.75rem', textAlign: 'center',
      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    },
    metaVal: { fontSize: 24, fontWeight: 700, color: '#1A6B1A', display: 'block' },
    metaLbl: { fontSize: 11, color: '#64748B', marginTop: 2 },
    label: { display: 'block', fontSize: 13, fontWeight: 600, color: '#0D4A0D', marginBottom: 6 },
    input: {
      width: '100%', padding: '0.7rem 1rem',
      border: '1.5px solid #C8DCC8', borderRadius: 8,
      fontSize: 14, color: '#1E293B', outline: 'none',
      transition: 'border 0.15s',
    },
    sectionTitle: { fontSize: 13, fontWeight: 600, color: '#0D4A0D', marginBottom: 8 },
    pills: { display: 'flex', flexWrap: 'wrap', gap: 7 },
    pill: {
      background: '#E8F5E8', border: '1px solid #C8DCC8',
      borderRadius: 20, padding: '4px 12px', fontSize: 12,
      color: '#1A6B1A', fontWeight: 500,
    },
    btn: {
      width: '100%', background: '#1A6B1A', color: '#fff',
      border: 'none', borderRadius: 8, padding: '0.9rem',
      fontSize: 16, fontWeight: 700, letterSpacing: '0.5px',
      transition: 'background 0.15s', marginTop: 4,
    },
    footer: { textAlign: 'center', fontSize: 11, color: '#94A3B8', marginTop: '1rem' },
  };

  return (
    <div style={s.wrap} className="fade-up">
      <div style={s.hero}>
        <div style={s.heroCircle} />
        <div style={s.logos}>
          <img src={UB_LOGO} alt="United Beverages" style={s.ubLogo} />
          <div style={s.divider} />
          <img src={TPM_LOGO} alt="TPM United" style={s.tpmLogo} />
        </div>
        <div style={s.heroTitle}>Safety Induction Assessment</div>
        <div style={s.heroSub}>
          Please complete this assessment before entering the facility.<br />
          All questions are based on our 7 Golden Safety Rules.
        </div>
      </div>

      <div style={s.metaRow}>
        {[['24','Questions'],['20 min','Time Limit'],['75%','Pass Mark'],['7','Safety Topics']].map(([v,l]) => (
          <div key={l} style={s.metaCard}>
            <span style={s.metaVal}>{v}</span>
            <span style={s.metaLbl}>{l}</span>
          </div>
        ))}
      </div>

      <div style={s.card}>
        <div style={{ marginBottom: '1rem' }}>
          <label style={s.label} htmlFor="nameInput">Your full name</label>
          <input
            id="nameInput"
            style={s.input}
            type="text"
            placeholder="Enter your name before starting..."
            maxLength={60}
            value={name}
            onChange={e => setName(e.target.value)}
            onFocus={e => { e.target.style.borderColor = '#1A6B1A'; }}
            onBlur={e => { e.target.style.borderColor = '#C8DCC8'; }}
          />
        </div>
        <div>
          <div style={s.sectionTitle}>Topics covered in this assessment:</div>
          <div style={s.pills}>
            {SECTIONS.map(sec => (
              <span key={sec.id} style={s.pill}>{sec.icon} {sec.name}</span>
            ))}
          </div>
        </div>
      </div>

      <button
        style={s.btn}
        onMouseEnter={e => { e.target.style.background = '#0D4A0D'; }}
        onMouseLeave={e => { e.target.style.background = '#1A6B1A'; }}
        onClick={() => onStart(name.trim() || 'Visitor')}
      >
        ▶ Begin Safety Assessment
      </button>

      <div style={s.footer}>
        United Beverages Share Company · {QUESTIONS.length} questions · Powered by TPM United
      </div>
    </div>
  );
}
