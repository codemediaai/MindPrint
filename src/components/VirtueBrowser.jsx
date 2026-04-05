import { useState } from 'react';
import VIRTUES from '../data/virtues';
import { SEASONS, getSeason } from '../lib/helpers';

export default function VirtueBrowser({ currentWeek }) {
  const [selected, setSelected] = useState(currentWeek - 1);
  const v = VIRTUES[selected];
  const activeSeason = getSeason(v.week);

  return (
    <div className="virtues">
      <h2 className="virtues-title">52 Virtues</h2>

      {/* Season tabs */}
      <div className="virtues-seasons">
        {Object.entries(SEASONS).map(([key, s]) => {
          const isActive = activeSeason.key === key;
          return (
            <button
              key={key}
              onClick={() => setSelected(s.weeks[0] - 1)}
              className={`virtues-season-tab ${isActive ? 'active' : ''}`}
            >
              {s.name.toUpperCase()}
            </button>
          );
        })}
      </div>

      {/* Week grid */}
      <div className="virtues-grid">
        {VIRTUES.filter(vv => getSeason(vv.week).key === activeSeason.key).map(vv => (
          <button
            key={vv.week}
            onClick={() => setSelected(vv.week - 1)}
            className={`virtues-week-btn ${vv.week === v.week ? 'selected' : ''} ${vv.week === currentWeek ? 'current' : ''}`}
          >
            {vv.week}
          </button>
        ))}
      </div>

      {/* Virtue detail */}
      <div className="virtue-detail">
        <div className="virtue-detail-header">
          <h3 className="virtue-detail-name">{v.name}</h3>
          <span className="virtue-detail-latin">{v.latin}</span>
          {v.week === currentWeek && <span className="virtue-badge">THIS WEEK</span>}
        </div>
        <p className="virtue-detail-def">{v.def}</p>

        <div className="virtue-detail-section">
          <p><strong>Daily focus:</strong> {v.prompt}</p>
          <p><strong>Reflection:</strong> {v.reflection}</p>
        </div>

        <div className="virtue-detail-section">
          <p className="virtue-quote-text">"{v.quote.text}"</p>
          <p className="virtue-quote-author">— {v.quote.author}</p>
        </div>

        <div className="virtue-detail-section">
          <p><strong>Daily challenge:</strong> {v.challenge.daily} <span className="xp-badge">+{v.challenge.dxp} XP</span></p>
          <p><strong>Weekly challenge:</strong> {v.challenge.weekly} <span className="xp-badge">+{v.challenge.wxp} XP</span></p>
        </div>
      </div>
    </div>
  );
}
