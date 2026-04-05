import { useState } from 'react';

export default function Journal({ virtue }) {
  const [wentWell, setWentWell] = useState('');
  const [improve, setImprove] = useState('');
  const [notes, setNotes] = useState('');
  const [dailyDone, setDailyDone] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    // TODO: Save to Supabase
    console.log('Journal saved:', { wentWell, improve, notes, dailyDone });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="journal">
      <h2 className="journal-title">Evening Reflection</h2>
      <p className="journal-prompt">{virtue.reflection}</p>

      <label className="form-label">What went well today?</label>
      <textarea value={wentWell} onChange={e => setWentWell(e.target.value)} className="form-textarea" rows={3} />

      <label className="form-label">What could I improve?</label>
      <textarea value={improve} onChange={e => setImprove(e.target.value)} className="form-textarea" rows={3} />

      <label className="form-label">Notes & observations</label>
      <textarea value={notes} onChange={e => setNotes(e.target.value)} className="form-textarea" rows={3} />

      <div className="journal-challenge-check">
        <input type="checkbox" checked={dailyDone} onChange={e => setDailyDone(e.target.checked)} id="dc" />
        <label htmlFor="dc">
          Completed daily challenge <span className="xp-badge">+{virtue.challenge.dxp} XP</span>
        </label>
      </div>

      <button onClick={handleSave} className="btn-primary">
        {saved ? '✓ Saved' : 'Save Reflection'}
      </button>
    </div>
  );
}
