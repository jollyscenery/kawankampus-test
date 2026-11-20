import { useState, useEffect, useRef, useCallback } from 'react';
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
  const [createIntent, setCreateIntent] = useState(0);
  const previousTab = useRef(activeTab);
  const Content = TABS[activeTab];

  useEffect(() => {
    if (previousTab.current !== activeTab) {
      previousTab.current = activeTab;
      window.scrollTo({ top: 0, behavior: 'instant' });
      document.getElementById('page-title')?.focus({ preventScroll: true });
    }
  }, [activeTab]);

  const handleCreateCommunity = () => {
    setActiveTab('communities');
    setCreateIntent((intent) => intent + 1);
  };

  // One-shot: the communities tab reports back so a later remount does not
  // reopen the creation form on its own.
  const handleCreateIntentHandled = useCallback(() => setCreateIntent(0), []);

  return (
    <div className="app-page">
      <a className="skip-link" href="#app-content">Langsung ke konten</a>
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} onCreateCommunity={handleCreateCommunity} onLogout={onLogout} />
      <main className="app-main" aria-labelledby="page-title">
        <Header activeTab={activeTab} onProfile={() => setActiveTab('profile')} />
        <div id="app-content" tabIndex={-1}>
          <Content onNavigateTab={setActiveTab} createIntent={createIntent} onCreateIntentHandled={handleCreateIntentHandled} />
        </div>
      </main>
    </div>
  );
}
