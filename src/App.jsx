import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import SetupWizard from './pages/SetupWizard';
import Dashboard from './pages/Dashboard';

export default function App() {
  const [setupComplete, setSetupComplete] = useState(false);
  const [config, setConfig] = useState({
    eprintEmail: '',
    personalEmail: '',
    printTime: '05:30',
    calendarConnected: false,
    userName: ''
  });

  if (!setupComplete) {
    return <SetupWizard config={config} setConfig={setConfig} onComplete={() => setSetupComplete(true)} />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/*" element={<Dashboard config={config} setConfig={setConfig} />} />
      </Routes>
    </BrowserRouter>
  );
}
