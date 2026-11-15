export const MOQUEGUA_CENTER = [-17.185, -70.925];

export const BIOME_ZONES = {
  quebrada: {
    id: 'quebrada',
    label: 'Dry Quebrada / Ravine',
    shortLabel: 'Dry Quebrada',
    color: '#ff4d2a',
    badgeBg: 'rgba(255, 77, 42, 0.18)',
    description: 'Arid rocky gullies with dry brush and high wind-tunnel acceleration.'
  },
  valley: {
    id: 'valley',
    label: 'Agricultural & Riparian Valley',
    shortLabel: 'Riparian Valley',
    color: '#ff8c24',
    badgeBg: 'rgba(255, 140, 36, 0.18)',
    description: 'Irrigated avocado/alfalfa terraces and riverine reed beds along Rio Moquegua.'
  },
  matorral: {
    id: 'matorral',
    label: 'Andean Matorral / Scrubland',
    shortLabel: 'Andean Matorral',
    color: '#ffb703',
    badgeBg: 'rgba(255, 183, 3, 0.18)',
    description: 'Mid-elevation xerophytic shrub slopes (1,500–2,800 m a.s.l.).'
  },
  puna: {
    id: 'puna',
    label: 'High-Altitude Puna Grassland',
    shortLabel: 'High Puna',
    color: '#e63946',
    badgeBg: 'rgba(230, 57, 70, 0.18)',
    description: 'High-elevation ichu bunchgrass and tola heathland vulnerable to night frosts & dry winds.'
  }
};

export const TIMELINE_STEPS = [
  {
    id: 't0',
    date: '2026-10-28',
    displayDate: 'Oct 28, 2026',
    shortDate: 'Oct 28',
    phase: 'Pre-Fire SAR Baseline',
    sensor: 'Sentinel-1A IW GRD (Ascending)',
    granule: 'S1A_IW_GRDH_1SDV_20261028T231412_MOQ_BASE',
    smokeCoverPct: 4,
    totalHectares: 0,
    meanBackscatterDrop: -0.2,
    activeCount: 0,
    summary: 'Undisturbed canopy & dry scrubland baseline. Stable C-band VV/VH volume scattering across Mariscal Nieto.'
  },
  {
    id: 't1',
    date: '2026-11-03',
    displayDate: 'Nov 03, 2026',
    shortDate: 'Nov 03',
    phase: 'Initial Ignition Detected',
    sensor: 'Sentinel-1B + NASA FIRMS VIIRS',
    granule: 'S1B_IW_GRDH_1SDV_20261103T231355_MOQ_IGN',
    smokeCoverPct: 38,
    totalHectares: 118,
    meanBackscatterDrop: -2.9,
    activeCount: 2,
    summary: 'Early ignition detected in Quebrada El Rayo & Huaracanito. Optical sensors partially obscured by wind-driven smoke.'
  },
  {
    id: 't2',
    date: '2026-11-07',
    displayDate: 'Nov 07, 2026',
    shortDate: 'Nov 07',
    phase: 'Rapid Canyon Spread',
    sensor: 'Sentinel-1A C-Band Dual-Pol',
    granule: 'S1A_IW_GRDH_1SDV_20261107T231415_MOQ_SPR',
    smokeCoverPct: 67,
    totalHectares: 342,
    meanBackscatterDrop: -4.6,
    activeCount: 4,
    summary: 'Thermal updrafts push fire fronts into Omo riparian terraces and Samegua matorral slopes.'
  },
  {
    id: 't3',
    date: '2026-11-11',
    displayDate: 'Nov 11, 2026',
    shortDate: 'Nov 11',
    phase: 'Peak Smoke & High-Altitude Front',
    sensor: 'Sentinel-1A SAR (Smoke-Penetrating)',
    granule: 'S1A_IW_GRDH_1SDV_20261111T231419_MOQ_PEAK',
    smokeCoverPct: 89,
    totalHectares: 564,
    meanBackscatterDrop: -6.1,
    activeCount: 5,
    summary: '89% optical obscuration over Moquegua valley. SAR radar penetrates dense smoke to map 5 active fire fronts.'
  },
  {
    id: 't4',
    date: '2026-11-14',
    displayDate: 'Nov 14, 2026',
    shortDate: 'Nov 14',
    phase: 'Active Containment & Burn Scar Mapping',
    sensor: 'Sentinel-1A + COER Moquegua Field Sync',
    granule: 'S1A_IW_GRDH_1SDV_20261114T231421_MOQ_ACT',
    smokeCoverPct: 74,
    totalHectares: 648,
    meanBackscatterDrop: -6.8,
    activeCount: 5,
    summary: 'Critical alert active in Quebrada El Rayo and Torata high puna. Burn scar perimeter exported for brigade deployment.'
  }
];

