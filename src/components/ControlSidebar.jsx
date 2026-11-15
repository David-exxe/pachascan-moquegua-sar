import React from 'react';
import {
  MapPin,
  Flame,
  Layers,
  Radio,
  Mountain,
  Sprout,
  Compass,
  Trees,
  Info
} from 'lucide-react';
import { BIOME_ZONES } from '../data/moqueguaData.js';

export function BiomeBadgeIcon({ biome, size = 14 }) {
  switch (biome) {
    case 'quebrada':
      return <Compass size={size} />;
    case 'valley':
      return <Sprout size={size} />;
    case 'matorral':
      return <Trees size={size} />;
    case 'puna':
      return <Mountain size={size} />;
    default:
      return <Flame size={size} />;
  }
}

export default function ControlSidebar({
  hotspots,
  selectedHotspotId,
  onSelectHotspot,
  layers,
  onToggleLayer,
  activeBiomeFilter,
  setActiveBiomeFilter
}) {
  return (
    <aside className="sidebar-left">
      {/* Study Area Header */}
      <div className="panel-card">
        <div className="eyebrow">TERRITORIAL MONITOR · PERU</div>
        <h2 className="panel-title">Change, in plain sight.</h2>
        <p className="panel-subtitle">
          Detecting active wildfires and burn scars beneath dense smoke across{' '}
          <strong>Moquegua</strong> using Sentinel-1 C-Band SAR.
        </p>

        <div className="study-area-box">
          <MapPin size={16} className="accent-orange" />
          <div>
            <div className="study-area-name">Moquegua Region — Mariscal Nieto</div>
            <div className="study-area-coords">17°11'S 70°55'W · 1,210–3,140 m a.s.l.</div>
          </div>
        </div>
      </div>

      {/* SAR & Thematic Map Layers */}
      <div className="panel-card">
        <div className="section-header-row">
          <span className="section-label">
            <Layers size={13} /> SAR & HAZARD LAYERS
          </span>
          <span className="active-counter">
            {Object.values(layers).filter(Boolean).length} active
          </span>
        </div>

        <div className="layer-toggle-list">
          <label className="layer-toggle-item">
            <div className="layer-info">
              <span className="layer-name">Burn Scar Backscatter (Δσ⁰)</span>
              <span className="layer-desc">Sentinel-1 VV/VH canopy loss polygons</span>
            </div>
            <input
              type="checkbox"
              checked={layers.burnPolygons}
              onChange={() => onToggleLayer('burnPolygons')}
            />
            <span className="toggle-switch" />
          </label>

          <label className="layer-toggle-item">
            <div className="layer-info">
              <span className="layer-name">Zone-Adaptive Fire Markers</span>
              <span className="layer-desc">Flame intensity + ecosystem icon</span>
            </div>
            <input
              type="checkbox"
              checked={layers.fireMarkers}
              onChange={() => onToggleLayer('fireMarkers')}
            />
            <span className="toggle-switch" />
          </label>

          <label className="layer-toggle-item">
            <div className="layer-info">
              <span className="layer-name">Simulated Smoke Plume Layer</span>
              <span className="layer-desc">Shows optical obscuration in Left Lens</span>
            </div>
            <input
              type="checkbox"
              checked={layers.smokeOverlay}
              onChange={() => onToggleLayer('smokeOverlay')}
            />
            <span className="toggle-switch" />
          </label>
        </div>
      </div>

      {/* Zone-Adaptive Flame Legend & Filter */}
      <div className="panel-card">
        <div className="section-header-row">
          <span className="section-label">
            <Flame size={13} /> TERRESTRIAL BIOME FLAMES
          </span>
          {activeBiomeFilter !== 'all' && (
            <button className="reset-link" onClick={() => setActiveBiomeFilter('all')}>
              Show All
            </button>
          )}
        </div>

        <div className="biome-filter-grid">
          {Object.values(BIOME_ZONES).map((b) => {
            const isSelected = activeBiomeFilter === b.id;
            return (
              <button
                key={b.id}
                className={`biome-pill ${isSelected ? 'selected' : ''}`}
                onClick={() => setActiveBiomeFilter(isSelected ? 'all' : b.id)}
                style={{ '--biome-color': b.color }}
              >
                <span className="biome-icon-circle" style={{ background: b.badgeBg, color: b.color }}>
                  <BiomeBadgeIcon biome={b.id} size={13} />
                </span>
                <span className="biome-pill-text">{b.shortLabel}</span>
              </button>
            );
          })}
        </div>

        {/* Active Hotspots Quick List */}
        <div className="hotspot-list">
          {hotspots.map((spot) => {
            const biomeMeta = BIOME_ZONES[spot.biome];
            const isSelected = spot.id === selectedHotspotId;
            return (
              <button
                key={spot.id}
                className={`hotspot-item ${isSelected ? 'selected' : ''}`}
                onClick={() => onSelectHotspot(spot)}
              >
                <div className="hotspot-item-top">
                  <span className="hotspot-code">{spot.code}</span>
                  <span
                    className="hotspot-biome-tag"
                    style={{ color: biomeMeta.color, background: biomeMeta.badgeBg }}
                  >
                    <BiomeBadgeIcon biome={spot.biome} size={11} />
                    {biomeMeta.shortLabel}
                  </span>
                </div>
                <div className="hotspot-name">{spot.name}</div>
                <div className="hotspot-metrics-row">
                  <span>Δσ⁰ {spot.deltaDb} dB</span>
                  <span>FRP {spot.frpMw} MW</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Why Radar Educational Card */}
      <div className="panel-card radar-info-card">
        <div className="radar-info-title">
          <Radio size={15} className="accent-orange" />
          <span>Why SAR Radar for Wildfires?</span>
        </div>
        <p>
          Dense smoke columns in Moquegua&apos;s narrow ravines blind optical satellites.{' '}
          <strong>C-Band microwaves (5.405 GHz)</strong> penetrate smoke and clouds day and night,
          measuring structural vegetation loss immediately.
        </p>
        <div className="radar-info-footnote">
          <Info size={12} />
          <span>Demo integrates NASA Earthdata Sentinel-1 & COER Moquegua records.</span>
        </div>
      </div>
    </aside>
  );
}
