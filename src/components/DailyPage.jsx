import { getDayOfYear, DAYS, DAYS_SHORT } from '../lib/helpers';

export default function DailyPage({ date: pageDate, events, virtue, weekNum, season }) {
  const dayName = DAYS[pageDate.getDay()];
  const dayOfYear = getDayOfYear(pageDate);
  const dateStr = pageDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).toUpperCase();
  const dow = pageDate.getDay();

  return (
    <div className="daily-page">
      {/* Header */}
      <div className="dp-header">
        <div className="dp-header-top">
          <span className="dp-brand">M I N D P R I N T</span>
          <span className="dp-date">{dateStr}</span>
        </div>
        <div className="dp-header-main">
          <h1 className="dp-day-name">{dayName}</h1>
          <div className="dp-header-right">
            <div className="dp-progress-text">Day {dayOfYear} of 365 · Week {weekNum}</div>
            <div className="dp-season-text">
              {season.name.toUpperCase()} — {season.description}
            </div>
          </div>
        </div>
      </div>

      {/* Virtue */}
      <div className="dp-section dp-virtue">
        <div className="dp-section-header">
          <span className="dp-label">VIRTUE OF THE WEEK</span>
          <span className="dp-label">WEEK {weekNum} OF 52</span>
        </div>
        <div className="dp-virtue-name">
          <span className="dp-virtue-title">{virtue.name}</span>
          <span className="dp-virtue-latin">{virtue.latin}</span>
        </div>
        <p className="dp-virtue-def">{virtue.def}</p>
        <p className="dp-virtue-prompt">
          <span className="dp-label">TODAY'S FOCUS: </span>
          {virtue.prompt}
        </p>
      </div>

      {/* Two columns */}
      <div className="dp-section dp-columns">
        {/* Schedule + Priorities */}
        <div className="dp-col">
          <span className="dp-label">TODAY'S SCHEDULE</span>
          <div className="dp-schedule">
            {events && events.length > 0 ? events.slice(0, 8).map((ev, i) => (
              <div key={i} className="dp-event">
                <span className="dp-event-time">{ev.time}</span>
                <span className="dp-event-title">{ev.title}</span>
              </div>
            )) : (
              <p className="dp-empty">No events scheduled</p>
            )}
          </div>

          <div className="dp-priorities">
            <span className="dp-label">PRIORITIES</span>
            <div className="dp-priority-list">
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className="dp-priority-item">
                  <div className="dp-checkbox" />
                  <div className="dp-priority-line" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Challenges */}
        <div className="dp-col">
          <span className="dp-label">DAILY CHALLENGE</span>
          <p className="dp-challenge-text">{virtue.challenge.daily}</p>
          <span className="dp-xp">+{virtue.challenge.dxp} XP</span>

          <div className="dp-weekly-challenge">
            <span className="dp-label">WEEKLY CHALLENGE</span>
            <p className="dp-challenge-text">{virtue.challenge.weekly}</p>
            <span className="dp-xp">+{virtue.challenge.wxp} XP</span>
          </div>

          <div className="dp-week-progress">
            <span className="dp-label">WEEK PROGRESS</span>
            <div className="dp-dots">
              {DAYS_SHORT.map((d, i) => (
                <div key={i} className="dp-dot-group">
                  <div className={`dp-dot ${i < dow ? 'done' : ''} ${i === dow ? 'today' : ''}`} />
                  <div className="dp-dot-label">{d}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quote */}
      <div className="dp-section dp-quote-section">
        <span className="dp-label">QUOTE OF THE DAY</span>
        <div className="dp-quote">
          <span className="dp-quote-mark">"</span>
          <p className="dp-quote-text">{virtue.quote.text}</p>
          <p className="dp-quote-author">— {virtue.quote.author}</p>
        </div>
      </div>

      {/* Evening Reflection */}
      <div className="dp-section dp-reflection">
        <span className="dp-label">EVENING REFLECTION</span>
        <p className="dp-reflection-prompt">{virtue.reflection}</p>

        {["What went well today?", "What could I improve?", "Notes & observations"].map((label, idx) => (
          <div key={idx} className="dp-reflection-block">
            <span className="dp-reflection-label">{label}</span>
            <div className="dp-lines">
              {[1,2,3].map(j => <div key={j} className="dp-line" />)}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="dp-footer">
        <span>MindPrint · {pageDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} · {virtue.name} ({virtue.latin})</span>
        <span>Day {dayOfYear} · Week {weekNum}</span>
      </div>
    </div>
  );
}
