import React from 'react';
import { Flame, Volume2, Crosshair, X } from 'lucide-react';

export default function AlarmBanner({
  alarmActive,
  selectedHotspot,
  currentStep,
  onFocusHotspot,
  onReplaySound,
  onDismiss
}) {
  if (!alarmActive || currentStep.activeCount === 0) return null;

  const target = selectedHotspot || {
    name: 'Quebrada El Rayo — San Antonio, Moquegua',
    deltaDb: -6.8,
    severity: 'CRITICAL',
    coords: [-17.224, -70.946]
  };

  return (
    <div className="alarm-banner" role="alert">
      <div className="alarm-banner-left">
        <div className="alarm-icon-wrap">
          <Flame size={18} />
        </div>
        <div className="alarm-copy">
          <span className="alarm-badge">{target.severity} SAR ALERT</span>
          <strong className="alarm-target-name">{target.name}</strong>
          <span className="alarm-meta">
            Δσ⁰: <b>{target.deltaDb} dB</b> · Area: <b>{currentStep.totalHectares} ha</b> · Smoke:{' '}
            <b>{currentStep.smokeCoverPct}%</b>
          </span>
        </div>
      </div>

      <div className="alarm-banner-actions">
        <button className="btn-alarm-mini" onClick={() => onFocusHotspot(target)}>
          <Crosshair size={14} />
          <span>Center</span>
        </button>
        <button className="btn-alarm-mini" onClick={onReplaySound}>
          <Volume2 size={14} />
          <span>Chime</span>
        </button>
        <button className="btn-alarm-close" onClick={onDismiss} aria-label="Dismiss Alert">
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
