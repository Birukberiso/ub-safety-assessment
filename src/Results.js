import React, { useState, useEffect, useRef } from 'react';
import UB_LOGO from './ub_logo_b64';
import TPM_LOGO from './tpm_logo_b64';
import { QUESTIONS, SECTIONS, LETTERS, SUPERVISOR_PIN, PASS_MARK, SHEETS_URL } from './data';

function calcResults(order, answers) {
  let correct = 0;
  QUESTIONS.forEach((q, i) => { if (answers[i] === q.a) correct++; });
  const pct = Math.round((correct / QUESTIONS.length) * 100);
  const passed = pct >= PASS_MARK;
  const secScores = SECTIONS.map((_, si) => {
    const qs = QUESTIONS.filter(q => q.s === si);
    const got = qs.filter(q => answers[QUESTIONS.indexOf(q)] === q.a).length;
    return { got, total: qs.length };
  });
  return { correct, pct, passed, secScores };
}

function ScoreRing({ pct, passed }) {
  const r = 55, circ = 2 * Math.PI * r;
  const offset = circ - (circ * pct / 100);
  return (
    <svg width="130" height="130" viewBox="0 0 130 130" style={{ transform: 'rotate(-90deg)' }}>
      <circle cx="65" cy="65" r={r} fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="10" />
      <circle cx="65" cy="65" r={r} fill="none"
        stroke={passed ? '#F5A623' : '#FF6B6B'} strokeWidth="10" strokeLinecap="round"
        strokeDasharray={circ} strokeDashoffset={offset}
        style={{ transition: 'stroke-dashoffset 1.2s ease' }}
      />
    </svg>
  );
}

