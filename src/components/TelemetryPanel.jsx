import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import { Flame, Activity, EyeOff, CheckCircle2, FileSpreadsheet } from 'lucide-react';
import { BIOME_ZONES, TIMELINE_STEPS } from '../data/moqueguaData.js';
import { BiomeBadgeIcon } from './ControlSidebar.jsx';

export default function TelemetryPanel({
  hotspots,
  stepIndex,
  currentStep,
  selectedHotspot,
  onExportReport
}) {
  const chartCanvasRef = useRef(null);
  const chartInstanceRef = useRef(null);

  const biomeTotals = Object.keys(BIOME_ZONES).map((biomeKey) => {
    const ha = hotspots
      .filter((h) => h.biome === biomeKey)
      .reduce((acc, h) => acc + (h.hectaresByStep[stepIndex] || 0), 0);
    return {
      ...BIOME_ZONES[biomeKey],
      ha
    };
  });

  const maxBiomeHa = Math.max(250, ...biomeTotals.map((b) => b.ha));

  useEffect(() => {
    if (!chartCanvasRef.current) return;
    const ctx = chartCanvasRef.current.getContext('2d');

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const labels = TIMELINE_STEPS.map((s) => s.shortDate);
    const haSeries = TIMELINE_STEPS.map((s) => s.totalHectares);
    const dbSeries = TIMELINE_STEPS.map((s) => Math.abs(s.meanBackscatterDrop));

    chartInstanceRef.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Affected Area (ha)',
            data: haSeries,
            backgroundColor: labels.map((_, i) =>
              i === stepIndex ? '#ff5424' : 'rgba(255, 110, 56, 0.32)'
            ),
            borderColor: '#ff7b47',
            borderWidth: 1,
            borderRadius: 6,
            yAxisID: 'y'
          },
          {
            type: 'line',
            label: 'SAR |Δσ⁰| Drop (dB)',
            data: dbSeries,
            borderColor: '#ffb703',
            backgroundColor: '#ffb703',
            borderWidth: 2.2,
            tension: 0.35,
            pointRadius: 4,
            yAxisID: 'y1'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: {
              color: '#cbd5e1',
              font: { size: 11, family: 'Inter' }
            }
          }
        },
        scales: {
          x: {
            ticks: { color: '#94a3b8', font: { size: 10 } },
            grid: { color: 'rgba(255,255,255,0.05)' }
          },
          y: {
            position: 'left',
            ticks: { color: '#ff8c66', font: { size: 10 } },
            grid: { color: 'rgba(255,255,255,0.06)' }
          },
          y1: {
            position: 'right',
            min: 0,
            max: 8,
            ticks: { color: '#ffb703', font: { size: 10 } },
            grid: { drawOnChartArea: false }
          }
        }
      }
    });

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [stepIndex]);

  return (
    <aside className="sidebar-right">
      <div className="panel-card kpi-hero-card">
        <div className="eyebrow">MOQUEGUA TELEMETRY · {currentStep.displayDate.toUpperCase()}</div>
        <h3 className="panel-title-sm">Territory Under Thermal Stress</h3>

        <div className="hero-stat-row">
          <span className="hero-stat-value">{currentStep.totalHectares.toLocaleString()}</span>
          <span className="hero-stat-unit">ha burned</span>
        </div>
        <p className="hero-stat-caption">{currentStep.summary}</p>

        <div className="mini-kpi-grid">
          <div className="mini-kpi">
            <Flame size={14} className="accent-orange" />
            <div>
              <span className="mini-kpi-val">{currentStep.activeCount}</span>
              <span className="mini-kpi-lbl">Active Fronts</span>
            </div>
          </div>
          <div className="mini-kpi">
            <Activity size={14} className="accent-amber" />
            <div>
              <span className="mini-kpi-val">{currentStep.meanBackscatterDrop} dB</span>
              <span className="mini-kpi-lbl">Mean Δσ⁰</span>
            </div>
          </div>
          <div className="mini-kpi">
            <EyeOff size={14} className="accent-cyan" />
            <div>
              <span className="mini-kpi-val">{currentStep.smokeCoverPct}%</span>
              <span className="mini-kpi-lbl">Smoke Blocked</span>
            </div>
          </div>
        </div>
      </div>

      <div className="panel-card">
        <div className="section-header-row">
          <span className="section-label">AFFECTED AREA BY BIOME</span>
          <span className="active-counter">COER Sync</span>
        </div>

        <div className="biome-bars-list">
          {biomeTotals.map((item) => (
            <div key={item.id} className="biome-bar-row">
              <div className="biome-bar-meta">
                <span className="biome-bar-label" style={{ color: item.color }}>
                  <BiomeBadgeIcon biome={item.id} size={13} />
                  {item.shortLabel}
                </span>
                <span className="biome-bar-ha">{item.ha} ha</span>
              </div>
              <div className="biome-bar-track">
                <div
                  className="biome-bar-fill"
                  style={{
                    width: `${Math.min(100, (item.ha / maxBiomeHa) * 100)}%`,
                    background: item.color
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="panel-card">
        <div className="section-header-row">
          <span className="section-label">SAR EVOLUTION (OCT 28 – NOV 14)</span>
        </div>
        <div className="chart-box">
          <canvas ref={chartCanvasRef} />
        </div>
      </div>

      {selectedHotspot && (
        <div className="panel-card selected-dossier">
          <div className="dossier-top">
            <span className="dossier-badge">{selectedHotspot.code} INSPECTOR</span>
            <span className="dossier-valid">
              <CheckCircle2 size={12} /> Ground Verified
            </span>
          </div>
          <h4>{selectedHotspot.name}</h4>
          <p className="dossier-notes">{selectedHotspot.notes}</p>
          <div className="dossier-source">
            <strong>Official Local Record:</strong> {selectedHotspot.localSource}
          </div>
        </div>
      )}

      <button className="btn btn-export-full" onClick={onExportReport}>
        <FileSpreadsheet size={15} />
        <span>Export Moquegua SAR Situation Brief</span>
      </button>
    </aside>
  );
}
