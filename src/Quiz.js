import React, { useState, useEffect, useCallback } from 'react';
import { QUESTIONS, SECTIONS, LETTERS, TOTAL_SECONDS } from './data';

function shuffle(arr) { return [...arr].sort(() => Math.random() - 0.5); }

export default function Quiz({ name, onFinish }) {
  const [order] = useState(() => shuffle([...Array(QUESTIONS.length).keys()]));
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState(Array(QUESTIONS.length).fill(null));
  const [chosen, setChosen] = useState(null);
  const [timer, setTimer] = useState(TOTAL_SECONDS);
  const [startTs] = useState(Date.now());

  const finish = useCallback(() => {
    const elapsed = Math.floor((Date.now() - startTs) / 1000);
    onFinish({ order, answers, elapsed });
  }, [order, answers, onFinish, startTs]);

  useEffect(() => {
    const t = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) { clearInterval(t); finish(); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [finish]);

  const qi = order[idx];
  const q = QUESTIONS[qi];
  const sec = SECTIONS[q.s];
  const pct = Math.round((idx / QUESTIONS.length) * 100);
  const m = Math.floor(timer / 60);
  const ss = timer % 60;
  const isWarn = timer <= 300;
  const isAnswered = chosen !== null;

  function pick(i) {
    if (isAnswered) return;
    setChosen(i);
    const newAnswers = [...answers];
    newAnswers[qi] = i;
    setAnswers(newAnswers);
  }

  function next() {
    if (idx < QUESTIONS.length - 1) {
      setIdx(idx + 1);
      setChosen(null);
    } else {
      const elapsed = Math.floor((Date.now() - startTs) / 1000);
      onFinish({ order, answers: answers.map((a, i) => i === qi ? chosen : a), elapsed });
    }
  }

  const s = {
    wrap: { maxWidth: 680, margin: '0 auto', padding: '1.25rem 1rem' },
    topRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' },
    qBadge: {
      background: '#0D4A0D', color: '#fff', borderRadius: 8,
      padding: '5px 14px', fontSize: 13, fontWeight: 700,
    },
    timer: {
      display: 'flex', alignItems: 'center', gap: 6,
      background: isWarn ? '#FDECEA' : '#fff',
      border: `1.5px solid ${isWarn ? '#C0392B' : '#C8DCC8'}`,
      borderRadius: 8, padding: '5px 12px',
      fontSize: 14, fontWeight: 700,
      color: isWarn ? '#C0392B' : '#0D4A0D',
    },
    progress: { marginBottom: '1rem' },
    track: { height: 6, background: '#D1E0D1', borderRadius: 3, overflow: 'hidden', marginBottom: 4 },
    fill: { height: '100%', background: '#1A6B1A', borderRadius: 3, width: `${pct}%`, transition: 'width 0.4s' },
    pLabel: { fontSize: 11, color: '#94A3B8' },
    secTag: {
      display: 'inline-flex', alignItems: 'center', gap: 6,
      background: '#E8F5E8', border: '1px solid #C8DCC8',
      borderRadius: 20, padding: '4px 12px', fontSize: 11,
      fontWeight: 600, color: '#1A6B1A', marginBottom: '0.9rem',
    },
    qCard: {
      background: '#fff', border: '1.5px solid #C8DCC8',
      borderRadius: 12, padding: '1.25rem', marginBottom: '0.9rem',
      boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
    },
    qText: { fontSize: 17, fontWeight: 600, color: '#0D4A0D', lineHeight: 1.55 },
    grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: '0.9rem' },
    optBase: {
      background: '#fff', border: '1.5px solid #D1E0D1',
      borderRadius: 12, padding: '0.85rem 1rem',
      textAlign: 'left', display: 'flex', alignItems: 'flex-start',
      gap: 10, fontSize: 13, color: '#1E293B', lineHeight: 1.45,
      transition: 'all 0.15s', cursor: 'pointer',
    },
    letter: {
      width: 28, height: 28, borderRadius: '50%', background: '#0D4A0D',
      color: '#fff', fontSize: 11, fontWeight: 700,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0, marginTop: 1,
    },
    explain: {
      background: '#EAF7EE', border: '1px solid rgba(27,107,58,0.3)',
      borderRadius: 8, padding: '0.8rem 1rem',
      fontSize: 13, color: '#1B6B3A', lineHeight: 1.55,
      marginBottom: '0.9rem',
    },
    nextBtn: {
      background: '#1A6B1A', color: '#fff', border: 'none',
      borderRadius: 8, padding: '0.65rem 1.6rem',
      fontSize: 14, fontWeight: 600, float: 'right',
      display: isAnswered ? 'inline-block' : 'none',
    },
  };

  function optStyle(i) {
    if (!isAnswered) return { ...s.optBase };
    if (i === q.a) return { ...s.optBase, borderColor: '#1B6B3A', background: 'rgba(27,107,58,0.07)', cursor: 'default' };
    if (i === chosen && i !== q.a) return { ...s.optBase, borderColor: '#C0392B', background: 'rgba(192,57,43,0.07)', cursor: 'default' };
    return { ...s.optBase, opacity: 0.45, cursor: 'default' };
  }

  function letterStyle(i) {
    if (!isAnswered) return s.letter;
    if (i === q.a) return { ...s.letter, background: '#1B6B3A' };
    if (i === chosen && i !== q.a) return { ...s.letter, background: '#C0392B' };
    return s.letter;
  }

  return (
    <div style={s.wrap} className="fade-up">
      <div style={s.topRow}>
        <div style={s.qBadge}>Q{String(idx + 1).padStart(2, '0')} / {QUESTIONS.length}</div>
        <div style={s.timer}>
          ⏱ {m}:{ss < 10 ? '0' : ''}{ss}
        </div>
      </div>

      <div style={s.progress}>
        <div style={s.track}><div style={s.fill} /></div>
        <div style={s.pLabel}>{idx} of {QUESTIONS.length} answered</div>
      </div>

      <div style={s.secTag}>{sec.icon} {sec.name}</div>

      <div style={s.qCard}>
        <div style={s.qText}>{q.q}</div>
      </div>

      <div style={s.grid}>
        {q.o.map((opt, i) => (
          <button key={i} style={optStyle(i)} onClick={() => pick(i)} disabled={isAnswered}>
            <span style={letterStyle(i)}>{isAnswered && i === q.a ? '✓' : isAnswered && i === chosen && i !== q.a ? '✗' : LETTERS[i]}</span>
            <span>{opt}</span>
          </button>
        ))}
      </div>

      {isAnswered && (
        <div style={s.explain}>
          <strong>💡 Explanation:</strong> {q.e}
        </div>
      )}

      <button style={s.nextBtn} onClick={next}>
        {idx < QUESTIONS.length - 1 ? 'Next question →' : 'See results →'}
      </button>
      <div style={{ clear: 'both' }} />
    </div>
  );
}
