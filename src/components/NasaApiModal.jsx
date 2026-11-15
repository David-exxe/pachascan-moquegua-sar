import React, { useState } from 'react';
import { KeyRound, X, CheckCircle2, AlertTriangle, ExternalLink, Trash2 } from 'lucide-react';

export default function NasaApiModal({ isOpen, onClose, apiKeys, onSaveKeys }) {
  const [earthdataToken, setEarthdataToken] = useState(apiKeys.earthdataToken || '');
  const [firmsMapKey, setFirmsMapKey] = useState(apiKeys.firmsMapKey || '');
  const [testStatus, setTestStatus] = useState(null);
  const [isTesting, setIsTesting] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    onSaveKeys({
      earthdataToken: earthdataToken.trim(),
      firmsMapKey: firmsMapKey.trim()
    });
    setTestStatus({
      type: 'success',
      message: 'API credentials saved locally in browser storage (never exposed in Git).'
    });
  };

  const handleClear = () => {
    setEarthdataToken('');
    setFirmsMapKey('');
    onSaveKeys({ earthdataToken: '', firmsMapKey: '' });
    setTestStatus({
      type: 'info',
      message: 'Credentials cleared. Fields are now blank.'
    });
  };

  const handleTestLiveConnection = async () => {
    if (!firmsMapKey.trim() && !earthdataToken.trim()) {
      setTestStatus({
        type: 'warning',
        message: 'Paste at least one NASA key above before running a live endpoint test.'
      });
      return;
    }

    setIsTesting(true);
    setTestStatus(null);

    try {
      if (firmsMapKey.trim()) {
        const bbox = '-71.5,-17.8,-70.0,-16.0';
        const url = `https://firms.modaps.eosdis.nasa.gov/api/area/csv/${encodeURIComponent(
          firmsMapKey.trim()
        )}/VIIRS_SNPP_NRT/${bbox}/1`;
        const res = await fetch(url);
        if (res.ok) {
          const text = await res.text();
          const lines = text.trim().split('\n');
          setTestStatus({
            type: 'success',
            message: `NASA FIRMS Live Feed Connected! Retrieved ${Math.max(
              0,
              lines.length - 1
            )} thermal records for Moquegua bbox.`
          });
          setIsTesting(false);
          return;
        }
      }

      const cmrRes = await fetch(
        'https://cmr.earthdata.nasa.gov/search/granules.json?short_name=SENTINEL-1A_DUAL_POL_GRD_HIGH_RES&bounding_box=-71.5,-17.8,-70.0,-16.0&page_size=2'
      );
      if (cmrRes.ok) {
        setTestStatus({
          type: 'success',
          message:
            'NASA Earthdata CMR Endpoint Reachable! Sentinel-1 SAR catalog ready for Moquegua queries.'
        });
      } else {
        throw new Error('Endpoint returned non-200 status');
      }
    } catch (err) {
      setTestStatus({
        type: 'warning',
        message:
          'Keys stored locally. Note: Direct browser calls to Earthdata/FIRMS may require a CORS proxy or valid active token.'
      });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="nasa-modal-title">
      <div className="modal-card">
        <div className="modal-header">
          <div className="modal-title-group">
            <KeyRound size={18} className="accent-orange" />
            <h3 id="nasa-modal-title">NASA Earthdata &amp; FIRMS API Configuration</h3>
          </div>
          <button className="btn-icon-close" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        <p className="modal-description">
          Enter your personal NASA API credentials below. Fields are intentionally left{' '}
          <strong>blank</strong> so you can paste your tokens manually without committing secrets to
          your public GitHub repository.
        </p>

        <form onSubmit={handleSave} className="api-form">
          <div className="form-group">
            <div className="form-label-row">
              <label htmlFor="earthdata-token">NASA Earthdata Bearer Token (Sentinel-1 / NISAR SAR)</label>
              <a
                href="https://urs.earthdata.nasa.gov/users/new"
                target="_blank"
                rel="noreferrer"
                className="doc-link"
              >
                Get Token <ExternalLink size={11} />
              </a>
            </div>
            <input
              id="earthdata-token"
              type="password"
              value={earthdataToken}
              onChange={(e) => setEarthdataToken(e.target.value)}
              placeholder="Paste your NASA Earthdata Bearer Token here..."
              autoComplete="off"
            />
          </div>

          <div className="form-group">
            <div className="form-label-row">
              <label htmlFor="firms-key">NASA FIRMS MAP_KEY (Live VIIRS / MODIS Hotspots)</label>
              <a
                href="https://firms.modaps.eosdis.nasa.gov/api/map_key/"
                target="_blank"
                rel="noreferrer"
                className="doc-link"
              >
                Get MAP_KEY <ExternalLink size={11} />
              </a>
            </div>
            <input
              id="firms-key"
              type="text"
              value={firmsMapKey}
              onChange={(e) => setFirmsMapKey(e.target.value)}
              placeholder="Paste your 32-character NASA FIRMS MAP_KEY here..."
              autoComplete="off"
            />
          </div>

          {testStatus && (
            <div className={`api-status-box ${testStatus.type}`}>
              {testStatus.type === 'success' ? (
                <CheckCircle2 size={16} />
              ) : (
                <AlertTriangle size={16} />
              )}
              <span>{testStatus.message}</span>
            </div>
          )}

          <div className="modal-actions">
            <button type="button" className="btn btn-ghost" onClick={handleClear}>
              <Trash2 size={14} />
              <span>Clear</span>
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleTestLiveConnection}
              disabled={isTesting}
            >
              <span>{isTesting ? 'Testing...' : 'Test Endpoint'}</span>
            </button>
            <button type="submit" className="btn btn-primary">
              <span>Save Credentials</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
