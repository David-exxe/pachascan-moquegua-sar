import React from 'react';
import { Play, Pause, Calendar, Satellite } from 'lucide-react';
import { TIMELINE_STEPS } from '../data/moqueguaData.js';

export default function TimelineBar({ stepIndex, setStepIndex, isPlaying, setIsPlaying }) {
  const current = TIMELINE_STEPS[stepIndex];

  return (
    <div className="timeline-dock">
      <div className="timeline-header">
        <div className="timeline-title-group">
          <Calendar size={15} className="accent-orange" />
          <span className="timeline-heading">SAR Pass Timeline</span>
          <span className="phase-chip">{current.phase}</span>
        </div>

        <div className="granule-tag" title="NASA Earthdata Sentinel-1 Granule ID">
          <Satellite size={13} />
          <code>{current.granule}</code>
        </div>
      </div>

      <div className="timeline-controls-row">
        <button
          className="btn-play-timeline"
          onClick={() => setIsPlaying(!isPlaying)}
          aria-label={isPlaying ? 'Pause SAR time-series' : 'Play SAR time-series'}
        >
          {isPlaying ? <Pause size={15} /> : <Play size={15} />}
          <span>{isPlaying ? 'Pause' : 'Play'}</span>
        </button>

        <div className="timeline-track-wrapper">
          <div className="timeline-steps-labels">
            {TIMELINE_STEPS.map((step, idx) => (
              <button
                key={step.id}
                className={`step-node ${idx === stepIndex ? 'active' : ''} ${
                  idx < stepIndex ? 'passed' : ''
                }`}
                onClick={() => {
                  setIsPlaying(false);
                  setStepIndex(idx);
                }}
              >
                <span className="step-dot" />
                <span className="step-date-full">{step.displayDate}</span>
                <span className="step-date-short">{step.shortDate}</span>
                <span className="step-ha">{step.totalHectares} ha</span>
              </button>
            ))}
          </div>
          <div className="timeline-progress-bg">
            <div
              className="timeline-progress-fill"
              style={{ width: `${(stepIndex / (TIMELINE_STEPS.length - 1)) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
