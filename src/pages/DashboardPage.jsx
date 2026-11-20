import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from '../components/dashboard/Sidebar';
import Header from '../components/dashboard/Header';
import HomeTab from '../components/tabs/HomeTab';
import CommunitiesTab from '../components/tabs/CommunitiesTab';
import EventsTab from '../components/tabs/EventsTab';
import ConnectTab from '../components/tabs/ConnectTab';
import ProfileTab from '../components/tabs/ProfileTab';
import VerifyTab from '../components/tabs/VerifyTab';
import '../dashboard-responsive.css';

const TABS = {
  home: HomeTab,
  communities: CommunitiesTab,
  events: EventsTab,
  connect: ConnectTab,
  profile: ProfileTab,
  verify: VerifyTab
};

export default function DashboardPage({ onLogout }) {
  const initialTab = useLocation().state?.dashboardTab;
  const [activeTab, setActiveTab] = useState(() => Object.hasOwn(TABS, initialTab) ? initialTab : 'home');
  const previousTab = useRef(activeTab);
  const Content = TABS[activeTab];

  useEffect(() => {
    if (previousTab.current !== activeTab) {
      previousTab.current = activeTab;
      window.scrollTo({ top: 0, behavior: 'instant' });
      document.getElementById('page-title')?.focus({ preventScroll: true });
    }
  }, [activeTab]);

  return (
    <div className="app-page">
      <a className="skip-link" href="#app-content">Langsung ke konten</a>
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} onLogout={onLogout} />
      <main className="app-main" aria-labelledby="page-title">
        <Header activeTab={activeTab} onProfile={() => setActiveTab('profile')} />
        <div id="app-content" tabIndex={-1}><Content onNavigateTab={setActiveTab} /></div>
      </main>
    </div>
  );
}
