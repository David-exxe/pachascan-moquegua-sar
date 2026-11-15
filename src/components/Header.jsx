import React from 'react';
import { BellRing, KeyRound, Download, Satellite, Layers, ShieldCheck } from 'lucide-react';
import PachaLogo from './PachaLogo.jsx';

export default function Header({
  activeTab,
  setActiveTab,
  onTriggerAlarm,
  onOpenApiModal,
  onExportReport,
  hasApiKeys
}) {
  return (
    <header className="app-header">
      {/* Peruvian Geometric Textile Accent Bar */}
      <div className="andean-textile-strip" aria-hidden="true" />

      <div className="header-inner">
        {/* Brand Identity */}
        <div className="brand-cluster" onClick={() => setActiveTab('explorer')} role="button" tabIndex={0}>
          <PachaLogo size={42} />
          <div className="brand-divider" />
          <div className="brand-tagline">
            <span className="tagline-pill">SCIENCE · ALERT · LIFE</span>
            <span className="tagline-sub">For a more prepared Peru</span>
          </div>
        </div>

        {/* Center Navigation Tabs */}
        <nav className="header-nav" aria-label="Primary Platform Sections">
          <button
            className={`nav-tab ${activeTab === 'explorer' ? 'active' : ''}`}
            onClick={() => setActiveTab('explorer')}
          >
            <Layers size={15} />
            <span>SAR Explorer</span>
          </button>
          <button
            className={`nav-tab ${activeTab === 'physics' ? 'active' : ''}`}
            onClick={() => setActiveTab('physics')}
          >
            <Satellite size={15} />
            <span>About SAR Radar</span>
          </button>
          <button
            className={`nav-tab ${activeTab === 'validation' ? 'active' : ''}`}
            onClick={() => setActiveTab('validation')}
          >
            <ShieldCheck size={15} />
            <span>Local Validation</span>
          </button>
        </nav>

        {/* Right Action Controls */}
        <div className="header-actions">
          <div className="challenge-badge" title="NASA Space Apps Challenge">
            <span className="pulse-dot" />
            <span>SPACE APPS · DANCING WITH THE SARS</span>
          </div>

          <button
            className="btn btn-alarm"
            onClick={onTriggerAlarm}
            title="Simulate Orbital SAR Wildfire Detection & Sound Radar Alarm"
          >
            <BellRing size={15} />
            <span>Test Fire Alarm</span>
          </button>

          <button
            className="btn btn-secondary"
            onClick={onOpenApiModal}
            title="Configure NASA Earthdata & NASA FIRMS API Keys"
          >
            <KeyRound size={15} />
            <span>NASA API Config</span>
            <span className={`key-status-dot ${hasApiKeys ? 'connected' : 'pending'}`} />
          </button>

          <button
            className="btn btn-primary"
            onClick={onExportReport}
            title="Export Moquegua Wildfire Telemetry Summary (JSON)"
          >
            <Download size={15} />
            <span>Export</span>
          </button>
        </div>
      </div>
    </header>
  );
}
