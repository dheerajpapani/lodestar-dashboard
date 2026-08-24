# LODESTAR Dashboard - Project Stats & Tech Stack

Updated: 29 June 2026

## 1. Project Snapshot

```text
+------------------------------------------------------+
| LODESTAR Dashboard                                   |
| Low-cost Disaster & Emergency Services for           |
| Communities At Risk                                  |
+------------------------------------------------------+
| Type        : Frontend-first geo dashboard            |
| Status      : Active frontend, backend under dev      |
| Deployment  : GitHub Pages                            |
| Runtime     : Node.js 18+                             |
| App Shell   : React + Vite                            |
+------------------------------------------------------+
```

## 2. Current Project Stats

| Area | Count / Status |
| --- | ---: |
| Project files counted | 111 |
| React source files | 24 |
| Pages | 12 |
| Reusable components | 10 |
| Locale packs | 10 |
| Public assets | 61 |
| Runtime dependencies | 19 |
| Dev dependencies | 14 |
| Static data files | 2 |
| Backend | Excluded - under development |

> Counts exclude `backend/`, `node_modules/`, `dist/`, and build output folders.

## 3. Current Stack

```text
Frontend
  |-- React 18
  |-- Vite 6
  |-- JavaScript / JSX
  |-- React Router

UI + Styling
  |-- Tailwind CSS
  |-- Material UI
  |-- Emotion
  |-- React Icons
  |-- Framer Motion

Maps + Geo Data
  |-- MapLibre GL
  |-- react-map-gl
  |-- GeoTIFF
  |-- d3-geo
  |-- react-simple-maps
  |-- @tmcw/togeojson

Charts + Data
  |-- Recharts
  |-- Axios
  |-- Static JSON datasets
  |-- Forecast images / raster assets

Language + Tooling
  |-- i18next
  |-- react-i18next
  |-- ESLint
  |-- GitHub Pages
```

## 4. Stack By Purpose

| Purpose | Tools |
| --- | --- |
| App framework | React 18, Vite |
| Routing | React Router |
| Maps | MapLibre GL, react-map-gl |
| Raster / GIS data | GeoTIFF, d3-geo, react-simple-maps, togeojson |
| Charts | Recharts |
| Styling | Tailwind CSS, MUI, Emotion |
| Motion | Framer Motion, canvas-confetti |
| API calls | Axios |
| Translation | i18next, react-i18next |
| Deployment | GitHub Pages, Vite build |

## 5. Repository Structure

Backend is intentionally skipped here because it is empty / under development.

```text
lodestar-dashboard/
|-- frontend/
|   |-- public/
|   |   |-- faculty/             Profile images
|   |   |-- forecast_gifs/       Forecast images and animations
|   |   |-- forecast_tiffs/      Raster forecast files
|   |   |-- sentinel_cog/        Sentinel COG imagery
|   |   |-- favicon.svg
|   |   |-- IITP.png
|   |   `-- lodestar-logo.svg
|   |
|   |-- src/
|   |   |-- components/          Shared UI blocks
|   |   |-- data/                Local dashboard datasets
|   |   |-- locales/             Translation JSON files
|   |   |-- pages/               Main route screens
|   |   |-- services/            API and data service helpers
|   |   |-- utils/               GeoTIFF parsing utilities
|   |   |-- App.jsx
|   |   |-- main.jsx
|   |   `-- router.js
|   |
|   |-- index.html
|   |-- package.json
|   |-- vite.config.js
|   `-- eslint.config.js
|
|-- README.md
`-- TECH_STACK.md
```

## 6. Feature Surface

```text
+-----------------------+--------------------------------+
| Maps                  | Interactive geo dashboard       |
| Alerts                | Multi-hazard warning interface  |
| Living Labs           | Research and location context   |
| Research              | Project information pages       |
| Team                  | Faculty / contributor profiles  |
| Internal Access       | Admin-facing entry point        |
| Internationalization  | 10 language packs               |
+-----------------------+--------------------------------+
```

## 7. Build And Run

```bash
cd frontend
npm install
npm run dev
npm run build
```

## 8. Short Summary

LODESTAR Dashboard is currently a frontend-focused React + Vite application for geospatial disaster-risk visualization. It uses MapLibre, GeoTIFF parsing, static datasets, forecast imagery, multilingual content, and GitHub Pages deployment. Backend work is excluded from this snapshot because it is still empty or under development.