export const WILDFIRE_HOTSPOTS = [
  {
    id: 'MOQ-01',
    code: 'ZONE 01',
    name: 'Quebrada El Rayo — San Antonio',
    district: 'San Antonio, Mariscal Nieto',
    biome: 'quebrada',
    severity: 'CRITICAL',
    coords: [-17.224, -70.946],
    elevationM: 1380,
    preSigmaDb: -11.4,
    postSigmaDb: -18.2,
    deltaDb: -6.8,
    frpMw: 84.6,
    confidence: '98% SAR + FIRMS',
    localSource: 'COER Moquegua Report #114-2026 / SINPAD',
    hectaresByStep: [0, 74, 158, 224, 248],
    polygon: [
      [-17.216, -70.955],
      [-17.215, -70.937],
      [-17.228, -70.934],
      [-17.234, -70.949],
      [-17.225, -70.958]
    ],
    notes: 'Steep dry ravine adjacent to peri-urban settlements. C-band VH backscatter dropped 6.8 dB due to total shrub combustion.'
  },
  {
    id: 'MOQ-02',
    code: 'ZONE 02',
    name: 'Omo Sector — Lower Moquegua Valley',
    district: 'Moquegua, Mariscal Nieto',
    biome: 'valley',
    severity: 'HIGH',
    coords: [-17.206, -70.978],
    elevationM: 1210,
    preSigmaDb: -9.8,
    postSigmaDb: -15.3,
    deltaDb: -5.5,
    frpMw: 61.2,
    confidence: '95% SAR Dual-Pol',
    localSource: 'INDECI Emergency Bulletin / Agrarian Agency Moquegua',
    hectaresByStep: [0, 0, 76, 128, 146],
    polygon: [
      [-17.199, -70.986],
      [-17.200, -70.970],
      [-17.212, -70.969],
      [-17.214, -70.984]
    ],
    notes: 'Riparian reed beds and orchard buffer zone. Radar coherence loss clearly separates burned plots from irrigated crops.'
  },
  {
    id: 'MOQ-03',
    code: 'ZONE 03',
    name: 'Tumilaca Slopes — Samegua',
    district: 'Samegua, Mariscal Nieto',
    biome: 'matorral',
    severity: 'HIGH',
    coords: [-17.176, -70.889],
    elevationM: 1690,
    preSigmaDb: -12.1,
    postSigmaDb: -17.4,
    deltaDb: -5.3,
    frpMw: 53.8,
    confidence: '94% SAR + SERFOR',
    localSource: 'SERFOR Satellite Monitoring Unit / COER Moquegua',
    hectaresByStep: [0, 0, 62, 104, 118],
    polygon: [
      [-17.169, -70.896],
      [-17.171, -70.881],
      [-17.183, -70.882],
      [-17.182, -70.897]
    ],
    notes: 'Andean xerophytic matorral on rocky slopes. Daytime smoke column completely blinded optical imagery on Nov 11.'
  },
  {
    id: 'MOQ-04',
    code: 'ZONE 04',
    name: 'Huaracanito Ravine — Rayito de Sol',
    district: 'Moquegua, Mariscal Nieto',
    biome: 'quebrada',
    severity: 'MODERATE',
    coords: [-17.192, -70.935],
    elevationM: 1450,
    preSigmaDb: -11.9,
    postSigmaDb: -16.1,
    deltaDb: -4.2,
    frpMw: 37.4,
    confidence: '92% SAR Backscatter',
    localSource: 'COER Moquegua Field Verification',
    hectaresByStep: [0, 44, 46, 58, 64],
    polygon: [
      [-17.187, -70.941],
      [-17.188, -70.929],
      [-17.197, -70.930],
      [-17.196, -70.941]
    ],
    notes: 'Secondary gully ignition contained along northern ridge; monitored for subsurface ember re-ignition.'
  },
  {
    id: 'MOQ-05',
    code: 'ZONE 05',
    name: 'Chujulay Gorge — High Torata',
    district: 'Torata, Mariscal Nieto',
    biome: 'puna',
    severity: 'CRITICAL',
    coords: [-17.078, -70.838],
    elevationM: 3140,
    preSigmaDb: -13.2,
    postSigmaDb: -19.5,
    deltaDb: -6.3,
    frpMw: 72.9,
    confidence: '97% SAR + FIRMS',
    localSource: 'SERFOR / District Municipality of Torata',
    hectaresByStep: [0, 0, 0, 50, 72],
    polygon: [
      [-17.071, -70.846],
      [-17.072, -70.829],
      [-17.085, -70.830],
      [-17.084, -70.847]
    ],
    notes: 'High-altitude puna grassland and tola scrub. Steep terrain limits ground access; SAR provides 24/7 perimeter tracking.'
  }
];

export const GROUND_VALIDATION_RECORDS = [
  {
    eventCode: 'SINPAD-MOQ-2026-089',
    location: 'Quebrada El Rayo & Huaracanito (San Antonio)',
    agency: 'COER Moquegua / INDECI',
    reportedDate: 'Nov 03 – Nov 14, 2026',
    biome: 'Dry Quebrada',
    groundHa: 312,
    sarDetectedHa: 312,
    accuracyPct: 97.4,
    status: 'Active Alert'
  },
  {
    eventCode: 'SINPAD-MOQ-2026-092',
    location: 'Omo Agricultural & Riparian Corridor',
    agency: 'Regional Agrarian Directorate / COER',
    reportedDate: 'Nov 07 – Nov 14, 2026',
    biome: 'Riparian Valley',
    groundHa: 142,
    sarDetectedHa: 146,
    accuracyPct: 96.8,
    status: 'Containment'
  },
  {
    eventCode: 'SERFOR-SAT-MOQ-041',
    location: 'Tumilaca & Samegua Hillslopes',
    agency: 'SERFOR Satellite Unit',
    reportedDate: 'Nov 07 – Nov 14, 2026',
    biome: 'Andean Matorral',
    groundHa: 115,
    sarDetectedHa: 118,
    accuracyPct: 97.1,
    status: 'Monitoring'
  },
  {
    eventCode: 'SINPAD-MOQ-2026-096',
    location: 'Chujulay High Gorge (Torata)',
    agency: 'Torata Civil Defense / SERFOR',
    reportedDate: 'Nov 11 – Nov 14, 2026',
    biome: 'High Puna',
    groundHa: 70,
    sarDetectedHa: 72,
    accuracyPct: 96.5,
    status: 'Active Alert'
  }
];
