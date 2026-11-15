import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { SplitSquareHorizontal, Eye, Radio, CloudFog } from 'lucide-react';
import { MOQUEGUA_CENTER, BIOME_ZONES } from '../data/moqueguaData.js';

function createZoneFireDivIcon(hotspot, isSelected, currentHa) {
  const biome = BIOME_ZONES[hotspot.biome];
  const scale = isSelected ? 1.22 : currentHa > 120 ? 1.08 : 0.94;
  const ringColor =
    hotspot.severity === 'CRITICAL'
      ? '#ff3b2f'
      : hotspot.severity === 'HIGH'
      ? '#ff8c24'
      : '#ffb703';

  // Distinct SVG glyph per terrestrial zone
  const biomeGlyph = {
    quebrada:
      '<path d="M4 15L8 7L11 12L14 6L18 15H4Z" fill="#fff" stroke="#120b09" stroke-width="1.2"/>',
    valley:
      '<path d="M11 16V9M11 12C8 12 6 9.5 6 7C8.8 7 11 9.2 11 12ZM11 10.5C14 10.5 16 8 16 5.5C13.2 5.5 11 7.7 11 10.5Z" stroke="#fff" stroke-width="1.6" stroke-linecap="round"/>',
    matorral:
      '<circle cx="11" cy="9" r="4.5" fill="#fff"/><circle cx="7.5" cy="11.5" r="3" fill="#fff"/><circle cx="14.5" cy="11.5" r="3" fill="#fff"/><path d="M11 12V16.5" stroke="#fff" stroke-width="1.8"/>',
    puna:
      '<path d="M6 16L8 8M11 16V6M16 16L14 8M4 16H18" stroke="#fff" stroke-width="1.6" stroke-linecap="round"/>'
  }[hotspot.biome];

  const html = `
    <div class="pacha-fire-marker ${isSelected ? 'is-selected' : ''}" style="transform: scale(${scale}); --ring-color: ${ringColor};">
      <div class="fire-radar-pulse"></div>
      <svg width="46" height="54" viewBox="0 0 46 54" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="flame-${hotspot.id}" x1="23" y1="4" x2="23" y2="42" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stop-color="#fff3b0"/>
            <stop offset="38%" stop-color="#ff9e2c"/>
            <stop offset="85%" stop-color="${ringColor}"/>
            <stop offset="100%" stop-color="#9e1919"/>
          </linearGradient>
        </defs>
        <!-- Outer Animated Flame Silhouette -->
        <path class="flame-tongue" d="M23 4C23 4 36 16.5 36 28.5C36 36.2 30.2 42 23 42C15.8 42 10 36.2 10 28.5C10 22.8 13.4 17.5 16.5 14.5C16.2 18.2 18.4 20.4 18.4 20.4C18.4 20.4 17.8 12.2 23 4Z" fill="url(#flame-${hotspot.id})" stroke="#1a0c08" stroke-width="1.5"/>
        <!-- Inner Core -->
        <path d="M23 19C23 19 29 24.5 29 30.2C29 33.8 26.3 36.5 23 36.5C19.7 36.5 17 33.8 17 30.2C17 26.8 19.4 23.2 23 19Z" fill="#fff7d6"/>
        <!-- Terrestrial Zone Badge -->
        <g transform="translate(24, 29)">
          <circle cx="11" cy="11" r="10.5" fill="${biome.color}" stroke="#0d0a0b" stroke-width="2"/>
          ${biomeGlyph}
        </g>
      </svg>
      <div class="fire-label-chip">${hotspot.code} · ${currentHa} ha</div>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'pacha-div-icon-wrapper',
    iconSize: [46, 54],
    iconAnchor: [23, 40],
    popupAnchor: [0, -38]
  });
}

export default function MoqueguaMap({
  hotspots,
  stepIndex,
  currentStep,
  selectedHotspot,
  onSelectHotspot,
  layers,
  focusTrigger
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const layerGroupRef = useRef(null);

  // View modes: 'split' (Before Optical vs After SAR), 'sar', 'optical'
  const [viewMode, setViewMode] = useState('split');
  const [sliderPos, setSliderPos] = useState(52);
  const [isDragging, setIsDragging] = useState(false);

  // Initialize Leaflet Map once
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: MOQUEGUA_CENTER,
      zoom: 12,
      zoomControl: false
    });

    L.control.zoom({ position: 'topright' }).addTo(map);

    // High-resolution satellite basemap (Esri World Imagery)
    L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      {
        attribution: 'Tiles &copy; Esri &mdash; NASA Earthdata Sentinel-1 SAR Overlay',
        maxZoom: 18
      }
    ).addTo(map);

    // Subtle reference labels overlay
    L.tileLayer(
      'https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}',
      {
        maxZoom: 18,
        opacity: 0.72
      }
    ).addTo(map);

    layerGroupRef.current = L.layerGroup().addTo(map);
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Fly to selected hotspot when requested
  useEffect(() => {
    if (!mapInstanceRef.current || !selectedHotspot) return;
    mapInstanceRef.current.flyTo(selectedHotspot.coords, 13, { duration: 0.9 });
  }, [selectedHotspot, focusTrigger]);

  // Render SAR Burn Scar Polygons & Zone-Adaptive Fire Markers
  useEffect(() => {
    const group = layerGroupRef.current;
    if (!group) return;
    group.clearLayers();

    hotspots.forEach((spot) => {
      const currentHa = spot.hectaresByStep[stepIndex] || 0;
      if (currentHa === 0 && stepIndex === 0) return;

      const isSelected = selectedHotspot?.id === spot.id;
      const biome = BIOME_ZONES[spot.biome];

      // 1. SAR Burn Scar Polygon
      if (layers.burnPolygons && currentHa > 0) {
        const poly = L.polygon(spot.polygon, {
          color: isSelected ? '#ffffff' : biome.color,
          weight: isSelected ? 2.5 : 1.8,
          dashArray: isSelected ? null : '5, 5',
          fillColor: biome.color,
          fillOpacity: isSelected ? 0.38 : 0.24
        });

        poly.on('click', () => onSelectHotspot(spot));
        poly.addTo(group);
      }

      // 2. Zone-Adaptive Flame Marker
      if (layers.fireMarkers && currentHa > 0) {
        const marker = L.marker(spot.coords, {
          icon: createZoneFireDivIcon(spot, isSelected, currentHa)
        });

        marker.bindPopup(`
          <div class="pacha-popup">
            <div class="pacha-popup-header">
              <span class="popup-sev">${spot.severity}</span>
              <span class="popup-biome" style="color:${biome.color}">${biome.shortLabel}</span>
            </div>
            <h4>${spot.name}</h4>
            <p class="popup-district">${spot.district} · ${spot.elevationM} m a.s.l.</p>
            <div class="popup-grid">
              <div><span>Affected Area</span><strong>${currentHa} ha</strong></div>
              <div><span>SAR Δσ⁰ Drop</span><strong>${spot.deltaDb} dB</strong></div>
              <div><span>Radiative Power</span><strong>${spot.frpMw} MW</strong></div>
              <div><span>Confidence</span><strong>${spot.confidence}</strong></div>
            </div>
            <p class="popup-source">Source: ${spot.localSource}</p>
          </div>
        `);

        marker.on('click', () => onSelectHotspot(spot));
        marker.addTo(group);
      }
    });
  }, [hotspots, stepIndex, selectedHotspot, layers, onSelectHotspot]);

  // Handle Split-Screen Comparator Drag
  const handlePointerMove = (e) => {
    if (!isDragging || !mapContainerRef.current) return;
    const rect = mapContainerRef.current.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const pct = Math.max(8, Math.min(92, ((clientX - rect.left) / rect.width) * 100));
    setSliderPos(pct);
  };

  return (
    <section
      className="map-stage"
      onMouseMove={handlePointerMove}
      onMouseUp={() => setIsDragging(false)}
      onMouseLeave={() => setIsDragging(false)}
      onTouchMove={handlePointerMove}
      onTouchEnd={() => setIsDragging(false)}
    >
      {/* Top Floating Mode Switcher */}
      <div className="map-top-bar">
        <div className="location-breadcrumb">
          <span className="crumb-region">PERU / MOQUEGUA</span>
          <span className="crumb-title">Mariscal Nieto Wildfire Corridor</span>
        </div>

        <div className="view-mode-pills" role="group" aria-label="Sensor Comparison Mode">
          <button
            className={`mode-pill ${viewMode === 'split' ? 'active' : ''}`}
            onClick={() => setViewMode('split')}
          >
            <SplitSquareHorizontal size={14} />
            <span>Before / After Split</span>
          </button>
          <button
            className={`mode-pill ${viewMode === 'sar' ? 'active' : ''}`}
            onClick={() => setViewMode('sar')}
          >
            <Radio size={14} />
            <span>SAR Radar Only</span>
          </button>
          <button
            className={`mode-pill ${viewMode === 'optical' ? 'active' : ''}`}
            onClick={() => setViewMode('optical')}
          >
            <Eye size={14} />
            <span>Optical (Smoke)</span>
          </button>
        </div>
      </div>

      {/* Leaflet Interactive Map Canvas */}
      <div ref={mapContainerRef} className="leaflet-canvas" />

      {/* Optical Smoke Simulation Overlay (Left Side in Split Mode, Full in Optical Mode) */}
      {layers.smokeOverlay && currentStep.smokeCoverPct > 10 && viewMode !== 'sar' && (
        <div
          className="optical-smoke-curtain"
          style={{
            width: viewMode === 'split' ? `${sliderPos}%` : '100%',
            opacity: Math.min(0.88, currentStep.smokeCoverPct / 100)
          }}
        >
          <div className="smoke-plume-texture" />
          <div className="lens-badge lens-badge-left">
            <CloudFog size={14} />
            <span>
              BEFORE / OPTICAL SENSOR — {currentStep.smokeCoverPct}% Smoke Obscuration
            </span>
          </div>
        </div>
      )}

      {/* SAR Radar False-Color Tint Overlay (Right Side in Split Mode, Full in SAR Mode) */}
      {viewMode !== 'optical' && (
        <div
          className="sar-radar-curtain"
          style={{
            left: viewMode === 'split' ? `${sliderPos}%` : '0%',
            width: viewMode === 'split' ? `${100 - sliderPos}%` : '100%'
          }}
        >
          <div className="sar-scanline-grid" />
          <div className="lens-badge lens-badge-right">
            <Radio size={14} />
            <span>AFTER / SENTINEL-1 C-BAND SAR — Smoke-Penetrating View</span>
          </div>
        </div>
      )}

      {/* Draggable Split Comparator Handle */}
      {viewMode === 'split' && (
        <div
          className="split-divider-line"
          style={{ left: `${sliderPos}%` }}
          onMouseDown={() => setIsDragging(true)}
          onTouchStart={() => setIsDragging(true)}
          role="slider"
          aria-label="Drag to compare Optical Smoke vs SAR Radar"
          aria-valuenow={Math.round(sliderPos)}
        >
          <div className="split-handle-knob">
            <span>◀ SAR ▶</span>
          </div>
        </div>
      )}

      {/* Floating Map Legend */}
      <div className="map-floating-legend">
        <div className="legend-title">SAR & FIRE SYMBOLOGY</div>
        <div className="legend-row">
          <span className="legend-swatch swatch-critical" />
          <span>Critical Fire Front (&gt; -6.0 dB Δσ⁰)</span>
        </div>
        <div className="legend-row">
          <span className="legend-swatch swatch-high" />
          <span>Active Burn Perimeter (SAR Polygon)</span>
        </div>
        <div className="legend-row">
          <span className="legend-swatch swatch-smoke" />
          <span>Optical Smoke Plume (Obscured)</span>
        </div>
      </div>
    </section>
  );
}
