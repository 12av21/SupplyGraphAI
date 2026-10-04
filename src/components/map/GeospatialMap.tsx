// SCIP - Interactive Geospatial Intelligence Map Component
import React, { useState } from 'react';
import { Report, Incident } from '../../types/scip.ts';
import { MapPin, AlertCircle, Layers, Eye, Navigation } from 'lucide-react';

interface GeospatialMapProps {
  reports: Report[];
  incidents: Incident[];
  onSelectReport?: (report: Report) => void;
  onSelectIncident?: (incident: Incident) => void;
  selectedReportId?: string;
  selectedIncidentId?: string;
}

export const GeospatialMap: React.FC<GeospatialMapProps> = ({
  reports,
  incidents,
  onSelectReport,
  onSelectIncident,
  selectedReportId,
  selectedIncidentId
}) => {
  const [showReports, setShowReports] = useState(true);
  const [showIncidents, setShowIncidents] = useState(true);
  const [showHotspots, setShowHotspots] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [hoveredItem, setHoveredItem] = useState<{ type: 'report' | 'incident'; data: any } | null>(null);

  // Map bounding coordinates for Metro Municipal Area (calibrated around 28.61 to 28.64 Lat, 77.20 to 77.23 Lng)
  const minLat = 28.608;
  const maxLat = 28.642;
  const minLng = 77.202;
  const maxLng = 77.234;

  const latToY = (lat: number) => {
    const clamped = Math.max(minLat, Math.min(maxLat, lat));
    return ((maxLat - clamped) / (maxLat - minLat)) * 100;
  };

  const lngToX = (lng: number) => {
    const clamped = Math.max(minLng, Math.min(maxLng, lng));
    return ((clamped - minLng) / (maxLng - minLng)) * 100;
  };

  const filteredReports = reports.filter(r => {
    if (categoryFilter !== 'ALL' && r.category !== categoryFilter) return false;
    return true;
  });

  const filteredIncidents = incidents.filter(i => {
    if (categoryFilter !== 'ALL' && i.category !== categoryFilter) return false;
    return true;
  });

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'Water & Drainage': return '#2563EB'; // Blue
      case 'Roads & Traffic': return '#D97706'; // Amber
      case 'Power & Lighting': return '#DC2626'; // Crimson
      case 'Public Sanitation': return '#059669'; // Emerald
      case 'Parks & Environment': return '#16A34A'; // Green
      case 'Structural Safety': return '#7C3AED'; // Purple
      default: return '#475569';
    }
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden flex flex-col h-[560px]">
      {/* Top Map Controls Bar */}
      <div className="p-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-700 flex items-center gap-1.5">
            <Navigation className="w-3.5 h-3.5 text-indigo-600" />
            Metro Municipal District (East & Central Sectors)
          </span>
          <span className="text-slate-400">·</span>
          <span className="text-slate-500 font-mono text-[11px] tabular-nums">
            {filteredReports.length} observations / {filteredIncidents.length} incidents
          </span>
        </div>

        {/* Filter Controls */}
        <div className="flex items-center gap-3">
          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="px-2 py-1 bg-white border border-slate-200 rounded-md text-slate-700 text-xs focus:outline-hidden"
          >
            <option value="ALL">All Categories</option>
            <option value="Water & Drainage">Water & Drainage</option>
            <option value="Roads & Traffic">Roads & Traffic</option>
            <option value="Power & Lighting">Power & Lighting</option>
            <option value="Public Sanitation">Public Sanitation</option>
            <option value="Structural Safety">Structural Safety</option>
          </select>

          <div className="flex items-center gap-2 border-l border-slate-200 pl-3">
            <label className="flex items-center gap-1 cursor-pointer text-slate-600 select-none">
              <input
                type="checkbox"
                checked={showReports}
                onChange={e => setShowReports(e.target.checked)}
                className="rounded-sm text-indigo-600 focus:ring-0"
              />
              <span>Reports</span>
            </label>
            <label className="flex items-center gap-1 cursor-pointer text-slate-600 select-none">
              <input
                type="checkbox"
                checked={showIncidents}
                onChange={e => setShowIncidents(e.target.checked)}
                className="rounded-sm text-indigo-600 focus:ring-0"
              />
              <span>Incidents</span>
            </label>
            <label className="flex items-center gap-1 cursor-pointer text-slate-600 select-none">
              <input
                type="checkbox"
                checked={showHotspots}
                onChange={e => setShowHotspots(e.target.checked)}
                className="rounded-sm text-indigo-600 focus:ring-0"
              />
              <span>Hotspot Heat</span>
            </label>
          </div>
        </div>
      </div>

      {/* Main Interactive Canvas Area */}
      <div className="relative flex-1 bg-slate-100 overflow-hidden select-none">
        {/* Subtle Map Grid lines representing municipal survey sectors */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#64748b" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          {/* Simulated arterial corridors */}
          <line x1="15%" y1="10%" x2="85%" y2="90%" stroke="#94a3b8" strokeWidth="3" strokeDasharray="6,4" />
          <line x1="80%" y1="15%" x2="20%" y2="85%" stroke="#94a3b8" strokeWidth="2" />
          <line x1="10%" y1="45%" x2="90%" y2="48%" stroke="#cbd5e1" strokeWidth="3" />
        </svg>

        {/* Sector Labels */}
        <div className="absolute top-4 left-6 text-[11px] font-semibold tracking-wider text-slate-400 uppercase pointer-events-none">
          Sector 12 Residential Zone
        </div>
        <div className="absolute top-6 right-8 text-[11px] font-semibold tracking-wider text-slate-400 uppercase pointer-events-none">
          North Industrial Expressway
        </div>
        <div className="absolute bottom-6 left-8 text-[11px] font-semibold tracking-wider text-slate-400 uppercase pointer-events-none">
          Sector 4 Commercial Corridor
        </div>
        <div className="absolute bottom-6 right-10 text-[11px] font-semibold tracking-wider text-slate-400 uppercase pointer-events-none">
          Riverfront Canal Basin
        </div>

        {/* Heatmap Layer for Sector 4 Hotspot */}
        {showHotspots && (
          <div
            className="absolute rounded-full pointer-events-none filter blur-xl transition-opacity duration-300"
            style={{
              left: `${lngToX(77.2092)}%`,
              top: `${latToY(28.6141)}%`,
              width: '140px',
              height: '140px',
              transform: 'translate(-50%, -50%)',
              background: 'radial-gradient(circle, rgba(239, 68, 68, 0.35) 0%, rgba(245, 158, 11, 0.15) 50%, transparent 80%)'
            }}
          />
        )}

        {/* Incident Clusters Layer */}
        {showIncidents &&
          filteredIncidents.map(inc => {
            const x = lngToX(inc.longitude);
            const y = latToY(inc.latitude);
            const isSelected = selectedIncidentId === inc.id;

            return (
              <div
                key={inc.id}
                onClick={() => onSelectIncident?.(inc)}
                onMouseEnter={() => setHoveredItem({ type: 'incident', data: inc })}
                onMouseLeave={() => setHoveredItem(null)}
                className={`absolute cursor-pointer transition-transform duration-150 ${isSelected ? 'scale-110 z-20' : 'z-10 hover:scale-105'}`}
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                  transform: 'translate(-50%, -50%)'
                }}
              >
                {/* Cluster Outer Radius Circle */}
                <div
                  className={`rounded-full border-2 flex items-center justify-center transition-all ${
                    inc.severity === 'critical'
                      ? 'border-rose-500 bg-rose-500/15 animate-pulse'
                      : 'border-indigo-600 bg-indigo-600/15'
                  } ${isSelected ? 'ring-3 ring-indigo-400' : ''}`}
                  style={{
                    width: `${Math.min(90, Math.max(48, inc.radiusMeters / 2.5))}px`,
                    height: `${Math.min(90, Math.max(48, inc.radiusMeters / 2.5))}px`
                  }}
                >
                  <div className="w-5 h-5 rounded-full bg-slate-900 text-white text-[10px] font-bold flex items-center justify-center shadow-md">
                    {inc.reportIds.length}
                  </div>
                </div>
              </div>
            );
          })}

        {/* Individual Report Pins Layer */}
        {showReports &&
          filteredReports.map(rep => {
            const x = lngToX(rep.longitude);
            const y = latToY(rep.latitude);
            const isSelected = selectedReportId === rep.id;
            const color = getCategoryColor(rep.category);

            return (
              <div
                key={rep.id}
                onClick={() => onSelectReport?.(rep)}
                onMouseEnter={() => setHoveredItem({ type: 'report', data: rep })}
                onMouseLeave={() => setHoveredItem(null)}
                className={`absolute cursor-pointer transition-transform duration-150 ${isSelected ? 'scale-125 z-30' : 'z-15 hover:scale-115'}`}
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                  transform: 'translate(-50%, -100%)'
                }}
              >
                <div
                  className="w-4 h-4 rounded-full border border-white shadow-xs flex items-center justify-center"
                  style={{ backgroundColor: color }}
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-white" />
                </div>
              </div>
            );
          })}

        {/* Live Hover Tooltip Card */}
        {hoveredItem && (
          <div className="absolute bottom-4 left-4 max-w-sm bg-white/95 backdrop-blur-xs p-3 rounded-lg shadow-lg border border-slate-200 z-40 text-xs pointer-events-none transition-all">
            {hoveredItem.type === 'incident' ? (
              <div>
                <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                  <span>{hoveredItem.data.title}</span>
                </div>
                <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-2">
                  <span>{hoveredItem.data.category}</span>
                  <span>·</span>
                  <span className="font-mono tabular-nums">{hoveredItem.data.reportIds.length} linked reports</span>
                  <span>·</span>
                  <span className="font-semibold text-rose-700">{hoveredItem.data.priority}</span>
                </div>
                <p className="text-slate-600 mt-1.5 text-[11px] line-clamp-2">{hoveredItem.data.description}</p>
              </div>
            ) : (
              <div>
                <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-indigo-600" />
                  <span>{hoveredItem.data.title}</span>
                </div>
                <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-2">
                  <span>{hoveredItem.data.category}</span>
                  <span>·</span>
                  <span>{hoveredItem.data.locationName}</span>
                </div>
                <p className="text-slate-600 mt-1 text-[11px] line-clamp-2">{hoveredItem.data.description}</p>
              </div>
            )}
          </div>
        )}

        {/* Map Legend */}
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-xs p-2.5 rounded-md shadow-xs border border-slate-200 text-[11px] space-y-1">
          <div className="font-semibold text-slate-700 text-[10px] uppercase tracking-wider mb-1">Categories</div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
            <span className="text-slate-600">Water & Drainage</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-600" />
            <span className="text-slate-600">Roads & Traffic</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600" />
            <span className="text-slate-600">Power & Lighting</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
            <span className="text-slate-600">Public Sanitation</span>
          </div>
        </div>
      </div>
    </div>
  );
};