export default function Results({ name, order, answers, elapsed, onReset }) {
  const { correct, pct, passed, secScores } = calcResults(order, answers);
  const [pinOpen, setPinOpen] = useState(false);
  const [pinVal, setPinVal] = useState('');
  const [pinErr, setPinErr] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [syncStatus, setSyncStatus] = useState('saving'); // saving | saved | error
  const pinRef = useRef(null);
  const certRef = useRef(null);

  const em = Math.floor(elapsed / 60), es = elapsed % 60;
  const timeStr = `${em}m ${es < 10 ? '0' : ''}${es}s`;
  const today = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

  useEffect(() => {
    setSyncStatus('saving');
    const payload = {
      timestamp: new Date().toLocaleString('en-GB'),
      name, score: pct + '%', result: passed ? 'PASSED' : 'FAILED',
      correct, wrong: QUESTIONS.length - correct, timeTaken: timeStr,
      sec0: `${secScores[0].got}/${secScores[0].total}`,
      sec1: `${secScores[1].got}/${secScores[1].total}`,
      sec2: `${secScores[2].got}/${secScores[2].total}`,
      sec3: `${secScores[3].got}/${secScores[3].total}`,
      sec4: `${secScores[4].got}/${secScores[4].total}`,
      sec5: `${secScores[5].got}/${secScores[5].total}`,
      sec6: `${secScores[6].got}/${secScores[6].total}`,
    };
    // Google Apps Script requires form-encoded body to avoid CORS preflight issues
    const formBody = 'payload=' + encodeURIComponent(JSON.stringify(payload));
    fetch(SHEETS_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formBody,
    })
      .then(() => setSyncStatus('saved'))
      .catch(() => setSyncStatus('error'));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function openPin() { setPinOpen(true); setPinVal(''); setPinErr(''); setTimeout(() => pinRef.current?.focus(), 100); }
  function closePin() { setPinOpen(false); }
  function confirmPin() {
    if (pinVal === SUPERVISOR_PIN) { closePin(); setUnlocked(true); }
    else { setPinErr('Incorrect PIN. Please try again.'); setPinVal(''); pinRef.current?.focus(); }
  }

  function printCert() {
    window.print();
  }

  const syncColors = { saving: '#B07D10', saved: '#1B6B3A', error: '#C0392B' };
  const syncText = { saving: '⏳ Saving result to HR records...', saved: '✅ Result saved to HR records', error: '⚠️ Could not save — check internet connection' };

  const s = {
    wrap: { maxWidth: 680, margin: '0 auto', padding: '1.25rem 1rem' },
    hero: {
      background: 'linear-gradient(135deg, #0D4A0D 0%, #1A6B1A 100%)',
      borderRadius: 16, padding: '1.75rem 1.5rem', textAlign: 'center',
      marginBottom: '1.25rem', color: '#fff',
    },
    ringWrap: { width: 130, height: 130, margin: '0 auto 1rem', position: 'relative' },
    ringCenter: { position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', textAlign: 'center' },
    pct: { fontSize: 30, fontWeight: 800, color: '#fff' },
    pctLbl: { fontSize: 10, opacity: 0.7 },
    verdict: { fontSize: 20, fontWeight: 700, marginBottom: 4, color: passed ? '#fff' : '#FFB3B3' },
    verdictSub: { fontSize: 13, opacity: 0.8 },
    rName: { fontSize: 13, opacity: 0.7, marginBottom: 8 },
    statsRow: { display: 'flex', gap: 10, marginBottom: '1.25rem' },
    statCard: {
      flex: 1, background: '#fff', border: '1px solid #C8DCC8',
      borderRadius: 10, padding: '0.9rem 0.75rem', textAlign: 'center',
      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    },
    statV: { fontSize: 24, fontWeight: 700, display: 'block' },
    statL: { fontSize: 11, color: '#64748B', marginTop: 2 },
    sync: {
      textAlign: 'center', marginBottom: '1rem',
      padding: '0.5rem 1rem', background: syncStatus === 'saved' ? '#EAF7EE' : syncStatus === 'error' ? '#FDECEA' : '#FFF8E0',
      border: `1px solid ${syncStatus === 'saved' ? 'rgba(27,107,58,0.3)' : syncStatus === 'error' ? 'rgba(192,57,43,0.3)' : '#E0C060'}`,
      borderRadius: 8, fontSize: 13, fontWeight: 600,
      color: syncColors[syncStatus],
    },
    pinBar: {
      background: '#FFF8E0', border: '1px solid #E0C060',
      borderRadius: 8, padding: '0.65rem 1rem',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      marginBottom: '1rem', fontSize: 12, color: '#7A5800',
    },
    unlockBtn: {
      background: '#F5A623', border: 'none', borderRadius: 6,
      padding: '4px 14px', fontSize: 12, fontWeight: 700,
      color: '#4A2800', cursor: 'pointer',
    },
    card: {
      background: '#fff', border: '1px solid #C8DCC8', borderRadius: 12,
      padding: '1.25rem', marginBottom: '1rem',
      boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
    },
    cardTitle: { fontSize: 14, fontWeight: 600, color: '#0D4A0D', marginBottom: '0.75rem' },
    sbRow: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 },
    sbName: { width: 200, fontSize: 12, color: '#475569', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
    sbTrack: { flex: 1, height: 6, background: '#D1E0D1', borderRadius: 3, overflow: 'hidden' },
    sbScore: { width: 36, textAlign: 'right', fontSize: 12, fontWeight: 600, color: '#0D4A0D' },
    riItem: {
      background: '#fff', border: '1px solid #E8F0E8', borderRadius: 8,
      padding: '0.8rem 1rem', marginBottom: 8,
      display: 'flex', gap: 10, alignItems: 'flex-start',
    },
    riIcon: (ok) => ({
      width: 24, height: 24, borderRadius: '50%', flexShrink: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 13, fontWeight: 700,
      background: ok ? 'rgba(27,107,58,0.15)' : 'rgba(192,57,43,0.12)',
      color: ok ? '#1B6B3A' : '#C0392B',
    }),
    btns: { display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center', marginTop: '1.5rem' },
    btnOutline: {
      background: '#fff', border: '1.5px solid #C8DCC8', borderRadius: 8,
      padding: '0.65rem 1.4rem', fontSize: 13, cursor: 'pointer', color: '#1E293B',
      fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: 6,
    },
    btnGreen: {
      background: '#1A6B1A', border: 'none', borderRadius: 8,
      padding: '0.65rem 1.4rem', fontSize: 13, cursor: 'pointer', color: '#fff',
      fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 6,
    },
    // PIN overlay
    overlay: {
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 200,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    },
    pinBox: {
      background: '#fff', borderRadius: 12, padding: '2rem 1.75rem',
      maxWidth: 340, width: '90%', textAlign: 'center',
      boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
    },
    pinLogo: { height: 36, marginBottom: '1rem' },
    pinTitle: { fontSize: 18, fontWeight: 700, color: '#0D4A0D', marginBottom: 4 },
    pinSub: { fontSize: 13, color: '#64748B', marginBottom: '1.25rem' },
    pinInput: {
      width: '100%', padding: '0.75rem', border: '1.5px solid #C8DCC8',
      borderRadius: 8, fontSize: 22, textAlign: 'center', letterSpacing: 8,
      fontWeight: 700, color: '#0D4A0D', marginBottom: '0.75rem', outline: 'none',
    },
    pinErr: { color: '#C0392B', fontSize: 12, marginBottom: '0.75rem', minHeight: 16 },
    pinBtns: { display: 'flex', gap: 8 },
    // Certificate (print)
    cert: {
      background: '#fff', border: '8px solid #1A6B1A',
      borderRadius: 12, padding: '2.5rem 2rem',
      maxWidth: 680, margin: '0 auto', textAlign: 'center',
      position: 'relative',
    },
  };

  return (
    <div style={s.wrap} className="fade-up">
      {/* PIN Modal */}
      {pinOpen && (
        <div style={s.overlay}>
          <div style={s.pinBox}>
            <img src={UB_LOGO} alt="UB" style={s.pinLogo} />
            <div style={s.pinTitle}>Supervisor Access</div>
            <div style={s.pinSub}>Enter your 4-digit PIN to unlock the full results view</div>
            <input
              ref={pinRef}
              style={s.pinInput}
              type="password"
              maxLength={4}
              placeholder="••••"
              inputMode="numeric"
              value={pinVal}
              onChange={e => setPinVal(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') confirmPin(); }}
            />
            <div style={s.pinErr}>{pinErr}</div>
            <div style={s.pinBtns}>
              <button style={{ ...s.btnOutline, flex: 1 }} onClick={closePin}>Cancel</button>
              <button style={{ ...s.btnGreen, flex: 1, justifyContent: 'center' }} onClick={confirmPin}>Unlock</button>
            </div>
          </div>
        </div>
      )}

      {/* Certificate (print only) */}
      {passed && (
        <div className="print-only" ref={certRef}>
          <div style={s.cert}>
            <div style={{ position: 'absolute', inset: 10, border: '2px solid #F5A623', borderRadius: 8, pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%) rotate(-30deg)', fontSize: 80, fontWeight: 900, color: 'rgba(26,107,26,0.04)', whiteSpace: 'nowrap', pointerEvents: 'none' }}>CERTIFIED</div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20, marginBottom: '1.25rem' }}>
              <img src={UB_LOGO} alt="UB" style={{ height: 50 }} />
              <div style={{ width: 1, height: 44, background: '#D1E0D1' }} />
              <img src={TPM_LOGO} alt="TPM" style={{ height: 56, borderRadius: '50%' }} />
            </div>
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 3, color: '#1A6B1A', textTransform: 'uppercase', marginBottom: 6 }}>Certificate of Completion</div>
            <div style={{ fontSize: 26, fontWeight: 800, color: '#0D4A0D', marginBottom: 4 }}>Safety Induction Assessment</div>
            <div style={{ fontSize: 14, color: '#64748B', marginBottom: '1rem' }}>This certifies that</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: '#1A6B1A', borderBottom: '2px solid #F5A623', display: 'inline-block', paddingBottom: 4, marginBottom: '1rem' }}>{name}</div>
            <div style={{ fontSize: 14, color: '#64748B', lineHeight: 1.7, maxWidth: 440, margin: '0 auto 1rem' }}>
              has successfully completed the United Beverages Share Company Safety Induction Assessment and has demonstrated sufficient knowledge of the 7 Golden Safety Rules.
            </div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12, background: '#E8F5E8', border: '1.5px solid #C8DCC8', borderRadius: 8, padding: '0.65rem 1.5rem', marginBottom: '1rem' }}>
              <span style={{ fontSize: 26, fontWeight: 800, color: '#1A6B1A' }}>{pct}%</span>
              <div style={{ fontSize: 12, color: '#64748B', textAlign: 'left', lineHeight: 1.3 }}>Final score<br /><span style={{ color: '#1B6B3A', fontWeight: 700 }}>PASSED</span></div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #D1E0D1', fontSize: 12, color: '#64748B' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ width: 120, height: 1, background: '#D1E0D1', margin: '0 auto 4px' }} />
                <div style={{ fontWeight: 600, color: '#0D4A0D' }}>Safety Officer</div>
                <div>United Beverages S.C.</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div>{today}</div>
                <div>Valid for this visit only</div>
                <div style={{ fontWeight: 600, color: '#1A6B1A', marginTop: 4 }}>Safety Starts With You</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ width: 120, height: 1, background: '#D1E0D1', margin: '0 auto 4px' }} />
                <div style={{ fontWeight: 600, color: '#0D4A0D' }}>TPM United</div>
                <div>Driving Excellence</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Result Hero */}
      <div style={s.hero} className="no-print">
        {name && <div style={s.rName}>Result for: {name}</div>}
        <div style={s.ringWrap}>
          <ScoreRing pct={pct} passed={passed} />
          <div style={s.ringCenter}>
            <div style={s.pct}>{pct}%</div>
            <div style={s.pctLbl}>score</div>
          </div>
        </div>
        <div style={s.verdict}>{passed ? '✅ Assessment Passed' : '❌ Assessment Not Passed'}</div>
        <div style={s.verdictSub}>
          {passed
            ? 'You may proceed — please collect your visitor badge from reception.'
            : 'Please review the safety materials and speak with your host before re-attempting.'}
        </div>
      </div>

      {/* Stats */}
      <div style={s.statsRow} className="no-print">
        <div style={s.statCard}><span style={{ ...s.statV, color: '#1B6B3A' }}>{correct}</span><span style={s.statL}>Correct</span></div>
        <div style={s.statCard}><span style={{ ...s.statV, color: '#C0392B' }}>{QUESTIONS.length - correct}</span><span style={s.statL}>Incorrect</span></div>
        <div style={s.statCard}><span style={{ ...s.statV, color: '#1A6B1A' }}>{timeStr}</span><span style={s.statL}>Time Taken</span></div>
      </div>

      {/* Sync status */}
      <div style={s.sync} className="no-print">{syncText[syncStatus]}</div>

      {/* PIN bar or supervisor section */}
      {!unlocked ? (
        <div style={s.pinBar} className="no-print">
          🔒 Detailed breakdown and review are supervisor-protected.
          <button style={s.unlockBtn} onClick={openPin}>Unlock ▶</button>
        </div>
      ) : (
        <div className="no-print">
          {/* Section breakdown */}
          <div style={s.card}>
            <div style={s.cardTitle}>Performance by section</div>
            {SECTIONS.map((sec, si) => {
              const { got, total } = secScores[si];
              const p = total > 0 ? Math.round(got / total * 100) : 0;
              const col = p >= 75 ? '#1B6B3A' : p >= 50 ? '#B07D10' : '#C0392B';
              return (
                <div key={si} style={s.sbRow}>
                  <div style={s.sbName}>{sec.icon} {sec.name}</div>
                  <div style={s.sbTrack}><div style={{ height: '100%', borderRadius: 3, background: col, width: `${p}%` }} /></div>
                  <div style={s.sbScore}>{got}/{total}</div>
                </div>
              );
            })}
          </div>

          {/* Question review */}
          <div style={s.card}>
            <div style={s.cardTitle}>Full question review</div>
            {QUESTIONS.map((q, i) => {
              const ua = answers[i];
              const ok = ua === q.a;
              return (
                <div key={i} style={s.riItem}>
                  <div style={s.riIcon(ok)}>{ok ? '✓' : '✗'}</div>
                  <div>
                    <div style={{ fontSize: 12, color: '#1E293B', lineHeight: 1.4 }}>Q{i + 1}. {q.q}</div>
                    <div style={{ fontSize: 11, color: '#64748B', marginTop: 3 }}>
                      {!ok && ua != null && <span>Your answer: {LETTERS[ua]}. {q.o[ua]} · </span>}
                      <span style={{ color: '#1B6B3A', fontWeight: 600 }}>Correct: {LETTERS[q.a]}. {q.o[q.a]}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div style={s.btns} className="no-print">
        <button style={s.btnOutline} onClick={onReset}>🔄 New attempt</button>
        {passed && <button style={s.btnGreen} onClick={printCert}>🏆 Print certificate</button>}
        <button style={s.btnOutline} onClick={() => window.print()}>🖨️ Print results</button>
      </div>
    </div>
  );
}
