export default function Settings({ config, setConfig }) {
  return (
    <div className="settings">
      <h2 className="settings-title">Settings</h2>

      <label className="form-label">HP ePrint email</label>
      <input
        type="email"
        value={config.eprintEmail || ''}
        onChange={e => setConfig({ ...config, eprintEmail: e.target.value })}
        className="form-input"
        placeholder="yourprinter@hpeprint.com"
      />

      <label className="form-label mt-16">Personal email</label>
      <input
        type="email"
        value={config.personalEmail || ''}
        onChange={e => setConfig({ ...config, personalEmail: e.target.value })}
        className="form-input"
        placeholder="you@gmail.com"
      />

      <label className="form-label mt-16">Print time</label>
      <input
        type="time"
        value={config.printTime || '05:30'}
        onChange={e => setConfig({ ...config, printTime: e.target.value })}
        className="form-input"
      />

      <label className="form-label mt-16">Your name</label>
      <input
        type="text"
        value={config.userName || ''}
        onChange={e => setConfig({ ...config, userName: e.target.value })}
        className="form-input"
      />

      <div className={`calendar-status ${config.calendarConnected ? 'connected' : 'disconnected'}`}>
        <span>
          {config.calendarConnected ? '✓ Google Calendar connected' : '⚠ Google Calendar not connected'}
        </span>
        <button
          onClick={() => setConfig({ ...config, calendarConnected: !config.calendarConnected })}
          className="btn-secondary btn-sm"
        >
          {config.calendarConnected ? 'Disconnect' : 'Connect'}
        </button>
      </div>
    </div>
  );
}
