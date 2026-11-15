# PACHA SCAN — SAR Earth Monitoring & Wildfire Early Warning Platform

> **Science · Alert · Life — For a more prepared Peru**  
> Built for the **NASA Space Apps Challenge** (*Dancing with the SARs*).

## Overview
**PACHA SCAN** is a desktop-first web application that combines **Synthetic Aperture Radar (SAR)** satellite telemetry from **NASA Earthdata (Sentinel-1 C-Band)** with local emergency records from **COER Moquegua, INDECI (SINPAD), and SERFOR** to detect and monitor wildfires in **Moquegua, Peru**.

Unlike optical satellites that are blinded by thick smoke plumes in narrow Andean valleys, C-Band microwaves penetrate smoke and clouds day and night to map active burn scars and vegetation loss.

## Key Features
- **Andean-Orbital Brand Identity:** Custom vector emblem uniting Andean peaks, radar signal arcs, and Peruvian geometric textile accents.
- **Zone-Adaptive Wildfire Markers:** Animated flame markers paired with terrestrial ecosystem badges (*Dry Quebrada*, *Agricultural & Riparian Valley*, *Andean Matorral*, and *High-Altitude Puna*).
- **Interactive Before/After Split Comparator:** Draggable split-screen lens contrasting smoke-obscured optical imagery against smoke-penetrating SAR radar over Moquegua.
- **Tactical Wildfire Alarm & Web Audio Synthesizer:** Real-time emergency alert banner and synthesized radar warning chime.
- **Manual NASA API Configuration:** Dedicated modal with blank fields for `NASA Earthdata Bearer Token` and `NASA FIRMS MAP_KEY` stored safely in `localStorage`.

## Quick Start in VS Code
```bash
npm install
npm run dev
```
