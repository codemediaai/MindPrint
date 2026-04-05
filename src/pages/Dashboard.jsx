import { useState } from 'react';
import DailyPage from '../components/DailyPage';
import Journal from '../components/Journal';
import VirtueBrowser from '../components/VirtueBrowser';
import Settings from '../components/Settings';
import { getWeekNumber, getSeason } from '../lib/helpers';
import { getVirtue } from '../data/virtues';

const SAMPLE_EVENTS = [
  { time: "8:00 AM", title: "Morning standup" },
  { time: "9:30 AM", title: "Design review" },
  { time: "11:00 AM", title: "Client call" },
  { time: "12:30 PM", title: "Lunch" },
  { time: "2:00 PM", title: "Deep work block" },
  { time: "4:30 PM", title: "Weekly sync" },
  { time: "6:00 PM", title: "Gym" },
];

const TABS = [
  { id: 'today', label: "Today's Page" },
  { id: 'journal', label: 'Journal' },
  { id: 'virtues', label: 'Virtues' },
  { id: 'settings', label: 'Settings' },
];

export default function Dashboard({ config, setConfig }) {
  const [activeTab, setActiveTab] = useState('today');
  const [currentDate] = useState(new Date());
  const weekNum = getWeekNumber(currentDate);
  const virtue = getVirtue(weekNum);
  const season = getSeason(weekNum);

  return (
    <div className="dashboard">
      <nav className="nav">
        <span className="nav-brand">M I N D P R I N T</span>
        <div className="nav-tabs">
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`nav-tab ${activeTab === t.id ? 'active' : ''}`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <span className="nav-week">Week {weekNum}</span>
      </nav>

      <div className="dashboard-content">
        {activeTab === 'today' && (
          <div>
            <p className="delivery-status">
              {config.eprintEmail ? `Printing daily to ${config.eprintEmail}` : 'Set up ePrint in settings to auto-print'}
              {config.personalEmail ? ` · Emailing to ${config.personalEmail}` : ''}
            </p>
            <DailyPage date={currentDate} events={SAMPLE_EVENTS} virtue={virtue} weekNum={weekNum} season={season} />
          </div>
        )}
        {activeTab === 'journal' && <Journal virtue={virtue} />}
        {activeTab === 'virtues' && <VirtueBrowser currentWeek={weekNum} />}
        {activeTab === 'settings' && <Settings config={config} setConfig={setConfig} />}
      </div>
    </div>
  );
}
