import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header.jsx';
import AlarmBanner from './components/AlarmBanner.jsx';
import ControlSidebar from './components/ControlSidebar.jsx';
import MoqueguaMap from './components/MoqueguaMap.jsx';
import TimelineBar from './components/TimelineBar.jsx';
import TelemetryPanel from './components/TelemetryPanel.jsx';
import NasaApiModal from './components/NasaApiModal.jsx';
import {
  WILDFIRE_HOTSPOTS,
  TIMELINE_STEPS,
  GROUND_VALIDATION_RECORDS
} from './data/moqueguaData.js';
import { playRadarAlarm } from './utils/audioAlarm.js';
import { Radio, ShieldCheck, Flame, ExternalLink } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('explorer');
  const [stepIndex, setStepIndex] = useState(4);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedHotspot, setSelectedHotspot] = useState(WILDFIRE_HOTSPOTS[0]);
  const [focusTrigger, setFocusTrigger] = useState(0);
  const [alarmActive, setAlarmActive] = useState(true);
  const [activeBiomeFilter, setActiveBiomeFilter] = useState('all');

  const [layers, setLayers] = useState({
    burnPolygons: true,
    fireMarkers: true,
    smokeOverlay: true
  });

  const [isApiModalOpen, setIsApiModalOpen] = useState(false);
  const [apiKeys, setApiKeys] = useState(() => {
    try {
      const saved = localStorage.getItem('pachascan_nasa_keys');
      return saved ? JSON.parse(saved) : { earthdataToken: '', firmsMapKey: '' };
    } catch {
      return { earthdataToken: '', firmsMapKey: '' };
    }
  });

  const handleSaveApiKeys = (newKeys) => {
    setApiKeys(newKeys);
    try {
      localStorage.setItem('pachascan_nasa_keys', JSON.stringify(newKeys));
    } catch {
      // Ignore storage quota errors
    }
  };

  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setStepIndex((prev) => {
        if (prev >= TIMELINE_STEPS.length - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, 1700);
    return () => clearInterval(timer);
  }, [isPlaying]);

  const filteredHotspots = useMemo(() => {
    if (activeBiomeFilter === 'all') return WILDFIRE_HOTSPOTS;
    return WILDFIRE_HOTSPOTS.filter((h) => h.biome === activeBiomeFilter);
  }, [activeBiomeFilter]);

  const currentStep = TIMELINE_STEPS[stepIndex];

  const handleToggleLayer = (key) => {
    setLayers((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSelectHotspot = (spot) => {
    setSelectedHotspot(spot);
    setFocusTrigger((n) => n + 1);
  };

  const handleTriggerAlarm = () => {
    setStepIndex(4);
    setSelectedHotspot(WILDFIRE_HOTSPOTS[0]);
    setAlarmActive(true);
    setFocusTrigger((n) => n + 1);
    playRadarAlarm();
  };

  const handleExportReport = () => {
    const payload = {
      platform: 'PACHA SCAN — SAR Wildfire Early Warning System',
      region: 'Moquegua, Peru (Mariscal Nieto Province)',
      observationDate: currentStep.displayDate,
      sentinelGranule: currentStep.granule,
      totalAffectedHectares: currentStep.totalHectares,
      meanBackscatterDropDb: currentStep.meanBackscatterDrop,
      smokeObscurationPct: currentStep.smokeCoverPct,
      activeHotspots: WILDFIRE_HOTSPOTS.map((h) => ({
        id: h.id,
        name: h.name,
        biome: h.biome,
        severity: h.severity,
        affectedHa: h.hectaresByStep[stepIndex],
        deltaDb: h.deltaDb,
        localSource: h.localSource
      }))
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pachascan-moquegua-report-${currentStep.date}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const hasApiKeys = Boolean(apiKeys.earthdataToken || apiKeys.firmsMapKey);

  return (
    <div className="app-shell">
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onTriggerAlarm={handleTriggerAlarm}
        onOpenApiModal={() => setIsApiModalOpen(true)}
        onExportReport={handleExportReport}
        hasApiKeys={hasApiKeys}
      />

      <AlarmBanner
        alarmActive={alarmActive}
        selectedHotspot={selectedHotspot}
        currentStep={currentStep}
        onFocusHotspot={handleSelectHotspot}
        onReplaySound={playRadarAlarm}
        onDismiss={() => setAlarmActive(false)}
      />

      {activeTab === 'explorer' && (
        <main className="workspace-grid">
          <ControlSidebar
            hotspots={filteredHotspots}
            selectedHotspotId={selectedHotspot?.id}
            onSelectHotspot={handleSelectHotspot}
            layers={layers}
            onToggleLayer={handleToggleLayer}
            activeBiomeFilter={activeBiomeFilter}
            setActiveBiomeFilter={setActiveBiomeFilter}
          />

          <div className="center-column">
            <MoqueguaMap
              hotspots={filteredHotspots}
              stepIndex={stepIndex}
              currentStep={currentStep}
              selectedHotspot={selectedHotspot}
              onSelectHotspot={handleSelectHotspot}
              layers={layers}
              focusTrigger={focusTrigger}
            />
            <TimelineBar
              stepIndex={stepIndex}
              setStepIndex={setStepIndex}
              isPlaying={isPlaying}
              setIsPlaying={setIsPlaying}
            />
          </div>

          <TelemetryPanel
            hotspots={WILDFIRE_HOTSPOTS}
            stepIndex={stepIndex}
            currentStep={currentStep}
            selectedHotspot={selectedHotspot}
            onExportReport={handleExportReport}
          />
        </main>
      )}

      {activeTab === 'physics' && (
        <section className="secondary-view">
          <div className="secondary-card">
            <div className="eyebrow">SCIENTIFIC METHODOLOGY · NASA EARTHDATA SAR</div>
            <h2>Why Synthetic Aperture Radar (SAR) Outperforms Optical Sensors in Andean Wildfires</h2>
            <p className="lead-text">
              In narrow Andean valleys like Moquegua, thermal inversions trap dense smoke plumes for
              days. Conventional optical satellites (Sentinel-2, Landsat) cannot see through
              aerosols or operate at night.
            </p>

            <div className="physics-grid">
              <div className="physics-box">
                <Radio size={22} className="accent-orange" />
                <h3>1. Smoke &amp; Cloud Penetration</h3>
                <p>
                  Sentinel-1 C-Band microwaves (5.6 cm wavelength) pass directly through thick wildfire
                  smoke without scattering, delivering unobstructed surface geometry 24/7.
                </p>
              </div>
              <div className="physics-box">
                <Flame size={22} className="accent-amber" />
                <h3>2. Volume Scattering Drop (Δσ⁰)</h3>
                <p>
                  Healthy matorral and riparian foliage scatter radar waves in multiple directions
                  (high VH/VV backscatter). When fire consumes branches and leaves, radar energy
                  bounces away from the sensor, producing a sharp -4 to -7 dB drop.
                </p>
              </div>
              <div className="physics-box">
                <ShieldCheck size={22} className="accent-cyan" />
                <h3>3. Rapid Civil Defense Triage</h3>
                <p>
                  Combining SAR burn-scar polygons with biome classification tells COER Moquegua
                  brigades whether a fire threatens peri-urban ravines, irrigation canals, or high puna.
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {activeTab === 'validation' && (
        <section className="secondary-view">
          <div className="secondary-card">
            <div className="eyebrow">GROUND-TRUTH CROSS-VALIDATION · PERU</div>
            <h2>Moquegua Wildfire Incident Corroboration (SAR vs. Local Agencies)</h2>
            <p className="lead-text">
              Every SAR anomaly detected in PACHA SCAN is cross-referenced against official Peruvian
              emergency bulletins from COER Moquegua, INDECI (SINPAD), and SERFOR.
            </p>

            <div className="table-wrapper">
              <table className="validation-table">
                <thead>
                  <tr>
                    <th>Incident Code</th>
                    <th>Moquegua Sector</th>
                    <th>Biome Type</th>
                    <th>Local Agency</th>
                    <th>Ground Report (ha)</th>
                    <th>SAR Detected (ha)</th>
                    <th>Agreement</th>
                  </tr>
                </thead>
                <tbody>
                  {GROUND_VALIDATION_RECORDS.map((row) => (
                    <tr key={row.eventCode}>
                      <td>
                        <code>{row.eventCode}</code>
                      </td>
                      <td>
                        <strong>{row.location}</strong>
                      </td>
                      <td>{row.biome}</td>
                      <td>{row.agency}</td>
                      <td>{row.groundHa} ha</td>
                      <td>{row.sarDetectedHa} ha</td>
                      <td>
                        <span className="accuracy-pill">{row.accuracyPct}%</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="sources-footer">
              <span>Primary Satellite Archive: NASA Earthdata / Alaska Satellite Facility (Sentinel-1)</span>
              <a href="https://search.asf.alaska.edu/" target="_blank" rel="noreferrer">
                Open ASF Vertex <ExternalLink size={12} />
              </a>
            </div>
          </div>
        </section>
      )}

      <NasaApiModal
        isOpen={isApiModalOpen}
        onClose={() => setIsApiModalOpen(false)}
        apiKeys={apiKeys}
        onSaveKeys={handleSaveApiKeys}
      />
    </div>
  );
}
